"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";

export function InteractiveHeroImage({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // Motion values to track mouse position relative to center of component (-0.5 to 0.5)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs to make the rotation fluid rather than snappy
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  // Transform mouse position into rotation degrees (-15deg to 15deg)
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);
  
  // Dynamic glare/reflection effect
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["100%", "0%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["100%", "0%"]);
  const glareOpacity = useTransform(
    mouseXSpring,
    [-0.5, 0, 0.5],
    [0.5, 0, 0.5]
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <div 
      className="w-full max-w-lg aspect-square relative perspective-[1200px]"
    >
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        // Support touch on mobile
        onTouchMove={(e) => {
          if (!ref.current) return;
          const rect = ref.current.getBoundingClientRect();
          const touch = e.touches[0];
          const mouseX = touch.clientX - rect.left;
          const mouseY = touch.clientY - rect.top;
          x.set(mouseX / rect.width - 0.5);
          y.set(mouseY / rect.height - 0.5);
        }}
        onTouchStart={() => setIsHovered(true)}
        onTouchEnd={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="w-full h-full relative rounded-3xl cursor-grab active:cursor-grabbing group"
        animate={
          isHovered 
            ? { scale: 1.05, y: 0 } 
            : { scale: 1, y: [0, -15, 0] } // Idle floating animation
        }
        transition={
          isHovered
            ? { duration: 0.3, ease: "easeOut" }
            : { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }
      >
        {/* Floating background glass frame (Timbul Effect) */}
        <div 
          className="absolute inset-0 rounded-3xl"
          style={{
            transform: "translateZ(-30px)",
            boxShadow: "0 20px 50px rgba(168,85,247,0.3), 0 0 100px rgba(99,102,241,0.1) inset",
            background: "rgba(255,255,255,0.03)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.15)"
          }}
        />

        {/* The actual image popping out */}
        <div 
          className="absolute inset-0 rounded-3xl overflow-hidden border border-white/20 drop-shadow-[0_0_30px_rgba(168,85,247,0.5)]"
          style={{ transform: "translateZ(40px)" }}
        >
          <Image 
            src={src} 
            alt={alt} 
            fill 
            className="object-cover" 
            priority 
          />
          
          {/* Dynamic Glare overlay */}
          <motion.div
            className="absolute inset-0 pointer-events-none mix-blend-overlay"
            style={{
              background: "radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 60%)",
              opacity: glareOpacity,
              left: glareX,
              top: glareY,
              width: "200%",
              height: "200%",
              transform: "translate(-50%, -50%)"
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}
