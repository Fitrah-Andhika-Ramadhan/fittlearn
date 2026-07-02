import { prisma } from "@/lib/prisma"
import Link from "next/link"
import Image from "next/image"
import { Calendar, ArrowRight, Clock, ChevronLeft, ChevronRight } from "lucide-react"
import { cookies } from "next/headers"
import { unstable_cache } from "next/cache"

export const dynamic = "force-dynamic"

export default async function PublicBlogPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const cookieStore = await cookies()
  const lang = cookieStore.get('NEXT_LOCALE')?.value || 'id'
  
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page) || 1;
  const limit = 4;
  const skip = (page - 1) * limit;

  // Cache the blog posts query for 60 seconds to make page loads instant
  const getCachedPosts = unstable_cache(
    async (limit: number, skip: number) => {
      const [posts, totalPosts] = await Promise.all([
        prisma.blogPost.findMany({
          where: { status: "published" },
          orderBy: { createdAt: "desc" },
          take: limit,
          skip: skip
        }),
        prisma.blogPost.count({
          where: { status: "published" }
        })
      ])
      return { posts, totalPosts }
    },
    ['blog-posts'],
    { revalidate: 60, tags: ['blog'] }
  )

  const { posts, totalPosts } = await getCachedPosts(limit, skip);
  
  const totalPages = Math.ceil(totalPosts / limit);

  return (
    <div className="w-full text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 to-transparent pointer-events-none"></div>

        <div className="relative z-10 w-full max-w-4xl mx-auto text-center">
          <div className="inline-block px-5 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-white/70 mb-6 backdrop-blur-md">
            {lang === 'id' ? 'Wawasan & Pemikiran' : 'Insights & Thoughts'}
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-md tracking-tight">
            The Digital <span className="text-blue-500">Journal</span>
          </h1>
          
          <p className="text-sm md:text-base text-purple-200/60 max-w-2xl mx-auto mb-8 font-light leading-relaxed">
            {lang === 'id' 
              ? 'Mengeksplorasi titik temu antara analisis sistem, pengembangan web modern, dan inovasi digital. Kumpulan pelajaran, tutorial, dan tren teknologi.' 
              : 'Exploring the intersections of systems analysis, modern web development, and digital innovation. A collection of lessons, tutorials, and tech trends.'}
          </p>
        </div>
      </section>

      {/* Blog Posts Stacked List */}
      <section className="py-8 px-4 pb-24">
        <div className="container mx-auto max-w-4xl">
          {posts.length === 0 ? (
            <div className="text-center py-20 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md">
              <p className="text-white/50 text-lg">{lang === 'id' ? 'Belum ada artikel yang dipublikasikan saat ini.' : 'No articles published at the moment.'}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {posts.map((post) => {
                const wordCount = post.content ? post.content.split(/\s+/).length : 0;
                const readTime = Math.max(1, Math.ceil(wordCount / 200));

                return (
                  <div 
                    key={post.id} 
                    className="group flex flex-col md:flex-row gap-6 md:gap-8 p-4 md:p-6 bg-[#13141f]/80 backdrop-blur-md border border-white/5 rounded-[2rem] hover:border-purple-500/30 hover:bg-[#161726] transition-all duration-500"
                  >
                    {/* Thumbnail */}
                    <Link href={`/blog/${post.slug}`} className="block relative w-full md:w-5/12 aspect-[4/3] rounded-2xl overflow-hidden shrink-0 bg-black/40">
                      <Image
                        src={post.image || "/placeholder.svg?height=400&width=600"}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80"></div>
                    </Link>

                    {/* Content */}
                    <div className="flex flex-col justify-center py-2 flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        {post.category && (
                          <span className="px-3 py-1 rounded-full border border-purple-500/30 text-[10px] font-bold text-purple-300 tracking-wider">
                            {post.category.toUpperCase()}
                          </span>
                        )}
                        
                        <div className="flex items-center text-xs text-white/40 gap-1.5 font-medium">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{new Date(post.createdAt).toLocaleDateString(lang === 'id' ? "id-ID" : "en-US", { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        
                        <div className="flex items-center text-xs text-white/40 gap-1.5 font-medium">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{readTime} {lang === 'id' ? 'mnt baca' : 'min read'}</span>
                        </div>
                      </div>

                      <Link href={`/blog/${post.slug}`}>
                        <h2 className="text-2xl md:text-[1.7rem] font-bold text-white mb-3 leading-snug group-hover:text-purple-300 transition-colors">
                          {post.title}
                        </h2>
                      </Link>

                      <p className="text-sm text-white/50 leading-relaxed mb-6 line-clamp-3">
                        {post.excerpt}
                      </p>

                      <Link 
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center text-sm font-medium text-purple-500 hover:text-purple-400 transition-colors mt-auto"
                      >
                        {lang === 'id' ? 'Lanjutkan Membaca' : 'Continue Reading'} <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              {page > 1 ? (
                <Link href={`/blog?page=${page - 1}`} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </Link>
              ) : (
                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-white/20 cursor-not-allowed">
                  <ChevronLeft className="w-4 h-4" />
                </div>
              )}
              
              {Array.from({ length: totalPages }).map((_, i) => {
                const p = i + 1;
                return (
                  <Link 
                    key={p} 
                    href={`/blog?page=${p}`}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-semibold transition-all duration-300 ${
                      page === p 
                        ? 'bg-[#5a67d8] text-white shadow-[0_0_15px_rgba(90,103,216,0.5)]' 
                        : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {p}
                  </Link>
                )
              })}

              {page < totalPages ? (
                <Link href={`/blog?page=${page + 1}`} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </Link>
              ) : (
                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-white/20 cursor-not-allowed">
                  <ChevronRight className="w-4 h-4" />
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
