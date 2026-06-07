import { createBrowserClient } from "@supabase/ssr"

let supabaseClient: ReturnType<typeof createBrowserClient> | null = null

export function getSupabaseClient() {
  if (!supabaseClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!url || !key) {
      console.error("[v0] Missing Supabase environment variables!")
      console.error("[v0] NEXT_PUBLIC_SUPABASE_URL:", url ? "✓" : "✗ MISSING")
      console.error("[v0] NEXT_PUBLIC_SUPABASE_ANON_KEY:", key ? "✓" : "✗ MISSING")
      throw new Error(
        "Supabase environment variables are not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment variables in Vercel project settings."
      )
    }

    supabaseClient = createBrowserClient(url, key)
  }
  return supabaseClient
}
