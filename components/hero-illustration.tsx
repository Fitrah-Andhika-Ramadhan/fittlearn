"use client";

import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from "framer-motion";
import { useEffect, useState } from "react";
import { GraduationCap, BookOpen, Mountain, Rocket, Star, TrendingUp, Sparkles, Target } from "lucide-react";

export function StudentSuccessAnimation() {
  const [isMounted, setIsMounted] = useState(false);
  
  // Mouse position for parallax effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 });

  // Transforms for different depth layers
  const bgX = useTransform(springX, [-1, 1], [-10, 10]);
  const bgY = useTransform(springY, [-1, 1], [-10, 10]);
  
  const midX = useTransform(springX, [-1, 1], [-25, 25]);
  const midY = useTransform(springY, [-1, 1], [-25, 25]);
  
  const fgX = useTransform(springX, [-1, 1], [-45, 45]);
  const fgY = useTransform(springY, [-1, 1], [-45, 45]);

  useEffect(() => {
    setIsMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse position between -1 and 1
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const radialGradientX = useTransform(mouseX, [-1, 1], ['0%', '100%']);
  const radialGradientY = useTransform(mouseY, [-1, 1], ['0%', '100%']);
  const bgGradient = useMotionTemplate`radial-gradient(circle at ${radialGradientX} ${radialGradientY}, rgba(255,255,255,0.06), transparent 40%)`;

  if (!isMounted) return <div className="w-full h-full min-h-[400px]" />;

  return (
    <div className="relative w-full h-[500px] md:h-[600px] flex items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950/40 via-[#1a153a] to-purple-950/40 border border-white/10 shadow-[0_0_100px_rgba(139,92,246,0.15)] group perspective-1000">
      
      {/* Background Animated Gradient Orbs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 -left-1/4 w-[150%] h-[150%] bg-purple-600/20 rounded-full blur-[120px]"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.5, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -bottom-1/4 -right-1/4 w-[150%] h-[150%] bg-pink-600/20 rounded-full blur-[100px]"
      />

      {/* Deep Background Layer (Mountains/Goals) */}
      <motion.div style={{ x: bgX, y: bgY }} className="absolute inset-0 flex items-center justify-center opacity-40">
        <Mountain size={400} className="text-purple-900/50 absolute bottom-[-100px] left-[-50px]" />
        <Mountain size={500} className="text-indigo-900/50 absolute bottom-[-150px] right-[-100px]" />
        <motion.div 
          animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-[20%] right-[30%]"
        >
          <Target size={120} className="text-pink-500/20" />
        </motion.div>
      </motion.div>

      {/* Mid Layer (Books / Knowledge Path) */}
      <motion.div style={{ x: midX, y: midY }} className="absolute inset-0 z-10 pointer-events-none">
        {/* Floating Books forming stairs */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 50, x: -50 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            transition={{ delay: i * 0.2 + 0.5, duration: 1 }}
            className={`absolute`}
            style={{
              bottom: `${15 + i * 15}%`,
              left: `${20 + i * 12}%`,
            }}
          >
            <motion.div
              animate={{ y: [0, -8, 0], rotateZ: [0, i % 2 === 0 ? 2 : -2, 0] }}
              transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
            >
              <BookOpen size={40 + i * 5} className="text-purple-300/60 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
            </motion.div>
          </motion.div>
        ))}

        {/* Stars and Sparkles of ideas */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute"
            style={{
              top: `${Math.random() * 80 + 10}%`,
              left: `${Math.random() * 80 + 10}%`,
            }}
            animate={{ 
              scale: [0, 1, 0], 
              opacity: [0, 1, 0],
              rotate: [0, 180] 
            }}
            transition={{ 
              duration: 2 + Math.random() * 2, 
              repeat: Infinity, 
              delay: Math.random() * 2 
            }}
          >
            {i % 2 === 0 ? (
              <Star size={16} className="text-yellow-400" />
            ) : (
              <Sparkles size={20} className="text-pink-400" />
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Foreground Layer (The Student & Action) */}
      <motion.div style={{ x: fgX, y: fgY }} className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
        
        {/* The Student (Abstract Representation) Climbing */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, x: -100, y: 100 }}
          animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute bottom-[40%] left-[45%] flex flex-col items-center justify-center"
        >
          {/* Glowing Aura around the student */}
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-white/20 blur-xl rounded-full w-32 h-32 -z-10 -m-8"
          />
          
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            <div className="bg-gradient-to-tr from-purple-500 to-pink-500 p-4 rounded-2xl shadow-[0_0_30px_rgba(168,85,247,0.6)] backdrop-blur-sm border border-white/30 transform rotate-12 hover:rotate-0 transition-transform duration-500">
              <GraduationCap size={64} className="text-white drop-shadow-md" />
            </div>
            
            {/* Success Graph Arrow bursting out */}
            <motion.div
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2, delay: 1 }}
              className="absolute -top-10 -right-16 text-green-400"
            >
              <TrendingUp size={48} className="drop-shadow-[0_0_10px_rgba(74,222,128,0.8)]" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Rocket shooting towards success */}
        <motion.div
          initial={{ opacity: 0, x: -50, y: 150 }}
          animate={{ 
            opacity: [0, 1, 1, 0], 
            x: [0, 200], 
            y: [0, -200] 
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity, 
            repeatDelay: 2,
            ease: "easeInOut"
          }}
          className="absolute top-[30%] right-[30%]"
        >
          <Rocket size={40} className="text-pink-400 drop-shadow-[0_0_15px_rgba(244,114,182,0.8)]" />
        </motion.div>
        
      </motion.div>

      {/* Meaningful Overlay Text */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center z-30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 1 }}
          className="px-6 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white/70 text-sm font-medium tracking-widest uppercase flex items-center space-x-3"
        >
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span>The Journey to Success</span>
        </motion.div>
      </div>

      {/* Interactive hover glow effect */}
      <motion.div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" 
        style={{ background: bgGradient }} 
      />
    </div>
  );
}
