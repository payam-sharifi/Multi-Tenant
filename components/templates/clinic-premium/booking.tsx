"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

export type BookingPrefill = {
  /** index in services.items */
  service?: number;
  /** doctor id */
  doctor?: string;
};

type BookingCtx = {
  isOpen: boolean;
  prefill: BookingPrefill;
  open: (prefill?: BookingPrefill) => void;
  close: () => void;
};

const Ctx = createContext<BookingCtx | null>(null);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [prefill, setPrefill] = useState<BookingPrefill>({});

  const open = useCallback((p?: BookingPrefill) => {
    setPrefill(p ?? {});
    setOpen(true);
  }, []);
  const close = useCallback(() => setOpen(false), []);

  const value = useMemo(() => ({ isOpen, prefill, open, close }), [isOpen, prefill, open, close]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useBooking() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useBooking must be used inside <BookingProvider>");
  return ctx;
}
