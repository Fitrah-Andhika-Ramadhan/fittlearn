"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export function CustomSvgAnimation({ lang = 'en' }: { lang?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isTypingFast, setIsTypingFast] = useState(false);
  const [isTurbo, setIsTurbo] = useState(false);

  // Mouse tracking for interactivity
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Springs for smooth head/eye following
  const smoothMouseX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 100, damping: 30 });

  // Map mouse position to head rotation and movement
  const headRotate = useTransform(smoothMouseX, [-0.5, 0.5], [-15, 15]);
  const headX = useTransform(smoothMouseX, [-0.5, 0.5], [-10, 10]);
  const headY = useTransform(smoothMouseY, [-0.5, 0.5], [-10, 10]);

  // Map mouse to holographic screens parallax
  const screenLeftX = useTransform(smoothMouseX, [-0.5, 0.5], [-20, 20]);
  const screenRightX = useTransform(smoothMouseX, [-0.5, 0.5], [20, -20]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsTypingFast(false);
  };

  // Determine animation speed based on interaction state
  const typingDuration = isTurbo ? 0.15 : (isTypingFast ? 0.3 : 0.6);
  const particleSpeed = isTurbo ? 0.5 : 2;

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsTypingFast(true)}
      onMouseLeave={handleMouseLeave}
      onMouseDown={() => setIsTurbo(true)}
      onMouseUp={() => setIsTurbo(false)}
      onTouchStart={() => setIsTurbo(true)}
      onTouchEnd={() => setIsTurbo(false)}
      className="relative w-full h-full min-h-[400px] md:min-h-[500px] flex items-center justify-center perspective-[1000px] cursor-pointer"
    >
      
      {/* Background ambient glow that reacts to turbo mode */}
      <motion.div 
        animate={{ 
          backgroundColor: isTurbo ? "rgba(59, 130, 246, 0.4)" : "rgba(168, 85, 247, 0.2)",
          scale: isTurbo ? 1.2 : 1 
        }}
        className="absolute w-[150%] h-[150%] blur-[100px] rounded-full top-0 left-0 -translate-x-1/4 -translate-y-1/4 transition-colors duration-300"
      ></motion.div>
      
      {/* Container for the 3D SVG Scene */}
      <motion.div 
        initial={{ rotateX: 5, rotateY: -10 }}
        animate={{ 
          rotateX: [5, 2, 5], 
          rotateY: [-10, -5, -10],
          y: isTurbo ? [0, 2, -2, 0] : [0, -10, 0] // Shakes when turbo
        }}
        transition={{ duration: isTurbo ? 0.2 : 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-[350px] h-[350px] transform-style-3d"
      >
        {/* Floating Hologram Screens (Background) */}
        <motion.div 
          style={{ x: screenLeftX, transform: "translateZ(-50px) rotateY(15deg)" }}
          animate={{ y: [0, -15, 0], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] left-[5%] w-24 h-32 bg-blue-500/20 border border-blue-400/50 rounded-lg backdrop-blur-sm flex flex-col p-2 gap-2"
        >
          <div className="w-full h-2 bg-blue-400/50 rounded-full animate-pulse"></div>
          <div className="w-3/4 h-2 bg-blue-400/30 rounded-full"></div>
          <div className="w-5/6 h-2 bg-blue-400/30 rounded-full"></div>
          {/* Mock Code Lines */}
          <div className="w-1/2 h-1 bg-green-400/50 mt-4 rounded-full"></div>
          <div className="w-full h-1 bg-green-400/50 rounded-full"></div>
          <div className="w-2/3 h-1 bg-green-400/50 rounded-full"></div>
        </motion.div>

        <motion.div 
          style={{ x: screenRightX, transform: "translateZ(-30px) rotateY(-15deg)" }}
          animate={{ y: [0, -10, 0], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-[5%] right-[10%] w-32 h-24 bg-purple-500/20 border border-purple-400/50 rounded-lg backdrop-blur-sm flex flex-col p-2 gap-2"
        >
          <div className="w-full h-full grid grid-cols-3 gap-1 opacity-50">
             {[...Array(9)].map((_, i) => (
                <motion.div 
                  key={i} 
                  animate={{ opacity: [0.2, 1, 0.2] }} 
                  transition={{ duration: isTurbo ? 0.5 : 1.5, repeat: Infinity, delay: i * 0.1 }}
                  className="bg-purple-400 rounded-sm"
                />
             ))}
          </div>
        </motion.div>

        {/* The Desk */}
        <div 
          className="absolute bottom-[10%] left-[10%] right-[10%] h-4 bg-gradient-to-r from-orange-900 via-amber-900 to-orange-900 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
          style={{ transform: "translateZ(0px)" }}
        ></div>

        {/* Stack of College Books */}
        <div className="absolute bottom-[13%] left-[15%] w-16 h-12" style={{ transform: "translateZ(10px)" }}>
           <div className="absolute bottom-0 w-full h-3 bg-red-800 rounded-sm border border-red-950"></div>
           <div className="absolute bottom-3 w-11/12 left-1 h-4 bg-blue-800 rounded-sm border border-blue-950"></div>
           <div className="absolute bottom-7 w-full h-3 bg-emerald-800 rounded-sm border border-emerald-950 rotate-[-5deg] origin-bottom-left"></div>
        </div>

        {/* Coffee Cup */}
        <div className="absolute bottom-[13%] right-[20%] w-8 h-10" style={{ transform: "translateZ(15px)" }}>
           <div className="w-full h-full bg-slate-100 rounded-b-lg border-b-4 border-slate-300 relative overflow-hidden">
             {/* Coffee Sleeve */}
             <div className="absolute top-1/3 w-full h-1/3 bg-amber-700"></div>
           </div>
           {/* Coffee Steam */}
           <motion.div 
             animate={{ y: [0, -10, 0], opacity: [0, 0.5, 0], x: [0, 5, 0] }}
             transition={{ duration: 2, repeat: Infinity }}
             className="absolute -top-4 left-2 w-1 h-4 bg-white/50 blur-[1px] rounded-full"
           ></motion.div>
        </div>

        {/* The Laptop */}
        <div 
          className="absolute bottom-[13%] left-[50%] -translate-x-1/2 w-32 h-24"
          style={{ transform: "translateZ(20px)" }}
        >
          {/* Screen */}
          <motion.div 
            className="absolute bottom-0 w-full h-full bg-slate-900 rounded-t-xl border-2 border-slate-700 relative overflow-hidden shadow-[0_0_15px_rgba(59,130,246,0.3)]"
            style={{ transformOrigin: "bottom", transform: "perspective(300px) rotateX(15deg)" }}
          >
            {/* Screen Glow */}
            <motion.div 
              animate={{ opacity: isTurbo ? [0.8, 1, 0.8] : [0.4, 0.6, 0.4] }}
              transition={{ duration: isTurbo ? 0.2 : 2, repeat: Infinity }}
              className="absolute inset-0 bg-blue-500/30"
            ></motion.div>
            {/* Code lines on screen */}
            <div className="absolute top-2 left-2 right-2 flex flex-col gap-1 opacity-70">
              <div className="w-full h-1 bg-blue-300 rounded-full"></div>
              <div className="w-3/4 h-1 bg-green-400 rounded-full"></div>
              <div className="w-5/6 h-1 bg-purple-400 rounded-full"></div>
              <div className="w-1/2 h-1 bg-yellow-400 rounded-full"></div>
            </div>
          </motion.div>
          {/* Base */}
          <div className="absolute -bottom-2 -left-4 -right-4 h-2 bg-slate-400 rounded-b-xl shadow-xl"></div>
        </div>

        {/* The Character (SVG) */}
        <svg 
          viewBox="0 0 200 200" 
          className="absolute bottom-[20%] left-[50%] -translate-x-1/2 w-48 h-48 drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)]"
          style={{ transform: "translateZ(10px)" }}
        >
          <defs>
            {/* University Almamater Jacket (Maroon/Yellow) */}
            <linearGradient id="jacketGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#7f1d1d" /> {/* Dark Red/Maroon */}
              <stop offset="100%" stopColor="#450a0a" />
            </linearGradient>
            <linearGradient id="shirtGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f8fafc" /> {/* White undershirt */}
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>
          </defs>

          {/* Body/Jacket */}
          <motion.path 
            d="M 40 200 Q 50 120 100 120 Q 150 120 160 200 Z" 
            fill="url(#jacketGrad)" 
            animate={{ d: ["M 40 200 Q 50 120 100 120 Q 150 120 160 200 Z", "M 40 200 Q 50 123 100 123 Q 150 123 160 200 Z", "M 40 200 Q 50 120 100 120 Q 150 120 160 200 Z"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Inner Shirt */}
          <path d="M 80 120 L 100 150 L 120 120 Z" fill="url(#shirtGrad)" />
          {/* Jacket Lapels */}
          <path d="M 80 120 L 100 200 L 70 200 Z" fill="#991b1b" />
          <path d="M 120 120 L 100 200 L 130 200 Z" fill="#991b1b" />

          {/* Head & Neck (Interactive) */}
          <motion.g 
            style={{ 
              rotateZ: headRotate, 
              x: headX, 
              y: headY,
              transformOrigin: "100px 120px" 
            }}
          >
            {/* Neck */}
            <rect x="90" y="80" width="20" height="45" fill="#fca5a5" />
            {/* Face */}
            <circle cx="100" cy="70" r="32" fill="#fca5a5" />
            
            {/* Messy Student Hair */}
            <path d="M 65 65 Q 70 20 100 25 Q 130 20 135 65 Q 135 40 120 35 Q 100 20 80 35 Q 65 40 65 65 Z" fill="#27272a" />
            
            {/* Classic Glasses (Mahasiswa) */}
            <rect x="75" y="60" width="18" height="12" rx="2" fill="none" stroke="#333" strokeWidth="2.5" />
            <rect x="107" y="60" width="18" height="12" rx="2" fill="none" stroke="#333" strokeWidth="2.5" />
            <line x1="93" y1="65" x2="107" y2="65" stroke="#333" strokeWidth="2.5" />
            
            {/* Eye reflections (Screen glow in eyes) */}
            <motion.circle 
              cx="84" cy="66" r="2" fill="#60a5fa"
              animate={{ opacity: isTurbo ? [1, 0, 1] : 0.8, scale: isTurbo ? 1.5 : 1 }}
              transition={{ duration: 0.1, repeat: Infinity }}
            />
            <motion.circle 
              cx="116" cy="66" r="2" fill="#60a5fa"
              animate={{ opacity: isTurbo ? [1, 0, 1] : 0.8, scale: isTurbo ? 1.5 : 1 }}
              transition={{ duration: 0.1, repeat: Infinity }}
            />
          </motion.g>

          {/* Left Arm (Typing) */}
          <motion.path 
            d="M 60 140 Q 40 170 80 190" 
            fill="none" 
            stroke="url(#jacketGrad)" 
            strokeWidth="16" 
            strokeLinecap="round"
            animate={{ 
              d: isTurbo 
                ? ["M 60 140 Q 40 170 80 190", "M 60 140 Q 40 150 80 180", "M 60 140 Q 40 170 80 190"]
                : ["M 60 140 Q 40 170 80 190", "M 60 140 Q 40 160 80 185", "M 60 140 Q 40 170 80 190"] 
            }}
            transition={{ duration: typingDuration, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Right Arm (Typing) */}
          <motion.path 
            d="M 140 140 Q 160 170 120 190" 
            fill="none" 
            stroke="url(#jacketGrad)" 
            strokeWidth="16" 
            strokeLinecap="round"
            animate={{ 
              d: isTurbo 
                ? ["M 140 140 Q 160 170 120 190", "M 140 140 Q 160 150 120 180", "M 140 140 Q 160 170 120 190"]
                : ["M 140 140 Q 160 170 120 190", "M 140 140 Q 160 180 120 195", "M 140 140 Q 160 170 120 190"] 
            }}
            transition={{ duration: typingDuration * 1.2, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
          />
        </svg>

        {/* Front Particle Effects (Ideas/Code flowing) */}
        {[...Array(isTurbo ? 20 : 10)].map((_, i) => (
          <motion.div
            key={`particle-${i}-${isTurbo ? 'turbo' : 'normal'}`}
            className={`absolute rounded-full ${i % 3 === 0 ? 'bg-purple-400' : 'bg-blue-400'}`}
            style={{
              width: i % 2 === 0 ? 4 : 6,
              height: i % 2 === 0 ? 4 : 6,
              bottom: "20%",
              left: "50%",
              transform: "translateZ(40px)",
            }}
            initial={{ opacity: 0, x: 0, y: 0 }}
            animate={{ 
              opacity: [0, 1, 0], 
              x: (Math.random() - 0.5) * (isTurbo ? 300 : 200), 
              y: -Math.random() * (isTurbo ? 300 : 200) 
            }}
            transition={{ 
              duration: (Math.random() * 2 + 1) * particleSpeed, 
              repeat: Infinity, 
              delay: Math.random() * 2 
            }}
          />
        ))}
      </motion.div>

      {/* Overlay Instructions */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-5 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white/80 text-xs font-medium tracking-wide flex items-center gap-3 pointer-events-none shadow-xl z-20">
        <span className={`w-2 h-2 rounded-full ${isTurbo ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' : (isTypingFast ? 'bg-yellow-400 shadow-[0_0_10px_#facc15]' : 'bg-blue-400 shadow-[0_0_10px_#60a5fa]')} animate-pulse`} />
        {isTurbo ? (lang === 'id' ? "MODE KODING TURBO!" : "TURBO CODING MODE!") : (isTypingFast ? (lang === 'id' ? "Sedang Bekerja Keras..." : "Working Hard...") : (lang === 'id' ? "Arahkan atau Klik untuk Berinteraksi" : "Hover or Click to Interact"))}
      </div>
    </div>
  );
}

