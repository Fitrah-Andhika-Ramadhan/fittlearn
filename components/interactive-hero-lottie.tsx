"use client";

import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export function InteractiveHeroLottie() {
  return (
    <div className="w-full h-full min-h-[400px] md:min-h-[500px] relative flex items-center justify-center rounded-[2.5rem] overflow-hidden glass-card border-white/20 shadow-[0_0_50px_rgba(168,85,247,0.3)] group perspective-[1000px]">
      
      {/* Background glowing orb for the Lottie animation */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-vibrant-purple/20 blur-[100px] rounded-full pointer-events-none transition-all duration-1000 group-hover:bg-electric-blue/30 group-hover:scale-110"></div>
      
      <div 
        className="w-full h-full max-w-lg aspect-square relative z-10 flex items-center justify-center drop-shadow-[0_0_30px_rgba(168,85,247,0.6)] transform transition-transform duration-500 group-hover:scale-110"
      >
        <DotLottieReact
          src="https://lottie.host/80e9224f-ef19-482a-a924-f76156e737c3/R2946yD3H4.json"
          loop
          autoplay
        />
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-5 py-2 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 text-white/80 text-xs font-medium tracking-wide flex items-center gap-2 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        Moving Forward
      </div>
    </div>
  );
}
