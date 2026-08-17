"use server";

import Groq from "groq-sdk";
import { requireAuth } from "@/modules/auth/auth.guard";
import { getDefaultTimetable } from "@/modules/timetables/timetables.service";
import { getTimetableSchedulesWithSubject } from "@/modules/schedules/schedules.service";
import { DAYS_OF_WEEK } from "@/lib/constants";

export interface AIChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function askDemuseAIAction(
  messages: AIChatMessage[],
  timetableId?: string
) {
  const user = await requireAuth();

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return {
      success: false,
      error:
        "Groq API Key is not configured. Please add GROQ_API_KEY to your environment variables (.env.local).",
    };
  }

  const groq = new Groq({ apiKey });

  // 1. Fetch current schedule context to feed AI with full knowledge of user's week
  let targetTimetableId = timetableId;
  if (!targetTimetableId) {
    const defaultTimetable = await getDefaultTimetable(user.id);
    targetTimetableId = defaultTimetable?.id;
  }

  let scheduleContext = "No classes or shifts scheduled yet.";
  if (targetTimetableId) {
    try {
      const schedules = await getTimetableSchedulesWithSubject(targetTimetableId, user.id);
      if (schedules.length > 0) {
        const lines = schedules.map((s) => {
          const day = DAYS_OF_WEEK.find((d) => d.number === s.dayOfWeek)?.full || `Day ${s.dayOfWeek}`;
          return `- ${day}: ${s.subject.name} (${s.startTime} - ${s.endTime}) [Type: ${s.type || "lecture"}${
            s.room ? `, Room: ${s.room}` : ""
          }${s.subject.teacher ? `, Teacher: ${s.subject.teacher}` : ""}]`;
        });
        scheduleContext = `User's Current Weekly Schedule:\n${lines.join("\n")}`;
      }
    } catch {
      // Fallback
    }
  }

  const systemPrompt = `You are Demuse AI, an intelligent, calm, and concise personal schedule & productivity assistant for Demuse (an intentional weekly timetable & work-life schedule planner).
User Name: ${user.name}

${scheduleContext}

Your capabilities:
1. Answer questions about the user's weekly timetable, free time slots, upcoming classes, work shifts, or possible time clashes.
2. If the user asks to create or parse a new schedule from text, you can help them draft it and provide the structured format:
   - Day of week (1=Monday ... 7=Sunday)
   - Start Time (HH:mm) and End Time (HH:mm)
   - Event Name, Venue/Room, and Type (lecture, lab, work, meeting, study, personal)
3. Give friendly, intentional advice on study-work-life balance, time management, and exam preparation.

Rules:
- Be concise, helpful, and organized. Use bullet points or markdown tables when listing schedules.
- Respond in the language used by the user (Vietnamese, English, French, German).
- Always be encouraging and respectful.`;

  try {
    const groqMessages = [
      { role: "system" as const, content: systemPrompt },
      ...messages.slice(-10).map((m) => ({
        role: m.role as "user" | "assistant" | "system",
        content: m.content,
      })),
    ];

    let candidateModels = [
      "llama-3.1-8b-instant",
      "llama-3.3-70b-versatile",
      "gemma2-9b-it",
    ];

    try {
      const activeList = await groq.models.list();
      if (activeList.data && activeList.data.length > 0) {
        const activeIds = activeList.data.map((m) => m.id);
        const validCandidates = candidateModels.filter((m) => activeIds.includes(m));
        if (validCandidates.length > 0) {
          candidateModels = validCandidates;
        } else if (activeIds.length > 0) {
          candidateModels = activeIds.slice(0, 3);
        }
      }
    } catch {
      // Use static fallback list
    }

    let reply = "";
    let lastError: unknown = null;

    for (const model of candidateModels) {
      try {
        const completion = await groq.chat.completions.create({
          model,
          messages: groqMessages,
          temperature: 0.6,
          max_tokens: 1024,
        });
        reply = completion.choices[0]?.message?.content || "";
        if (reply) break;
      } catch (err: unknown) {
        lastError = err;
        console.warn(`Groq model ${model} failed, trying next candidate...`);
      }
    }

    if (!reply && lastError) {
      throw lastError;
    }
    return {
      success: true,
      message: reply,
    };
  } catch (err: unknown) {
    console.error("Groq API error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to connect to Groq AI.",
    };
  }
}
