import { useState } from "react";
import { Link } from "wouter";
import { BookOpen, Calendar, ArrowRight } from "lucide-react";
import { Layout } from "@/components/layout";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useListBlogPosts } from "@workspace/api-client-react";

const CATEGORIES = ["All", "Tips & Guides", "Platform Updates", "Payments", "Policy"];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const { data: posts, isLoading } = useListBlogPosts(
    activeCategory !== "All" ? { category: activeCategory } : undefined
  );

  return (
    <Layout>
      <div className="py-10 border-b" style={{ backgroundColor: "#1a2744" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Badge
            className="mb-4 text-xs font-semibold uppercase tracking-widest border px-3 py-1"
            style={{ backgroundColor: "rgba(201,162,39,0.15)", color: "#c9a227", borderColor: "rgba(201,162,39,0.3)" }}
          >
            Resource Center
          </Badge>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 flex items-center gap-3">
            <BookOpen className="h-8 w-8" style={{ color: "#c9a227" }} />
            Articles &amp; Guides
          </h1>
          <p className="text-white/60 text-base max-w-xl">
            Practical guides, policy updates, and earning strategies for home verification workers.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-4 py-1.5 rounded-full text-sm font-medium border transition-all"
              style={
                activeCategory === cat
                  ? { backgroundColor: "#1a2744", color: "white", borderColor: "#1a2744" }
                  : { backgroundColor: "white", color: "#555", borderColor: "#ddd" }
              }
              data-testid={`filter-${cat.toLowerCase().replace(/\s/g, "-")}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Posts Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-64 rounded-2xl" />
            ))}
          </div>
        ) : !posts || posts.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="font-semibold text-lg">No articles found</p>
            <p className="text-sm mt-1">Check back soon for new guides and updates.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link href={`/blog/${post.slug}`} key={post.slug}>
                <div
                  className="bg-white border rounded-2xl overflow-hidden hover:shadow-lg transition-all cursor-pointer group h-full flex flex-col"
                  data-testid={`card-blog-${post.slug}`}
                >
                  {/* Featured image or placeholder */}
                  {post.featuredImageUrl ? (
                    <div className="h-44 overflow-hidden shrink-0">
                      <img
                        src={post.featuredImageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div
                      className="h-44 flex items-center justify-center shrink-0"
                      style={{ background: "linear-gradient(135deg, #1a2744 0%, #243560 100%)" }}
                    >
                      <BookOpen className="h-10 w-10 text-white/20" />
                    </div>
                  )}

                  <div className="p-5 flex flex-col flex-1">
                    <Badge variant="secondary" className="w-fit text-xs mb-3">
                      {post.category}
                    </Badge>
                    <h2 className="font-bold text-base leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2" style={{ color: "#1a2744" }}>
                      {post.title}
                    </h2>
                    <p className="text-xs text-muted-foreground leading-relaxed flex-1 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        {post.publishedAt
                          ? new Date(post.publishedAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : ""}
                      </div>
                      <span className="text-xs font-semibold flex items-center gap-1" style={{ color: "#c9a227" }}>
                        Read More <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
