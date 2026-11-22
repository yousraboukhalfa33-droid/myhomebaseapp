import { z } from "zod";

export const scale = z.number().int().min(1).max(5);
export const priorityPosition = z.number().int().min(1).max(3);
export const taskInput = z.object({
  title: z.string().trim().min(1).max(500),
  next_step: z.string().max(2000).default(""),
  category: z.enum(["personal", "work", "school"]).default("personal"),
  context_label: z.string().max(150).default(""),
  due_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .nullable()
    .default(null),
});
export const actionInput = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("capture"),
    kind: z.enum(["thought", "task", "link"]),
    body: z.string().trim().min(1).max(10000),
    url: z.string().url().nullable().default(null),
  }),
  z.object({ action: z.literal("task"), task: taskInput }),
  z.object({ action: z.literal("complete"), id: z.string().uuid(), done: z.boolean() }),
  z.object({ action: z.literal("priority"), id: z.string().uuid(), position: priorityPosition }),
  z.object({ action: z.literal("unprioritize"), id: z.string().uuid() }),
  z.object({ action: z.literal("checkin"), field: z.enum(["mood", "energy"]), value: scale }),
  z.object({ action: z.literal("convert"), id: z.string().uuid() }),
  z.object({ action: z.literal("archive"), id: z.string().uuid() }),
  z.object({
    action: z.literal("profile"),
    display_name: z.string().trim().max(100),
    timezone: z.string().refine((v) => {
      try {
        new Intl.DateTimeFormat("en", { timeZone: v });
        return true;
      } catch {
        return false;
      }
    }, "Choose a valid timezone"),
    content_language: z.enum(["en", "fr", "ar"]),
    appearance: z.enum(["light", "dark"]),
  }),
]);
export type HomeAction = z.input<typeof actionInput>;
export function localDay(timezone: string, date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}
export function availablePriority(positions: number[]) {
  return [1, 2, 3].find((n) => !positions.includes(n));
}
