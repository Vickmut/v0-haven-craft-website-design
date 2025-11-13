"use client"

import { useEffect, useState } from "react"
import { RoomSection } from "@/components/room-section"
import { getFurnitureItemsByCategory, initializeFurnitureData } from "@/lib/furniture-data"
import type { FurnitureItem } from "@/lib/furniture-data"

export function CuratedRooms() {
  const [furnitureData, setFurnitureData] = useState<Record<string, FurnitureItem[]>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadFurnitureData = () => {
      // Initialize data if needed
      initializeFurnitureData()

      // Load data by category
      const categories = ["Living Room", "Bedroom", "Office", "Outdoor", "Dining"]
      const data: Record<string, FurnitureItem[]> = {}

      categories.forEach((category) => {
        data[category.toLowerCase().replace(" ", "-")] = getFurnitureItemsByCategory(category)
      })

      setFurnitureData(data)
      setLoading(false)
    }

    loadFurnitureData()

    // Listen for storage changes (when admin updates data)
    const handleStorageChange = () => {
      loadFurnitureData()
    }

    window.addEventListener("storage", handleStorageChange)

    // Also listen for custom events from the same tab
    window.addEventListener("furnitureDataUpdated", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("furnitureDataUpdated", handleStorageChange)
    }
  }, [])

  if (loading) {
    return (
      <div className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse text-lg text-primary">Loading collections...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">Curated Collections</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our carefully selected furniture pieces for every room in your home
          </p>
        </div>

        <RoomSection id="living-room" title="Living Room" items={furnitureData["living-room"] || []} />
        <RoomSection id="bedroom" title="Bedroom" items={furnitureData["bedroom"] || []} />
        <RoomSection id="office" title="Office" items={furnitureData["office"] || []} />
        <RoomSection id="outdoor" title="Outdoor" items={furnitureData["outdoor"] || []} />
        <RoomSection id="dining" title="Dining" items={furnitureData["dining"] || []} />
      </div>
    </div>
  )
}
