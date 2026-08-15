import { db, pool } from "./index";
import { users, timetables, subjects, schedules, notificationSettings } from "./schema";
import { hashPassword } from "../modules/auth/auth.service";
import { eq } from "drizzle-orm";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

async function seed() {
  console.log("🌱 Starting Demuse database seeding...");

  const demoEmail = "demo@demuse.app";
  const demoUser = await db.query.users.findFirst({
    where: eq(users.email, demoEmail),
  });

  if (demoUser) {
    console.log(`🧹 Removing existing demo user: ${demoEmail}`);
    await db.delete(users).where(eq(users.id, demoUser.id));
  }

  console.log("👤 Creating demo student: Claire Vance");
  const passwordHash = await hashPassword("password123");
  const [createdUser] = await db
    .insert(users)
    .values({
      name: "Claire Vance",
      email: demoEmail,
      passwordHash,
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    })
    .returning();

  console.log("🔔 Setting up notification preferences");
  await db.insert(notificationSettings).values({
    userId: createdUser.id,
    enabled: true,
    defaultMinutesBefore: 15,
    soundEnabled: true,
  });

  console.log("📅 Creating semester timetable");
  const [tt] = await db
    .insert(timetables)
    .values({
      userId: createdUser.id,
      name: "Computer Science & Design — Spring 2026",
      description: "Core junior year schedule: algorithms, systems, interaction design, machine learning",
      academicTerm: "Spring 2026",
      isPublic: true,
      isDefault: true,
      shareToken: "demuse-claire-vance-preview",
    })
    .returning();

  console.log("📚 Creating curriculum subjects");
  const [sub1] = await db
    .insert(subjects)
    .values({
      timetableId: tt.id,
      name: "Data Structures & Algorithms",
      code: "CS 204",
      teacher: "Prof. Alan Miller",
      room: "Hall 302",
      color: "sage",
      note: "Bring algorithm textbook & laptop with Clang compiler environment.",
    })
    .returning();

  const [sub2] = await db
    .insert(subjects)
    .values({
      timetableId: tt.id,
      name: "UI / UX Interaction Design",
      code: "DES 310",
      teacher: "Elena Rostova",
      room: "Design Studio B",
      color: "terracotta",
      note: "Weekly group critique & Figma design system prototyping on Monday afternoons.",
    })
    .returning();

  const [sub3] = await db
    .insert(subjects)
    .values({
      timetableId: tt.id,
      name: "Computer Systems Architecture",
      code: "CS 350",
      teacher: "Dr. Marcus Chen",
      room: "Turing Lab 104",
      color: "slate",
      note: "RISC-V assembly simulator exercises and cache hit-rate benchmarks.",
    })
    .returning();

  const [sub4] = await db
    .insert(subjects)
    .values({
      timetableId: tt.id,
      name: "Linear Algebra & Optimization",
      code: "MATH 240",
      teacher: "Dr. Sarah Jenkins",
      room: "Euler Hall 12",
      color: "ochre",
      note: "Matrix decomposition, eigenvalues, and gradient descent problem sets.",
    })
    .returning();

  const [sub5] = await db
    .insert(subjects)
    .values({
      timetableId: tt.id,
      name: "Human-Computer Interaction",
      code: "HCI 401",
      teacher: "Prof. Kenneth Ward",
      room: "Media Lab 208",
      color: "dusty-rose",
      note: "User testing experiments and cognitive walkthrough evaluations.",
    })
    .returning();

  const [sub6] = await db
    .insert(subjects)
    .values({
      timetableId: tt.id,
      name: "Applied Machine Learning",
      code: "CS 420",
      teacher: "Prof. Linnea Holme",
      room: "Ada Lab 405",
      color: "pine",
      note: "Deep learning models, CNNs, Transformers, and PyTorch workshops.",
    })
    .returning();

  console.log("⏱️ Scheduling weekly class slots");
  await db.insert(schedules).values([
    // Monday
    {
      subjectId: sub1.id,
      dayOfWeek: 1, // Mon
      startTime: "09:00",
      endTime: "10:30",
      room: "Hall 302",
      type: "lecture",
    },
    {
      subjectId: sub2.id,
      dayOfWeek: 1, // Mon
      startTime: "13:30",
      endTime: "15:30",
      room: "Design Studio B",
      type: "workshop",
    },
    // Tuesday
    {
      subjectId: sub4.id,
      dayOfWeek: 2, // Tue
      startTime: "09:00",
      endTime: "10:30",
      room: "Euler Hall 12",
      type: "lecture",
    },
    {
      subjectId: sub3.id,
      dayOfWeek: 2, // Tue
      startTime: "11:00",
      endTime: "12:30",
      room: "Turing Lab 104",
      type: "lecture",
    },
    {
      subjectId: sub6.id,
      dayOfWeek: 2, // Tue
      startTime: "14:00",
      endTime: "16:00",
      room: "Ada Lab 405",
      type: "lab",
    },
    // Wednesday
    {
      subjectId: sub1.id,
      dayOfWeek: 3, // Wed
      startTime: "09:00",
      endTime: "10:30",
      room: "Turing Lab 104",
      type: "lab",
    },
    {
      subjectId: sub5.id,
      dayOfWeek: 3, // Wed
      startTime: "14:00",
      endTime: "15:30",
      room: "Media Lab 208",
      type: "seminar",
    },
    // Thursday
    {
      subjectId: sub4.id,
      dayOfWeek: 4, // Thu
      startTime: "09:00",
      endTime: "10:30",
      room: "Euler Hall 12",
      type: "tutorial",
    },
    {
      subjectId: sub3.id,
      dayOfWeek: 4, // Thu
      startTime: "13:00",
      endTime: "15:00",
      room: "Turing Lab 104",
      type: "lab",
    },
    // Friday
    {
      subjectId: sub6.id,
      dayOfWeek: 5, // Fri
      startTime: "10:00",
      endTime: "12:00",
      room: "Ada Lab 405",
      type: "lecture",
    },
    {
      subjectId: sub5.id,
      dayOfWeek: 5, // Fri
      startTime: "13:30",
      endTime: "15:00",
      room: "Media Lab 208",
      type: "workshop",
    },
  ]);

  console.log("✨ Demuse database seeded successfully!");
  console.log("🔑 Demo account credentials:");
  console.log("   Email: demo@demuse.app");
  console.log("   Password: password123");
  console.log("   Share link preview: /share/demuse-claire-vance-preview");

  await pool.end();
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
