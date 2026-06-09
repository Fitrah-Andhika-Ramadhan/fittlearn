"use client"

import { useState } from "react"
import { Send } from "lucide-react"

export function ClientContactForm({ email, variant = "home" }: { email: string, variant?: "home" | "contact" }) {
  const [formData, setFormData] = useState({
    name: "",
    emailAddress: "",
    subject: "",
    message: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const { name, emailAddress, subject, message } = formData
    
    // Construct the email body
    const body = `Name: ${name}%0D%0AEmail: ${emailAddress}%0D%0A%0D%0A${message}`
    
    // Open mail client
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject || "New Message from Portfolio")}&body=${body}`
  }

  if (variant === "contact") {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs text-purple-300/70 uppercase tracking-widest mb-1.5">Your Name</label>
          <input
            type="text"
            name="name"
            required
            onChange={handleChange}
            placeholder="Your name"
            className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 transition"
          />
        </div>
        <div>
          <label className="block text-xs text-purple-300/70 uppercase tracking-widest mb-1.5">Your Email</label>
          <input
            type="email"
            name="emailAddress"
            required
            onChange={handleChange}
            placeholder="your@email.com"
            className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 transition"
          />
        </div>
        <div>
          <label className="block text-xs text-purple-300/70 uppercase tracking-widest mb-1.5">Subject</label>
          <input
            type="text"
            name="subject"
            onChange={handleChange}
            placeholder="What is this about?"
            className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 transition"
          />
        </div>
        <div>
          <label className="block text-xs text-purple-300/70 uppercase tracking-widest mb-1.5">Message</label>
          <textarea
            name="message"
            rows={4}
            required
            onChange={handleChange}
            placeholder="Write your message here..."
            className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 transition resize-none"
          />
        </div>
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition font-semibold text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]"
        >
          <Send className="w-4 h-4" />
          Send Message
        </button>
      </form>
    )
  }

  // Home variant
  return (
    <form onSubmit={handleSubmit} className="w-full sm:w-7/12 space-y-3">
      <h3 className="text-sm font-bold mb-4 text-white">Send me a message</h3>
      <input name="name" onChange={handleChange} type="text" placeholder="Name" required className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-xs outline-none focus:border-purple-500 transition focus:bg-white/10 text-white" />
      <input name="emailAddress" onChange={handleChange} type="email" placeholder="Email Address" required className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-xs outline-none focus:border-purple-500 transition focus:bg-white/10 text-white" />
      <input name="subject" onChange={handleChange} type="text" placeholder="Subject" className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-xs outline-none focus:border-purple-500 transition focus:bg-white/10 text-white" />
      <textarea name="message" onChange={handleChange} placeholder="Your message" rows={3} required className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-xs outline-none focus:border-purple-500 transition resize-none focus:bg-white/10 text-white"></textarea>
      <button type="submit" className="w-2/3 py-2.5 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 transition text-xs font-bold mt-2 shadow-[0_0_15px_rgba(168,85,247,0.3)] text-white">Send Message</button>
    </form>
  )
}
