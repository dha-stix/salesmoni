"use client";

import { useState } from "react";
import { Button } from "./Button";
import { Modal } from "./Modal";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  body: string;
  confirmLabel: string;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}

/** Asks before a destructive action such as deleting a product. */
export function ConfirmDialog({ open, title, body, confirmLabel, onConfirm, onClose }: ConfirmDialogProps) {
  const [busy, setBusy] = useState(false);

  async function handleConfirm() {
    setBusy(true);
    try {
      await onConfirm();
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal open={open} title={title} onClose={onClose}>
      <p className="text-muted">{body}</p>
      <div className="flex gap-2.5">
        <Button variant="outline" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button variant="danger" onClick={handleConfirm} loading={busy} className="flex-1">
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
