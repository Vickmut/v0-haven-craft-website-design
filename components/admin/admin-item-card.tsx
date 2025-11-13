"use client"

import { useState } from "react"
import Image from "next/image"
import { Edit, Trash2, Eye, Video, Tag, Percent } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { QuickDiscountDialog } from "./quick-discount-dialog"

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

interface AdminItemCardProps {
  item: FurnitureItem
  onEdit: () => void
  onDelete: () => void
  onDiscountApplied?: () => void
}

export function AdminItemCard({ item, onEdit, onDelete, onDiscountApplied }: AdminItemCardProps) {
  const [showDiscountDialog, setShowDiscountDialog] = useState(false)

  const getCategoryColor = (category: string) => {
    const colors = {
      "Living Room": "bg-blue-100 text-blue-800",
      Bedroom: "bg-purple-100 text-purple-800",
      Office: "bg-green-100 text-green-800",
      Outdoor: "bg-yellow-100 text-yellow-800",
      Dining: "bg-red-100 text-red-800",
    }
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
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

  return (
    <>
      <Card className="group overflow-hidden bg-gradient-to-br from-cream-50 to-amber-50 border-amber-200 hover:shadow-xl transition-all duration-300">
        <div className="relative">
          <Image
            src={item.image || "/placeholder.svg"}
            alt={item.name}
            width={400}
            height={250}
            className="w-full h-48 object-cover"
          />

          {/* Badges */}
          <div className="absolute top-2 right-2 flex flex-col space-y-1">
            {item.hasVideo && (
              <Badge className="bg-red-500 text-white">
                <Video className="h-3 w-3 mr-1" />
                Video
              </Badge>
            )}
            {discountPercentage > 0 && (
              <Badge className="bg-green-600 text-white">
                <Tag className="h-3 w-3 mr-1" />
                {discountPercentage}% OFF
              </Badge>
            )}
          </div>

          <div className="absolute top-2 left-2">
            <Badge className={getCategoryColor(item.category)}>{item.category}</Badge>
          </div>
        </div>

        <CardContent className="p-4">
          <h3 className="font-serif font-semibold text-lg text-amber-900 mb-2 line-clamp-1">{item.name}</h3>
          <p className="text-sm text-amber-700 mb-3 line-clamp-2">{item.description}</p>

          {/* Price Display */}
          <div className="mb-4">
            {item.originalPrice && item.discountedPrice ? (
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm line-through text-gray-500">
                    KES {Number.parseInt(item.originalPrice).toLocaleString()}
                  </span>
                  <span className="font-bold text-amber-900 text-lg">
                    KES {Number.parseInt(item.discountedPrice).toLocaleString()}
                  </span>
                </div>
                <div className="text-xs text-green-600 font-medium">
                  Save KES{" "}
                  {(Number.parseInt(item.originalPrice) - Number.parseInt(item.discountedPrice)).toLocaleString()}
                </div>
              </div>
            ) : (
              <p className="font-bold text-amber-900 text-lg">{item.price}</p>
            )}
          </div>

          <div className="flex items-center justify-between space-x-2">
            <Link href={`/item/${item.id}`} target="_blank">
              <Button
                size="sm"
                variant="outline"
                className="flex-1 bg-transparent border-amber-300 text-amber-700 hover:bg-amber-100"
              >
                <Eye className="h-3 w-3 mr-1" />
                View
              </Button>
            </Link>
            <Button
              size="sm"
              onClick={() => setShowDiscountDialog(true)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Percent className="h-3 w-3 mr-1" />
              Discount
            </Button>
            <Button size="sm" onClick={onEdit} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white">
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </Button>
            <Button size="sm" variant="destructive" onClick={onDelete} className="flex-1 bg-red-600 hover:bg-red-700">
              <Trash2 className="h-3 w-3 mr-1" />
              Delete
            </Button>
          </div>

          {item.updatedAt && (
            <div className="text-xs text-amber-600 mt-2">Updated: {new Date(item.updatedAt).toLocaleDateString()}</div>
          )}
        </CardContent>
      </Card>

      <QuickDiscountDialog
        itemId={item.id}
        itemName={item.name}
        currentPrice={item.originalPrice || "0"}
        open={showDiscountDialog}
        onOpenChange={setShowDiscountDialog}
        onSuccess={onDiscountApplied}
      />
    </>
  )
}
