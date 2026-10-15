import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { enquiries } from "@/db/schema";
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
  const enquiryId = Number(id);
  if (!Number.isInteger(enquiryId)) {
    return NextResponse.json({ ok: false, error: "Bad id" }, { status: 400 });
  }

  let body: { isRead?: boolean };
  try {
    body = (await request.json()) as { isRead?: boolean };
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
  }

  const [updated] = await db
    .update(enquiries)
    .set({ isRead: Boolean(body.isRead) })
    .where(eq(enquiries.id, enquiryId))
    .returning();

  if (!updated) {
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, enquiry: updated });
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const enquiryId = Number(id);
  if (!Number.isInteger(enquiryId)) {
    return NextResponse.json({ ok: false, error: "Bad id" }, { status: 400 });
  }

  await db.delete(enquiries).where(eq(enquiries.id, enquiryId));
  return NextResponse.json({ ok: true });
}


