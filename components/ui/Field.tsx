"use client";

import { useId, useState, type ComponentProps, type ReactNode } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface FieldProps extends ComponentProps<"input"> {
  label: ReactNode;
  hint?: string;
}

/** A labelled text input. Password fields get a show/hide toggle. */
export function Field({ label, hint, className, type = "text", required, ...props }: FieldProps) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="field-label">
        {label}
        {required && <span className="text-danger"> *</span>}
      </label>
      <div className="relative">
        <input
          id={id}
          type={isPassword && visible ? "text" : type}
          required={required}
          className={cn("field-input", isPassword && "pr-14", className)}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible((current) => !current)}
            aria-label={visible ? "Hide password" : "Show password"}
            className="absolute right-1 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-lg text-muted hover:text-ink"
          >
            {visible ? <EyeOff className="size-5" aria-hidden /> : <Eye className="size-5" aria-hidden />}
          </button>
        )}
      </div>
      {hint && <p className="text-sm text-muted">{hint}</p>}
    </div>
  );
}
