"use client";

import React, { useState } from "react";
import Spline from '@splinetool/react-spline';
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export function InteractiveHeroSpline() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="w-full h-full min-h-[400px] md:min-h-[500px] relative flex items-center justify-center rounded-[2.5rem] overflow-hidden glass-card border-white/20 shadow-[0_0_50px_rgba(168,85,247,0.3)]">
      
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-cosmic-indigo/50 backdrop-blur-md">
          <Loader2 className="w-10 h-10 text-purple-400 animate-spin mb-4" />
          <p className="text-sm font-medium tracking-widest text-purple-200 animate-pulse uppercase">
            Loading 3D Universe...
          </p>
        </div>
      )}

      {/* 
        This Spline scene features a fully interactive 3D character 
        working at a desk with neon/cyberpunk aesthetics.
        The user can click and drag to rotate the camera like in a game.
      */}
      <div className={`w-full h-full transition-opacity duration-1000 ${isLoading ? 'opacity-0' : 'opacity-100 cursor-grab active:cursor-grabbing'}`}>
        <Spline 
          scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode" 
          onLoad={() => setIsLoading(false)}
        />
      </div>
      
      {/* Interactive Overlay hints */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? 20 : 0 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 px-5 py-2 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 text-white/80 text-xs font-medium tracking-wide flex items-center gap-2 pointer-events-none"
      >
        <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
        Drag to explore the 3D scene
      </motion.div>
    </div>
  );
}
