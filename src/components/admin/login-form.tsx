"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/admin/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const payload = (await response.json()) as { ok?: boolean; error?: string };

    if (!response.ok || !payload.ok) {
      setError(payload.error ?? "Login failed.");
      setLoading(false);
      return;
    }

    setPassword("");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="card mx-auto w-full max-w-md p-10">
      <p className="eyebrow">Staff area</p>
      <h1 className="display mt-3 text-3xl">Front desk login</h1>
      <p className="mt-3 text-sm leading-relaxed text-cream/55">
        Manage bookings, guest messages and the live menu.
      </p>

      <label className="label mt-8" htmlFor="password">
        Password
      </label>
      <input
        id="password"
        type="password"
        required
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        className="field"
        placeholder="••••••••"
      />

      {error ? (
        <p className="mt-5 rounded-xl border border-clay/50 bg-clay/10 px-4 py-3 text-sm text-clay">
          {error}
        </p>
      ) : null}

      <button type="submit" disabled={loading} className="btn-gold mt-7 w-full disabled:opacity-60">
        {loading ? "Checking…" : "Enter dashboard"}
      </button>

      <p className="mt-6 text-xs leading-relaxed text-cream/35">
        Demo password: <span className="text-gold">zaiqa2024</span> — override it with the
        ADMIN_PASSWORD environment variable.
      </p>
    </form>
  );
}
