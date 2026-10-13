"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";
import { registerAccount } from "@/firebase-actions";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { errorMessage } from "@/lib/utils";

const emptyForm = { businessName: "", name: "", email: "", password: "" };

export function RegisterForm() {
  const [form, setForm] = useState(emptyForm);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const bind = (key: keyof typeof emptyForm) => ({
    value: form[key],
    onChange: (event: { target: { value: string } }) =>
      setForm((current) => ({ ...current, [key]: event.target.value })),
  });

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!form.businessName.trim()) return setError("Enter your business name.");
    if (form.password.length < 8) return setError("Use a password with at least 8 characters.");
    setBusy(true);
    setError("");
    try {
      await registerAccount(form);
      // AuthLayout sends the user to the dashboard once their profile loads.
    } catch (reason) {
      setError(errorMessage(reason));
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <h2 className="heading-display text-[38px] leading-tight">Create your account</h2>
        <p className="text-muted">Set up your business in under a minute.</p>
      </div>

      <Field
        label="Business name"
        placeholder="Asaolu Provisions"
        hint="It appears on your dashboard and Excel reports."
        autoComplete="organization"
        required
        {...bind("businessName")}
      />
      <Field
        label="Your full name"
        placeholder="David Asaolu"
        hint="Shown next to every sale you record."
        autoComplete="name"
        required
        {...bind("name")}
      />
      <Field
        label="Email"
        type="email"
        placeholder="you@business.com"
        hint="Joining a team? Use the email your employer added and you'll join their business."
        autoComplete="email"
        required
        {...bind("email")}
      />
      <Field
        label="Password"
        type="password"
        placeholder="At least 8 characters"
        autoComplete="new-password"
        minLength={8}
        required
        {...bind("password")}
      />

      {error && (
        <p role="alert" className="rounded-xl bg-danger-soft px-4 py-3 text-sm font-semibold text-danger">
          {error}
        </p>
      )}

      <Button type="submit" size="lg" loading={busy}>
        Create account <ArrowRight className="size-[18px]" aria-hidden />
      </Button>

      <p className="text-[15px] text-muted">
        Already have an account?{" "}
        <Link href="/auth/login" className="font-bold text-brand hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
