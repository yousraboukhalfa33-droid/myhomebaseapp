import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useHomeAction } from "./use-action";
export function TaskDialog() {
  const [open, setOpen] = useState(false);
  const mutation = useHomeAction();
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        <Plus />
        Add a task
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogTitle>One thing at a time.</DialogTitle>
          <DialogDescription>A small step counts, too.</DialogDescription>
          <form
            className="form-stack"
            onSubmit={async (e) => {
              e.preventDefault();
              const form = new FormData(e.currentTarget);
              await mutation
                .mutateAsync({
                  action: "task",
                  task: {
                    title: String(form.get("title")),
                    next_step: String(form.get("next_step")),
                    category: form.get("category") as "personal" | "work" | "school",
                    context_label: String(form.get("context_label")),
                    due_date: String(form.get("due_date")) || null,
                  },
                })
                .then(() => setOpen(false))
                .catch(() => {});
            }}
          >
            <label htmlFor="task-title">Task</label>
            <Input
              id="task-title"
              name="title"
              dir="auto"
              required
              maxLength={500}
              placeholder="What would you like to move forward?"
            />
            <label htmlFor="task-step">
              Next small step <span className="text-muted-foreground">(optional)</span>
            </label>
            <Input
              id="task-step"
              name="next_step"
              dir="auto"
              placeholder="Something you could do in five minutes"
            />
            <div className="form-two">
              <div>
                <label htmlFor="task-category">Area</label>
                <select id="task-category" name="category">
                  <option value="personal">Personal</option>
                  <option value="work">Client work</option>
                  <option value="school">School</option>
                </select>
              </div>
              <div>
                <label htmlFor="task-date">Due date (optional)</label>
                <Input id="task-date" type="date" name="due_date" />
              </div>
            </div>
            <label htmlFor="task-context">Client or course (optional)</label>
            <Input id="task-context" name="context_label" dir="auto" maxLength={150} />
            <Button disabled={mutation.isPending} type="submit">
              {mutation.isPending ? "Saving…" : "Save task"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
