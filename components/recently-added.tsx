"use client"

import { useEffect, useState } from "react"
import { FurnitureCard } from "@/components/furniture-card"
import { getRecentlyAddedItems, initializeFurnitureData } from "@/lib/furniture-data"
import type { FurnitureItem } from "@/lib/furniture-data"

export function RecentlyAdded() {
  const [recentItems, setRecentItems] = useState<FurnitureItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadRecentItems = () => {
      // Initialize data if needed
      initializeFurnitureData()

      // Load recent items
      const items = getRecentlyAddedItems()
      setRecentItems(items)
      setLoading(false)
    }

    loadRecentItems()

    // Listen for storage changes (when admin updates data)
    const handleStorageChange = () => {
      loadRecentItems()
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("furnitureDataUpdated", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("furnitureDataUpdated", handleStorageChange)
    }
  }, [])

  if (loading) {
    return (
      <section className="py-16 bg-cream-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse text-lg text-primary">Loading recent items...</div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-cream-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">Recently Added</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Discover our latest furniture pieces</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {recentItems.map((item) => (
            <FurnitureCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}
