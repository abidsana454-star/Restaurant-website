import { and, asc, desc, eq, ne, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  categories,
  enquiries,
  menuItems,
  orders,
  posts,
  reservations,
  testimonials,
  type Category,
  type MenuItem,
} from "@/db/schema";
import { ensureSeeded } from "@/lib/seed";

export type MenuItemWithCategory = MenuItem & {
  categorySlug: string;
  categoryName: string;
};

export async function getMenu(): Promise<{
  categories: Category[];
  items: MenuItemWithCategory[];
}> {
  await ensureSeeded();

  const [cats, items] = await Promise.all([
    db.select().from(categories).orderBy(asc(categories.sortOrder)),
    db
      .select({
        item: menuItems,
        categorySlug: categories.slug,
        categoryName: categories.name,
      })
      .from(menuItems)
      .innerJoin(categories, eq(menuItems.categoryId, categories.id))
      .orderBy(asc(categories.sortOrder), asc(menuItems.id)),
  ]);

  return {
    categories: cats,
    items: items.map((row) => ({
      ...row.item,
      categorySlug: row.categorySlug,
      categoryName: row.categoryName,
    })),
  };
}

export async function getSignatureDishes(limit = 6) {
  const { items } = await getMenu();
  return items
    .filter((item) => item.isSignature && item.isAvailable)
    .slice(0, limit);
}

export async function getDishBySlug(slug: string) {
  await ensureSeeded();
  const rows = await db
    .select({
      item: menuItems,
      categorySlug: categories.slug,
      categoryName: categories.name,
    })
    .from(menuItems)
    .innerJoin(categories, eq(menuItems.categoryId, categories.id))
    .where(eq(menuItems.slug, slug))
    .limit(1);

  const row = rows[0];
  if (!row) return null;

  const related = await db
    .select({
      item: menuItems,
      categorySlug: categories.slug,
      categoryName: categories.name,
    })
    .from(menuItems)
    .innerJoin(categories, eq(menuItems.categoryId, categories.id))
    .where(and(eq(menuItems.categoryId, row.item.categoryId), ne(menuItems.id, row.item.id)))
    .limit(3);

  return {
    dish: {
      ...row.item,
      categorySlug: row.categorySlug,
      categoryName: row.categoryName,
    } as MenuItemWithCategory,
    related: related.map((r) => ({
      ...r.item,
      categorySlug: r.categorySlug,
      categoryName: r.categoryName,
    })) as MenuItemWithCategory[],
  };
}

export async function getTestimonials() {
  await ensureSeeded();
  return db
    .select()
    .from(testimonials)
    .where(eq(testimonials.isActive, true))
    .orderBy(asc(testimonials.id));
}

export async function getPosts(limit?: number) {
  await ensureSeeded();
  const query = db.select().from(posts).orderBy(desc(posts.publishedAt));
  return limit ? query.limit(limit) : query;
}

export async function getPostBySlug(slug: string) {
  await ensureSeeded();
  const rows = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1);
  return rows[0] ?? null;
}

export async function getReservations() {
  return db.select().from(reservations).orderBy(desc(reservations.createdAt));
}

export async function getOrders() {
  return db.select().from(orders).orderBy(desc(orders.createdAt));
}

export async function getEnquiries() {
  return db.select().from(enquiries).orderBy(desc(enquiries.createdAt));
}

export type DashboardStats = {
  totalReservations: number;
  pending: number;
  coversToday: number;
  totalOrders: number;
  openOrders: number;
  orderRevenue: number;
  unreadEnquiries: number;
  dishCount: number;
};

export async function getDashboardStats(): Promise<DashboardStats> {
  await ensureSeeded();

  const today = new Date().toISOString().slice(0, 10);

  const [reservationRows, todayRows, orderRows, openOrderRows, revenueRows, unreadRows, dishRows] =
    await Promise.all([
      db
        .select({ status: reservations.status, count: sql<number>`count(*)::int` })
        .from(reservations)
        .groupBy(reservations.status),
      db
        .select({ covers: sql<number>`coalesce(sum(${reservations.guests}), 0)::int` })
        .from(reservations)
        .where(eq(reservations.date, today)),
      db.select({ count: sql<number>`count(*)::int` }).from(orders),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(orders)
        .where(ne(orders.status, "delivered")),
      db.select({ total: sql<number>`coalesce(sum(${orders.total}), 0)::int` }).from(orders),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(enquiries)
        .where(eq(enquiries.isRead, false)),
      db.select({ count: sql<number>`count(*)::int` }).from(menuItems),
    ]);

  const byStatus = new Map(reservationRows.map((row) => [row.status, row.count]));

  return {
    totalReservations: reservationRows.reduce((sum, row) => sum + row.count, 0),
    pending: byStatus.get("pending") ?? 0,
    coversToday: todayRows[0]?.covers ?? 0,
    totalOrders: orderRows[0]?.count ?? 0,
    openOrders: openOrderRows[0]?.count ?? 0,
    orderRevenue: revenueRows[0]?.total ?? 0,
    unreadEnquiries: unreadRows[0]?.count ?? 0,
    dishCount: dishRows[0]?.count ?? 0,
  };
}
