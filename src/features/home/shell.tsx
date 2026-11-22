import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, type ReactNode } from "react";
import {
  Sun,
  LayoutDashboard,
  Inbox,
  UserRound,
  LogOut,
  Flower2,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { homeOptions } from "./queries";
import { Capture } from "./capture";
export function HomeShell({ children }: { children: ReactNode }) {
  const { data } = useSuspenseQuery(homeOptions);
  const qc = useQueryClient();
  const navigate = useNavigate();
  useEffect(() => {
    document.documentElement.classList.toggle("dark", data.profile.appearance === "dark");
  }, [data.profile.appearance]);
  return (
    <div className="app-layout">
      <aside className="sidebar">
        <Link to="/" className="brand">
          <span className="brand-mark">
            <Sun />
          </span>
          <span>
            my home base<span className="brand-sub">a little room for everything</span>
          </span>
        </Link>
        <div className="nav-label">YOUR SPACE</div>
        <nav className="main-nav">
          <Link
            to="/today"
            activeOptions={{ exact: true }}
            activeProps={{ className: "nav-active" }}
          >
            <LayoutDashboard />
            Today
          </Link>
          <Link to="/inbox" activeProps={{ className: "nav-active" }}>
            <Inbox />
            Inbox{data.inbox.length > 0 && <span className="nav-count">{data.inbox.length}</span>}
          </Link>
          <Link to="/account" activeProps={{ className: "nav-active" }}>
            <UserRound />
            My account
          </Link>
        </nav>
        <div className="sidebar-note">
          <Flower2 />
          <p>
            A little progress.
            <br />A little breathing room.
          </p>
        </div>
        <div className="sidebar-bottom">
          <Link to="/account" className="profile-link">
            <span className="avatar">
              {(data.profile.display_name || "Y").slice(0, 1).toUpperCase()}
            </span>
            <span>
              {data.profile.display_name || "Your space"}
              <small>Personal account</small>
            </span>
            <ArrowUpRight size={15} />
          </Link>
          <Button
            variant="ghost"
            onClick={async () => {
              await qc.cancelQueries();
              qc.clear();
              await supabase.auth.signOut();
              await navigate({ to: "/auth", replace: true });
            }}
          >
            <LogOut />
            Sign out
          </Button>
        </div>
      </aside>
      <div className="app-main">
        <header className="topbar">
          <span>
            <Sun size={16} /> YOUR DAY, AT YOUR PACE
          </span>
          <div className="topbar-right">
            <span className="private-label">Just for you</span>
            <Link to="/account" className="avatar" aria-label="My account">
              {(data.profile.display_name || "Y").slice(0, 1).toUpperCase()}
            </Link>
          </div>
        </header>
        {children}
        <footer className="page-footer">
          <Flower2 size={14} /> You don’t have to do it all today.
        </footer>
      </div>
      <Capture />
    </div>
  );
}
