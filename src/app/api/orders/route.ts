import { NextResponse } from "next/server";
import { inArray } from "drizzle-orm";
import { db } from "@/db";
import { menuItems, orders } from "@/db/schema";
import { site } from "@/lib/site";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

type IncomingLine = { id: number; qty: number };

function str(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const rows = await db.select().from(orders);
  return NextResponse.json({ ok: true, orders: rows });
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const customerName = str(body.customerName);
  const email = str(body.email);
  const phone = str(body.phone);
  const fulfilment = str(body.fulfilment) === "delivery" ? "delivery" : "pickup";
  const address = str(body.address);
  const scheduledFor = str(body.scheduledFor);
  const paymentMethod = str(body.paymentMethod) || "cash";

  const rawLines = Array.isArray(body.items) ? body.items : [];
  const incoming: IncomingLine[] = rawLines
    .map((line) => {
      const record = line as Record<string, unknown>;
      const id = Number(record.id);
      const qty = Number(record.qty);
      return Number.isInteger(id) && id > 0 && Number.isInteger(qty) && qty > 0
        ? { id, qty: Math.min(50, qty) }
        : null;
    })
    .filter((line): line is IncomingLine => line !== null);

  if (!customerName || !email || !phone) {
    return NextResponse.json(
      { ok: false, error: "Name, email and phone are required." },
      { status: 400 },
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { ok: false, error: "That email does not look right." },
      { status: 400 },
    );
  }

  if (incoming.length === 0) {
    return NextResponse.json({ ok: false, error: "Your bag is empty." }, { status: 400 });
  }

  if (fulfilment === "delivery" && !address) {
    return NextResponse.json(
      { ok: false, error: "Please add a delivery address." },
      { status: 400 },
    );
  }

  try {
    // Price is always resolved server-side from the database.
    const rows = await db
      .select({ id: menuItems.id, name: menuItems.name, price: menuItems.price })
      .from(menuItems)
      .where(
        inArray(
          menuItems.id,
          incoming.map((line) => line.id),
        ),
      );

    if (rows.length === 0) {
      return NextResponse.json(
        { ok: false, error: "Those dishes are no longer available." },
        { status: 400 },
      );
    }

    const priceMap = new Map(rows.map((row) => [row.id, row]));
    const items = incoming
      .map((line) => {
        const dish = priceMap.get(line.id);
        return dish ? { id: dish.id, name: dish.name, price: dish.price, qty: line.qty } : null;
      })
      .filter((line): line is NonNullable<typeof line> => line !== null);

    const subtotal = items.reduce((sum, line) => sum + line.price * line.qty, 0);
    const deliveryFee =
      fulfilment === "delivery" && subtotal < site.freeDeliveryOver ? site.deliveryFee : 0;

    const [created] = await db
      .insert(orders)
      .values({
        customerName,
        email,
        phone,
        fulfilment,
        address: fulfilment === "delivery" ? address : null,
        scheduledFor: scheduledFor || null,
        paymentMethod,
        items,
        subtotal,
        deliveryFee,
        total: subtotal + deliveryFee,
      })
      .returning();

    return NextResponse.json({ ok: true, order: created }, { status: 201 });
  } catch {
    return NextResponse.json(
      { ok: false, error: "We could not place that order. Please try again." },
      { status: 500 },
    );
  }
}
