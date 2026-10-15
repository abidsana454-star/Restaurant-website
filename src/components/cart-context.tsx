"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartLine = {
  id: number;
  slug: string;
  name: string;
  price: number;
  imageUrl: string | null;
  qty: number;
};

type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  ready: boolean;
  add: (item: Omit<CartLine, "qty">, qty?: number) => void;
  setQty: (id: number, qty: number) => void;
  remove: (id: number) => void;
  clear: () => void;
  lastAdded: string | null;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "zaiqa.cart.v1";

export function CartProvider({
  children,
  deliveryFee,
  freeOver,
}: {
  children: ReactNode;
  deliveryFee: number;
  freeOver: number;
}) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  const [lastAdded, setLastAdded] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw) as CartLine[]);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, ready]);

  useEffect(() => {
    if (!lastAdded) return;
    const timer = window.setTimeout(() => setLastAdded(null), 2200);
    return () => window.clearTimeout(timer);
  }, [lastAdded]);

  const add = useCallback((item: Omit<CartLine, "qty">, qty = 1) => {
    setLines((prev) => {
      const found = prev.find((line) => line.id === item.id);
      if (found) {
        return prev.map((line) =>
          line.id === item.id ? { ...line, qty: line.qty + qty } : line,
        );
      }
      return [...prev, { ...item, qty }];
    });
    setLastAdded(item.name);
  }, []);

  const setQty = useCallback((id: number, qty: number) => {
    setLines((prev) =>
      qty <= 0
        ? prev.filter((line) => line.id !== id)
        : prev.map((line) => (line.id === id ? { ...line, qty } : line)),
    );
  }, []);

  const remove = useCallback((id: number) => {
    setLines((prev) => prev.filter((line) => line.id !== id));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartContextValue>(() => {
    const subtotal = lines.reduce((sum, line) => sum + line.price * line.qty, 0);
    const fee = subtotal === 0 || subtotal >= freeOver ? 0 : deliveryFee;
    return {
      lines,
      count: lines.reduce((sum, line) => sum + line.qty, 0),
      subtotal,
      deliveryFee: fee,
      total: subtotal + fee,
      ready,
      add,
      setQty,
      remove,
      clear,
      lastAdded,
    };
  }, [lines, ready, add, setQty, remove, clear, lastAdded, deliveryFee, freeOver]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
