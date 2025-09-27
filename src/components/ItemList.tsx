"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Package, Hash, Tag, X } from "lucide-react";

export interface ExtractedItem {
  id: string;
  name: string;
  quantity: number;
  brand: string;
  price?: number;
  category?: string;
}

interface ItemListProps {
  items: ExtractedItem[];
  onConfirm: (items: ExtractedItem[]) => void;
  onItemUpdate: (id: string, updates: Partial<ExtractedItem>) => void;
  onItemRemove: (id: string) => void;
}

export default function ItemList({ items, onConfirm, onItemUpdate, onItemRemove }: ItemListProps) {
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirm = async () => {
    setIsConfirming(true);
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    onConfirm(items);
    setIsConfirming(false);
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity >= 0) {
      onItemUpdate(id, { quantity });
    }
  };

  const handleBrandChange = (id: string, brand: string) => {
    onItemUpdate(id, { brand });
  };

  const handleNameChange = (id: string, name: string) => {
    onItemUpdate(id, { name });
  };

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="text-center text-gray-500">
          <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium">No items detected</p>
          <p className="text-sm">Upload a photo to extract items</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Package className="h-5 w-5" />
          Detected Items ({items.length})
        </h3>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {items.map((item) => (
          <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Item Name</label>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleNameChange(item.id, e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter item name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      <Hash className="h-4 w-4" />
                      Quantity
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 0)}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      <Tag className="h-4 w-4" />
                      Brand
                    </label>
                    <select
                      value={item.brand}
                      onChange={(e) => handleBrandChange(item.id, e.target.value)}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Generic">Generic</option>
                      <option value="Nike">Nike</option>
                      <option value="Adidas">Adidas</option>
                      <option value="Apple">Apple</option>
                      <option value="Samsung">Samsung</option>
                      <option value="Coca-Cola">Coca-Cola</option>
                      <option value="Pepsi">Pepsi</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {item.price && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Estimated Price</label>
                    <div className="mt-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                      ${item.price.toFixed(2)}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => onItemRemove(item.id)}
                className="ml-4 p-2 text-gray-400 hover:text-red-500 transition-colors"
                title="Remove item"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <Button
          onClick={handleConfirm}
          disabled={isConfirming || items.length === 0}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2"
        >
          <Check className="h-5 w-5" />
          {isConfirming ? "Processing..." : `Confirm ${items.length} Items`}
        </Button>
      </div>
    </div>
  );
}
