import React, { useState } from "react";
import { ModelCatalog } from "./ModelCatalog";
import { ClothingCatalog } from "./ClothingCatalog";
import { PreviewContainer } from "./PreviewContainer";
import { Header } from "./Header";
import { toast } from "sonner";
import { generateDressUp } from "@/lib/genai";

export interface ClothingItem {
  id: string;
  name: string;
  category: "above-waist" | "below-waist" | "shoes" | "accessories";
  image: string;
  type?: string;
}

export interface Model {
  id: string;
  name: string;
  image: string;
  isActive: boolean;
  processedImage?: string;
}

export const FashionHaul = () => {
  const [models, setModels] = useState<Model[]>([
    {
      id: 'sample-model-1',
      name: 'Sample Model',
      image: '/Model/model1.png',
      isActive: false,
    }
  ]);
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>([
    // Tops & Shirts
    { id: 'top-1', name: 'Jacket', category: 'above-waist', image: '/Tops_Shirts/jacket.webp' },
    { id: 'top-2', name: 'Blouse', category: 'above-waist', image: '/Tops_Shirts/top2.webp' },
    { id: 'top-3', name: 'T-Shirt', category: 'above-waist', image: '/Tops_Shirts/top3.webp' },
    { id: 'top-4', name: 'Women Top', category: 'above-waist', image: '/Tops_Shirts/womenTop.webp' },
    // Bottoms
    { id: 'bottom-1', name: 'Jeans', category: 'below-waist', image: '/Bottoms/bo1.webp' },
    { id: 'bottom-2', name: 'Trousers', category: 'below-waist', image: '/Bottoms/bo3.webp' },
    { id: 'bottom-3', name: 'Shorts', category: 'below-waist', image: '/Bottoms/bo4.webp' },
    { id: 'bottom-4', name: 'Skirt', category: 'below-waist', image: '/Bottoms/skirt.webp' },
    // Footwear
    { id: 'shoe-1', name: 'Heels', category: 'shoes', image: '/Footwear/heels.webp' },
    { id: 'shoe-2', name: 'High Heels', category: 'shoes', image: '/Footwear/heels1.webp' },
    { id: 'shoe-3', name: 'Sandals', category: 'shoes', image: '/Footwear/heels2.webp' },
    { id: 'shoe-4', name: 'Boots', category: 'shoes', image: '/Footwear/heels3.webp' },
    // Accessories
    { id: 'acc-1', name: 'Handbag', category: 'accessories', image: '/Accessories/bag1.webp' },
    { id: 'acc-2', name: 'Purse', category: 'accessories', image: '/Accessories/purse.webp' },
    { id: 'acc-3', name: 'Earrings', category: 'accessories', image: '/Accessories/ear1.webp' },
    { id: 'acc-4', name: 'Glasses', category: 'accessories', image: '/Accessories/spec.webp' },
  ]);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [previewItems, setPreviewItems] = useState<ClothingItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isProcessingModel, setIsProcessingModel] = useState(false);
  const [finalImage, setFinalImage] = useState<string | null>(null);

  const handleAddModel = (modelData: Omit<Model, "id" | "isActive">) => {
    const newModel: Model = {
      id: Date.now().toString(),
      ...modelData,
      isActive: false,
    };
    setModels(prev => [...prev, newModel]);
    toast.success("Model added successfully!");
  };

  const handleDeleteModel = (modelId: string) => {
    setModels(prev => prev.filter(m => m.id !== modelId));
    if (selectedModel?.id === modelId) {
      setSelectedModel(null);
      setFinalImage(null);
    }
    toast.success("Model deleted!");
  };

  const handleSelectModel = (model: Model) => {
    setSelectedModel(model);
    setModels(prev => 
      prev.map(m => ({ ...m, isActive: m.id === model.id }))
    );
    toast.success(`${model.name} selected as model!`);
  };

  const handleMakeModel = async (model: Model) => {
    setIsProcessingModel(true);
    try {
      toast.message("Processing model...", { description: "Creating 2D cutout" });
      const base64 = await window.fetch(model.image).then(r => r.blob()).then(blob => new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      }));
      const res = await fetch('/api/cutout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64 })
      });
      if (!res.ok) throw new Error('Cutout failed');
      const data = await res.json();
      const processed = data.png as string;
      setModels(prev => prev.map(m => m.id === model.id ? { ...m, processedImage: processed } : m));
      setSelectedModel(prev => prev && prev.id === model.id ? { ...prev, processedImage: processed } : prev);
      toast.success("Model processed. Ready for dress-up!");
    } catch (e) {
      toast.error("Failed to process model. Try another photo.");
    } finally {
      setIsProcessingModel(false);
    }
  };

  const handleAddClothing = (item: Omit<ClothingItem, "id">) => {
    const newItem: ClothingItem = {
      id: Date.now().toString(),
      ...item,
    };
    setClothingItems(prev => [...prev, newItem]);
    toast.success("Clothing item added to catalog!");
  };

  const handleDeleteClothing = (itemId: string) => {
    setClothingItems(prev => prev.filter(i => i.id !== itemId));
    setPreviewItems(prev => prev.filter(i => i.id !== itemId));
    toast.success("Clothing item deleted!");
  };

  const handleDragToPreview = (item: ClothingItem) => {
    setPreviewItems(prev => {
      // Remove existing item of same category (except accessories)
      const filtered = item.category === "accessories" 
        ? prev 
        : prev.filter(p => p.category !== item.category);
      return [...filtered, item];
    });
  };

  const handleRemoveFromPreview = (itemId: string) => {
    setPreviewItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleDressUp = async () => {
    if (!selectedModel || previewItems.length === 0) {
      toast.error("Please select a model and add clothing items!");
      return;
    }
    if (!selectedModel.processedImage) {
      await handleMakeModel(selectedModel);
    }

    setIsGenerating(true);
    try {
      const garmentBase64s = await Promise.all(previewItems.map(async (item) => {
        if (item.image.startsWith('data:image')) return item.image;
        const blob = await fetch(item.image).then(r => r.blob());
        return await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });
      }));

      const prompt = `CRITICAL: This is a clothing replacement task. You must keep the EXACT same person from the first image (the cutout model) and ONLY change their clothing.

STRICT REQUIREMENTS:
- DO NOT change the person's face, facial features, or expression
- DO NOT change the person's body shape, proportions, or pose
- DO NOT change the person's skin tone, hair, or any physical characteristics
- DO NOT change the person's identity or appearance beyond clothing
- The person must look IDENTICAL to the cutout model, just wearing different clothes
- PRESERVE the FULL BODY from head to toe - do not crop or cut off any part of the person
- Maintain the same full-body framing and composition as the original cutout

TASK: Dress the exact same person from the cutout model with the provided garment images. The person should remain 100% identical - only the clothing should change.

GARMENT PLACEMENT:
- Above-waist items: Place on torso, shoulders, and arms
- Below-waist items: Place on hips, waist, and legs  
- Shoes: Place on feet with correct perspective
- Accessories: Place naturally on body (bags, jewelry, etc.)

REALISM:
- Maintain realistic fabric physics, folds, and draping
- Respect natural layering and occlusions
- Keep the same lighting and shadows as the original cutout
- Preserve the 2D sculpture-like style of the cutout

OUTPUT REQUIREMENTS:
- High-resolution PNG with transparent background
- Show the EXACT same person wearing the new clothes
- MUST include the FULL BODY from head to toe
- Maintain the same full-body composition as the input cutout
- Do not crop or cut off any part of the person's body`;

      // Ensure we have the processed cutout model
      const modelImage = selectedModel.processedImage || selectedModel.image;
      if (!modelImage) {
        toast.error("No model image available. Please process the model first.");
        return;
      }

      console.log('Sending to generate API:', {
        hasModel: !!modelImage,
        modelType: selectedModel.processedImage ? 'processed' : 'original',
        garmentsCount: garmentBase64s.length,
        promptLength: prompt.length
      });

      const result = await generateDressUp({
        modelPng: modelImage,
        garments: garmentBase64s.filter(Boolean),
        prompt,
        background: 'transparent',
        size: '1024x1536'
      });
      setFinalImage(result);
      toast.success("Dress-up complete! Check the preview!");
    } catch (error) {
      toast.error("Failed to generate dress-up. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-120px)]">
          {/* Left Sidebar - Model Catalog */}
          <div className="col-span-3">
            <ModelCatalog
              models={models}
              onAddModel={handleAddModel}
              onSelectModel={handleSelectModel}
              onDeleteModel={handleDeleteModel}
              onMakeModel={handleMakeModel}
            />
          </div>

          {/* Center - Preview Container */}
          <div className="col-span-6">
            <PreviewContainer
              selectedModel={selectedModel}
              previewItems={previewItems}
              onRemoveItem={handleRemoveFromPreview}
              onAddItemToPreview={handleDragToPreview}
              onDressUp={handleDressUp}
              isGenerating={isGenerating}
              isProcessingModel={isProcessingModel}
              finalImage={finalImage}
            />
          </div>

          {/* Right Sidebar - Clothing Catalog */}
          <div className="col-span-3">
            <ClothingCatalog
              items={clothingItems}
              onAddItem={handleAddClothing}
              onDeleteItem={handleDeleteClothing}
              onDragItem={handleDragToPreview}
            />
          </div>
        </div>
      </main>
    </div>
  );
};