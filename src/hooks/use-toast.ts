"use client";

import { useState, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ToastVariant = "success" | "error";

export interface ToastState {
  open: boolean;
  variant: ToastVariant;
  title: string;
  description?: string;
}

const INITIAL_STATE: ToastState = {
  open: false,
  variant: "success",
  title: "",
  description: undefined,
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useToast() {
  const [toast, setToast] = useState<ToastState>(INITIAL_STATE);

  const showToast = useCallback((variant: ToastVariant, title: string, description?: string) => {
    setToast({ open: true, variant, title, description });
  }, []);

  const showSuccess = useCallback(
    (title: string, description?: string) => showToast("success", title, description),
    [showToast]
  );

  const showError = useCallback(
    (title: string, description?: string) => showToast("error", title, description),
    [showToast]
  );

  const dismissToast = useCallback(() => {
    setToast((prev) => ({ ...prev, open: false }));
  }, []);

  return { toast, showSuccess, showError, dismissToast };
}
