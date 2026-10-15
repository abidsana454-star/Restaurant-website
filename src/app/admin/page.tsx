import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/admin/login-form";
import {
  DishManager,
  EnquiriesBoard,
  LogoutButton,
  OrdersBoard,
  ReservationsBoard,
} from "@/components/admin/boards";
import { isAdmin } from "@/lib/auth";
import {
  getDashboardStats,
  getEnquiries,
  getMenu,
  getOrders,
  getReservations,
} from "@/lib/queries";
import { formatDateLabel, formatPrice } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Staff Dashboard",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const authed = await isAdmin();

  if (!authed) {
    return (
      <section className="shell flex min-h-screen items-center justify-center py-32">
        <LoginForm />
      </section>
    );
  }

  const [stats, reservations, orders, enquiries, menu] = await Promise.all([
    getDashboardStats(),
    getReservations(),
    getOrders(),
    getEnquiries(),
    getMenu(),
  ]);

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = reservations
    .filter((row) => row.date >= today && row.status !== "cancelled")
    .sort((a, b) =>
      a.date === b.date ? a.time.localeCompare(b.time) : a.date.localeCompare(b.date),
    )
    .slice(0, 6);

  const cards = [
    { label: "Bookings", value: String(stats.totalReservations), hint: `${stats.pending} pending` },
    { label: "Covers today", value: String(stats.coversToday), hint: formatDateLabel(today) },
    { label: "Online orders", value: String(stats.totalOrders), hint: `${stats.openOrders} open` },
    {
      label: "Order revenue",
      value: formatPrice(stats.orderRevenue),
      hint: "All time, ex-vat",
    },
    { label: "Unread messages", value: String(stats.unreadEnquiries), hint: "Contact + events" },
    { label: "Dishes live", value: String(stats.dishCount), hint: "Across all courses" },
  ];

  const sections = [
    { id: "reservations", title: "Reservations", rows: reservations },
    { id: "orders", title: "Online orders", rows: orders },
    { id: "enquiries", title: "Messages & enquiries", rows: enquiries },
  ];

  return (
    <section className="shell py-32">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow">Front desk</p>
          <h1 className="display mt-3 text-4xl">Service dashboard</h1>
          <p className="mt-3 text-sm text-cream/55">
            Bookings, online orders, messages and the live menu — all in one place.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/" className="btn-ghost !px-5 !py-2.5 !text-[0.62rem]">
            View site
          </Link>
          <LogoutButton />
        </div>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {cards.map((card) => (
          <div key={card.label} className="card p-6">
            <p className="text-[0.58rem] uppercase tracking-[0.2em] text-cream/40">
              {card.label}
            </p>
            <p className="display mt-3 text-2xl text-gold">{card.value}</p>
            <p className="mt-1 text-[0.68rem] text-cream/35">{card.hint}</p>
          </div>
        ))}
      </div>

      {upcoming.length > 0 ? (
        <div className="card mt-8 p-6">
          <p className="eyebrow">Next up</p>
          <ul className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-6">
            {upcoming.map((row) => (
              <li key={row.id} className="rounded-xl border border-cream/10 p-4">
                <p className="font-display text-base">{row.name}</p>
                <p className="mt-1 text-xs text-cream/50">
                  {formatDateLabel(row.date)} · {row.time}
                </p>
                <p className="mt-1 text-xs text-gold">{row.guests} guests</p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {sections.map((section) => (
        <div key={section.id} className="mt-16">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="display text-2xl">{section.title}</h2>
            <span className="text-[0.62rem] uppercase tracking-[0.2em] text-cream/40">
              {section.rows.length} {section.rows.length === 1 ? "entry" : "entries"}
            </span>
          </div>
          <div className="mt-6">
            {section.id === "reservations" ? <ReservationsBoard rows={reservations} /> : null}
            {section.id === "orders" ? <OrdersBoard rows={orders} /> : null}
            {section.id === "enquiries" ? <EnquiriesBoard rows={enquiries} /> : null}
          </div>
        </div>
      ))}

      <div className="mt-16">
        <h2 className="display text-2xl">Live menu</h2>
        <div className="mt-6">
          <DishManager items={menu.items} categories={menu.categories} />
        </div>
      </div>
    </section>
  );
}
