"use client"

import { useState, useEffect } from "react"
import { Plus, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AddItemForm } from "./add-item-form"
import { EditItemForm } from "./edit-item-form"
import { DeleteConfirmDialog } from "./delete-confirm-dialog"
import { AdminItemCard } from "./admin-item-card"
import { useAuth } from "@/contexts/auth-context"

interface FurnitureItem {
  id: string
  name: string
  description: string
  price: string
  originalPrice?: string
  discountedPrice?: string
  category: string
  image: string
  hasVideo: boolean
  videoUrl?: string
  createdAt?: Date
  updatedAt?: Date
}

export function AdminDashboard() {
  const [items, setItems] = useState<FurnitureItem[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingItem, setEditingItem] = useState<FurnitureItem | null>(null)
  const [deletingItem, setDeletingItem] = useState<FurnitureItem | null>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    loadItems()

    const handleDataUpdate = () => {
      console.log("[v0] Data update event received, refreshing items")
      loadItems()
    }

    if (typeof window !== "undefined") {
      window.addEventListener("furnitureDataUpdated", handleDataUpdate)
      return () => window.removeEventListener("furnitureDataUpdated", handleDataUpdate)
    }
  }, [])

  const loadItems = async () => {
    try {
      // Load items from localStorage for now (in production, this would be from a database)
      const savedItems = localStorage.getItem("havencraft-furniture-items")
      if (savedItems) {
        const parsedItems = JSON.parse(savedItems)
        // Ensure all items have the required discount fields
        const migratedItems = parsedItems.map((item: any) => ({
          ...item,
          originalPrice: item.originalPrice || "",
          discountedPrice: item.discountedPrice || "",
        }))
        setItems(migratedItems)
      } else {
        // Initialize with existing items
        const initialItems = getInitialItems()
        setItems(initialItems)
        localStorage.setItem("havencraft-furniture-items", JSON.stringify(initialItems))
      }
    } catch (error) {
      console.error("Error loading items:", error)
      // Fallback to initial items if there's an error
      const initialItems = getInitialItems()
      setItems(initialItems)
    } finally {
      setLoading(false)
    }
  }

  const getInitialItems = (): FurnitureItem[] => [
    {
      id: "m1",
      name: "Semi Recliners",
      description: "5 seater, 7 seater - Premium leather recliners with adjustable positions",
      price: "From KES 75,000",
      originalPrice: "85000",
      discountedPrice: "75000",
      category: "Living Room",
      image: "/images/m1.png",
      hasVideo: true,
      videoUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/v1-mdY987BWO6eqLhPgDeNYrIHICWa1nT.mp4",
      createdAt: new Date(),
    },
    {
      id: "m2",
      name: "L-shaped Seats",
      description: "6 seater - Comfortable sectional sofa perfect for family gatherings",
      price: "From KES 55,000",
      originalPrice: "65000",
      discountedPrice: "55000",
      category: "Living Room",
      image: "/images/m2.png",
      hasVideo: true,
      videoUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled%20video%20-%20Made%20with%20Clipchamp%20%282%29-38JNgxJpGLdNysrMbnVnVnQU9x8XEc.mp4",
      createdAt: new Date(),
    },
    {
      id: "umbrella-seat",
      name: "Umbrella Seats",
      description: "Unique curved design armchair with premium upholstery",
      price: "From KES 20,000",
      originalPrice: "20000",
      category: "Living Room",
      image: "/images/screenshot-2025-0618-133743.png",
      hasVideo: false,
      createdAt: new Date(),
    },
    {
      id: "ottoman",
      name: "Ottoman",
      description: "Comfortable ottoman with ribbed upholstery design",
      price: "From KES 15,000",
      originalPrice: "18000",
      discountedPrice: "15000",
      category: "Living Room",
      image: "/images/screenshot-2025-0618-133750.png",
      hasVideo: false,
      createdAt: new Date(),
    },
    {
      id: "chester-bed-1",
      name: "Chester Beds",
      description: "Premium upholstered beds in multiple sizes - 3½×6, 4×6, 5×6",
      price: "From KES 18,000",
      originalPrice: "18000",
      category: "Bedroom",
      image: "/images/screenshot-2025-0618-133808.png",
      hasVideo: false,
      createdAt: new Date(),
    },
    {
      id: "chester-bed-2",
      name: "Chester Beds (Beige)",
      description: "Elegant beige upholstered headboards in various sizes",
      price: "From KES 18,000",
      originalPrice: "22000",
      discountedPrice: "18000",
      category: "Bedroom",
      image: "/images/screenshot-2025-0618-133816.png",
      hasVideo: false,
      createdAt: new Date(),
    },
    {
      id: "colorful-headboards",
      name: "Colorful Headboards",
      description: "Vibrant upholstered headboards in teal, navy, and beige",
      price: "From KES 20,000",
      originalPrice: "20000",
      category: "Bedroom",
      image: "/images/screenshot-2025-0618-133822.png",
      hasVideo: false,
      createdAt: new Date(),
    },
    {
      id: "orthopedic-mattress",
      name: "Orthopedic Mattresses",
      description: "Premium orthopedic mattresses for better sleep support",
      price: "From KES 12,000",
      originalPrice: "15000",
      discountedPrice: "12000",
      category: "Bedroom",
      image: "/images/screenshot-2025-0618-133829.png",
      hasVideo: false,
      createdAt: new Date(),
    },
  ]

  const handleAddItem = (newItem: Omit<FurnitureItem, "id" | "createdAt" | "updatedAt">) => {
    try {
      const item: FurnitureItem = {
        ...newItem,
        id: `item-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        // Ensure discount fields are properly set
        originalPrice: newItem.originalPrice || "",
        discountedPrice: newItem.discountedPrice || "",
      }

      const updatedItems = [...items, item]
      setItems(updatedItems)

      // Save to localStorage with error handling
      try {
        localStorage.setItem("havencraft-furniture-items", JSON.stringify(updatedItems))
        console.log("Item added successfully:", item.name)
      } catch (storageError) {
        console.error("Error saving to localStorage:", storageError)
        alert("Item added but failed to save permanently. Please try again.")
        return
      }

      // Dispatch custom event to notify other components
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("furnitureDataUpdated"))
      }

      setShowAddForm(false)
    } catch (error) {
      console.error("Error adding item:", error)
      alert("Failed to add item. Please try again.")
    }
  }

  const handleEditItem = (updatedItem: FurnitureItem) => {
    try {
      console.log("Starting item update:", updatedItem.name)

      // Ensure the updated item has all required fields
      const sanitizedItem: FurnitureItem = {
        ...updatedItem,
        updatedAt: new Date(),
        originalPrice: updatedItem.originalPrice || "",
        discountedPrice: updatedItem.discountedPrice || "",
      }

      console.log("Sanitized item data:", sanitizedItem)

      const updatedItems = items.map((item) => (item.id === sanitizedItem.id ? sanitizedItem : item))

      // Check if localStorage is available and has enough space
      try {
        const testData = JSON.stringify(updatedItems)

        // Check if the data is too large (most browsers have ~5-10MB limit)
        if (testData.length > 5 * 1024 * 1024) {
          // 5MB check
          console.error("Data too large for localStorage:", testData.length, "bytes")
          alert("Item data is too large to save. Please use smaller images/videos or video URLs instead of files.")
          return
        }

        localStorage.setItem("havencraft-furniture-items", testData)
        console.log("Item saved to localStorage successfully")

        // Update state only after successful save
        setItems(updatedItems)

        // Dispatch custom event to notify other components
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("furnitureDataUpdated"))
        }

        setEditingItem(null)
        console.log("Item updated successfully:", sanitizedItem.name)
      } catch (storageError: any) {
        console.error("localStorage error:", storageError)

        if (storageError.name === "QuotaExceededError") {
          alert(
            "Storage quota exceeded. Please use video URLs instead of uploading large video files, or clear some browser data.",
          )
        } else {
          alert("Failed to save item. This might be due to large video files. Please try using video URLs instead.")
        }
        return
      }
    } catch (error) {
      console.error("Error updating item:", error)
      alert("Failed to update item. Please try again.")
    }
  }

  const handleDeleteItem = (itemId: string) => {
    try {
      const updatedItems = items.filter((item) => item.id !== itemId)
      setItems(updatedItems)

      // Save to localStorage with error handling
      try {
        localStorage.setItem("havencraft-furniture-items", JSON.stringify(updatedItems))
        console.log("Item deleted successfully")
      } catch (storageError) {
        console.error("Error saving to localStorage:", storageError)
        alert("Item deleted but failed to save permanently. Please refresh the page.")
        return
      }

      // Dispatch custom event to notify other components
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("furnitureDataUpdated"))
      }

      setDeletingItem(null)
    } catch (error) {
      console.error("Error deleting item:", error)
      alert("Failed to delete item. Please try again.")
    }
  }

  const getCategoryStats = () => {
    const stats = items.reduce(
      (acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )
    return stats
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-pulse text-lg text-amber-800">Loading dashboard...</div>
        </div>
      </div>
    )
  }

  const categoryStats = getCategoryStats()

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-amber-900 mb-2">HavenCraft Admin Panel</h1>
            <p className="text-amber-700">Welcome back, {user?.displayName || user?.email}</p>
          </div>
          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-emerald-700 hover:bg-emerald-800 text-white shadow-lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Item
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-amber-100 to-orange-100 border-amber-200">
            <CardContent className="p-4 text-center">
              <Package className="h-8 w-8 text-amber-700 mx-auto mb-2" />
              <div className="text-2xl font-bold text-amber-900">{items.length}</div>
              <div className="text-sm text-amber-700">Total Items</div>
            </CardContent>
          </Card>
          {Object.entries(categoryStats).map(([category, count]) => (
            <Card key={category} className="bg-gradient-to-br from-cream-100 to-amber-50 border-amber-200">
              <CardContent className="p-4 text-center">
                <div className="text-xl font-bold text-amber-900">{count}</div>
                <div className="text-xs text-amber-700">{category}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => (
          <AdminItemCard
            key={item.id}
            item={item}
            onEdit={() => setEditingItem(item)}
            onDelete={() => setDeletingItem(item)}
          />
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-16">
          <Package className="h-16 w-16 text-amber-400 mx-auto mb-4" />
          <h2 className="text-2xl font-serif text-amber-700 mb-2">No items yet</h2>
          <p className="text-amber-600 mb-6">Start by adding your first furniture item</p>
          <Button onClick={() => setShowAddForm(true)} className="bg-emerald-700 hover:bg-emerald-800 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add First Item
          </Button>
        </div>
      )}

      {/* Add Item Form Modal */}
      {showAddForm && <AddItemForm onSubmit={handleAddItem} onCancel={() => setShowAddForm(false)} />}

      {/* Edit Item Form Modal */}
      {editingItem && (
        <EditItemForm item={editingItem} onSubmit={handleEditItem} onCancel={() => setEditingItem(null)} />
      )}

      {/* Delete Confirmation Dialog */}
      {deletingItem && (
        <DeleteConfirmDialog
          item={deletingItem}
          onConfirm={() => handleDeleteItem(deletingItem.id)}
          onCancel={() => setDeletingItem(null)}
        />
      )}
    </div>
  )
}
