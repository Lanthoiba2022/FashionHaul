import React, { useEffect, useMemo, useRef, useState } from "react";
import { ZoomIn, ZoomOut, RotateCcw, Sparkles, X, Loader, Minus, Plus, Download } from "lucide-react";
import { ClothingItem, Model } from "./FashionHaul";

interface PreviewContainerProps {
  selectedModel: Model | null;
  previewItems: ClothingItem[];
  onRemoveItem: (itemId: string) => void;
  onAddItemToPreview: (item: ClothingItem) => void;
  onDressUp: () => void;
  isGenerating: boolean;
  isProcessingModel: boolean;
  finalImage: string | null;
}

export const PreviewContainer: React.FC<PreviewContainerProps> = ({
  selectedModel,
  previewItems,
  onRemoveItem,
  onAddItemToPreview,
  onDressUp,
  isGenerating,
  isProcessingModel,
  finalImage,
}) => {
  const [zoom, setZoom] = useState(100);
  const [dragOver, setDragOver] = useState(false);
  const [itemTransforms, setItemTransforms] = useState<Record<string, { x: number; y: number; scale: number }>>({});
  const dragStateRef = useRef<{ id: string | null; startX: number; startY: number; origX: number; origY: number } | null>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    try {
      const itemData = e.dataTransfer.getData("application/json");
      const item: ClothingItem = JSON.parse(itemData);
      onAddItemToPreview(item);
    } catch (error) {
      console.error("Failed to parse dropped item:", error);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const adjustZoom = (delta: number) => {
    setZoom(prev => Math.max(50, Math.min(200, prev + delta)));
  };

  const resetZoom = () => {
    setZoom(100);
  };

  useEffect(() => {
    // Initialize transforms for any new items not yet tracked
    setItemTransforms(prev => {
      const next = { ...prev } as Record<string, { x: number; y: number; scale: number }>;
      previewItems.forEach((item, index) => {
        if (!next[item.id]) {
          next[item.id] = { x: 0, y: 20 + index * 80, scale: 1 };
        }
      });
      // Remove transforms for items no longer present
      Object.keys(next).forEach(id => {
        if (!previewItems.find(i => i.id === id)) {
          delete next[id];
        }
      });
      return next;
    });
  }, [previewItems]);

  const onItemMouseDown = (e: React.MouseEvent, id: string) => {
    const rect = (e.currentTarget.parentElement as HTMLElement)?.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;
    const { x = 0, y = 0 } = itemTransforms[id] || { x: 0, y: 0 };
    dragStateRef.current = { id, startX, startY, origX: x, origY: y };
    e.preventDefault();
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragStateRef.current) return;
    const { id, startX, startY, origX, origY } = dragStateRef.current;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    setItemTransforms(prev => ({ ...prev, [id as string]: { ...prev[id as string], x: origX + dx, y: origY + dy } }));
  };

  const onMouseUp = () => {
    dragStateRef.current = null;
  };

  const changeItemScale = (id: string, delta: number) => {
    setItemTransforms(prev => {
      const cur = prev[id] || { x: 0, y: 0, scale: 1 };
      const next = Math.max(0.5, Math.min(2, cur.scale + delta));
      return { ...prev, [id]: { ...cur, scale: next } };
    });
  };

  const handleDownload = () => {
    if (!finalImage) return;
    
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = finalImage;
    link.download = `virtual-try-on-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="fashion-card mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-fashion-pink" />
            Virtual Try-On
          </h2>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => adjustZoom(-25)}
              className="p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-sm text-muted-foreground min-w-12 text-center">
              {zoom}%
            </span>
            <button
              onClick={() => adjustZoom(25)}
              className="p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={resetZoom}
              className="p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            {finalImage && (
              <button
                onClick={handleDownload}
                className="p-2 rounded-lg bg-fashion-green/20 hover:bg-fashion-green/30 text-fashion-green transition-colors"
                title="Download high quality image"
              >
                <Download className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Dress-Up Button */}
        <button
          onClick={onDressUp}
          disabled={!selectedModel || previewItems.length === 0 || isGenerating || isProcessingModel}
          className="fashion-button-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : isProcessingModel ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Processing Model...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Dress-Up Model
            </>
          )}
        </button>
      </div>

      {/* Preview Area */}
      <div className="flex-1 fashion-card" onMouseMove={onMouseMove} onMouseUp={onMouseUp}>
        <div
          className={`relative h-full rounded-xl overflow-hidden transition-all duration-300 ${
            dragOver ? 'bg-fashion-pink/10 border-fashion-pink/30' : 'bg-muted/10'
          } ${!selectedModel ? 'border-2 border-dashed border-muted-foreground/30' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {!selectedModel ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Sparkles className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground">
                  Select a Model
                </h3>
                <p className="text-sm text-muted-foreground/70 mt-2">
                  Choose a model from the catalog to start trying on outfits
                </p>
              </div>
            </div>
          ) : (
            <div className="relative h-full flex items-center justify-center">
              {/* Model Display */}
              <div 
                className="relative transition-transform duration-300"
                style={{ transform: `scale(${zoom / 100})` }}
              >
                <img
                  src={finalImage || selectedModel.processedImage || selectedModel.image}
                  alt={selectedModel.name}
                  className="max-h-full max-w-full object-contain rounded-lg"
                />
                
                {/* Loading Overlay */}
                {(isGenerating || isProcessingModel) && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <div className="text-center text-white">
                      <Loader className="w-8 h-8 animate-spin mx-auto mb-2" />
                      <p className="text-sm">
                        {isProcessingModel ? 'Processing model...' : 'Generating your look...'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Floating Preview Items */}
              {!isGenerating && !isProcessingModel && previewItems.map((item, index) => {
                const t = itemTransforms[item.id] || { x: 0, y: 20 + index * 80, scale: 1 };
                const style: React.CSSProperties = {
                  transform: `translate(${t.x}px, ${t.y}px) scale(${t.scale})`,
                  top: 0,
                  left: 'calc(100% - 140px)',
                  zIndex: 10,
                };
                return (
                <div
                  key={item.id}
                  className="absolute bg-card/90 backdrop-blur-sm rounded-lg p-2 shadow-lg border border-border/50 group cursor-move select-none"
                  style={style}
                  onMouseDown={(e) => onItemMouseDown(e, item.id)}
                >
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-destructive rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3 text-destructive-foreground" />
                  </button>
                  
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <p className="text-xs font-medium mt-1 text-center max-w-16 truncate">
                    {item.name}
                  </p>
                  <div className="flex items-center justify-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1 rounded bg-muted/50" onClick={(e) => { e.stopPropagation(); changeItemScale(item.id, -0.1); }}>
                      <Minus className="w-3 h-3" />
                    </button>
                    <button className="p-1 rounded bg-muted/50" onClick={(e) => { e.stopPropagation(); changeItemScale(item.id, 0.1); }}>
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                );
              })}

              {/* Drop Zone Indicator */}
              {dragOver && (
                <div className="absolute inset-4 border-2 border-dashed border-fashion-pink/50 rounded-xl bg-fashion-pink/10 flex items-center justify-center">
                  <div className="text-center">
                    <Sparkles className="w-8 h-8 text-fashion-pink mx-auto mb-2" />
                    <p className="text-sm text-fashion-pink font-medium">
                      Drop clothing item here
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Status Bar */}
        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <div>
            {selectedModel ? (
              <span>Model: {selectedModel.name}</span>
            ) : (
              <span>No model selected</span>
            )}
          </div>
          <div>
            Items: {previewItems.length}
          </div>
        </div>
      </div>
    </div>
  );
};