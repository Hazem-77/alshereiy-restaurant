import { User } from "@supabase/supabase-js";

export async function login(email: string, password: string) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });
  const data = await res.json();
  return { data, error: data.error ? { message: data.error } : null };
}

export async function logout() {
  await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
}

export async function getSession(): Promise<User | null> {
  try {
    const res = await fetch("/api/auth/session", {
      cache: "no-store",
      credentials: "include",
    });
    if (res.status === 401) return null;
    const data = await res.json();
    return data.user ?? null;
  } catch {
    return null;
  }
}
