"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const ADMIN_EMAIL = "2300146@students.kcau.ac.ke"

export default function AdminPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || loading) return

    if (!user) {
      router.push("/auth")
      return
    }

    if (user.email !== ADMIN_EMAIL) {
      router.push("/")
      return
    }
  }, [user, loading, mounted, router])

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="animate-pulse text-lg text-amber-800">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (user.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center border-red-200">
          <CardContent className="p-8">
            <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-serif font-bold text-red-700 mb-2">Access Denied</h1>
            <p className="text-red-600 mb-6">You don't have permission to access the admin panel.</p>
            <Link href="/">
              <Button className="bg-primary hover:bg-brown-700 text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <AdminDashboard />
    </div>
  )
}
