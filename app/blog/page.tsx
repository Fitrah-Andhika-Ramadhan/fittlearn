import { prisma } from "@/lib/prisma"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Eye, Heart, Tag, ArrowRight } from "lucide-react"
import { cookies } from "next/headers"

export const dynamic = "force-dynamic"

export default async function PublicBlogPage() {
  const cookieStore = await cookies()
  const lang = cookieStore.get('NEXT_LOCALE')?.value || 'id'

  const posts = await prisma.blogPost.findMany({
    where: { status: "published" },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="w-full text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-transparent pointer-events-none"></div>

        <div className="relative z-10 w-full max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-md bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
            {lang === 'id' ? 'Wawasan & Pemikiran' : 'Insights & Thoughts'}
          </h1>
          <p className="text-lg text-purple-200/80 max-w-2xl mx-auto mb-8">
            {lang === 'id' ? 'Tulisan seputar teknologi, web development, dan pengalaman pribadi saya dalam memecahkan masalah.' : 'Articles about technology, web development, and my personal experiences in solving problems.'}
          </p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          {posts.length === 0 ? (
            <div className="text-center py-20 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md">
              <p className="text-white/50 text-lg">{lang === 'id' ? 'Belum ada artikel yang dipublikasikan saat ini.' : 'No articles published at the moment.'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Card 
                  key={post.id} 
                  className="group flex flex-col overflow-hidden bg-white/5 border-white/10 backdrop-blur-md text-white hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] transition-all duration-300"
                >
                  <Link href={`/blog/${post.slug}`} className="block relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={post.image || "/placeholder.svg?height=400&width=600"}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b0914] to-transparent opacity-60"></div>
                    {post.category && (
                      <Badge className="absolute top-4 left-4 bg-purple-600/80 backdrop-blur border-none hover:bg-purple-600">
                        {post.category}
                      </Badge>
                    )}
                  </Link>

                  <CardContent className="flex flex-col flex-1 p-6 pt-6">
                    <div className="flex items-center gap-4 text-xs text-white/50 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(post.createdAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{post.views}</span>
                      </div>
                    </div>

                    <Link href={`/blog/${post.slug}`} className="group-hover:text-purple-300 transition-colors">
                      <h3 className="text-xl font-bold mb-3 line-clamp-2 leading-tight">{post.title}</h3>
                    </Link>

                    <p className="text-white/60 text-sm line-clamp-3 mb-6 flex-1">
                      {post.excerpt}
                    </p>

                    <div className="mt-auto">
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.slice(0, 3).map((tag, idx) => (
                            <span key={idx} className="text-xs text-purple-300 bg-purple-500/10 px-2 py-1 rounded border border-purple-500/20">
                              #{tag}
                            </span>
                          ))}
                          {post.tags.length > 3 && (
                            <span className="text-xs text-white/40 px-1 py-1">+{post.tags.length - 3}</span>
                          )}
                        </div>
                      )}

                      <Link 
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        {lang === 'id' ? 'Baca selengkapnya' : 'Read more'} <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

