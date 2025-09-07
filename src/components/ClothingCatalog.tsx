import React, { useState } from "react";
import { Shirt, Package, Footprints, Watch, Plus, Upload, Trash2 } from "lucide-react";
import { ClothingItem } from "./FashionHaul";
import { toast } from "sonner";

interface ClothingCatalogProps {
  items: ClothingItem[];
  onAddItem: (item: Omit<ClothingItem, "id">) => void;
  onDeleteItem: (itemId: string) => void;
  onDragItem: (item: ClothingItem) => void;
}

const categories = [
  { 
    id: "above-waist" as const, 
    name: "Tops & Shirts", 
    icon: Shirt, 
    color: "fashion-pink",
    items: ["T-Shirts", "Blouses", "Jackets", "Sweaters"]
  },
  { 
    id: "below-waist" as const, 
    name: "Bottoms", 
    icon: Package, 
    color: "fashion-purple",
    items: ["Jeans", "Skirts", "Trousers", "Shorts"]
  },
  { 
    id: "shoes" as const, 
    name: "Footwear", 
    icon: Footprints, 
    color: "fashion-blue",
    items: ["Sneakers", "Heels", "Boots", "Sandals"]
  },
  { 
    id: "accessories" as const, 
    name: "Accessories", 
    icon: Watch, 
    color: "fashion-teal",
    items: ["Watches", "Bags", "Jewelry", "Hats"]
  },
];

export const ClothingCatalog: React.FC<ClothingCatalogProps> = ({
  items,
  onAddItem,
  onDeleteItem,
  onDragItem,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>("above-waist");
  const [showUpload, setShowUpload] = useState<string | null>(null);

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>, 
    category: ClothingItem["category"]
  ) => {
    const files = Array.from(e.target.files || []);
    
    for (const file of files) {
      if (file.type.startsWith('image/')) {
        const imageUrl = URL.createObjectURL(file);
        onAddItem({
          name: `${category} Item ${items.filter(i => i.category === category).length + 1}`,
          category,
          image: imageUrl,
          type: file.name.split('.')[0],
        });
      }
    }
    setShowUpload(null);
  };

  const handleDragStart = (e: React.DragEvent, item: ClothingItem) => {
    e.dataTransfer.setData("application/json", JSON.stringify(item));
  };

  const getCategoryItems = (categoryId: string) => {
    return items.filter(item => item.category === categoryId);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="fashion-card mb-4">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Package className="w-5 h-5 text-fashion-purple" />
          Fashion Catalog
        </h2>

        {/* Category Tabs */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`p-2 rounded-lg text-xs font-medium transition-all duration-300 ${
                  activeCategory === category.id
                    ? `bg-${category.color}/20 text-${category.color} border border-${category.color}/30`
                    : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
                }`}
              >
                <Icon className="w-4 h-4 mx-auto mb-1" />
                {category.name}
              </button>
            );
          })}
        </div>

        {/* Add Item Button */}
        <button
          onClick={() => setShowUpload(activeCategory)}
          className="fashion-button-secondary w-full py-2 text-xs flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add {categories.find(c => c.id === activeCategory)?.name}
        </button>

        {/* Upload Modal */}
        {showUpload && (
          <div className="mt-3 p-3 bg-muted/20 rounded-lg">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFileUpload(e, showUpload as ClothingItem["category"])}
              className="hidden"
              id={`upload-${showUpload}`}
            />
            <label htmlFor={`upload-${showUpload}`} className="cursor-pointer block">
              <div className="drag-zone py-4">
                <Upload className="w-6 h-6 text-fashion-pink mx-auto mb-2" />
                <p className="text-xs">Click or drop images here</p>
              </div>
            </label>
            <button
              onClick={() => setShowUpload(null)}
              className="text-xs text-muted-foreground mt-2 hover:text-foreground"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Items Grid */}
      <div className="flex-1">
        <div className="grid grid-cols-2 gap-3">
          {getCategoryItems(activeCategory).map((item) => (
            <div
              key={item.id}
              draggable
              onDragStart={(e) => handleDragStart(e, item)}
              onClick={() => onDragItem(item)}
              className="fashion-card cursor-grab active:cursor-grabbing hover:scale-105 transition-transform duration-200 group relative"
            >
              <button
                onClick={(e) => { e.stopPropagation(); onDeleteItem(item.id); }}
                className="absolute top-1 right-1 w-5 h-5 bg-destructive/80 hover:bg-destructive rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                <Trash2 className="w-3 h-3 text-white" />
              </button>
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-20 object-contain rounded-lg mb-2 bg-muted/20"
              />
              <h4 className="text-xs font-medium truncate">{item.name}</h4>
              <p className="text-xs text-muted-foreground capitalize">
                {item.category.replace('-', ' ')}
              </p>
            </div>
          ))}
        </div>
        
        {getCategoryItems(activeCategory).length === 0 && (
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-2 opacity-50" />
            <p className="text-sm text-muted-foreground">
              No items in {categories.find(c => c.id === activeCategory)?.name.toLowerCase()} yet
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Click "Add" to upload your first item
            </p>
          </div>
        )}
      </div>
    </div>
  );
};