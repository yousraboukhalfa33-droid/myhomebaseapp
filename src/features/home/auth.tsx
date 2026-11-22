import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Sun, ArrowRight, ArrowLeft, Mail } from "lucide-react";
import { LovableMark } from "@lovable.dev/cloud-auth-js/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GoogleMark } from "@/components/google-mark";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import banner from "@/assets/morning-banner.asset.json";

export function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const qc = useQueryClient();
  async function social(provider: "google" | "lovable") {
    setBusy(true);
    setError("");
    try {
      const result = await lovable.auth.signInWithOAuth(provider, {
        redirect_uri: window.location.origin,
      });
      if (result.error) throw result.error;
      if (!result.redirected) {
        await qc.invalidateQueries();
        await navigate({ to: "/" });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not sign in. Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="auth-page">
      <img
        className="auth-background"
        src={banner.url}
        alt="Eucalyptus and a notebook in morning light"
      />
      <header className="auth-brand">
        <Sun />
        <span>my home base</span>
      </header>
      <main className="auth-content">
        <div className="eyebrow">YOUR SPACE TO COME BACK TO</div>
        <h1>
          A little room
          <br />
          for your life.
        </h1>
        <p className="auth-intro">
          Your work. Your studies. Your everyday.
          <br />
          One small step at a time.
        </p>
        <div className="auth-form-panel">
          <div className="auth-tabs">
            {mode !== "forgot" ? (
              <>
                <Button
                  variant={mode === "signin" ? "secondary" : "ghost"}
                  onClick={() => {
                    setMode("signin");
                    setError("");
                    setMessage("");
                  }}
                >
                  Sign in
                </Button>
                <Button
                  variant={mode === "signup" ? "secondary" : "ghost"}
                  onClick={() => {
                    setMode("signup");
                    setError("");
                    setMessage("");
                  }}
                >
                  Create account
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                onClick={() => {
                  setMode("signin");
                  setMessage("");
                }}
              >
                <ArrowLeft />
                Back to sign in
              </Button>
            )}
          </div>
          {mode === "forgot" && <h2>Let’s get you back in.</h2>}
          {message ? (
            <div className="auth-message" role="status">
              <Mail />
              <h2>Check your email</h2>
              <p>{message}</p>
              <Button
                variant="outline"
                onClick={() => {
                  setMessage("");
                  setMode("signin");
                }}
              >
                Back to sign in
              </Button>
            </div>
          ) : (
            <form
              className="form-stack"
              onSubmit={async (e) => {
                e.preventDefault();
                setBusy(true);
                setError("");
                const form = new FormData(e.currentTarget);
                const email = String(form.get("email"));
                const password = String(form.get("password") || "");
                try {
                  if (mode === "forgot") {
                    const { error } = await supabase.auth.resetPasswordForEmail(email, {
                      redirectTo: `${window.location.origin}/reset-password`,
                    });
                    if (error) throw error;
                    setMessage(
                      "If an account exists for that email, you’ll receive a link to choose a new password.",
                    );
                  } else if (mode === "signup") {
                    const { data, error } = await supabase.auth.signUp({
                      email,
                      password,
                      options: {
                        emailRedirectTo: window.location.origin,
                        data: { display_name: String(form.get("display_name")) },
                      },
                    });
                    if (error) throw error;
                    if (!data.session) {
                      setMessage("Follow the confirmation link to open your home base.");
                    } else {
                      await qc.invalidateQueries();
                      await navigate({ to: "/" });
                    }
                  } else {
                    const { error } = await supabase.auth.signInWithPassword({ email, password });
                    if (error) throw error;
                    await qc.invalidateQueries();
                    await navigate({ to: "/" });
                  }
                } catch (e) {
                  setError(
                    e instanceof Error ? e.message : "Something went wrong. Please try again.",
                  );
                } finally {
                  setBusy(false);
                }
              }}
            >
              {mode === "signup" && (
                <>
                  <label htmlFor="display-name">Your name</label>
                  <Input
                    id="display-name"
                    name="display_name"
                    autoComplete="given-name"
                    required
                    maxLength={100}
                    placeholder="What should we call you?"
                  />
                </>
              )}
              <label htmlFor="email">Email address</label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
              />
              {mode !== "forgot" && (
                <>
                  <div className="password-label">
                    <label htmlFor="password">Password</label>
                    {mode === "signin" && (
                      <Button
                        type="button"
                        variant="link"
                        size="sm"
                        onClick={() => setMode("forgot")}
                      >
                        Forgot password?
                      </Button>
                    )}
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete={mode === "signup" ? "new-password" : "current-password"}
                    required
                    minLength={8}
                    placeholder={mode === "signup" ? "At least 8 characters" : "Your password"}
                  />
                </>
              )}
              {error && (
                <p className="form-error" role="alert">
                  {error}
                </p>
              )}
              <Button type="submit" disabled={busy} size="lg">
                {busy
                  ? "One moment…"
                  : mode === "signup"
                    ? "Create my home base"
                    : mode === "forgot"
                      ? "Send reset link"
                      : "Welcome back"}
                <ArrowRight />
              </Button>
            </form>
          )}
          {mode !== "forgot" && !message && (
            <>
              <div className="auth-divider">
                <span>or come in with</span>
              </div>
              <div className="social-buttons">
                <Button variant="google" disabled={busy} onClick={() => social("google")}>
                  <GoogleMark />
                  Continue with Google
                </Button>
                <Button variant="outline" disabled={busy} onClick={() => social("lovable")}>
                  <LovableMark />
                  Continue with Lovable
                </Button>
              </div>
            </>
          )}
        </div>
        <p className="auth-bottom">Nothing to catch up on. Just a place to begin.</p>
      </main>
    </div>
  );
}
