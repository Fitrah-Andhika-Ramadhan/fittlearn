import { prisma } from "@/lib/prisma"
import { Mail, Phone, MapPin, Send } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function ContactPage() {
  const profile = await prisma.profile.findFirst().catch(() => null)

  const name = profile?.name || "Fitrah Andhika Ramadhan"
  const email = profile?.email_contact || "fitrahramadhan310@gmail.com"
  const phone = profile?.phone || "+62 877 6028 7039"
  const location = profile?.location || "Banten, Indonesia"
  const contactIntro = profile?.contact_intro || "I'm very approachable and would love to speak to you. Feel free to call, send me an email or simply complete this enquiry form."

  return (
    <div className="w-full text-white min-h-screen">
      <section className="relative flex flex-col items-center justify-center pt-24 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-5xl w-full mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-md">Get in Touch</h1>
            <p className="text-lg text-purple-200/80 max-w-2xl mx-auto">{contactIntro}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Contact Info */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>
              {[
                { icon: <Mail className="w-5 h-5 text-purple-400" />, label: "Email", value: email, href: `mailto:${email}` },
                { icon: <Phone className="w-5 h-5 text-purple-400" />, label: "Phone", value: phone, href: `tel:${phone.replace(/\s/g, "")}` },
                { icon: <MapPin className="w-5 h-5 text-purple-400" />, label: "Location", value: location, href: undefined },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-purple-500/30 transition">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-xs text-purple-300/70 uppercase tracking-widest mb-1">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} className="text-white font-medium hover:text-purple-300 transition">{item.value}</a>
                    ) : (
                      <p className="text-white font-medium">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Message Form */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
              <h2 className="text-2xl font-bold text-white mb-6">Send a Message</h2>
              <form action={`mailto:${email}`} method="post" encType="text/plain" className="space-y-4">
                <div>
                  <label className="block text-xs text-purple-300/70 uppercase tracking-widest mb-1.5">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder={`Message to ${name}`}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs text-purple-300/70 uppercase tracking-widest mb-1.5">Your Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="your@email.com"
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs text-purple-300/70 uppercase tracking-widest mb-1.5">Subject</label>
                  <input
                    type="text"
                    name="subject"
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
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
