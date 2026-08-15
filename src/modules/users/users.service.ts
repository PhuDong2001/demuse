import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NotFoundError, UnauthorizedError } from "@/lib/errors";
import { verifyPassword, hashPassword } from "../auth/auth.service";
import type { UpdateProfileInput, UpdatePasswordInput } from "./users.schema";

export async function getUserProfile(userId: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new NotFoundError("User not found.");
  }

  return user;
}

export async function updateUserProfile(userId: string, data: UpdateProfileInput) {
  const [updated] = await db
    .update(users)
    .set({
      name: data.name,
      avatarUrl: data.avatarUrl || null,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId))
    .returning({
      id: users.id,
      name: users.name,
      email: users.email,
      avatarUrl: users.avatarUrl,
    });

  return updated;
}

export async function updateUserPassword(userId: string, data: UpdatePasswordInput) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!user) {
    throw new NotFoundError("User not found.");
  }

  const isCurrentValid = await verifyPassword(data.currentPassword, user.passwordHash);
  if (!isCurrentValid) {
    throw new UnauthorizedError("Current password is incorrect.");
  }

  const newHash = await hashPassword(data.newPassword);
  await db
    .update(users)
    .set({
      passwordHash: newHash,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));

  return { success: true };
}
