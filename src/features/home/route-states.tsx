import { useRouter, type ErrorComponentProps } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
export function RouteError({ error, reset }: ErrorComponentProps) {
  const router = useRouter();
  return (
    <div className="route-state">
      <h1>A little hiccup.</h1>
      <p role="alert">{error instanceof Error ? error.message : "Please try again in a moment."}</p>
      <Button
        onClick={async () => {
          await router.invalidate();
          reset();
        }}
      >
        Try again
      </Button>
    </div>
  );
}
export function RouteMissing() {
  return (
    <div className="route-state">
      <h1>Nothing here yet.</h1>
      <p>That page could not be found.</p>
    </div>
  );
}
