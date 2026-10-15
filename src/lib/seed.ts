import { sql } from "drizzle-orm";
import { db } from "@/db";
import {
  categories,
  menuItems,
  posts,
  testimonials,
} from "@/db/schema";
import {
  seedCategories,
  seedMenuItems,
  seedPosts,
  seedTestimonials,
} from "@/db/seed-data";

let seedPromise: Promise<void> | null = null;

async function runSeed() {
  const existing = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(categories);

  if ((existing[0]?.count ?? 0) > 0) return;

  const insertedCategories = await db
    .insert(categories)
    .values(
      seedCategories.map((category) => ({
        name: category.name,
        slug: category.slug,
        tagline: category.tagline,
        sortOrder: category.sortOrder,
      })),
    )
    .onConflictDoNothing()
    .returning();

  const allCategories = insertedCategories.length
    ? insertedCategories
    : await db.select().from(categories);

  const bySlug = new Map(allCategories.map((c) => [c.slug, c.id]));

  const rows = seedMenuItems
    .map(({ categorySlug, ...item }) => {
      const categoryId = bySlug.get(categorySlug);
      return categoryId ? { ...item, categoryId } : null;
    })
    .filter((row): row is NonNullable<typeof row> => row !== null);

  if (rows.length) {
    await db.insert(menuItems).values(rows).onConflictDoNothing();
  }

  const [tCount, pCount] = await Promise.all([
    db.select({ count: sql<number>`count(*)::int` }).from(testimonials),
    db.select({ count: sql<number>`count(*)::int` }).from(posts),
  ]);

  if ((tCount[0]?.count ?? 0) === 0) {
    await db.insert(testimonials).values(seedTestimonials);
  }

  if ((pCount[0]?.count ?? 0) === 0) {
    await db.insert(posts).values(seedPosts);
  }
}

export async function ensureSeeded() {
  if (!seedPromise) {
    seedPromise = runSeed().catch((error) => {
      seedPromise = null;
      throw error;
    });
  }
  await seedPromise;
}
