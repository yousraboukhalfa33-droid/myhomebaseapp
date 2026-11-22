import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { pageHead } from "@/features/home/queries";
export const Route = createFileRoute("/reset-password")({
  head: () => pageHead("Reset password", "Choose a new password and return to My Home Base."),
  component: ResetPassword,
});
function ResetPassword() {
  const [valid, setValid] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    const recovery = new URLSearchParams(window.location.hash.slice(1)).get("type") === "recovery";
    setValid(recovery || sessionStorage.getItem("homebase-recovery") === "true");
    setChecking(false);
  }, []);
  return (
    <main className="reset-page">
      <div className="brand">
        <Sun />
        my home base
      </div>
      <h1>A fresh start.</h1>
      {checking ? (
        <p>Checking your reset link…</p>
      ) : done ? (
        <>
          <p role="status">Your new password is saved.</p>
          <Button asChild>
            <Link to="/">Back to my home base</Link>
          </Button>
        </>
      ) : valid ? (
        <form
          className="form-stack"
          onSubmit={async (e) => {
            e.preventDefault();
            const form = new FormData(e.currentTarget);
            const password = String(form.get("password"));
            if (password !== form.get("confirm")) {
              setError("Your passwords don’t match.");
              return;
            }
            setBusy(true);
            const { error } = await supabase.auth.updateUser({ password });
            setBusy(false);
            if (error) setError(error.message);
            else {
              sessionStorage.removeItem("homebase-recovery");
              setDone(true);
            }
          }}
        >
          <label htmlFor="new-password">New password</label>
          <Input
            name="password"
            id="new-password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
          />
          <label htmlFor="confirm-password">Confirm new password</label>
          <Input
            name="confirm"
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
          />
          {error && (
            <p role="alert" className="form-error">
              {error}
            </p>
          )}
          <Button type="submit" disabled={busy}>
            {busy ? "Saving…" : "Save new password"}
          </Button>
        </form>
      ) : (
        <>
          <p>This reset link is missing or has expired. Request a fresh link to try again.</p>
          <Button asChild>
            <Link to="/auth">Back to sign in</Link>
          </Button>
        </>
      )}
    </main>
  );
}
