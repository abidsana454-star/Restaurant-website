import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { enquiries } from "@/db/schema";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

const allowedKinds = new Set([
  "general",
  "event",
  "careers",
  "feedback",
  "press",
]);

function str(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function int(value: unknown) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const kindRaw = str(body.kind);
  const kind = allowedKinds.has(kindRaw) ? kindRaw : "general";

  const name = str(body.name);
  const email = str(body.email);
  const phone = str(body.phone);
  const subject = str(body.subject);
  const text = str(body.body);
  const eventType = str(body.eventType);
  const budget = str(body.budget);
  const eventDate = str(body.eventDate);
  const guests = int(body.guests);

  if (!name || !email || !text) {
    return NextResponse.json(
      { ok: false, error: "Name, email and message are required." },
      { status: 400 },
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { ok: false, error: "That email does not look right." },
      { status: 400 },
    );
  }

  try {
    const [created] = await db
      .insert(enquiries)
      .values({
        kind,
        name,
        email,
        phone: phone || null,
        eventType: eventType || null,
        guests,
        budget: budget || null,
        eventDate: eventDate || null,
        subject: subject || null,
        body: text,
      })
      .returning();

    return NextResponse.json({ ok: true, enquiry: created }, { status: 201 });
  } catch {
    return NextResponse.json(
      { ok: false, error: "We could not send that message. Please try again." },
      { status: 500 },
    );
  }
}

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const rows = await db.select().from(enquiries).where(eq(enquiries.isRead, false));
  return NextResponse.json({ ok: true, enquiries: rows });
}
