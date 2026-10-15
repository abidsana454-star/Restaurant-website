import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { menuItems } from "@/db/schema";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const itemId = Number(id);
  if (!Number.isInteger(itemId)) {
    return NextResponse.json({ ok: false, error: "Bad id" }, { status: 400 });
  }

  let body: { isAvailable?: boolean; isSignature?: boolean };
  try {
    body = (await request.json()) as { isAvailable?: boolean; isSignature?: boolean };
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
  }

  const patch: { isAvailable?: boolean; isSignature?: boolean } = {};
  if (typeof body.isAvailable === "boolean") patch.isAvailable = body.isAvailable;
  if (typeof body.isSignature === "boolean") patch.isSignature = body.isSignature;

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ ok: false, error: "Nothing to update" }, { status: 400 });
  }

  const [updated] = await db
    .update(menuItems)
    .set(patch)
    .where(eq(menuItems.id, itemId))
    .returning();

  if (!updated) {
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, item: updated });
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const itemId = Number(id);
  if (!Number.isInteger(itemId)) {
    return NextResponse.json({ ok: false, error: "Bad id" }, { status: 400 });
  }

  await db.delete(menuItems).where(eq(menuItems.id, itemId));
  return NextResponse.json({ ok: true });
}
