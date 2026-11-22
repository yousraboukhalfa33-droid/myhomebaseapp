import { createFileRoute, ClientOnly, Navigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { AuthPage } from "@/features/home/auth";
import { sessionOptions, pageHead } from "@/features/home/queries";

export const Route = createFileRoute("/")({
  head: () =>
    pageHead(
      "Your home base",
      "A calm, private home for your priorities, thoughts and everyday life.",
    ),
  component: Index,
});
function Index() {
  return (
    <ClientOnly fallback={<div className="route-state">My Home Base</div>}>
      <Suspense fallback={<div className="route-state">Opening your space…</div>}>
        <HomeEntry />
      </Suspense>
    </ClientOnly>
  );
}
function HomeEntry() {
  const { data } = useSuspenseQuery(sessionOptions);
  return data ? <Navigate to="/today" /> : <AuthPage />;
}
