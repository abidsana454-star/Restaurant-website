"use client";

import { useState } from "react";
import { useCart, type CartLine } from "@/components/cart-context";

type Props = {
  item: Omit<CartLine, "qty">;
  className?: string;
  disabled?: boolean;
  withQuantity?: boolean;
};

export function AddToCartButton({ item, className = "", disabled, withQuantity }: Props) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [flash, setFlash] = useState(false);

  function onAdd() {
    add(item, qty);
    setFlash(true);
    window.setTimeout(() => setFlash(false), 1200);
  }

  return (
    <div className={withQuantity ? "flex flex-wrap items-center gap-3" : ""}>
      {withQuantity && !disabled ? (
        <div className="flex items-center gap-1 rounded-full border border-cream/15 p-1">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQty((value) => Math.max(1, value - 1))}
            className="grid h-8 w-8 place-items-center rounded-full text-cream/70 transition hover:bg-cream/10 hover:text-gold"
          >
            −
          </button>
          <span className="w-7 text-center text-sm">{qty}</span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQty((value) => Math.min(20, value + 1))}
            className="grid h-8 w-8 place-items-center rounded-full text-cream/70 transition hover:bg-cream/10 hover:text-gold"
          >
            +
          </button>
        </div>
      ) : null}

      <button
        type="button"
        onClick={onAdd}
        disabled={disabled}
        className={`${
          flash ? "!bg-olive !text-ink" : ""
        } btn-gold !px-6 !py-3 !text-[0.68rem] ${className}`}
      >
        {disabled ? "Sold out" : flash ? "✓ Added to bag" : "Add to bag"}
      </button>
    </div>
  );
}
