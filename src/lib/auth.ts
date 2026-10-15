import { createHash } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "zaiqa_admin";

export function adminPassword() {
  return process.env.ADMIN_PASSWORD ?? "zaiqa2024";
}

export function adminToken() {
  return createHash("sha256")
    .update(`zaiqa::${adminPassword()}::staff`)
    .digest("hex")
    .slice(0, 32);
}

export async function isAdmin() {
  const store = await cookies();
  return store.get(ADMIN_COOKIE)?.value === adminToken();
}
