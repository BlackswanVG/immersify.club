import { useContext } from "react";
import { CartContext } from "@/lib/cart-context";
import { CartContextType } from "@/lib/types";

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
