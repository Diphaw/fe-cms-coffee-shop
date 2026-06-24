"use client";

import { useCallback, useEffect, useState } from "react";
import { SuccessModal } from "./success-modal";
import { ErrorModal } from "./error-modal";

export type AlertOptions = string | { title?: string; description: string };

const DEFAULT_TITLES = {
  success: "Sukses!",
  error: "Terjadi Kesalahan",
} as const;

type AlertState = {
  open: boolean;
  type: "success" | "error";
  title: string;
  description: string;
};

const initialState: AlertState = {
  open: false,
  type: "success",
  title: DEFAULT_TITLES.success,
  description: "",
};

type ShowAlert = (opts: { type: "success" | "error"; title: string; description: string }) => void;

let showAlertRef: ShowAlert | null = null;

export function setAlertEmitter(show: ShowAlert) {
  showAlertRef = show;
}

export const alert = {
  success(message: AlertOptions) {
    const { title, description } = normalizeOptions(message, "success");
    showAlertRef?.({ type: "success", title, description });
  },
  error(message: AlertOptions) {
    const { title, description } = normalizeOptions(message, "error");
    showAlertRef?.({ type: "error", title, description });
  },
};

function normalizeOptions(
  messageOrOptions: AlertOptions,
  type: "success" | "error"
): { title: string; description: string } {
  if (typeof messageOrOptions === "string") {
    return {
      title: DEFAULT_TITLES[type],
      description: messageOrOptions,
    };
  }
  return {
    title: messageOrOptions.title ?? DEFAULT_TITLES[type],
    description: messageOrOptions.description,
  };
}

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AlertState>(initialState);

  const show = useCallback<ShowAlert>(({ type, title, description }) => {
    setState({ open: true, type, title, description });
  }, []);

  useEffect(() => {
    setAlertEmitter(show);
    return () => {
      setAlertEmitter(null as unknown as ShowAlert);
    };
  }, [show]);

  const handleClose = useCallback(() => {
    setState((prev) => ({ ...prev, open: false }));
  }, []);

  return (
    <>
      {children}
      {state.type === "success" ? (
        <SuccessModal
          open={state.open}
          onClose={handleClose}
          title={state.title}
          description={state.description}
        />
      ) : (
        <ErrorModal
          open={state.open}
          onClose={handleClose}
          title={state.title}
          description={state.description}
        />
      )}
    </>
  );
}
