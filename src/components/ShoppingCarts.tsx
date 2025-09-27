"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ExternalLink, Trash2, Plus, Minus } from "lucide-react";
import { ExtractedItem } from "./ItemList";

interface ShoppingCartsProps {
  items: ExtractedItem[];
  onAddToCart: (item: ExtractedItem, store: 'amazon' | 'walmart') => void;
  onRemoveFromCart: (itemId: string, store: 'amazon' | 'walmart') => void;
  onUpdateQuantity: (itemId: string, store: 'amazon' | 'walmart', quantity: number) => void;
  onRemoveFromQuickAdd: (itemId: string) => void;
}

interface CartItem extends ExtractedItem {
  store: 'amazon' | 'walmart';
}

export default function ShoppingCarts({ items, onAddToCart, onRemoveFromCart, onUpdateQuantity, onRemoveFromQuickAdd }: ShoppingCartsProps) {
  const [amazonCart, setAmazonCart] = useState<CartItem[]>([]);
  const [walmartCart, setWalmartCart] = useState<CartItem[]>([]);
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());

  const addToCart = (item: ExtractedItem, store: 'amazon' | 'walmart') => {
    const cartItem: CartItem = { ...item, store };
    
    if (store === 'amazon') {
      const existingItem = amazonCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        setAmazonCart(prev => 
          prev.map(cartItem => 
            cartItem.id === item.id 
              ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
              : cartItem
          )
        );
      } else {
        setAmazonCart(prev => [...prev, cartItem]);
      }
    } else {
      const existingItem = walmartCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        setWalmartCart(prev => 
          prev.map(cartItem => 
            cartItem.id === item.id 
              ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
              : cartItem
          )
        );
      } else {
        setWalmartCart(prev => [...prev, cartItem]);
      }
    }
    
    // Remove item from Quick Add section when added to any cart
    onRemoveFromQuickAdd(item.id);
    onAddToCart(item, store);
    
    // Show visual feedback
    setAddedItems(prev => new Set([...prev, item.id]));
    setTimeout(() => {
      setAddedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(item.id);
        return newSet;
      });
    }, 2000);
  };

  const removeFromCart = (itemId: string, store: 'amazon' | 'walmart') => {
    if (store === 'amazon') {
      setAmazonCart(prev => prev.filter(item => item.id !== itemId));
    } else {
      setWalmartCart(prev => prev.filter(item => item.id !== itemId));
    }
    onRemoveFromCart(itemId, store);
  };

  const updateQuantity = (itemId: string, store: 'amazon' | 'walmart', quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId, store);
      return;
    }

    if (store === 'amazon') {
      setAmazonCart(prev => 
        prev.map(item => 
          item.id === itemId ? { ...item, quantity } : item
        )
      );
    } else {
      setWalmartCart(prev => 
        prev.map(item => 
          item.id === itemId ? { ...item, quantity } : item
        )
      );
    }
    onUpdateQuantity(itemId, store, quantity);
  };

  const getTotalPrice = (cart: CartItem[]) => {
    return cart.reduce((total, item) => total + ((item.price || 0) * item.quantity), 0);
  };

  const CartSection = ({ 
    title, 
    cart, 
    store, 
    color 
  }: { 
    title: string; 
    cart: CartItem[]; 
    store: 'amazon' | 'walmart'; 
    color: string;
  }) => (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          {title}
        </h3>
        <span className="text-sm font-medium text-gray-500">
          {cart.length} items
        </span>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium">Cart is empty</p>
          <p className="text-sm">Add items from the list</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {cart.map((item) => (
            <div key={`${item.id}-${store}`} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{item.name}</h4>
                  <p className="text-sm text-gray-500">Brand: {item.brand}</p>
                  {item.price && (
                    <p className="text-sm font-medium text-gray-700">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => updateQuantity(item.id, store, item.quantity - 1)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, store, item.quantity + 1)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => removeFromCart(item.id, store)}
                    className="p-1 text-gray-400 hover:text-red-500 ml-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {cart.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-lg font-semibold text-gray-900">Total:</span>
            <span className="text-lg font-bold text-gray-900">
              ${getTotalPrice(cart).toFixed(2)}
            </span>
          </div>
          <Button
            className={`w-full ${color} text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2`}
            onClick={() => {
              // In a real app, this would redirect to the store
              alert(`Redirecting to ${title} checkout...`);
            }}
          >
            <ExternalLink className="h-4 w-4" />
            Checkout on {title}
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <CartSection 
        title="Amazon Cart" 
        cart={amazonCart} 
        store="amazon" 
        color="bg-orange-600 hover:bg-orange-700" 
      />
      
      <CartSection 
        title="Walmart Cart" 
        cart={walmartCart} 
        store="walmart" 
        color="bg-blue-600 hover:bg-blue-700" 
      />

      {/* Quick Add Section */}
      {items.length > 0 && (
        <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Quick Add Items ({items.length - addedItems.size} remaining)
            </h3>
            {addedItems.size === items.length && (
              <span className="text-sm text-green-600 font-medium">All items added!</span>
            )}
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {items.map((item) => {
              const isAdded = addedItems.has(item.id);
              return (
                <div 
                  key={item.id} 
                  className={`flex items-center justify-between rounded-lg p-3 border transition-all duration-300 ${
                    isAdded 
                      ? 'bg-green-50 border-green-300 shadow-sm' 
                      : 'bg-white border-gray-200 hover:shadow-sm'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-gray-900 block truncate">{item.name}</span>
                    <span className="text-sm text-gray-500">({item.brand})</span>
                    {isAdded && (
                      <span className="text-xs text-green-600 font-medium">✓ Added to cart</span>
                    )}
                  </div>
                  <div className="flex gap-2 ml-3 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => addToCart(item, 'amazon')}
                      disabled={isAdded}
                      className={`text-orange-600 border-orange-300 hover:bg-orange-50 whitespace-nowrap ${
                        isAdded ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      Amazon
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => addToCart(item, 'walmart')}
                      disabled={isAdded}
                      className={`text-blue-600 border-blue-300 hover:bg-blue-50 whitespace-nowrap ${
                        isAdded ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      Walmart
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
