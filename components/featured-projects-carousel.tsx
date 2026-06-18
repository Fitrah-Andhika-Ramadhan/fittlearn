"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface FeaturedProject {
  id: string;
  title: string;
  slug: string;
  thumbnail_url: string | null;
}

interface FeaturedProjectsCarouselProps {
  title: string;
  subtitle: string;
  projects: FeaturedProject[];
}

export function FeaturedProjectsCarousel({ title, subtitle, projects }: FeaturedProjectsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fallback if no projects exist
  const displayProjects = projects.length >= 3 ? projects : [
    ...projects,
    ...Array(Math.max(0, 3 - projects.length)).fill({
      id: "placeholder-1",
      title: "UI Designs",
      slug: "#",
      thumbnail_url: "/placeholder.svg?height=400&width=300"
    })
  ].slice(0, Math.max(3, projects.length));

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % displayProjects.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + displayProjects.length) % displayProjects.length);
  };

  // Optional: Auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [displayProjects.length]);

  return (
    <div className="w-full max-w-2xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
      
      <h3 className="text-center text-xl font-bold text-white mb-10">{title}</h3>
      
      <div className="relative h-64 sm:h-80 w-full flex items-center justify-center perspective-[1000px]">
        {displayProjects.map((project, index) => {
          // Calculate relative position (-1, 0, 1) handling wrap-around
          let relativeIndex = index - currentIndex;
          if (relativeIndex < -1 && currentIndex === displayProjects.length - 1 && index === 0) {
            relativeIndex = 1;
          }
          if (relativeIndex > 1 && currentIndex === 0 && index === displayProjects.length - 1) {
            relativeIndex = -1;
          }

          // If not adjacent or active, hide it completely (useful if >3 items)
          if (Math.abs(relativeIndex) > 1) return null;

          const isActive = relativeIndex === 0;
          
          return (
            <motion.div
              key={`${project.id}-${index}`}
              className={`absolute cursor-pointer rounded-2xl overflow-hidden border transition-colors duration-300 ${
                isActive 
                  ? "border-purple-500/50 shadow-[0_0_40px_rgba(168,85,247,0.4)] z-20" 
                  : "border-white/5 shadow-inner z-10"
              }`}
              initial={false}
              animate={{
                x: `${relativeIndex * 60}%`,
                scale: isActive ? 1 : 0.8,
                opacity: isActive ? 1 : 0.4,
                zIndex: isActive ? 20 : 10,
              }}
              transition={{
                duration: 0.5,
                ease: "easeInOut",
              }}
              onClick={() => {
                if (relativeIndex === -1) handlePrev();
                if (relativeIndex === 1) handleNext();
              }}
              style={{
                width: "60%",
                maxWidth: "240px",
                height: isActive ? "100%" : "80%",
              }}
            >
              <div className="w-full h-full relative group/card">
                <Image
                  src={project.thumbnail_url || "/placeholder.svg?height=400&width=300"}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0914] via-[#0b0914]/50 to-transparent opacity-80"></div>
                
                {/* Title overlay at bottom */}
                <div className="absolute bottom-0 left-0 w-full p-4 text-center">
                  <h4 className={`font-bold transition-all duration-300 ${isActive ? "text-white text-lg" : "text-white/60 text-sm"}`}>
                    {project.title}
                  </h4>
                  {isActive && (
                    <div className="w-12 h-1 bg-purple-500 rounded-full mx-auto mt-2"></div>
                  )}
                </div>

                {/* Only active card is clickable to detail */}
                {isActive && project.slug !== "#" && (
                  <Link href={`/portfolio`} className="absolute inset-0 z-30" aria-label={`View ${project.title}`} />
                )}
              </div>
            </motion.div>
          );
        })}

        {/* Manual Navigation Controls (appear on hover) */}
        <button 
          onClick={handlePrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white/50 hover:text-white hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100 z-30 -ml-4 sm:ml-0"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button 
          onClick={handleNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white/50 hover:text-white hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100 z-30 -mr-4 sm:mr-0"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      <div className="text-center mt-10">
        <Link href="/portfolio" className="text-sm text-purple-300 hover:text-purple-200 transition underline underline-offset-4 relative z-40">
          {subtitle}
        </Link>
      </div>
    </div>
  );
}
