import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { wallet_address, full_name, email, phone } = body

    if (!wallet_address || !full_name || !email || !phone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY || "",
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // Handle errors during cookie setting
            }
          },
        },
      }
    )

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("wallet_address", wallet_address)
      .limit(1)

    if (existingUser && existingUser.length > 0) {
      return NextResponse.json(
        { error: "Wallet already registered" },
        { status: 400 }
      )
    }

    // Create user
    const { data: newUser, error: userError } = await supabase
      .from("users")
      .insert([
        {
          wallet_address,
          user_type: "doctor",
          full_name,
          email,
          phone,
        },
      ])
      .select()
      .limit(1)

    if (userError || !newUser || newUser.length === 0) {
      console.error("[v0] User creation error:", userError)
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 500 }
      )
    }

    const userId = newUser[0].id

    // Create doctor profile
    const { error: doctorError } = await supabase
      .from("doctors")
      .insert([
        {
          user_id: userId,
          specialization: "",
          consultation_fee: 0,
        },
      ])

    if (doctorError) {
      console.error("[v0] Doctor profile creation error:", doctorError)
      // Delete user if doctor profile creation fails
      await supabase.from("users").delete().eq("id", userId)
      return NextResponse.json(
        { error: "Failed to create doctor profile" },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, userId },
      { status: 201 }
    )
  } catch (error) {
    console.error("[v0] Doctor registration error:", error)
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    )
  }
}
