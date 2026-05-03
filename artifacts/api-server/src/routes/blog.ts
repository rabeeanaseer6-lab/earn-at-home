import { Router } from "express";
import { eq, desc, and } from "drizzle-orm";
import { db, blogPostsTable } from "@workspace/db";
import {
  CreateBlogPostBody,
  GetBlogPostParams,
  UpdateBlogPostParams,
  UpdateBlogPostBody,
  DeleteBlogPostParams,
  ListBlogPostsQueryParams,
} from "@workspace/api-zod";
import jwt from "jsonwebtoken";

const router = Router();

const JWT_SECRET = process.env.SESSION_SECRET ?? "secret";

function requireAdmin(req: any, res: any, next: any) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const token = auth.slice(7);
  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

function formatPost(p: any) {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    content: p.content,
    category: p.category,
    tags: p.tags ?? [],
    featuredImageUrl: p.featuredImageUrl ?? null,
    published: p.published,
    publishedAt: p.publishedAt ?? null,
    createdAt: p.createdAt,
  };
}

// GET /blog
router.get("/blog", async (req, res): Promise<void> => {
  const parsed = ListBlogPostsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { category, tag, limit } = parsed.data;
  let posts = await db
    .select()
    .from(blogPostsTable)
    .where(
      category
        ? and(eq(blogPostsTable.published, true), eq(blogPostsTable.category, category))
        : eq(blogPostsTable.published, true)
    )
    .orderBy(desc(blogPostsTable.publishedAt))
    .limit(limit ?? 50);

  if (tag) {
    posts = posts.filter((p) => (p.tags ?? []).includes(tag));
  }

  res.json(posts.map(formatPost));
});

// POST /blog
router.post("/blog", requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateBlogPostBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const existing = await db
    .select()
    .from(blogPostsTable)
    .where(eq(blogPostsTable.slug, parsed.data.slug));

  if (existing.length > 0) {
    res.status(400).json({ error: "Slug already exists" });
    return;
  }

  const [post] = await db
    .insert(blogPostsTable)
    .values({
      slug: parsed.data.slug,
      title: parsed.data.title,
      excerpt: parsed.data.excerpt,
      content: parsed.data.content,
      category: parsed.data.category,
      tags: parsed.data.tags ?? [],
      featuredImageUrl: parsed.data.featuredImageUrl ?? null,
      published: parsed.data.published ?? false,
      publishedAt: parsed.data.published ? new Date() : null,
    })
    .returning();

  res.status(201).json(formatPost(post));
});

// GET /blog/:slug
router.get("/blog/:slug", async (req, res): Promise<void> => {
  const params = GetBlogPostParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [post] = await db
    .select()
    .from(blogPostsTable)
    .where(eq(blogPostsTable.slug, params.data.slug));

  if (!post) {
    res.status(404).json({ error: "Blog post not found" });
    return;
  }

  res.json(formatPost(post));
});

// PATCH /blog/:slug
router.patch("/blog/:slug", requireAdmin, async (req, res): Promise<void> => {
  const params = UpdateBlogPostParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const body = UpdateBlogPostBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const updates: any = {
    title: body.data.title,
    excerpt: body.data.excerpt,
    content: body.data.content,
    category: body.data.category,
    tags: body.data.tags ?? [],
    published: body.data.published ?? false,
  };
  if (body.data.featuredImageUrl !== undefined) updates.featuredImageUrl = body.data.featuredImageUrl;
  if (body.data.published && !updates.publishedAt) updates.publishedAt = new Date();

  const [post] = await db
    .update(blogPostsTable)
    .set(updates)
    .where(eq(blogPostsTable.slug, params.data.slug))
    .returning();

  if (!post) {
    res.status(404).json({ error: "Blog post not found" });
    return;
  }

  res.json(formatPost(post));
});

// DELETE /blog/:slug
router.delete("/blog/:slug", requireAdmin, async (req, res): Promise<void> => {
  const params = DeleteBlogPostParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [deleted] = await db
    .delete(blogPostsTable)
    .where(eq(blogPostsTable.slug, params.data.slug))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Blog post not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
