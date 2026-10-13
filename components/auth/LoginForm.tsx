"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";
import { login, resetPassword } from "@/firebase-actions";
import { useToast } from "@/components/providers/ToastProvider";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { errorMessage } from "@/lib/utils";

export function LoginForm() {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await login(email, password);
      // AuthLayout sends the user to the dashboard once their profile loads.
    } catch (reason) {
      setError(errorMessage(reason));
      setBusy(false);
    }
  }

  async function handleReset() {
    if (!email) return setError("Enter your email above, then choose Forgot password.");
    try {
      await resetPassword(email);
      toast("Password reset link sent. Check your email.");
    } catch (reason) {
      setError(errorMessage(reason));
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate={false}>
      <div className="flex flex-col gap-2">
        <h2 className="heading-display text-[38px] leading-tight">Welcome back</h2>
        <p className="text-muted">Sign in to see today&apos;s sales and your stock.</p>
      </div>

      <Field
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="you@business.com"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <div className="flex flex-col gap-2">
        <Field
          label="Password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <button
          type="button"
          onClick={handleReset}
          className="self-end text-sm font-semibold text-brand hover:underline"
        >
          Forgot password?
        </button>
      </div>

      {error && (
        <p role="alert" className="rounded-xl bg-danger-soft px-4 py-3 text-sm font-semibold text-danger">
          {error}
        </p>
      )}

      <Button type="submit" size="lg" loading={busy}>
        Sign in <ArrowRight className="size-[18px]" aria-hidden />
      </Button>

      <p className="border-t border-line pt-5 text-[15px] text-muted">
        New to SalesMoni?{" "}
        <Link href="/auth/register" className="font-bold text-brand hover:underline">
          Create an account
        </Link>
      </p>
    </form>
  );
}
