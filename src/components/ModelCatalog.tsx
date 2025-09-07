import React, { useState, useCallback } from "react";
import { Upload, User, CheckCircle, AlertTriangle, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Model } from "./FashionHaul";

interface ModelCatalogProps {
  models: Model[];
  onAddModel: (model: Omit<Model, "id" | "isActive">) => void;
  onSelectModel: (model: Model) => void;
  onDeleteModel: (modelId: string) => void;
  onMakeModel: (model: Model) => Promise<void> | void;
}

export const ModelCatalog: React.FC<ModelCatalogProps> = ({
  models,
  onAddModel,
  onSelectModel,
  onDeleteModel,
  onMakeModel,
}) => {
  const [dragActive, setDragActive] = useState(false);

  const validateImage = async (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        // Check aspect ratio for full-body detection
        const aspectRatio = img.height / img.width;
        if (aspectRatio < 1.2) {
          toast.error("Please upload a full-body photo (head to toe visible)");
          resolve(false);
        } else {
          // Simple face detection via FaceDetector API if available
          if ('FaceDetector' in window) {
            try {
              // @ts-expect-error experimental
              const detector = new (window as any).FaceDetector({ fastMode: true });
              const canvas = document.createElement('canvas');
              canvas.width = img.width; canvas.height = img.height;
              const ctx = canvas.getContext('2d');
              if (!ctx) return resolve(true);
              ctx.drawImage(img, 0, 0);
              canvas.toBlob(async (blob) => {
                if (!blob) return resolve(true);
                try {
                  // @ts-expect-error experimental
                  const faces = await detector.detect(canvas);
                  if (!faces || faces.length === 0) {
                    toast.error('Face not detected. Please upload a photo with a clearly visible face.');
                    resolve(false);
                  } else {
                    resolve(true);
                  }
                } catch {
                  resolve(true);
                }
              });
            } catch {
              resolve(true);
            }
          } else {
            resolve(true);
          }
        }
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));

    for (const file of imageFiles) {
      const isValid = await validateImage(file);
      if (isValid) {
        const imageUrl = URL.createObjectURL(file);
        onAddModel({
          name: `Model ${models.length + 1}`,
          image: imageUrl,
        });
      }
    }
  }, [models.length, onAddModel]);

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    for (const file of files) {
      const isValid = await validateImage(file);
      if (isValid) {
        const imageUrl = URL.createObjectURL(file);
        onAddModel({
          name: `Model ${models.length + 1}`,
          image: imageUrl,
        });
      }
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="fashion-card mb-4">
        <div className="flex items-center gap-2 mb-3">
          <User className="w-5 h-5 text-fashion-pink" />
          <h2 className="text-lg font-semibold">Model Catalog</h2>
        </div>
        
        {/* Upload Area */}
        <div
          className={`drag-zone ${dragActive ? 'border-fashion-pink/50 bg-fashion-pink/10' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
            id="model-upload"
          />
          <label htmlFor="model-upload" className="cursor-pointer">
            <Upload className="w-8 h-8 text-fashion-pink mx-auto mb-2" />
            <p className="text-sm font-medium">Upload Model Photos</p>
            <p className="text-xs text-muted-foreground mt-1">
              Full body, visible face required
            </p>
          </label>
        </div>

        <div className="flex items-center gap-2 mt-3 p-2 bg-fashion-yellow/10 rounded-lg">
          <AlertTriangle className="w-4 h-4 text-fashion-orange flex-shrink-0" />
          <p className="text-xs text-muted-foreground">
            Photos must show full body (head to toe) with clearly visible face
          </p>
        </div>
      </div>

      {/* Models Grid */}
      <div className="flex-1">
        <div className="grid grid-cols-2 gap-2">
          {models.map((model) => (
            <div
              key={model.id}
              className={`fashion-card cursor-pointer transition-all duration-300 group ${
                model.isActive 
                  ? 'border-fashion-pink/50 shadow-fashion-pink' 
                  : 'hover:border-fashion-pink/30'
              }`}
              onClick={() => onSelectModel(model)}
            >
              <div className="relative">
                <img
                  src={model.image}
                  alt={model.name}
                  className="w-full h-20 object-contain rounded-lg bg-muted/20"
                />
                {model.isActive && (
                  <div className="absolute top-1 right-1">
                    <CheckCircle className="w-4 h-4 text-fashion-green" />
                  </div>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); onDeleteModel(model.id); }}
                  className="absolute top-1 left-1 w-5 h-5 bg-destructive/80 hover:bg-destructive rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3 h-3 text-white" />
                </button>
              </div>
              
              <div className="mt-2">
                <h3 className="font-medium text-xs truncate">{model.name}</h3>
                <button 
                  className="fashion-button-primary w-full mt-1 py-1 text-xs"
                  onClick={(e) => { e.stopPropagation(); onMakeModel(model); }}
                >
                  {model.processedImage ? 'Remodel' : 'Make Model'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};