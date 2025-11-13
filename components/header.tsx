"use client"

import Link from "next/link"
import Image from "next/image"
import { Heart, Menu, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/contexts/auth-context"
import { signOutUser } from "@/lib/firebase"
import { SignOutDialog } from "@/components/sign-out-dialog"
import { useState, useEffect } from "react"

export function Header() {
  const { user } = useAuth()
  const [wishlistCount, setWishlistCount] = useState(0)
  const [showSignOutDialog, setShowSignOutDialog] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || typeof window === "undefined") return

    const updateCount = async () => {
      if (!user) {
        setWishlistCount(0)
        return
      }

      try {
        const { getUserWishlist } = await import("@/lib/firebase")
        const wishlist = await getUserWishlist(user.uid)
        setWishlistCount(wishlist.length)
      } catch (error) {
        console.error("Error getting wishlist count:", error)
        setWishlistCount(0)
      }
    }

    updateCount()

    // Listen for wishlist updates
    const handleWishlistUpdate = () => {
      updateCount()
    }

    window.addEventListener("wishlistUpdated", handleWishlistUpdate)

    return () => {
      window.removeEventListener("wishlistUpdated", handleWishlistUpdate)
    }
  }, [user, mounted])

  const navigation = [
    { name: "Living Room", href: "/#living-room" },
    { name: "Bedroom", href: "/#bedroom" },
    { name: "Office", href: "/#office" },
    { name: "Outdoor", href: "/#outdoor" },
    { name: "Dining", href: "/#dining" },
  ]

  const handleSignOut = async () => {
    try {
      await signOutUser()
      setShowSignOutDialog(false)
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-XDAeo5SZNxKRG3nIKw6PgXsH2vHRcT.jpeg"
                alt="HavenCraft Logo"
                width={120}
                height={40}
                className="h-10 w-auto brightness-110 contrast-110"
              />
            </div>
            <span className="text-xl font-serif font-bold text-primary hidden sm:block">HavenCraft</span>
          </Link>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>
    )
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-XDAeo5SZNxKRG3nIKw6PgXsH2vHRcT.jpeg"
                alt="HavenCraft Logo"
                width={120}
                height={40}
                className="h-10 w-auto brightness-110 contrast-110 saturate-110"
              />
            </div>
            <span className="text-xl font-serif font-bold text-primary hidden sm:block">HavenCraft</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-2">
            <Link href="/wishlist" className="relative">
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
                <span className="sr-only">Wishlist</span>
                {user && wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {wishlistCount > 9 ? "9+" : wishlistCount}
                  </span>
                )}
              </Button>
            </Link>

            {user ? (
              <div className="flex items-center space-x-2">
                <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
                  <span>Welcome, {user.displayName || user.email}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setShowSignOutDialog(true)}>
                  <LogOut className="h-5 w-5" />
                  <span className="sr-only">Sign Out</span>
                </Button>
              </div>
            ) : (
              <Link href="/auth">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Account</span>
                </Button>
              </Link>
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="flex flex-col space-y-4 mt-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-lg font-medium text-muted-foreground hover:text-primary transition-colors"
                    >
                      {item.name}
                    </Link>
                  ))}
                  {user && (
                    <Button
                      variant="outline"
                      onClick={() => setShowSignOutDialog(true)}
                      className="mt-4 bg-transparent"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Sign Out Confirmation Dialog */}
      {showSignOutDialog && <SignOutDialog onConfirm={handleSignOut} onCancel={() => setShowSignOutDialog(false)} />}
    </>
  )
}
