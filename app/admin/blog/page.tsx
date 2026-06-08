"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Search, Filter, Eye, FileText, Calendar, Tag, Heart } from "lucide-react"
import { useCMSBlog } from "@/hooks/useCMS"
import type { BlogPost } from "@/lib/types"

export default function AdminBlog() {
  const { posts, createPost, updatePost, deletePost } = useCMSBlog()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    image: "",
    status: "draft" as "draft" | "published",
    tags: "",
    category: "",
  })

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === "all" || post.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      image: "",
      status: "draft",
      tags: "",
      category: "",
    })
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }

  const handleCreate = async () => {
    if (!formData.title || !formData.content) {
      alert("Please fill in required fields")
      return
    }

    setIsSubmitting(true)
    try {
      const slug = formData.slug || generateSlug(formData.title)
      const excerpt = formData.excerpt || formData.content.substring(0, 150) + "..."

      await createPost({
        ...formData,
        slug,
        excerpt,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      })

      setIsCreateDialogOpen(false)
      resetForm()
    } catch (error) {
      alert("Error creating post")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post)
    setFormData({
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      image: post.image || "",
      status: post.status,
      tags: post.tags.join(", "),
      category: post.category,
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdate = async () => {
    if (!editingPost || !formData.title || !formData.content) {
      alert("Please fill in required fields")
      return
    }

    setIsSubmitting(true)
    try {
      const slug = formData.slug || generateSlug(formData.title)
      const excerpt = formData.excerpt || formData.content.substring(0, 150) + "..."

      await updatePost(editingPost.id, {
        ...formData,
        slug,
        excerpt,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      })

      setIsEditDialogOpen(false)
      setEditingPost(null)
      resetForm()
    } catch (error) {
      alert("Error updating post")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return

    try {
      await deletePost(id)
    } catch (error) {
      alert("Error deleting post")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-500/20 text-green-300 border-green-500/30"
      case "draft":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
      default:
        return "bg-white/10 text-white/70 border-white/20"
    }
  }

  const publishedPosts = posts.filter((p) => p.status === "published")
  const draftPosts = posts.filter((p) => p.status === "draft")
  const totalViews = posts.reduce((sum, post) => sum + post.views, 0)
  const totalLikes = posts.reduce((sum, post) => sum + post.likes, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
        <div>
          <h1 className="text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">Blog Management</h1>
          <p className="text-white/60 mt-2">Create and manage your blog posts</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white border-0 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
          <Plus className="mr-2 h-4 w-4" />
          New Post
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white/5 backdrop-blur-xl border-white/10 relative overflow-hidden group hover:border-white/30 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-white/60">Total Posts</CardTitle>
            <div className="p-2 rounded-lg bg-black/20 border border-white/5">
              <FileText className="h-4 w-4 text-purple-400" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-bold text-white">{posts.length}</div>
            <p className="text-xs text-white/40 mt-1">All blog posts</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-xl border-white/10 relative overflow-hidden group hover:border-white/30 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-white/60">Published</CardTitle>
            <div className="p-2 rounded-lg bg-black/20 border border-white/5">
              <Eye className="h-4 w-4 text-green-400" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-bold text-white">{publishedPosts.length}</div>
            <p className="text-xs text-white/40 mt-1">Live posts</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-xl border-white/10 relative overflow-hidden group hover:border-white/30 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-white/60">Total Views</CardTitle>
            <div className="p-2 rounded-lg bg-black/20 border border-white/5">
              <Eye className="h-4 w-4 text-blue-400" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-bold text-white">{totalViews.toLocaleString()}</div>
            <p className="text-xs text-white/40 mt-1">Post views</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-xl border-white/10 relative overflow-hidden group hover:border-white/30 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-white/60">Total Likes</CardTitle>
            <div className="p-2 rounded-lg bg-black/20 border border-white/5">
              <Heart className="h-4 w-4 text-pink-400" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-bold text-white">{totalLikes.toLocaleString()}</div>
            <p className="text-xs text-white/40 mt-1">Post likes</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-white/5 backdrop-blur-xl border-white/10">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-white/40" />
              <Input
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-black/40 border-white/10 text-white focus:border-purple-500/50 focus:ring-purple-500/20"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-black/40 border-white/10 text-white">
                <Filter className="mr-2 h-4 w-4 text-white/40" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a142c] border-white/10 text-white">
                <SelectItem value="all" className="focus:bg-purple-600/30 focus:text-white">All Status</SelectItem>
                <SelectItem value="published" className="focus:bg-purple-600/30 focus:text-white">Published</SelectItem>
                <SelectItem value="draft" className="focus:bg-purple-600/30 focus:text-white">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <Card key={post.id} className="bg-white/5 backdrop-blur-xl border-white/10 hover:border-white/30 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 mr-6">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-semibold text-white">{post.title}</h3>
                    <Badge variant="outline" className={getStatusColor(post.status)}>{post.status}</Badge>
                  </div>

                  <p className="text-white/60 mb-4 line-clamp-2 leading-relaxed">{post.excerpt}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-6 text-sm text-white/40">
                    <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-full border border-white/5">
                      <Calendar className="h-4 w-4 text-blue-400" />
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-full border border-white/5">
                      <Eye className="h-4 w-4 text-green-400" />
                      <span>{post.views} views</span>
                    </div>
                    <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-full border border-white/5">
                      <Heart className="h-4 w-4 text-pink-400" />
                      <span>{post.likes} likes</span>
                    </div>
                    {post.category && (
                      <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-full border border-white/5">
                        <span className="text-purple-400">Category:</span>
                        <span>{post.category}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button size="icon" variant="outline" onClick={() => handleEdit(post)} className="bg-transparent border-blue-500/50 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 h-9 w-9">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="destructive" onClick={() => handleDelete(post.id, post.title)} className="bg-transparent border-red-500/50 text-red-400 hover:bg-red-500/20 hover:text-red-300 h-9 w-9">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <Card className="bg-white/5 backdrop-blur-xl border-white/10 border-dashed border-2">
          <CardContent className="text-center py-12">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="h-10 w-10 text-white/20" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">No posts found</h3>
            <p className="text-white/50 mb-8 max-w-md mx-auto">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Start by creating your first blog post to share your thoughts"}
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white border-0 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Post
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create / Edit Dialog */}
      {(() => {
        const DialogForm = ({ isOpen, setIsOpen, isEdit }: { isOpen: boolean, setIsOpen: (val: boolean) => void, isEdit: boolean }) => (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-[#1a142c] border border-purple-500/30 text-white shadow-[0_0_50px_rgba(0,0,0,0.8)]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                  {isEdit ? "Edit Blog Post" : "Create New Blog Post"}
                </DialogTitle>
                <DialogDescription className="text-white/50">
                  {isEdit ? "Update your blog post" : "Write a new blog post for your portfolio"}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                <div className="bg-black/30 p-5 rounded-xl border border-white/5 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={isEdit ? "edit-title" : "title"} className="text-white/80">Title <span className="text-red-400">*</span></Label>
                      <Input
                        id={isEdit ? "edit-title" : "title"}
                        value={formData.title}
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            title: e.target.value,
                            slug: generateSlug(e.target.value),
                          }))
                        }}
                        placeholder="Enter post title"
                        className="bg-black/50 border-white/10 text-white focus:border-purple-500/50 focus:ring-purple-500/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={isEdit ? "edit-slug" : "slug"} className="text-white/80">Slug</Label>
                      <Input
                        id={isEdit ? "edit-slug" : "slug"}
                        value={formData.slug}
                        onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                        placeholder="post-url-slug"
                        className="bg-black/50 border-white/10 text-white focus:border-purple-500/50 focus:ring-purple-500/20 font-mono text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={isEdit ? "edit-excerpt" : "excerpt"} className="text-white/80">Excerpt</Label>
                    <Textarea
                      id={isEdit ? "edit-excerpt" : "excerpt"}
                      value={formData.excerpt}
                      onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
                      placeholder="Brief description of the post"
                      rows={2}
                      className="bg-black/50 border-white/10 text-white focus:border-purple-500/50 focus:ring-purple-500/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={isEdit ? "edit-content" : "content"} className="text-white/80">Content <span className="text-red-400">*</span></Label>
                    <Textarea
                      id={isEdit ? "edit-content" : "content"}
                      value={formData.content}
                      onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                      placeholder="Write your blog post content here (Markdown supported)..."
                      rows={12}
                      className="bg-black/50 border-white/10 text-white focus:border-purple-500/50 focus:ring-purple-500/20 font-mono text-sm leading-relaxed"
                    />
                  </div>
                </div>

                <div className="bg-black/30 p-5 rounded-xl border border-white/5 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={isEdit ? "edit-category" : "category"} className="text-white/80">Category</Label>
                      <Input
                        id={isEdit ? "edit-category" : "category"}
                        value={formData.category}
                        onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                        placeholder="e.g., Technology, Tutorial"
                        className="bg-black/50 border-white/10 text-white focus:border-purple-500/50 focus:ring-purple-500/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={isEdit ? "edit-tags" : "tags"} className="text-white/80">Tags</Label>
                      <Input
                        id={isEdit ? "edit-tags" : "tags"}
                        value={formData.tags}
                        onChange={(e) => setFormData((prev) => ({ ...prev, tags: e.target.value }))}
                        placeholder="react, javascript (comma separated)"
                        className="bg-black/50 border-white/10 text-white focus:border-purple-500/50 focus:ring-purple-500/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={isEdit ? "edit-image" : "image"} className="text-white/80">Featured Image URL</Label>
                      <Input
                        id={isEdit ? "edit-image" : "image"}
                        value={formData.image}
                        onChange={(e) => setFormData((prev) => ({ ...prev, image: e.target.value }))}
                        placeholder="https://example.com/image.jpg"
                        className="bg-black/50 border-white/10 text-white focus:border-purple-500/50 focus:ring-purple-500/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={isEdit ? "edit-status" : "status"} className="text-white/80">Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value: "draft" | "published") => setFormData((prev) => ({ ...prev, status: value }))}
                      >
                        <SelectTrigger className="bg-black/50 border-white/10 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1a142c] border-white/10 text-white">
                          <SelectItem value="draft" className="focus:bg-purple-600/30 focus:text-white">Draft</SelectItem>
                          <SelectItem value="published" className="focus:bg-purple-600/30 focus:text-white text-green-400">Published</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsOpen(false)} className="bg-transparent border-white/20 text-white hover:bg-white/10">
                  Cancel
                </Button>
                <Button onClick={isEdit ? handleUpdate : handleCreate} disabled={isSubmitting} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white border-0 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                  {isSubmitting ? (isEdit ? "Updating..." : "Creating...") : (isEdit ? "Update Post" : "Create Post")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )

        return (
          <>
            {DialogForm({ isOpen: isCreateDialogOpen, setIsOpen: setIsCreateDialogOpen, isEdit: false })}
            {DialogForm({ isOpen: isEditDialogOpen, setIsOpen: setIsEditDialogOpen, isEdit: true })}
          </>
        )
      })()}
    </div>
  )
}
