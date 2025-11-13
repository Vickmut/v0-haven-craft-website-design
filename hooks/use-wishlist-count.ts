"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"

export function useWishlistCount() {
  const [count, setCount] = useState(0)
  const { user } = useAuth()

  useEffect(() => {
    if (typeof window === "undefined") return

    const updateCount = async () => {
      if (!user) {
        setCount(0)
        return
      }

      try {
        const { getUserWishlist } = await import("@/lib/firebase")
        const wishlist = await getUserWishlist(user.uid)
        setCount(wishlist.length)
      } catch (error) {
        console.error("Error getting wishlist count:", error)
        setCount(0)
      }
    }

    updateCount()

    // Listen for wishlist updates
    const handleWishlistUpdate = () => {
      updateCount()
    }

    if (typeof window !== "undefined") {
      window.addEventListener("wishlistUpdated", handleWishlistUpdate)
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("wishlistUpdated", handleWishlistUpdate)
      }
    }
  }, [user])

  return count
}
