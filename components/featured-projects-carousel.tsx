"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

export interface FeaturedProject {
  id: string;
  title: string;
  slug: string;
  thumbnail_url: string | null;
  link?: string;
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
      thumbnail_url: "/placeholder.svg?height=400&width=600",
      link: "/portfolio"
    })
  ].slice(0, Math.max(3, projects.length));

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % displayProjects.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + displayProjects.length) % displayProjects.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [displayProjects.length]);

  return (
    <div className="w-full max-w-3xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 sm:p-10 shadow-2xl relative overflow-visible group">
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none rounded-[2rem]"></div>
      
      <h3 className="text-center text-xl font-bold text-white mb-10">{title}</h3>
      
      <div className="relative h-48 sm:h-64 w-full flex items-center justify-center perspective-[1200px]">
        {displayProjects.map((project, index) => {
          let relativeIndex = index - currentIndex;
          if (relativeIndex < -1 && currentIndex === displayProjects.length - 1 && index === 0) {
            relativeIndex = 1;
          }
          if (relativeIndex > 1 && currentIndex === 0 && index === displayProjects.length - 1) {
            relativeIndex = -1;
          }

          if (Math.abs(relativeIndex) > 1) return null;

          const isActive = relativeIndex === 0;
          
          return (
            <motion.div
              key={`${project.id}-${index}`}
              className={`absolute cursor-pointer rounded-2xl overflow-hidden border transition-all duration-300 ${
                isActive 
                  ? "border-purple-500/50 shadow-[0_0_50px_rgba(168,85,247,0.5)] z-20" 
                  : "border-white/10 shadow-inner z-10 blur-[1px] hover:blur-none"
              }`}
              initial={false}
              animate={{
                x: `${relativeIndex * 55}%`,
                scale: isActive ? 1 : 0.75,
                opacity: isActive ? 1 : 0.4,
                zIndex: isActive ? 20 : 10,
              }}
              transition={{
                duration: 0.5,
                ease: "easeOut",
              }}
              onClick={() => {
                if (relativeIndex === -1) handlePrev();
                if (relativeIndex === 1) handleNext();
              }}
              style={{
                width: "80%",
                maxWidth: "380px",
                aspectRatio: "16/9",
              }}
            >
              <div className="w-full h-full relative group/card">
                <Image
                  src={project.thumbnail_url || "/placeholder.svg?height=400&width=600"}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
                
                {/* Dark gradient from bottom up */}
                <div className={`absolute inset-0 transition-opacity duration-300 ${isActive ? 'bg-gradient-to-t from-[#090714] via-[#090714]/60 to-transparent opacity-90' : 'bg-black/60'}`}></div>
                
                {/* Title overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 text-center">
                  <h4 className={`font-bold transition-all duration-300 drop-shadow-md ${isActive ? "text-white text-xl sm:text-2xl mb-1" : "text-white/60 text-sm mb-0"}`}>
                    {project.title}
                  </h4>
                  
                  {isActive && project.link && (
                    <div className="flex justify-center items-center gap-1 text-xs text-purple-300 font-medium opacity-0 group-hover/card:opacity-100 transition-opacity mb-2">
                      <span>View Live</span>
                      <ExternalLink className="w-3 h-3" />
                    </div>
                  )}

                  {isActive && (
                    <div className="w-16 h-1 bg-purple-500 rounded-full mx-auto mt-1 shadow-[0_0_10px_rgba(168,85,247,0.8)]"></div>
                  )}
                </div>

                {/* Direct link for active card */}
                {isActive && project.link && project.link !== "#" && (
                  <Link 
                    href={project.link} 
                    target={project.link.startsWith("http") ? "_blank" : "_self"} 
                    rel={project.link.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="absolute inset-0 z-30" 
                    aria-label={`View ${project.title}`} 
                  />
                )}
              </div>
            </motion.div>
          );
        })}

        {/* Manual Navigation Controls */}
        <button 
          onClick={handlePrev}
          className="absolute -left-2 sm:-left-6 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100 z-30 shadow-lg"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <button 
          onClick={handleNext}
          className="absolute -right-2 sm:-right-6 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100 z-30 shadow-lg"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      <div className="text-center mt-12 relative z-40">
        <Link href="/portfolio" className="text-sm font-medium text-purple-400 hover:text-purple-300 transition underline underline-offset-4 decoration-purple-500/30 hover:decoration-purple-400">
          {subtitle}
        </Link>
      </div>
    </div>
  );
}
