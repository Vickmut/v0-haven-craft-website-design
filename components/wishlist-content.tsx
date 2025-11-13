"use client"

import { useState, useEffect } from "react"
import { Heart, Eye, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { getUserWishlist, removeFromWishlist } from "@/lib/firebase"
import { getAllFurnitureItems, initializeFurnitureData } from "@/lib/furniture-data"

export function WishlistContent() {
  const [wishlistItems, setWishlistItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    setMounted(true)
  }, [])

  const fetchWishlist = async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      const wishlistIds = await getUserWishlist(user.uid)
      console.log("Fetched wishlist IDs:", wishlistIds)

      // Load current furniture items
      initializeFurnitureData()
      const allItems = getAllFurnitureItems()

      // Convert to the format expected by this component
      const itemsMap: Record<string, any> = {}
      allItems.forEach((item: any) => {
        itemsMap[item.id] = {
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
        }
      })

      const items = wishlistIds.map((id: string) => itemsMap[id]).filter(Boolean)
      console.log("Mapped wishlist items:", items)

      setWishlistItems(items)
    } catch (error) {
      console.error("Error fetching wishlist:", error)
    }
  }

  useEffect(() => {
    if (!mounted) return

    fetchWishlist().finally(() => setLoading(false))
  }, [user, mounted])

  const refreshWishlist = async () => {
    setRefreshing(true)
    await fetchWishlist()
    setRefreshing(false)
  }

  const removeFromWishlistHandler = async (id: string) => {
    if (!mounted || !user) return

    try {
      await removeFromWishlist(user.uid, id)
      setWishlistItems((items) => items.filter((item) => item.id !== id))

      // Dispatch custom event to update wishlist count safely
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("wishlistUpdated"))
      }

      console.log("Item removed from wishlist successfully")
    } catch (error) {
      console.error("Error removing from wishlist:", error)
      alert("Failed to remove item from wishlist. Please try again.")
    }
  }

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p>Loading your wishlist...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-8 text-center">Your Wishlist</h1>
          <div className="text-center py-16">
            <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-serif text-muted-foreground mb-2">Sign in to view your wishlist</h2>
            <p className="text-muted-foreground mb-6">Save your favorite furniture pieces and access them anywhere</p>
            <Link href="/auth">
              <Button className="bg-primary hover:bg-brown-700 rounded-2xl">Sign In</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary">Your Wishlist</h1>
          <Button
            variant="outline"
            onClick={refreshWishlist}
            disabled={refreshing}
            className="flex items-center space-x-2 bg-transparent"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-serif text-muted-foreground mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6">Start browsing our collections to add items you love</p>
            <Link href="/">
              <Button className="bg-primary hover:bg-brown-700 rounded-2xl">Browse Collections</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {wishlistItems.map((item) => (
              <Card
                key={item.id}
                className="group overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="relative overflow-hidden">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    width={400}
                    height={300}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
                    <Link href={`/item/${item.id}`}>
                      <Button size="icon" variant="secondary" className="rounded-full">
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View item</span>
                      </Button>
                    </Link>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="rounded-full"
                      onClick={() => removeFromWishlistHandler(item.id)}
                    >
                      <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                      <span className="sr-only">Remove from wishlist</span>
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h4 className="font-serif font-semibold text-lg text-primary mb-2">{item.name}</h4>
                  <p className="font-semibold text-primary text-lg">{item.price}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
