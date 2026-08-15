import { z } from "zod";

export const updateNotificationSettingsSchema = z.object({
  enabled: z.boolean(),
  defaultMinutesBefore: z.union([
    z.literal(5),
    z.literal(10),
    z.literal(15),
    z.literal(30),
    z.literal(60),
  ]),
  soundEnabled: z.boolean().optional().default(true),
});

export type UpdateNotificationSettingsInput = z.infer<
  typeof updateNotificationSettingsSchema
>;
