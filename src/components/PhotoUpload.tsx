"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Check } from "lucide-react";
import { useHydration } from "@/hooks/use-hydration";

interface PhotoUploadProps {
  onPhotoUpload: (file: File) => void;
  isProcessing?: boolean;
}

export default function PhotoUpload({ onPhotoUpload, isProcessing = false }: PhotoUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isHydrated = useHydration();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setShowPreview(true);
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      try {
        // Send the image directly to our image analysis API
        const formData = new FormData();
        formData.append('file', selectedFile);
        
        const response = await fetch('/api/analyze-image', {
          method: 'POST',
          body: formData,
        });
        
        if (response.ok) {
          const result = await response.json();
          console.log('Image analysis result:', result);
          
          if (result.success) {
            // Parse the analysis and create shopping list items
            await createShoppingListItems(result.analysis);
          } else {
            console.error('Image analysis failed:', result.error);
          }
        } else {
          const errorText = await response.text();
          console.error('Failed to send image to agent:', response.status, errorText);
        }
      } catch (error) {
        console.error('Error processing image:', error);
      }
      
      onPhotoUpload(selectedFile);
      setShowPreview(false);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const createShoppingListItems = async (analysis: string) => {
    try {
      // Parse the analysis result and create shopping list items
      const lines = analysis.split('\n');
      const items = [];
      let currentItem = null;
      
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.match(/^\d+\./)) {
          // New item
          if (currentItem) {
            items.push(currentItem);
          }
          currentItem = {
            name: trimmed.replace(/^\d+\.\s*/, ''),
            quantity: '',
            description: '',
            category: ''
          };
        } else if (trimmed.startsWith('Quantity:')) {
          if (currentItem) {
            currentItem.quantity = trimmed.replace('Quantity:', '').trim();
          }
        } else if (trimmed.startsWith('Description:')) {
          if (currentItem) {
            currentItem.description = trimmed.replace('Description:', '').trim();
          }
        } else if (trimmed.startsWith('Category:')) {
          if (currentItem) {
            currentItem.category = trimmed.replace('Category:', '').trim();
          }
        }
      }
      
      if (currentItem) {
        items.push(currentItem);
      }
      
      // Send items to the agent via chat to create them
      for (const item of items) {
        if (item.name) {
          const message = `Create a shopping list item: ${item.name}${item.quantity ? ` (${item.quantity})` : ''}${item.description ? ` - ${item.description}` : ''}${item.category ? ` [Category: ${item.category}]` : ''}`;
          
          await fetch('/api/copilotkit', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              messages: [
                {
                  role: 'user',
                  content: message
                }
              ]
            })
          });
        }
      }
      
      console.log(`Created ${items.length} shopping list items`);
    } catch (error) {
      console.error('Error creating shopping list items:', error);
    }
  };

  const handleCancel = () => {
    setShowPreview(false);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  if (!isHydrated) {
    return (
      <div className="space-y-4">
        <div className="w-full h-12 bg-gray-200 rounded-lg flex items-center justify-center">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Button
        onClick={handleButtonClick}
        disabled={isProcessing}
        className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2"
      >
        <Upload className="h-5 w-5" />
        {isProcessing ? "Processing..." : "Upload Photo"}
      </Button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {showPreview && selectedFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Confirm Photo Upload</h3>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              
              <div className="text-sm text-gray-600">
                <p><strong>File:</strong> {selectedFile.name}</p>
                <p><strong>Size:</strong> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                <p><strong>Type:</strong> {selectedFile.type}</p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpload}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Confirm Upload
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
