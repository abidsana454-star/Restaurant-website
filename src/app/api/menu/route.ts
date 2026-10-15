import { NextResponse } from "next/server";
import { db } from "@/db";
import { menuItems } from "@/db/schema";
import { getMenu } from "@/lib/queries";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const menu = await getMenu();
  return NextResponse.json({ ok: true, ...menu });
}

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";
  const categoryId = Number(body.categoryId);
  const price = Number(body.price);
  const imageUrl = typeof body.imageUrl === "string" ? body.imageUrl.trim() : "";
  const spiceLevel = Number(body.spiceLevel ?? 0);

  if (!name || !description) {
    return NextResponse.json(
      { ok: false, error: "Name and description are required." },
      { status: 400 },
    );
  }

  if (!Number.isInteger(categoryId) || categoryId <= 0) {
    return NextResponse.json({ ok: false, error: "Pick a category." }, { status: 400 });
  }

  if (!Number.isFinite(price) || price <= 0) {
    return NextResponse.json({ ok: false, error: "Price must be a positive number." }, { status: 400 });
  }

  try {
    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .slice(0, 90);

    const [created] = await db
      .insert(menuItems)
      .values({
        name,
        description,
        slug: `${baseSlug}-${Date.now().toString(36).slice(-4)}`,
        categoryId,
        price: Math.round(price),
        imageUrl: imageUrl || null,
        spiceLevel: Number.isInteger(spiceLevel) ? Math.min(3, Math.max(0, spiceLevel)) : 0,
        isVegetarian: Boolean(body.isVegetarian),
        isSignature: Boolean(body.isSignature),
        isAvailable: true,
      })
      .returning();

    return NextResponse.json({ ok: true, item: created }, { status: 201 });
  } catch {
    return NextResponse.json({ ok: false, error: "Could not create dish." }, { status: 500 });
  }
}
