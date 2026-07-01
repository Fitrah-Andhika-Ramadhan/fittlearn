"use client";

import React, { useRef, useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface VideoChromaKeyProps {
  src: string;
  className?: string;
  colorToExtract?: 'blue' | 'green';
}

export function VideoChromaKey({ src, className = '', colorToExtract = 'blue' }: VideoChromaKeyProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    
    // We use willReadFrequently to optimize for getImageData
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    let animationFrameId: number;

    const renderFrame = () => {
      if (video.paused || video.ended) {
        animationFrameId = requestAnimationFrame(renderFrame);
        return;
      }
      
      // Sync canvas size with video size
      if (canvas.width !== video.videoWidth && video.videoWidth > 0) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        setIsReady(true);
      }
      
      if (video.videoWidth === 0) {
        animationFrameId = requestAnimationFrame(renderFrame);
        return;
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = frame.data;
      
      const length = data.length;
      
      // Real-time Chroma Key processing
      for (let i = 0; i < length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        if (colorToExtract === 'blue') {
          // Detect blue background
          // Blue is significantly higher than red and green
          if (b > 100 && b > r * 1.4 && b > g * 1.4) {
            // Apply transparency (Alpha = 0)
            data[i + 3] = 0;
            
            // Optional: Spill suppression (remove blue fringe on edges)
          } else if (b > Math.max(r, g)) {
             // If slightly blue on edges, reduce blue to match the max of R/G to grey it out
             data[i + 2] = Math.max(r, g);
          }
        } else {
          // Detect green background
          if (g > 100 && g > r * 1.4 && g > b * 1.4) {
            data[i + 3] = 0;
          } else if (g > Math.max(r, b)) {
            data[i + 1] = Math.max(r, b);
          }
        }
      }
      
      ctx.putImageData(frame, 0, 0);
      animationFrameId = requestAnimationFrame(renderFrame);
    };

    video.addEventListener('play', () => {
      renderFrame();
    });
    
    // Handle loaded data
    video.addEventListener('loadeddata', () => {
       if(video.readyState >= 2) {
         video.play().catch(e => console.error("Auto-play prevented", e));
       }
    });

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [colorToExtract]);

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {!isReady && (
         <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
         </div>
      )}
      <video
        ref={videoRef}
        src={src}
        autoPlay
        loop
        muted
        playsInline
        crossOrigin="anonymous"
        className="hidden" 
      />
      <canvas
        ref={canvasRef}
        className={`w-full h-full object-contain transition-opacity duration-1000 ${isReady ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
}
