import React from "react";
import { Sparkles, Heart, Shirt } from "lucide-react";

export const Header = () => {
  return (
    <header className="bg-card/50 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-primary rounded-xl">
              <Shirt className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                FashionHaul
              </h1>
              <p className="text-sm text-muted-foreground">Virtual Try-On Studio</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="w-4 h-4 text-fashion-pink" />
              <span>AI-Powered Virtual Fitting</span>
            </div>
            
            <button className="fashion-button-primary flex items-center gap-2">
              <Heart className="w-4 h-4" />
              <span>Save Looks</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};