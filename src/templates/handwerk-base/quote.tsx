"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

type QuoteCtx = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const Ctx = createContext<QuoteCtx | null>(null);

export function QuoteProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const open = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);
  const value = useMemo(() => ({ isOpen, open, close }), [isOpen, open, close]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useQuote() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useQuote must be used inside <QuoteProvider>");
  return ctx;
}
