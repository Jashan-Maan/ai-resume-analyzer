// Mark this component as a Client Component so it can use hooks and handle events
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

/**
 * CredentialsForm — Email/password sign-in form.
 *
 * Uses a two-step authentication flow:
 *  1. Pre-validates the user via a custom `/api/auth/check-user` endpoint
 *     (handles unverified accounts, wrong passwords, etc. with clear error messages).
 *  2. If pre-validation passes, delegates the actual session creation to NextAuth's
 *     `signIn("credentials", ...)` so that session cookies are handled automatically.
 */
export default function CredentialsForm() {
  const router = useRouter();

  // Controlled form state for email and password inputs
  const [form, setForm] = useState({ email: "", password: "" });

  // Tracks whether a sign-in request is in progress (used to show spinner & disable button)
  const [loading, setLoading] = useState(false);

  // Holds any error message surfaced to the user after a failed sign-in attempt
  const [error, setError] = useState("");

  // If the user's account is unverified, store their email so we can
  // render a direct link to the email-verification page
  const [verifyEmail, setVerifyEmail] = useState<string>("");

  /**
   * Handles form submission.
   * Runs the two-step auth flow: custom pre-check → NextAuth sign-in.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Clear any previous error / verification prompt before a new attempt
    setError("");
    setVerifyEmail("");

    try {
      // ✅ Step 1 — Pre-validate with our own API before NextAuth
      // This lets us return domain-specific errors (e.g. "email not verified")
      // that NextAuth's generic error handling would otherwise swallow.
      const checkRes = await fetch("/api/auth/check-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      const checkData = await checkRes.json();

      // If the pre-check fails, display the error and bail out early
      if (!checkData.success) {
        setError(checkData.message);
        toast.error(checkData.message);

        // If the account exists but the email hasn't been verified yet,
        // surface a link so the user can complete verification
        if (checkData.needsVerification) {
          setVerifyEmail(checkData.email || form.email);
        }
        return;
      }

      // ✅ Step 2 — If pre-check passes, then sign in with NextAuth
      // `redirect: false` prevents NextAuth from doing a full-page redirect
      // so we can handle navigation ourselves and show toast feedback.
      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      // NextAuth returns an error string on failure even when redirect is false
      if (result?.error) {
        setError("Invalid credentials. Please try again.");
        return;
      }

      // Sign-in succeeded — notify the user and navigate to the dashboard
      toast.success("Welcome back!");
      router.push("/dashboard");
      router.refresh(); // Ensure server components reflect the new session
    } catch {
      // Catch unexpected network / runtime errors
      setError("Something went wrong. Please try again.");
    } finally {
      // Always re-enable the form regardless of outcome
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Email field */}
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
      </div>

      {/* Password field */}
      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Your password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
      </div>

      {/* Error banner — shown only when an error message is present */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 space-y-2">
          <p className="text-red-600 text-sm">{error}</p>

          {/* Verification prompt — shown only when the account needs email verification */}
          {verifyEmail && (
            <Link
              href={`/verify-email?email=${encodeURIComponent(verifyEmail)}`}
              className="inline-flex items-center gap-1 text-sky-blue-600 text-xs font-medium hover:underline"
            >
              Enter verification code →
            </Link>
          )}
        </div>
      )}

      {/* Submit button — disabled and shows a spinner while the request is in-flight */}
      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-sky-blue-600 hover:bg-sky-blue-700 text-white"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin mr-2" />
            Signing in...
          </>
        ) : (
          "Sign In"
        )}
      </Button>
    </form>
  );
}
