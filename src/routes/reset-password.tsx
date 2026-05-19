import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Lock } from "lucide-react";
import { AuthShell, Field } from "./register";

export const Route = createFileRoute("/reset-password")({
  component: ResetPassword,
  head: () => ({ meta: [{ title: "Reset password — Khushi's Hub" }] }),
});

function ResetPassword() {
  const nav = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Supabase recovery link sets a session via hash params on load
    supabase.auth.getSession().then(({ data }) => {
      setReady(!!data.session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) setReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) return toast.error("Passwords don't match");
    if (password.length < 6) return toast.error("Password must be at least 6 characters");
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Password updated! Please sign in.");
    await supabase.auth.signOut();
    nav({ to: "/login" });
  }

  return (
    <AuthShell title="Set new password" subtitle="Choose a strong password.">
      {!ready ? (
        <p className="text-center text-sm text-muted-foreground">
          This link is invalid or expired. Request a new reset link from the Forgot password page.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-3">
          <Field icon={Lock} type="password" placeholder="New password" value={password} onChange={setPassword} required minLength={6} />
          <Field icon={Lock} type="password" placeholder="Confirm password" value={confirm} onChange={setConfirm} required minLength={6} />
          <button disabled={loading} className="w-full btn-glow rounded-xl py-3 text-sm font-medium disabled:opacity-50">
            {loading ? "Updating…" : "Update password"}
          </button>
        </form>
      )}
    </AuthShell>
  );
}
