"use client";

import { useState, type FormEvent } from "react";
import { Check, UserPlus, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { errorMessage } from "@/lib/utils";

const permissions = [
  { allowed: true, label: "Record sales under their own name" },
  { allowed: true, label: "See products and stock levels" },
  { allowed: false, label: "Change products or prices, manage the team, or download reports" },
];

interface MemberFormProps {
  onInvite: (name: string, email: string) => Promise<void>;
}

export function MemberForm({ onInvite }: MemberFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await onInvite(name, email);
      setName("");
      setEmail("");
    } catch (reason) {
      setError(errorMessage(reason));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card flex flex-col gap-[18px]">
      <h2 className="heading-display text-2xl">Add a team member</h2>
      <Field
        label="Full name"
        placeholder="Amaka Obi"
        hint="This name shows on every sale they record."
        required
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <Field
        label="Email"
        type="email"
        placeholder="name@business.com"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />

      <div className="flex flex-col gap-2.5 rounded-[14px] bg-ground p-4 text-sm">
        <p className="font-bold">Sales staff can</p>
        {permissions.map((item) => (
          <p key={item.label} className={`flex items-start gap-2.5 ${item.allowed ? "" : "text-muted"}`}>
            {item.allowed ? (
              <Check className="mt-0.5 size-[18px] shrink-0 text-brand" aria-hidden />
            ) : (
              <X className="mt-0.5 size-[18px] shrink-0 text-danger" aria-hidden />
            )}
            <span>
              {!item.allowed && <span className="sr-only">Cannot: </span>}
              {item.label}
            </span>
          </p>
        ))}
      </div>

      {error && (
        <p role="alert" className="rounded-xl bg-danger-soft px-4 py-3 text-sm font-semibold text-danger">
          {error}
        </p>
      )}

      <Button type="submit" size="lg" loading={busy}>
        <UserPlus className="size-[18px]" aria-hidden /> Add member
      </Button>
      <p className="text-[13px] text-muted">
        Ask them to create a SalesMoni account with this email. They join your business as soon as
        they sign up.
      </p>
    </form>
  );
}
