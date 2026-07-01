import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Calendar, Eye, Heart, Tag, ArrowLeft, Clock } from "lucide-react"
import { cookies } from "next/headers"

export const revalidate = 60 // Revalidate every minute

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  
  const cookieStore = await cookies()
  const lang = cookieStore.get('NEXT_LOCALE')?.value || 'id'

  const post = await prisma.blogPost.findUnique({
    where: { slug },
  })

  if (!post || post.status !== "published") {
    notFound()
  }

  // Increment views in the background (we don't await this to keep the page load fast)
  prisma.blogPost.update({
    where: { id: post.id },
    data: { views: { increment: 1 } },
  }).catch(console.error)

  // Estimate reading time (roughly 200 words per minute)
  const wordCount = post.content.split(/\s+/).length
  const readingTime = Math.ceil(wordCount / 200)

  return (
    <article className="w-full text-white min-h-screen pb-20">
      {/* Article Header */}
      <header className="relative pt-24 pb-12 px-4 max-w-4xl mx-auto">
        <Link 
          href="/blog" 
          className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {lang === 'id' ? 'Kembali ke Blog' : 'Back to Blog'}
        </Link>

        {post.category && (
          <div className="mb-6">
            <span className="text-sm font-medium tracking-wider uppercase text-purple-300">
              {post.category}
            </span>
          </div>
        )}

        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 drop-shadow-sm">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-6 text-sm text-white/50 mb-8 border-y border-white/10 py-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <time dateTime={post.createdAt.toISOString()}>
              {post.createdAt.toLocaleDateString(lang === 'id' ? "id-ID" : "en-US", { day: 'numeric', month: 'long', year: 'numeric' })}
            </time>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{readingTime} {lang === 'id' ? 'mnt baca' : 'min read'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span>{post.views + 1} {lang === 'id' ? 'dilihat' : 'views'}</span>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      {post.image && (
        <div className="max-w-5xl mx-auto px-4 mb-12">
          <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      )}

      {/* Article Content */}
      <div className="max-w-3xl mx-auto px-4">
        <div className="prose prose-invert prose-purple lg:prose-lg max-w-none prose-img:rounded-2xl prose-a:text-purple-400 hover:prose-a:text-purple-300">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-16 pt-8 border-t border-white/10">
            <div className="flex flex-wrap gap-3">
              {post.tags.map((tag, idx) => (
                <span 
                  key={idx} 
                  className="flex items-center text-sm text-purple-200 bg-purple-500/10 px-3 py-1.5 rounded-lg border border-purple-500/20"
                >
                  <Tag className="w-3 h-3 mr-1.5 opacity-70" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  )
}
