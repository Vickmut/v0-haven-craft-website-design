"use client"

export interface FurnitureItem {
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

const STORAGE_KEY = "havencraft-furniture-items"

// Initial default items
const getInitialItems = (): FurnitureItem[] => [
  {
    id: "m1",
    name: "Semi Recliners",
    description: "5 seater, 7 seater - Premium leather recliners with adjustable positions",
    price: "From KES 75,000",
    originalPrice: "85000",
    discountedPrice: "75000",
    category: "Living Room",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/m1-sfkS46g9ShAzHDYP6ZA8oIhUGwUbnR.png",
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
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/m2-HwqmmIN6nKl1kaRIYeN5LWmZ1kkv1Q.png",
    hasVideo: true,
    videoUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled%20video%20-%20Made%20with%20Clipchamp%20%282%29-38JNgxJpGLdNysrMbnVnVnQU9x8XEc.mp4",
    createdAt: new Date(),
  },
  {
    id: "umbrella-seat",
    name: "Umbrella Seats",
    description: "Unique curved design armchair with premium upholstery",
    price: "From KES 20,000",
    originalPrice: "20000",
    category: "Living Room",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_2025_0618_133743-sGUibScxMZJ4cppv9VObX3hxFb70Up.png",
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
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_2025_0618_133750-SByfaqmfQ9GaydUWlEE51ZDYZQgfan.png",
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
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_2025_0618_133808-tBWyyHmBk6IkQcztNnz4RLiT4LUAoO.png",
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
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_2025_0618_133816-66x3Ghk37yeqkhEEMZWTz869sQLeVp.png",
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
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_2025_0618_133822-NDzUWXSMRisVOByowcZzwSDqRMFOxS.png",
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
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_2025_0618_133829-3YbSzOI0tRrQS7ogGKIzGv9oiLAPLN.png",
    hasVideo: false,
    createdAt: new Date(),
  },
]

// Initialize data if not exists
export const initializeFurnitureData = () => {
  if (typeof window === "undefined") return []

  const existingData = localStorage.getItem(STORAGE_KEY)
  if (!existingData) {
    const initialItems = getInitialItems()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialItems))
    return initialItems
  }
  return JSON.parse(existingData)
}

// Migration function to add missing fields to existing items
const migrateItemData = (item: any): FurnitureItem => {
  // If item doesn't have originalPrice, extract it from the price string
  if (!item.originalPrice && item.price) {
    const priceMatch = item.price.match(/(\d+(?:,\d+)*)/)
    if (priceMatch) {
      item.originalPrice = priceMatch[1].replace(/,/g, "")
    }
  }

  return {
    ...item,
    originalPrice: item.originalPrice || "",
    discountedPrice: item.discountedPrice || "",
  }
}

// Get all furniture items
export const getAllFurnitureItems = (): FurnitureItem[] => {
  if (typeof window === "undefined") return []

  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) {
      return initializeFurnitureData()
    }
    const items = JSON.parse(data)
    // Migrate items to ensure they have all required fields
    return items.map(migrateItemData)
  } catch (error) {
    console.error("Error loading furniture data:", error)
    return getInitialItems()
  }
}

// Get items by category
export const getFurnitureItemsByCategory = (category: string): FurnitureItem[] => {
  const allItems = getAllFurnitureItems()
  return allItems.filter((item) => item.category.toLowerCase() === category.toLowerCase())
}

// Get single item by ID
export const getFurnitureItemById = (id: string): FurnitureItem | null => {
  const allItems = getAllFurnitureItems()
  return allItems.find((item) => item.id === id) || null
}

// Get recently added items (last 8 items)
export const getRecentlyAddedItems = (): FurnitureItem[] => {
  const allItems = getAllFurnitureItems()
  return allItems
    .sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return dateB - dateA
    })
    .slice(0, 8)
}

// Save furniture items
export const saveFurnitureItems = (items: FurnitureItem[]) => {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

// Add new item
export const addFurnitureItem = (item: Omit<FurnitureItem, "id" | "createdAt" | "updatedAt">) => {
  const allItems = getAllFurnitureItems()
  const newItem: FurnitureItem = {
    ...item,
    id: `item-${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  const updatedItems = [...allItems, newItem]
  saveFurnitureItems(updatedItems)
  return newItem
}

// Update item
export const updateFurnitureItem = (updatedItem: FurnitureItem) => {
  const allItems = getAllFurnitureItems()
  const updatedItems = allItems.map((item) =>
    item.id === updatedItem.id ? { ...updatedItem, updatedAt: new Date() } : item,
  )
  saveFurnitureItems(updatedItems)
  return updatedItem
}

// Delete item
export const deleteFurnitureItem = (itemId: string) => {
  const allItems = getAllFurnitureItems()
  const updatedItems = allItems.filter((item) => item.id !== itemId)
  saveFurnitureItems(updatedItems)
}

// Helper function to calculate discount percentage
export const calculateDiscountPercentage = (originalPrice: string, discountedPrice: string): number => {
  const original = Number.parseInt(originalPrice)
  const discounted = Number.parseInt(discountedPrice)
  if (original && discounted && original > discounted) {
    return Math.round(((original - discounted) / original) * 100)
  }
  return 0
}
