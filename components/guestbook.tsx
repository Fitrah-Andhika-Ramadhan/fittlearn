"use client";

import { useState, useEffect, useMemo } from "react";
import { formatDistanceToNow } from "date-fns";

type GuestbookEntry = {
  id: string;
  name: string;
  message: string;
  created_at: string;
  parentId: string | null;
  replies?: GuestbookEntry[];
};

export function Guestbook() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Tokens for editing/deleting own comments
  const [ownedTokens, setOwnedTokens] = useState<Record<string, string>>({});

  // UI States for Reply and Edit
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editMessage, setEditMessage] = useState("");
  const [replyMessage, setReplyMessage] = useState("");

  useEffect(() => {
    // Load owned tokens from localStorage
    try {
      const stored = localStorage.getItem("guestbook_tokens");
      if (stored) {
        setOwnedTokens(JSON.parse(stored));
      }
    } catch (e) {}
  }, []);

  const saveToken = (id: string, token: string) => {
    const newTokens = { ...ownedTokens, [id]: token };
    setOwnedTokens(newTokens);
    localStorage.setItem("guestbook_tokens", JSON.stringify(newTokens));
  };

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message, parentId: null }),
      });

      if (res.ok) {
        const newEntry = await res.json();
        if (newEntry.edit_token) {
          saveToken(newEntry.id, newEntry.edit_token);
        }
        setName("");
        setMessage("");
        await fetchEntries();
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

  const handleReply = async (parentId: string) => {
    if (!name.trim() || !replyMessage.trim()) return;

    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message: replyMessage, parentId }),
      });

      if (res.ok) {
        const newEntry = await res.json();
        if (newEntry.edit_token) {
          saveToken(newEntry.id, newEntry.edit_token);
        }
        setReplyMessage("");
        setReplyingTo(null);
        await fetchEntries();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = async (id: string) => {
    if (!editMessage.trim()) return;
    const token = ownedTokens[id];
    if (!token) return;

    try {
      const res = await fetch(`/api/guestbook/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: editMessage, edit_token: token }),
      });

      if (res.ok) {
        setEditingId(null);
        setEditMessage("");
        await fetchEntries();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;
    const token = ownedTokens[id];
    if (!token) return;

    try {
      const res = await fetch(`/api/guestbook/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ edit_token: token }),
      });

      if (res.ok) {
        await fetchEntries();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Build tree from flat entries
  const rootEntries = useMemo(() => {
    const map = new Map<string, GuestbookEntry>();
    const roots: GuestbookEntry[] = [];

    // Initialize map
    entries.forEach((e) => {
      map.set(e.id, { ...e, replies: [] });
    });

    // Build tree
    entries.forEach((e) => {
      const entry = map.get(e.id)!;
      if (entry.parentId) {
        const parent = map.get(entry.parentId);
        if (parent) {
          parent.replies!.push(entry);
        } else {
          // Parent might have been deleted, treat as root or orphan
          roots.push(entry);
        }
      } else {
        roots.push(entry);
      }
    });

    // Sort replies chronologically
    roots.forEach((root) => {
      root.replies!.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    });

    return roots;
  }, [entries]);

  const renderEntry = (entry: GuestbookEntry, depth = 0) => {
    const isOwner = !!ownedTokens[entry.id];
    const isReplying = replyingTo === entry.id;
    const isEditing = editingId === entry.id;

    return (
      <div key={entry.id} className={`flex flex-col ${depth > 0 ? "ml-6 mt-3 pl-4 border-l-2 border-white/10" : "mt-4"}`}>
        <div className={`bg-black/20 border border-white/5 rounded-2xl p-4 transition hover:bg-black/30 ${depth > 0 ? 'text-[0.9em]' : ''}`}>
          <div className="flex justify-between items-start mb-2">
            <span className="font-semibold text-purple-300 text-sm">{entry.name}</span>
            <span className="text-xs text-white/40">
              {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })}
            </span>
          </div>

          {isEditing ? (
            <div className="mt-2 space-y-2">
              <textarea
                value={editMessage}
                onChange={(e) => setEditMessage(e.target.value)}
                className="w-full bg-black/40 border border-white/20 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500 transition resize-none"
                rows={3}
              />
              <div className="flex gap-2">
                <button onClick={() => handleEdit(entry.id)} className="text-xs bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 rounded-lg transition">Save</button>
                <button onClick={() => setEditingId(null)} className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg transition">Cancel</button>
              </div>
            </div>
          ) : (
            <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">
              {entry.message}
            </p>
          )}

          {/* Action Buttons */}
          {!isEditing && (
            <div className="flex gap-3 mt-3">
              {depth === 0 && ( // Only allow 1 level of replies for simplicity, or remove condition for infinite
                <button 
                  onClick={() => { setReplyingTo(entry.id); setEditingId(null); setReplyMessage(""); }}
                  className="text-xs text-white/50 hover:text-purple-300 transition"
                >
                  Reply
                </button>
              )}
              {isOwner && (
                <>
                  <button 
                    onClick={() => { setEditingId(entry.id); setEditMessage(entry.message); setReplyingTo(null); }}
                    className="text-xs text-white/50 hover:text-blue-300 transition"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(entry.id)}
                    className="text-xs text-white/50 hover:text-red-400 transition"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          )}

          {/* Reply Form */}
          {isReplying && (
            <div className="mt-4 p-3 bg-white/5 rounded-xl border border-white/10 space-y-2">
              {!name.trim() && <p className="text-xs text-yellow-400 mb-1">Please enter your name in the main form first.</p>}
              <textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder={`Reply to ${entry.name}...`}
                className="w-full bg-black/40 border border-white/20 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500 transition resize-none"
                rows={2}
              />
              <div className="flex gap-2">
                <button 
                  onClick={() => handleReply(entry.id)} 
                  disabled={!name.trim() || !replyMessage.trim()}
                  className="text-xs bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white px-3 py-1.5 rounded-lg transition"
                >
                  Post Reply
                </button>
                <button 
                  onClick={() => setReplyingTo(null)} 
                  className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Render nested replies */}
        {entry.replies && entry.replies.length > 0 && (
          <div className="flex flex-col">
            {entry.replies.map((reply) => renderEntry(reply, depth + 1))}
          </div>
        )}
      </div>
    );
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

          <form onSubmit={handleSubmit} className="space-y-4 sticky top-6">
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
        <div className="w-full md:w-2/3 flex flex-col max-h-[600px]">
          <h4 className="text-sm font-semibold text-white/80 mb-4 sticky top-0 bg-[#0f0c29]/0 backdrop-blur-sm py-1 z-10">
            Recent Messages ({entries.length})
          </h4>
          
          <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
            {rootEntries.length === 0 ? (
              <div className="flex items-center justify-center h-40 text-white/40 text-sm border border-dashed border-white/10 rounded-2xl">
                No messages yet. Be the first to say hi!
              </div>
            ) : (
              <div className="pb-8">
                {rootEntries.map((entry) => renderEntry(entry))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
