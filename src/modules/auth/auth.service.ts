import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { db } from "@/db";
import { users, timetables, notificationSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { generateShareToken } from "@/lib/utils";
import { AppError, UnauthorizedError, ConflictError } from "@/lib/errors";
import type { RegisterInput, LoginInput } from "./auth.schema";

const COOKIE_NAME = "demuse_session";
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "demuse_fallback_secret_key_32_characters_minimum"
);

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(JWT_SECRET);
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      name: payload.name as string,
    };
  } catch {
    return null;
  }
}

export async function setSessionCookie(token: string, rememberMe: boolean = true) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    ...(rememberMe ? { maxAge: 30 * 24 * 60 * 60 } : {}),
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function registerUser(input: RegisterInput) {
  // 1. Check existing user
  const existing = await db.query.users.findFirst({
    where: eq(users.email, input.email),
  });

  if (existing) {
    throw new ConflictError("An account with this email already exists.");
  }

  // 2. Hash password
  const passwordHash = await hashPassword(input.password);

  // 3. Create user in database
  const [newUser] = await db
    .insert(users)
    .values({
      name: input.name,
      email: input.email,
      passwordHash,
    })
    .returning();

  if (!newUser) {
    throw new AppError("Failed to create user account.");
  }

  // 4. Create default Timetable & Notification Settings for new user
  await db.insert(timetables).values({
    userId: newUser.id,
    name: "My Weekly Timetable",
    description: "Personal academic timetable",
    academicTerm: "Current Term",
    isPublic: false,
    isDefault: true,
    shareToken: generateShareToken(),
  });

  await db.insert(notificationSettings).values({
    userId: newUser.id,
    enabled: true,
    defaultMinutesBefore: 15,
    soundEnabled: true,
  });

  // 5. Issue session
  const token = await createSessionToken({
    userId: newUser.id,
    email: newUser.email,
    name: newUser.name,
  });

  await setSessionCookie(token);

  return {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
  };
}

export async function loginUser(input: LoginInput) {
  const user = await db.query.users.findFirst({
    where: eq(users.email, input.email),
  });

  if (!user) {
    throw new UnauthorizedError("Invalid email or password.");
  }

  const isValid = await verifyPassword(input.password, user.passwordHash);
  if (!isValid) {
    throw new UnauthorizedError("Invalid email or password.");
  }

  const token = await createSessionToken({
    userId: user.id,
    email: user.email,
    name: user.name,
  });

  await setSessionCookie(token, input.rememberMe ?? true);

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
  };
}

export async function getSessionPayload(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}
