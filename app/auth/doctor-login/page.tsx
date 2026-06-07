"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { connectMetaMask, getConnectedAccount, signMessage } from "@/lib/metamask"
import { getSupabaseClient } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function DoctorLogin() {
  const router = useRouter()
  const [account, setAccount] = useState<string | null>(null)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [isLogin, setIsLogin] = useState(true)

  useEffect(() => {
    const checkAccount = async () => {
      const connectedAccount = await getConnectedAccount()
      setAccount(connectedAccount)
    }
    checkAccount()
  }, [])

  const handleConnectWallet = async () => {
    const connectedAccount = await connectMetaMask()
    if (connectedAccount) {
      setAccount(connectedAccount)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!account) {
      setError("Please connect your wallet first")
      return
    }

    setLoading(true)
    setError("")

    try {
      let supabase
      try {
        supabase = getSupabaseClient()
      } catch (clientErr: any) {
        setError(clientErr.message || "Failed to initialize database connection. Please check your environment variables.")
        console.error("[v0] Supabase client error:", clientErr)
        setLoading(false)
        return
      }

      const message = `Sign in to MediConnect as Doctor with wallet: ${account}`
      const signature = await signMessage(message, account)

      if (!signature) {
        setError("Failed to sign message")
        setLoading(false)
        return
      }

      if (isLogin) {
        // Check if doctor exists
        const { data: existingUsers, error: fetchError } = await supabase
          .from("users")
          .select("id")
          .eq("wallet_address", account)
          .eq("user_type", "doctor")

        if (fetchError) {
          console.error("[v0] Login error:", fetchError)
          setError(fetchError.message || "Error checking user")
          setLoading(false)
          return
        }

        if (!existingUsers || existingUsers.length === 0) {
          setError("Doctor account not found. Please register first.")
          setLoading(false)
          return
        }

        sessionStorage.setItem("wallet_address", account)
        sessionStorage.setItem("user_type", "doctor")
        router.push("/doctor/dashboard")
      } else {
        // Register new doctor
        const { data: existingUsers } = await supabase
          .from("users")
          .select("id")
          .eq("wallet_address", account)

        if (existingUsers && existingUsers.length > 0) {
          setError("Wallet already registered")
          setLoading(false)
          return
        }

        const response = await fetch("/api/auth/doctor/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            wallet_address: account,
            full_name: fullName,
            email,
            phone,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          setError(data.error || "Registration failed")
          setLoading(false)
          return
        }

        sessionStorage.setItem("wallet_address", account)
        sessionStorage.setItem("user_type", "doctor")
        router.push("/doctor/complete-profile")
      }
    } catch (err: any) {
      console.error("[v0] Auth error:", err)
      setError(err.message || "An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-secondary p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>{isLogin ? "Doctor Login" : "Doctor Registration"}</CardTitle>
          <CardDescription>Connect your MetaMask wallet to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!account ? (
              <Button type="button" onClick={handleConnectWallet} className="w-full" size="lg">
                Connect MetaMask Wallet
              </Button>
            ) : (
              <div className="bg-secondary p-3 rounded-lg mb-4 flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Connected Wallet:</p>
                  <p className="text-sm font-mono break-all">{account}</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setAccount(null)}
                  className="ml-2 shrink-0"
                >
                  Change
                </Button>
              </div>
            )}

            {!isLogin && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    placeholder="Dr. Jane Smith"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required={!isLogin}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="doctor@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required={!isLogin}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required={!isLogin}
                  />
                </div>
              </>
            )}

            {error && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded">{error}</div>}

            <Button type="submit" className="w-full" disabled={!account || loading} size="lg">
              {loading ? "Processing..." : isLogin ? "Login" : "Register"}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => {
                setIsLogin(!isLogin)
                setError("")
              }}
            >
              {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
            </Button>

            <Button type="button" variant="outline" className="w-full bg-transparent" onClick={() => router.push("/")}>
              Back to Home
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
