/**
 * Supabase Environment Variable Sanitizer and Config
 * 
 * Ensures all environment variables are properly trimmed of whitespace and quotes.
 */

export function sanitizeEnv(val?: string): string {
  if (!val) return "";
  return val.trim().replace(/^["']|["']$/g, "").trim();
}

export const FALLBACK_SUPABASE_URL = "https://ouaphnqctltzzutozqih.supabase.co";

export function getSupabaseUrl(): string {
  const sanitized = sanitizeEnv(process.env.NEXT_PUBLIC_SUPABASE_URL);
  if (sanitized && (sanitized.startsWith("https://") || sanitized.startsWith("http://"))) {
    return sanitized;
  }
  return FALLBACK_SUPABASE_URL;
}

export function getSupabaseAnonKey(): string {
  return sanitizeEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function getSupabaseServiceRoleKey(): string {
  return sanitizeEnv(process.env.SUPABASE_SERVICE_ROLE_KEY);
}
