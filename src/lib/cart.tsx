import type React from "react";
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type CartItem = { id: string; name: string; price: number; image?: string | undefined; qty: number };

type CartCtx = {
  items: CartItem[];
  open: boolean;
  setOpen: (o: boolean) => void;
  add: (item: Omit<CartItem, "qty">) => void;
  update: (id: string, qty: number) => void;
  count: number;
  total: number;
};

// Keep one context instance across hot reloads so provider and consumers always match.
const g = globalThis as unknown as { __trazoCartCtx?: React.Context<CartCtx | null> };
const Ctx = g.__trazoCartCtx ?? (g.__trazoCartCtx = createContext<CartCtx | null>(null));

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);

  const value = useMemo<CartCtx>(
    () => ({
      items,
      open,
      setOpen,
      add: (item) =>
        setItems((prev) => {
          const found = prev.find((i) => i.id === item.id);
          if (found) return prev.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i));
          return [...prev, { ...item, qty: 1 }];
        }),
      update: (id, qty) =>
        setItems((prev) => (qty <= 0 ? prev.filter((i) => i.id !== id) : prev.map((i) => (i.id === id ? { ...i, qty } : i)))),
      count: items.reduce((s, i) => s + i.qty, 0),
      total: items.reduce((s, i) => s + i.qty * i.price, 0),
    }),
    [items, open],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

const FALLBACK: CartCtx = { items: [], open: false, setOpen: () => {}, add: () => {}, update: () => {}, count: 0, total: 0 };

export function useCart() {
  const c = useContext(Ctx);
  // Fallback keeps the page rendering during hot reloads instead of blanking the screen.
  return c ?? FALLBACK;
}
