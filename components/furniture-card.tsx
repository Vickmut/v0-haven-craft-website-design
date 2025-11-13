"use client"

import Image from "next/image"
import Link from "next/link"
import { Eye, Heart, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"

interface FurnitureItem {
  id: string
  name: string
  description: string
  price: string
  originalPrice?: string
  discountedPrice?: string
  image: string
  hasVideo: boolean
  videoId?: string
}

interface FurnitureCardProps {
  item: FurnitureItem
}

export function FurnitureCard({ item }: FurnitureCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { user, error } = useAuth()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const checkWishlistStatus = async () => {
      if (user && !error) {
        try {
          const { getUserWishlist } = await import("@/lib/firebase")
          const wishlist = await getUserWishlist(user.uid)
          setIsWishlisted(wishlist.includes(item.id))
        } catch (err) {
          console.error("Error checking wishlist status:", err)
        }
      }
    }
    checkWishlistStatus()
  }, [user, item.id, error, mounted])

  const handleWishlist = async () => {
    if (!mounted || !user) {
      window.location.href = "/auth"
      return
    }

    setLoading(true)
    try {
      const { addToWishlist, removeFromWishlist } = await import("@/lib/firebase")

      if (isWishlisted) {
        await removeFromWishlist(user.uid, item.id)
        setIsWishlisted(false)
        console.log("Item removed from wishlist successfully")
      } else {
        await addToWishlist(user.uid, item.id)
        setIsWishlisted(true)
        console.log("Item added to wishlist successfully")
      }

      // Dispatch custom event to update wishlist count safely
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("wishlistUpdated"))
      }
    } catch (error: any) {
      console.error("Error updating wishlist:", error)

      // Show specific error message
      let errorMessage = "Failed to update wishlist. Please try again."
      if (error.message) {
        errorMessage = error.message
      }

      alert(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Calculate discount percentage
  const discountPercentage =
    item.originalPrice && item.discountedPrice
      ? Math.round(
          ((Number.parseInt(item.originalPrice) - Number.parseInt(item.discountedPrice)) /
            Number.parseInt(item.originalPrice)) *
            100,
        )
      : 0

  if (!mounted) {
    return (
      <Card className="group overflow-hidden rounded-2xl shadow-md">
        <div className="w-full h-64 bg-gray-200 animate-pulse" />
        <CardContent className="p-4">
          <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-3 bg-gray-200 rounded animate-pulse mb-3" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="group overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative overflow-hidden">
        <Image
          src={item.image || "/placeholder.svg"}
          alt={item.name}
          width={400}
          height={300}
          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold px-3 py-1 text-sm shadow-lg">
              <Tag className="h-3 w-3 mr-1" />
              Save {discountPercentage}%
            </Badge>
          </div>
        )}

        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
          <Link href={`/item/${item.id}`}>
            <Button size="icon" variant="secondary" className="rounded-full">
              <Eye className="h-4 w-4" />
              <span className="sr-only">View item</span>
            </Button>
          </Link>
          <Button size="icon" variant="secondary" className="rounded-full" onClick={handleWishlist} disabled={loading}>
            <Heart className={`h-4 w-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
            <span className="sr-only">{isWishlisted ? "Remove from wishlist" : "Add to wishlist"}</span>
          </Button>
        </div>
      </div>
      <CardContent className="p-4">
        <h4 className="font-serif font-semibold text-lg text-primary mb-2">{item.name}</h4>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{item.description}</p>

        {/* Price Display */}
        <div className="space-y-1">
          {item.originalPrice && item.discountedPrice ? (
            <div className="flex items-center space-x-2">
              <span className="text-sm line-through text-gray-500">
                KES {Number.parseInt(item.originalPrice).toLocaleString()}
              </span>
              <span className="font-semibold text-primary text-lg">
                KES {Number.parseInt(item.discountedPrice).toLocaleString()}
              </span>
            </div>
          ) : (
            <p className="font-semibold text-primary text-lg">{item.price}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
