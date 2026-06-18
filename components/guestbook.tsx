"use client";

import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";

type GuestbookEntry = {
  id: string;
  name: string;
  message: string;
  created_at: string;
};

export function Guestbook() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchEntries = async () => {
    try {
      const res = await fetch("/api/guestbook");
      if (res.ok) {
        const data = await res.json();
        setEntries(data);
      }
    } catch (err) {
      console.error("Failed to fetch guestbook entries:", err);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, message }),
      });

      if (res.ok) {
        setName("");
        setMessage("");
        await fetchEntries(); // Refresh the list
      } else {
        const data = await res.json();
        setError(data.error || "Failed to submit comment.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 sm:p-10 shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-transparent pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row gap-10">
        
        {/* Left Side: Form */}
        <div className="w-full md:w-1/3">
          <h3 className="text-2xl font-bold mb-2 text-white">Guestbook</h3>
          <p className="text-sm text-purple-200/80 mb-6">
            Leave a message, share your thoughts, or just say hi!
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-xs font-medium text-purple-200 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
                maxLength={50}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition text-sm"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-xs font-medium text-purple-200 mb-1">
                Message
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Your message..."
                required
                maxLength={500}
                rows={4}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition text-sm resize-none"
              ></textarea>
            </div>
            
            {error && <p className="text-red-400 text-xs">{error}</p>}
            
            <button
              type="submit"
              disabled={isSubmitting || !name.trim() || !message.trim()}
              className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium text-sm text-white shadow-[0_0_20px_rgba(168,85,247,0.3)]"
            >
              {isSubmitting ? "Submitting..." : "Post Message"}
            </button>
          </form>
        </div>

        {/* Right Side: Comments List */}
        <div className="w-full md:w-2/3 flex flex-col h-[400px]">
          <h4 className="text-sm font-semibold text-white/80 mb-4 sticky top-0 bg-[#0f0c29]/0 backdrop-blur-sm py-1">
            Recent Messages ({entries.length})
          </h4>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
            {entries.length === 0 ? (
              <div className="flex items-center justify-center h-full text-white/40 text-sm">
                No messages yet. Be the first to say hi!
              </div>
            ) : (
              entries.map((entry) => (
                <div 
                  key={entry.id} 
                  className="bg-black/20 border border-white/5 rounded-2xl p-4 transition hover:bg-black/30"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-purple-300 text-sm">{entry.name}</span>
                    <span className="text-xs text-white/40">
                      {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">
                    {entry.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
