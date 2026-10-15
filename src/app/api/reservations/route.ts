import { NextResponse } from "next/server";
import { db } from "@/db";
import { reservations } from "@/db/schema";

export const dynamic = "force-dynamic";

type Payload = Record<string, unknown>;

function str(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const name = str(body.name);
  const email = str(body.email);
  const phone = str(body.phone);
  const date = str(body.date);
  const time = str(body.time);
  const occasion = str(body.occasion);
  const notes = str(body.notes);
  const guests = Number(body.guests);

  const missing = [name, email, phone, date, time].some((field) => !field);
  if (missing) {
    return NextResponse.json(
      { ok: false, error: "Please fill in your name, phone, email, date and time." },
      { status: 400 },
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "That email does not look right." }, { status: 400 });
  }

  if (!Number.isInteger(guests) || guests < 1 || guests > 20) {
    return NextResponse.json(
      { ok: false, error: "Guests must be between 1 and 20. Larger parties: call us." },
      { status: 400 },
    );
  }

  try {
    const [created] = await db
      .insert(reservations)
      .values({
        name,
        email,
        phone,
        date,
        time,
        guests,
        occasion: occasion || null,
        notes: notes || null,
      })
      .returning();

    return NextResponse.json({ ok: true, reservation: created }, { status: 201 });
  } catch {
    return NextResponse.json(
      { ok: false, error: "We could not save that booking. Please try again." },
      { status: 500 },
    );
  }
}
