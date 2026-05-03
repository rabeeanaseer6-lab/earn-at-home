import { Link, useParams } from "wouter";
import { ArrowLeft, Calendar, Tag, BookOpen } from "lucide-react";
import { Layout } from "@/components/layout";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useGetBlogPost, useListBlogPosts } from "@workspace/api-client-react";

export default function BlogPostPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const { data: post, isLoading, isError } = useGetBlogPost(slug, { query: { enabled: !!slug } });
  const { data: allPosts } = useListBlogPosts(undefined, { query: { enabled: !!post } });

  const related = allPosts
    ? allPosts.filter((p) => p.slug !== slug && p.category === post?.category).slice(0, 3)
    : [];

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-6">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-64 w-full" />
        </div>
      </Layout>
    );
  }

  if (isError || !post) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">
          <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
          <h1 className="text-2xl font-bold mb-2" style={{ color: "#1a2744" }}>
            Article not found
          </h1>
          <p className="text-muted-foreground mb-6">
            This article may have been removed or the link is incorrect.
          </p>
          <Link href="/blog">
            <Button>Back to Blog</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* MAIN ARTICLE */}
          <article className="flex-1 min-w-0">
            <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to Resource Center
            </Link>

            <Badge variant="secondary" className="mb-4">
              {post.category}
            </Badge>

            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4" style={{ color: "#1a2744" }}>
              {post.title}
            </h1>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6 flex-wrap">
              {post.publishedAt && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(post.publishedAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              )}
              {post.tags && post.tags.length > 0 && (
                <span className="flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5" />
                  {post.tags.join(", ")}
                </span>
              )}
            </div>

            {/* Hero featured image */}
            {post.featuredImageUrl && (
              <div className="rounded-2xl overflow-hidden mb-8 shadow-md">
                <img
                  src={post.featuredImageUrl}
                  alt={post.title}
                  className="w-full object-cover max-h-80"
                />
              </div>
            )}

            <div
              className="prose prose-sm max-w-none prose-headings:font-bold prose-headings:text-[#1a2744] prose-a:text-[#c9a227] prose-a:no-underline hover:prose-a:underline"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>

          {/* SIDEBAR */}
          <aside className="w-full lg:w-72 shrink-0">
            {related.length > 0 && (
              <div className="bg-white border rounded-2xl p-5 sticky top-20">
                <h3 className="font-bold text-sm uppercase tracking-wider mb-4" style={{ color: "#1a2744" }}>
                  Related Articles
                </h3>
                <div className="space-y-4">
                  {related.map((r) => (
                    <Link href={`/blog/${r.slug}`} key={r.slug}>
                      <div className="group cursor-pointer">
                        <Badge variant="outline" className="text-xs mb-1">
                          {r.category}
                        </Badge>
                        <p className="text-sm font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2" style={{ color: "#1a2744" }}>
                          {r.title}
                        </p>
                        {r.publishedAt && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(r.publishedAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div
              className="mt-6 border rounded-2xl p-5"
              style={{ backgroundColor: "rgba(201,162,39,0.07)", borderColor: "rgba(201,162,39,0.25)" }}
            >
              <h3 className="font-bold text-sm mb-2" style={{ color: "#1a2744" }}>
                Calculate Your Earnings
              </h3>
              <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                Use our earnings calculator to estimate how much you can make per month.
              </p>
              <Link href="/calculator">
                <Button size="sm" className="w-full">
                  Open Calculator
                </Button>
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
}
