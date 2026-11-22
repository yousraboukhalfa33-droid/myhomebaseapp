import { useSuspenseQuery } from "@tanstack/react-query";
import { Inbox, Link2, Lightbulb, ListTodo, Archive, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { homeOptions } from "./queries";
import { HomeShell } from "./shell";
import { useHomeAction } from "./use-action";
export function InboxPage() {
  const { data } = useSuspenseQuery(homeOptions);
  const mutation = useHomeAction();
  return (
    <HomeShell>
      <main className="page-content">
        <div className="page-heading">
          <div>
            <div className="eyebrow">A PLACE TO PUT IT DOWN</div>
            <h1>Inbox</h1>
            <p className="page-description">
              Everything you saved. Nothing you have to sort right now.
            </p>
          </div>
          <span className="soft-label">{data.inbox.length} unsorted</span>
        </div>
        <div className="inbox-list">
          {data.inbox.length === 0 ? (
            <div className="inbox-empty">
              <Inbox />
              <h2>A clear little corner.</h2>
              <p>Nothing in your Inbox yet.</p>
            </div>
          ) : (
            data.inbox.map((item) => {
              const Icon =
                item.kind === "link" ? Link2 : item.kind === "task" ? ListTodo : Lightbulb;
              const safeUrl = item.url && /^https?:\/\//i.test(item.url) ? item.url : null;
              return (
                <article className="inbox-item" key={item.id}>
                  <span
                    className={`widget-icon ${item.kind === "link" ? "tone-blue" : "tone-sage"}`}
                  >
                    <Icon />
                  </span>
                  <div className="inbox-body">
                    <div className="inbox-item-meta">
                      <span>{item.kind}</span>
                      <time>
                        {new Date(item.created_at).toLocaleDateString("en", {
                          month: "short",
                          day: "numeric",
                          timeZone: data.profile.timezone,
                        })}
                      </time>
                    </div>
                    <p dir="auto">{item.body}</p>
                    {safeUrl && (
                      <a href={safeUrl} target="_blank" rel="noreferrer" className="saved-link">
                        {item.url}
                        <ArrowUpRight size={15} />
                      </a>
                    )}
                    <div className="inbox-actions">
                      <Button
                        variant="outline"
                        disabled={mutation.isPending}
                        onClick={() => mutation.mutate({ action: "convert", id: item.id })}
                      >
                        Make a task
                        <ArrowUpRight />
                      </Button>
                      <Button
                        variant="ghost"
                        disabled={mutation.isPending}
                        onClick={() => mutation.mutate({ action: "archive", id: item.id })}
                      >
                        <Archive />
                        Archive
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </main>
    </HomeShell>
  );
}
