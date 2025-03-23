import { createContext, useEffect, useState, ReactNode } from "react";
import { CartItem, CartContextType } from "./types";

export const CartContext = createContext<CartContextType>({
  isOpen: false,
  toggleCart: () => {},
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateItemQuantity: () => {},
  clearCart: () => {},
  totalItems: 0,
  totalPrice: 0,
});

const LOCAL_STORAGE_KEY = "immersify-cart";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Failed to parse saved cart:", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const toggleCart = () => {
    setIsOpen(!isOpen);
  };

  const addItem = (newItem: CartItem) => {
    setItems((prevItems) => {
      // If it's an experience with a dateTime, consider it a new item
      if (newItem.type === "experience" && newItem.dateTime) {
        return [...prevItems, newItem];
      }

      // For products or experiences without dateTime, check if it already exists
      const existingItemIndex = prevItems.findIndex(
        (item) => 
          item.id === newItem.id && 
          item.type === newItem.type && 
          item.variant === newItem.variant
      );

      if (existingItemIndex >= 0) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + newItem.quantity,
        };
        return updatedItems;
      }

      return [...prevItems, newItem];
    });
    
    // Open cart when item added
    setIsOpen(true);
  };

  const removeItem = (id: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const updateItemQuantity = (id: number, quantity: number) => {
    setItems((prevItems) =>
      prevItems.map((item) => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        isOpen,
        toggleCart,
        items,
        addItem,
        removeItem,
        updateItemQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
