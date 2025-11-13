"use client"

import { useEffect, useState } from "react"
import { ItemDetail } from "@/components/item-detail"
import { FloatingWhatsApp } from "@/components/floating-whatsapp"
import { notFound } from "next/navigation"
import { getFurnitureItemById, initializeFurnitureData } from "@/lib/furniture-data"
import type { FurnitureItem } from "@/lib/furniture-data"

export default function ItemPage({ params }: { params: { id: string } }) {
  const [item, setItem] = useState<FurnitureItem | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadItem = () => {
      // Initialize data if needed
      initializeFurnitureData()

      // Load specific item
      const foundItem = getFurnitureItemById(params.id)
      setItem(foundItem)
      setLoading(false)
    }

    loadItem()

    // Listen for storage changes (when admin updates data)
    const handleStorageChange = () => {
      loadItem()
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("furnitureDataUpdated", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("furnitureDataUpdated", handleStorageChange)
    }
  }, [params.id])

  if (loading) {
    return (
      <main className="min-h-screen bg-cream-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-pulse text-lg text-primary">Loading item...</div>
          </div>
        </div>
        <FloatingWhatsApp />
      </main>
    )
  }

  if (!item) {
    notFound()
  }

  // Convert to the format expected by ItemDetail component
  const itemDetailData = {
    id: item.id,
    name: item.name,
    description: item.description,
    price: item.price,
    dimensions: "Contact seller for dimensions",
    material: "Premium quality materials",
    image: item.image,
    hasVideo: item.hasVideo,
    videoUrl: item.videoUrl,
  }

  return (
    <main className="min-h-screen bg-cream-50">
      <ItemDetail item={itemDetailData} />
      <FloatingWhatsApp />
    </main>
  )
}
