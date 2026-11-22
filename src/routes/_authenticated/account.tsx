import { createFileRoute } from "@tanstack/react-router";
import { AccountPage } from "@/features/home/account";
import { homeOptions, pageHead } from "@/features/home/queries";
import { RouteError, RouteMissing } from "@/features/home/route-states";
export const Route = createFileRoute("/_authenticated/account")({
  head: () =>
    pageHead("My account", "Personalize your profile, timezone, language and appearance."),
  loader: ({ context }) => context.queryClient.ensureQueryData(homeOptions),
  component: AccountPage,
  errorComponent: RouteError,
  notFoundComponent: RouteMissing,
});
