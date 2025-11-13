"use client"

import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface FurnitureItem {
  id: string
  name: string
  description: string
  price: string
  category: string
  image: string
  hasVideo: boolean
  videoUrl?: string
}

interface DeleteConfirmDialogProps {
  item: FurnitureItem
  onConfirm: () => void
  onCancel: () => void
}

export function DeleteConfirmDialog({ item, onConfirm, onCancel }: DeleteConfirmDialogProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-xl font-serif text-red-900">Delete Furniture Item</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-red-800">
            Are you sure you want to delete <strong>"{item.name}"</strong>?
          </p>
          <p className="text-sm text-red-600">This action cannot be undone.</p>

          <div className="flex space-x-4 pt-4">
            <Button
              variant="outline"
              onClick={onCancel}
              className="flex-1 bg-transparent border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={onConfirm} className="flex-1 bg-red-600 hover:bg-red-700 text-white">
              Delete Item
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
