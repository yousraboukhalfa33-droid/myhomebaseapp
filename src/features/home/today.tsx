import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  Target,
  CalendarDays,
  ArrowUpRight,
  Leaf,
  Check,
  Plus,
  Sun,
  ChevronDown,
  Minus,
  Send,
  Heart,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import banner from "@/assets/morning-banner.asset.json";
import { homeOptions } from "./queries";
import { useHomeAction } from "./use-action";
import { availablePriority } from "./rules";
import { HomeShell } from "./shell";
import { TaskDialog } from "./task-dialog";
export function Today() {
  const { data } = useSuspenseQuery(homeOptions);
  const mutation = useHomeAction();
  const [pick, setPick] = useState(false);
  const [showTasks, setShowTasks] = useState(false);
  const openTasks = data.tasks.filter((t) => t.status === "open");
  const deadlines = openTasks
    .filter((t) => t.due_date)
    .sort((a, b) => (a.due_date ?? "").localeCompare(b.due_date ?? ""));
  const next = deadlines[0];
  const school = deadlines.filter((t) => t.category === "school").slice(0, 3);
  const slot = availablePriority(data.priorities.map((p) => p.position));
  const priorityTasks = data.priorities.flatMap((p) => {
    const task = data.tasks.find((t) => t.id === p.task_id);
    return task ? [{ ...task, position: p.position }] : [];
  });
  const completed = priorityTasks.filter((t) => t.status === "done").length;
  const name = data.profile.display_name.trim().split(" ")[0];
  const dateLabel = new Date(`${data.today}T12:00:00`).toLocaleDateString("en", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  return (
    <HomeShell>
      <main className="page-content">
        <div className="page-heading">
          <div>
            <div className="eyebrow">{dateLabel}</div>
            <h1>Today</h1>
          </div>
          <TaskDialog />
        </div>
        <section className="welcome-banner">
          <img src={banner.url} alt="Eucalyptus, a notebook and a cup in morning sunlight" />
          <div className="welcome-text">
            <div className="welcome-eyebrow">
              <Sun size={15} /> A FRESH LITTLE START
            </div>
            <h2>
              Hello{name ? `, ${name}` : ""}.<br />
              Let’s make room for today.
            </h2>
            <p>Not everything. Just what matters.</p>
          </div>
        </section>
        <div className="today-grid">
          <section className="widget priorities-widget">
            <div className="widget-heading">
              <span className="widget-icon tone-sage">
                <Target />
              </span>
              <h2>My top 3</h2>
              <span className="widget-meta">
                {completed} of {priorityTasks.length} done
              </span>
            </div>
            <p className="widget-subtitle">A little focus goes a long way.</p>
            <div className="priority-list">
              {[1, 2, 3].map((position) => {
                const task = priorityTasks.find((t) => t.position === position);
                return task ? (
                  <div className="priority-row" key={position}>
                    <Button
                      size="icon"
                      variant="ghost"
                      className={`task-check ${task.status === "done" ? "is-complete" : ""}`}
                      aria-label={
                        task.status === "done" ? `Reopen ${task.title}` : `Complete ${task.title}`
                      }
                      disabled={mutation.isPending}
                      onClick={() =>
                        mutation.mutate({
                          action: "complete",
                          id: task.id,
                          done: task.status !== "done",
                        })
                      }
                    >
                      {task.status === "done" ? <Check /> : <span>{position}</span>}
                    </Button>
                    <div className="task-content">
                      <span className="task-area">
                        {task.context_label ||
                          { work: "Client work", school: "School", personal: "Personal" }[
                            task.category
                          ]}
                      </span>
                      <p dir="auto" className={task.status === "done" ? "completed-title" : ""}>
                        {task.title}
                      </p>
                      {task.next_step && <small dir="auto">Next: {task.next_step}</small>}
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label={`Remove ${task.title} from priorities`}
                      title="Remove from today"
                      disabled={mutation.isPending}
                      onClick={() => mutation.mutate({ action: "unprioritize", id: task.id })}
                    >
                      <Minus />
                    </Button>
                  </div>
                ) : (
                  <Button
                    key={position}
                    variant="ghost"
                    className="empty-priority"
                    onClick={() => setPick(true)}
                  >
                    <span className="priority-number">{position}</span>
                    <span>
                      {position === 1
                        ? "Choose one thing that matters"
                        : "Leave a little room, or add a priority"}
                    </span>
                    <Plus />
                  </Button>
                );
              })}
            </div>
            <div className="gentle-note">
              <Leaf size={15} />
              <span>Three is a limit, not a to-do.</span>
            </div>
          </section>
          <section className="widget deadline-widget">
            <div className="widget-heading">
              <span className="widget-icon tone-peach">
                <CalendarDays />
              </span>
              <h2>On the horizon</h2>
            </div>
            <p className="widget-subtitle">Your next deadline, without the noise.</p>
            {next ? (
              <div className="deadline-content">
                <span className="eyebrow">{next.context_label || next.category}</span>
                <h3 dir="auto">{next.title}</h3>
                <p className="deadline-date">
                  {next.due_date &&
                    new Date(`${next.due_date}T12:00:00`).toLocaleDateString("en", {
                      month: "short",
                      day: "numeric",
                    })}
                </p>
                {next.due_date && next.due_date < data.today && (
                  <span className="soft-label">Still here when you’re ready</span>
                )}
              </div>
            ) : (
              <div className="empty-state">
                <CalendarDays />
                <h3>A little breathing room.</h3>
                <p>No deadlines added yet.</p>
              </div>
            )}
            {school.length > 0 && (
              <div className="school-deadlines">
                {school.map((t) => (
                  <div key={t.id}>
                    <span dir="auto">{t.title}</span>
                    <small>{t.due_date}</small>
                  </div>
                ))}
              </div>
            )}
          </section>
          <section className="widget posts-widget">
            <div className="widget-heading">
              <span className="widget-icon tone-blue">
                <Send />
              </span>
              <h2>Content coming up</h2>
              <span className="widget-meta">Next 3 days</span>
            </div>
            <div className="empty-state compact">
              <Send />
              <h3>Nothing on the calendar yet.</h3>
              <p>Your next posts will have a home here.</p>
              <span className="soft-label">Content planning · Step 2</span>
            </div>
          </section>
          <section className="widget habits-widget">
            <div className="widget-heading">
              <span className="widget-icon tone-sage">
                <Leaf />
              </span>
              <h2>Little rituals</h2>
            </div>
            <div className="empty-state compact">
              <Leaf />
              <h3>Start small. Stay gentle.</h3>
              <p>No habits added yet.</p>
              <span className="soft-label">Habit tracking · Step 2</span>
            </div>
          </section>
          <section className="widget energy-widget">
            <div className="widget-heading">
              <span className="widget-icon tone-pink">
                <Heart />
              </span>
              <h2>How are you, really?</h2>
              <span className="widget-meta">A moment for you</span>
            </div>
            <div className="checkin-grid">
              {(["mood", "energy"] as const).map((field) => (
                <div key={field} className="checkin-scale">
                  <div className="scale-label">
                    <h3>{field === "mood" ? "My mood" : "My energy"}</h3>
                    <span>
                      {data.checkin?.[field]
                        ? `${data.checkin[field]} / 5`
                        : "No pressure to check in"}
                    </span>
                  </div>
                  <div className="emoji-scale">
                    {(field === "mood"
                      ? ["😔", "😕", "😐", "🙂", "😊"]
                      : ["🪫", "🌙", "🌤️", "☀️", "⚡"]
                    ).map((emoji, i) => (
                      <Button
                        key={i}
                        variant="ghost"
                        aria-label={`${field} ${i + 1}`}
                        aria-pressed={data.checkin?.[field] === i + 1}
                        title={`${i + 1} of 5`}
                        className={data.checkin?.[field] === i + 1 ? "emoji-selected" : ""}
                        disabled={mutation.isPending}
                        onClick={() => mutation.mutate({ action: "checkin", field, value: i + 1 })}
                      >
                        {emoji}
                      </Button>
                    ))}
                  </div>
                  <div className="scale-ends">
                    <span>{field === "mood" ? "Not my day" : "Running low"}</span>
                    <span>{field === "mood" ? "Feeling good" : "Ready to go"}</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="checkin-footnote">
              {data.checkin
                ? "Your check-in is saved. You can change it any time."
                : "Whatever you’re bringing today is welcome here."}
            </p>
          </section>
        </div>
        <section className="task-drawer">
          <Button
            variant="ghost"
            className="task-drawer-trigger"
            onClick={() => setShowTasks(!showTasks)}
            aria-expanded={showTasks}
          >
            <span>
              <CheckCircle2 />
              All my tasks <span className="soft-label">{openTasks.length} open</span>
            </span>
            <ChevronDown />
          </Button>
          {showTasks && (
            <div className="all-tasks">
              {data.tasks.length === 0 ? (
                <p>No tasks yet. Start with one small thing.</p>
              ) : (
                data.tasks.map((t) => (
                  <div key={t.id} className="all-task-row">
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={mutation.isPending}
                      aria-label={`Mark ${t.title} ${t.status === "done" ? "open" : "done"}`}
                      onClick={() =>
                        mutation.mutate({ action: "complete", id: t.id, done: t.status !== "done" })
                      }
                    >
                      {t.status === "done" ? <Check /> : <span className="checkbox-outline" />}
                    </Button>
                    <div>
                      <p dir="auto" className={t.status === "done" ? "completed-title" : ""}>
                        {t.title}
                      </p>
                      <small>
                        {t.context_label || t.category}
                        {t.due_date ? ` · ${t.due_date}` : ""}
                      </small>
                    </div>
                    {slot &&
                      t.status === "open" &&
                      !data.priorities.some((p) => p.task_id === t.id) && (
                        <Button
                          variant="ghost"
                          disabled={mutation.isPending}
                          onClick={() =>
                            mutation.mutate({ action: "priority", id: t.id, position: slot })
                          }
                        >
                          Today
                          <ArrowUpRight />
                        </Button>
                      )}
                  </div>
                ))
              )}
            </div>
          )}
        </section>
      </main>
      <Dialog open={pick} onOpenChange={setPick}>
        <DialogContent>
          <DialogTitle>What matters today?</DialogTitle>
          <DialogDescription>Pick one task. The rest can wait.</DialogDescription>
          {openTasks
            .filter((t) => !data.priorities.some((p) => p.task_id === t.id))
            .map((t) => (
              <Button
                variant="outline"
                className="priority-picker"
                key={t.id}
                disabled={!slot || mutation.isPending}
                onClick={async () => {
                  if (!slot) return;
                  await mutation
                    .mutateAsync({ action: "priority", id: t.id, position: slot })
                    .then(() => setPick(false))
                    .catch(() => {});
                }}
              >
                <span dir="auto">{t.title}</span>
                <Plus />
              </Button>
            ))}
          {openTasks.length === 0 && <p className="text-muted-foreground">No open tasks yet.</p>}
          <TaskDialog />
        </DialogContent>
      </Dialog>
    </HomeShell>
  );
}
