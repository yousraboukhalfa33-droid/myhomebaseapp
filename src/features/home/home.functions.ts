import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { actionInput, localDay } from "./rules";

export const readHome = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const db = context.supabase;
    const profile = await db.from("profiles").select("*").eq("id", context.userId).single();
    if (profile.error) throw new Error(profile.error.message);
    const today = localDay(profile.data.timezone);
    const [tasks, priorities, checkin, inbox] = await Promise.all([
      db.from("tasks").select("*").order("created_at", { ascending: false }),
      db.from("daily_priorities").select("*").eq("local_date", today).order("position"),
      db.from("daily_checkins").select("*").eq("local_date", today).maybeSingle(),
      db
        .from("inbox_items")
        .select("*")
        .is("sorted_at", null)
        .order("created_at", { ascending: false }),
    ]);
    for (const result of [tasks, priorities, checkin, inbox])
      if (result.error) throw new Error(result.error.message);
    return {
      profile: profile.data,
      today,
      tasks: tasks.data ?? [],
      priorities: priorities.data ?? [],
      checkin: checkin.data,
      inbox: inbox.data ?? [],
    };
  });

export const changeHome = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => actionInput.parse(input))
  .handler(async ({ data, context }) => {
    const db = context.supabase;
    const profile = await db.from("profiles").select("timezone").eq("id", context.userId).single();
    if (profile.error) throw new Error(profile.error.message);
    const today = localDay(profile.data.timezone);
    let error: { message: string } | null = null;
    // Ownership is enforced both by RLS and every mutation's owner predicate.
    switch (data.action) {
      case "capture":
        ({ error } = await db
          .from("inbox_items")
          .insert({ owner_id: context.userId, kind: data.kind, body: data.body, url: data.url }));
        break;
      case "task":
        ({ error } = await db.from("tasks").insert({ ...data.task, owner_id: context.userId }));
        break;
      case "complete":
        ({ error } = await db
          .from("tasks")
          .update({ status: data.done ? "done" : "open" })
          .eq("id", data.id)
          .eq("owner_id", context.userId));
        break;
      case "priority":
        ({ error } = await db
          .from("daily_priorities")
          .insert({
            owner_id: context.userId,
            local_date: today,
            task_id: data.id,
            position: data.position,
          }));
        break;
      case "unprioritize":
        ({ error } = await db
          .from("daily_priorities")
          .delete()
          .eq("task_id", data.id)
          .eq("owner_id", context.userId)
          .eq("local_date", today));
        break;
      case "checkin":
        ({ error } = await db
          .from("daily_checkins")
          .upsert(
            {
              owner_id: context.userId,
              local_date: today,
              ...(data.field === "mood" ? { mood: data.value } : { energy: data.value }),
            },
            { onConflict: "owner_id,local_date" },
          ));
        break;
      case "convert":
        ({ error } = await db.rpc("convert_capture_to_task", { capture_id: data.id }));
        break;
      case "archive":
        ({ error } = await db
          .from("inbox_items")
          .update({ sorted_at: new Date().toISOString() })
          .eq("id", data.id)
          .eq("owner_id", context.userId));
        break;
      case "profile":
        ({ error } = await db
          .from("profiles")
          .update({
            display_name: data.display_name,
            timezone: data.timezone,
            content_language: data.content_language,
            appearance: data.appearance,
          })
          .eq("id", context.userId));
        break;
    }
    if (error)
      throw new Error(
        error.message.includes("duplicate key")
          ? "That task or priority slot is already selected. Please refresh and try again."
          : error.message,
      );
    return { success: true };
  });
