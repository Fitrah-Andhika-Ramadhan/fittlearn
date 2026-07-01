"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const router = useRouter();
  const [lang, setLang] = useState('id'); // Default to ID based on user preference
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const cookies = document.cookie.split(';');
    const localeCookie = cookies.find(c => c.trim().startsWith('NEXT_LOCALE='));
    if (localeCookie) {
      setLang(localeCookie.split('=')[1]);
    }
  }, []);

  const switchLang = (newLang: string) => {
    if (lang === newLang) return;
    document.cookie = `NEXT_LOCALE=${newLang}; path=/; max-age=31536000`;
    setLang(newLang);
    router.refresh(); // Refresh server components to pick up new language!
  };

  if (!mounted) return null;

  return (
    <div className="fixed top-4 right-4 lg:top-8 lg:right-12 z-[100] flex items-center gap-3">
      {/* Icon Indicator */}
      <div className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-[0_0_15px_rgba(168,85,247,0.2)] text-purple-300">
        <Globe size={16} />
      </div>
      
      {/* Toggle Container */}
      <div className="relative flex items-center p-1 w-32 h-10 rounded-full bg-black/40 border border-white/10 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
        
        {/* Animated Highlight Pill */}
        <motion.div
          className="absolute h-8 top-1"
          initial={false}
          animate={{
             left: lang === 'id' ? '4px' : '62px',
             width: '62px' // half of 128px (32) minus padding
          }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
          <div className="w-full h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.6)]"></div>
        </motion.div>

        {/* ID Button */}
        <button 
          onClick={() => switchLang('id')}
          className={`relative z-10 w-1/2 h-full flex items-center justify-center text-xs font-bold tracking-widest rounded-full transition-colors duration-300 ${
            lang === 'id' ? 'text-white' : 'text-white/50 hover:text-white/80'
          }`}
        >
          ID
        </button>
        
        {/* EN Button */}
        <button 
          onClick={() => switchLang('en')}
          className={`relative z-10 w-1/2 h-full flex items-center justify-center text-xs font-bold tracking-widest rounded-full transition-colors duration-300 ${
            lang === 'en' ? 'text-white' : 'text-white/50 hover:text-white/80'
          }`}
        >
          EN
        </button>
      </div>
    </div>
  );
}
