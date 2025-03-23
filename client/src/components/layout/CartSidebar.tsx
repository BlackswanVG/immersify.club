import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const CartSidebar = () => {
  const { 
    isOpen, 
    toggleCart, 
    items, 
    removeItem, 
    updateItemQuantity,
    totalPrice,
  } = useCart();

  return (
    <>
      {/* Cart Sidebar */}
      <div 
        className={`fixed top-0 right-0 h-full w-80 md:w-96 bg-white dark:bg-gray-800 shadow-2xl transform transition-transform z-50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-heading font-bold text-xl">
              Your Cart ({items.length})
            </h3>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleCart} 
              className="rounded-full"
            >
              <X size={20} />
            </Button>
          </div>
          
          <div className="flex-grow overflow-y-auto p-4 custom-scrollbar">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingBag className="h-16 w-16 mb-4 text-gray-300 dark:text-gray-600" />
                <h4 className="text-lg font-medium mb-2">Your cart is empty</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  Looks like you haven't added any items to your cart yet.
                </p>
                <Button 
                  onClick={toggleCart} 
                  className="bg-primary hover:bg-primary/90"
                >
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <>
                {items.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex border-b border-gray-200 dark:border-gray-700 pb-4 mb-4"
                  >
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      className="w-20 h-20 object-cover rounded-md"
                    />
                    <div className="ml-4 flex-grow">
                      <div className="flex justify-between">
                        <h4 className="font-medium">{item.name}</h4>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeItem(item.id)}
                          className="h-8 w-8 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                        >
                          <X size={16} />
                        </Button>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {item.type === 'experience' ? (
                          `${item.dateTime}`
                        ) : (
                          item.variant ? `${item.variant}` : ''
                        )}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-6 w-6 rounded-full"
                            onClick={() => updateItemQuantity(item.id, Math.max(1, item.quantity - 1))}
                          >
                            <Minus size={14} />
                          </Button>
                          <span className="mx-2">{item.quantity}</span>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-6 w-6 rounded-full"
                            onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus size={14} />
                          </Button>
                        </div>
                        <span className="font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
          
          {items.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-4 text-sm text-gray-500 dark:text-gray-400">
                <span>Shipping & taxes calculated at checkout</span>
              </div>
              <Button 
                className="w-full bg-gradient-to-r from-primary to-secondary text-white font-medium rounded-lg hover:opacity-90 transition-opacity mb-2"
              >
                Checkout
              </Button>
              <Button 
                variant="outline" 
                onClick={toggleCart}
                className="w-full border-gray-300 dark:border-gray-600 font-medium"
              >
                Continue Shopping
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Overlay */}
      <div 
        onClick={toggleCart}
        className={`fixed inset-0 bg-black transition-opacity z-40 ${
          isOpen ? 'opacity-50 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />
    </>
  );
};

export default CartSidebar;
