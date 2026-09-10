"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseUrl, getSupabaseAnonKey } from "./env";

/**
 * Creates a Supabase client for use in Client Components.
 * Uses the built-in browser cookie handling (document.cookie) — no custom
 * cookie methods needed.
 *
 * Singleton by default (isSingleton option) to avoid re-creating on every render.
 */
export function createClient() {
  return createBrowserClient(
    getSupabaseUrl(),
    getSupabaseAnonKey()
  );
}
