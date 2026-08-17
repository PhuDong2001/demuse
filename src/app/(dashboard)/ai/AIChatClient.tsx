"use client";

import * as React from "react";
import { askDemuseAIAction, type AIChatMessage } from "@/actions/ai.actions";
import { useLanguage } from "@/lib/LanguageContext";
import { Button } from "@/components/ui/Button";
import {
  Sparkles,
  Send,
  Trash2,
  User,
  AlertTriangle,
  Lightbulb,
} from "reicon-react";

interface AIChatClientProps {
  user: {
    id: string;
    name: string;
    email: string;
  };
  timetableId?: string;
}

export function AIChatClient({ user, timetableId }: AIChatClientProps) {
  const { language } = useLanguage();
  const isVi = language === "vi";

  const initialGreeting: AIChatMessage = {
    role: "assistant",
    content: isVi
      ? `Xin chào ${user.name}! Mình là Trợ lý AI Demuse (chạy trên nền tảng siêu tốc Groq Llama 3.3). Mình đã nắm rõ toàn bộ thời khóa biểu và ca làm việc của bạn trong tuần. Bạn muốn hỏi về lịch hôm nay, tìm thời gian rảnh, hay cần mình phân tích lịch trình mới?`
      : `Hello ${user.name}! I'm Demuse AI (powered by ultra-fast Groq Llama 3.3). I have full context of your weekly schedule and commitments. How can I help you plan your week, check free slots, or parse new schedules today?`,
  };

  const [messages, setMessages] = React.useState<AIChatMessage[]>([initialGreeting]);
  const [input, setInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const quickPrompts = isVi
    ? [
        "Hôm nay mình có những lịch gì?",
        "Tuần này những ngày nào mình có nhiều thời gian rảnh nhất?",
        "Kiểm tra xem mình có bị trùng lịch học hay ca làm nào không?",
        "Lên giúp mình kế hoạch tự học 2 tiếng mỗi tối",
      ]
    : [
        "What is my schedule for today?",
        "Which days this week do I have the most free time?",
        "Do I have any potential schedule clashes?",
        "Draft a 2-hour daily focus study routine for me",
      ];

  const handleSend = async (textToSend?: string) => {
    const promptText = (textToSend || input).trim();
    if (!promptText || isLoading) return;

    const userMsg: AIChatMessage = { role: "user", content: promptText };
    const updatedMessages = [...messages, userMsg];

    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await askDemuseAIAction(updatedMessages, timetableId);
      if (res.success && res.message) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: res.message },
        ]);
      } else {
        setErrorMessage(
          res.error || (isVi ? "Không thể nhận phản hồi từ AI." : "Failed to get AI response.")
        );
      }
    } catch {
      setErrorMessage(
        isVi
          ? "Đã xảy ra lỗi kết nối với Groq AI. Vui lòng kiểm tra lại cấu hình."
          : "An error occurred connecting to Groq AI."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([initialGreeting]);
    setErrorMessage(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-2xl border border-[#ded7c8] bg-white shadow-xs">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-linear-to-br from-amber-500/20 to-orange-500/20 border border-amber-300 flex items-center justify-center text-amber-800 shadow-2xs">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-xl sm:text-2xl font-medium text-[#1c1917]">
                {isVi ? "Trợ Lý Lịch Trình AI" : "Demuse AI Assistant"}
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-[10px] font-bold text-emerald-800 border border-emerald-200 uppercase tracking-wider">
                ⚡ Powered by Groq
              </span>
            </div>
            <p className="text-xs text-[#78716c] mt-0.5">
              {isVi
                ? "Hỏi đáp lịch học, tìm khoảng trống thời gian, kiểm tra trùng lịch và lập kế hoạch tức thì."
                : "Ask about your commitments, find free study slots, check clashes, or draft new plans."}
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleClearHistory}
          className="gap-1.5 self-start sm:self-auto text-xs"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>{isVi ? "Làm mới hội thoại" : "Clear Chat"}</span>
        </Button>
      </div>

      {errorMessage && (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-800">
          <AlertTriangle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">{isVi ? "Thông báo từ Groq AI:" : "Groq AI Notice:"}</p>
            <p className="mt-0.5 opacity-90">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Main Chat Box */}
      <div className="rounded-2xl border border-[#ded7c8] bg-white shadow-xs overflow-hidden flex flex-col h-[580px]">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg, index) => {
            const isAssistant = msg.role === "assistant";

            return (
              <div
                key={index}
                className={`flex gap-3 ${
                  isAssistant ? "justify-start" : "justify-end"
                }`}
              >
                {isAssistant && (
                  <div className="h-8 w-8 rounded-lg bg-[#ede8dc] border border-[#ded7c8] flex items-center justify-center text-[#854d0e] shrink-0">
                    <Sparkles className="h-4 w-4" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                    isAssistant
                      ? "bg-[#faf7f2] border border-[#e8e1d5] text-[#1c1917] shadow-2xs"
                      : "bg-[#1c1917] text-white shadow-xs"
                  }`}
                >
                  {msg.content}
                </div>

                {!isAssistant && (
                  <div className="h-8 w-8 rounded-lg bg-[#1c1917] text-white flex items-center justify-center shrink-0 text-xs font-semibold">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 justify-start items-center animate-pulse">
              <div className="h-8 w-8 rounded-lg bg-[#ede8dc] border border-[#ded7c8] flex items-center justify-center text-[#854d0e] shrink-0">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="rounded-2xl px-4 py-3 bg-[#faf7f2] border border-[#e8e1d5] text-xs text-[#78716c] flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-[#854d0e] animate-bounce" />
                <div className="h-1.5 w-1.5 rounded-full bg-[#854d0e] animate-bounce [animation-delay:0.2s]" />
                <div className="h-1.5 w-1.5 rounded-full bg-[#854d0e] animate-bounce [animation-delay:0.4s]" />
                <span className="ml-1">{isVi ? "Demuse AI đang suy nghĩ..." : "Demuse AI is thinking..."}</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2.5 bg-[#faf7f2]/60 border-t border-[#f0eae1] flex items-center gap-2 overflow-x-auto select-none no-scrollbar">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-[#78716c] shrink-0">
            <Lightbulb className="h-3.5 w-3.5 text-amber-600" />
            <span>{isVi ? "Gợi ý:" : "Prompts:"}</span>
          </div>
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSend(prompt)}
              className="text-[11px] font-medium bg-white hover:bg-[#ede8dc] text-[#57534e] hover:text-[#1c1917] border border-[#ded7c8] px-2.5 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer shrink-0 shadow-2xs"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Form Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 sm:p-4 border-t border-[#ded7c8] bg-white flex items-center gap-2"
        >
          <input
            type="text"
            placeholder={
              isVi
                ? "Hỏi Demuse AI về lịch học, ca làm hoặc kế hoạch tuần..."
                : "Ask Demuse AI about your classes, shifts, or plans..."
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1 bg-[#faf7f2] border border-[#ded7c8] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#1c1917] placeholder:text-[#a8a29e] focus:bg-white focus:border-[#1c1917] focus:outline-none transition-all"
            autoComplete="off"
            spellCheck={false}
          />

          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={!input.trim() || isLoading}
            className="gap-1.5 px-4 h-10 shadow-2xs"
          >
            <span>{isVi ? "Gửi" : "Send"}</span>
            <Send className="h-3.5 w-3.5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
