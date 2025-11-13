"use client"

import type React from "react"

import { useState } from "react"
import { X, Upload, Video, Link, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

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

interface EditItemFormProps {
  item: FurnitureItem
  onSubmit: (item: FurnitureItem) => void
  onCancel: () => void
}

const categories = ["Living Room", "Bedroom", "Office", "Outdoor", "Dining"]

// Helper function to detect video URL type
const getVideoType = (url: string) => {
  if (!url) return "none"

  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    return "youtube"
  }

  if (url.includes("vimeo.com")) {
    return "vimeo"
  }

  if (url.match(/\.(mp4|webm|ogg|mov|avi)(\?.*)?$/i) || url.startsWith("data:video/") || url.includes("blob.vercel")) {
    return "direct"
  }

  return "unknown"
}

export function EditItemForm({ item, onSubmit, onCancel }: EditItemFormProps) {
  const [formData, setFormData] = useState<FurnitureItem>({
    ...item,
    originalPrice: item.originalPrice || "",
    discountedPrice: item.discountedPrice || "",
  })
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>(item.image)
  const [videoMode, setVideoMode] = useState<"url" | "file">("url")

  const videoType = getVideoType(formData.videoUrl || "")

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImagePreview(result)
        setFormData({ ...formData, image: result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size (5MB limit for better performance)
      if (file.size > 5 * 1024 * 1024) {
        alert("Video file is too large. Please use a video URL instead, or choose a file smaller than 5MB.")
        return
      }

      // Check file type
      if (!file.type.startsWith("video/")) {
        alert("Please select a valid video file.")
        return
      }

      setLoading(true)
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setFormData({ ...formData, videoUrl: result })
        setLoading(false)
        console.log("Video file processed successfully")
      }
      reader.onerror = () => {
        alert("Failed to process video file. Please try using a video URL instead.")
        setLoading(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    if (!formData.name || !formData.originalPrice || !formData.category || !formData.image) {
      alert("Please fill in all required fields (Name, Original Price, Category, and Image)")
      return
    }

    // Validate price fields
    if (formData.originalPrice && isNaN(Number.parseInt(formData.originalPrice))) {
      alert("Please enter a valid original price (numbers only)")
      return
    }

    if (formData.discountedPrice && isNaN(Number.parseInt(formData.discountedPrice))) {
      alert("Please enter a valid discounted price (numbers only)")
      return
    }

    // Validate discount logic
    if (formData.originalPrice && formData.discountedPrice) {
      const original = Number.parseInt(formData.originalPrice)
      const discounted = Number.parseInt(formData.discountedPrice)
      if (discounted >= original) {
        alert("Discounted price must be less than original price")
        return
      }
    }

    setLoading(true)
    try {
      // Set the display price based on discount
      const finalFormData: FurnitureItem = {
        ...formData,
        price: formData.discountedPrice
          ? `From KES ${Number.parseInt(formData.discountedPrice).toLocaleString()}`
          : `From KES ${Number.parseInt(formData.originalPrice).toLocaleString()}`,
        originalPrice: formData.originalPrice || "",
        discountedPrice: formData.discountedPrice || "",
        updatedAt: new Date(),
      }

      console.log("Updating item with data:", finalFormData)

      // Submit the form data
      onSubmit(finalFormData)
    } catch (error) {
      console.error("Error updating item:", error)
      alert("Failed to update item. Please check all fields and try again.")
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-cream-50 to-amber-50 border-amber-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-2xl font-serif text-amber-900">Edit Furniture Item</CardTitle>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="image" className="text-amber-900 font-medium">
                Product Image *
              </Label>
              <div className="border-2 border-dashed border-amber-300 rounded-lg p-6 text-center">
                {imagePreview ? (
                  <div className="space-y-4">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      className="max-h-48 mx-auto rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        document.getElementById("image-upload")?.click()
                      }}
                      className="bg-transparent border-amber-300 text-amber-700"
                    >
                      Change Image
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="h-12 w-12 text-amber-400 mx-auto" />
                    <div>
                      <Label
                        htmlFor="image-upload"
                        className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg inline-block"
                      >
                        Choose Image
                      </Label>
                    </div>
                  </div>
                )}
                <Input id="image-upload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </div>
            </div>

            {/* Product Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-amber-900 font-medium">
                Product Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Premium Leather Sofa"
                className="border-amber-300 focus:border-emerald-500"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-amber-900 font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the furniture piece, its features, and benefits..."
                rows={3}
                className="border-amber-300 focus:border-emerald-500"
              />
            </div>

            {/* Price Section */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="originalPrice" className="text-amber-900 font-medium">
                    Original Price (KES) *
                  </Label>
                  <Input
                    id="originalPrice"
                    value={formData.originalPrice || ""}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    placeholder="e.g., 25000"
                    className="border-amber-300 focus:border-emerald-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discountedPrice" className="text-amber-900 font-medium">
                    Discounted Price (KES) <span className="text-amber-600">(Optional)</span>
                  </Label>
                  <Input
                    id="discountedPrice"
                    value={formData.discountedPrice || ""}
                    onChange={(e) => setFormData({ ...formData, discountedPrice: e.target.value })}
                    placeholder="e.g., 20000"
                    className="border-amber-300 focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Discount Preview */}
              {formData.originalPrice && formData.discountedPrice && (
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div>
                      <span className="text-lg line-through text-gray-500">
                        KES {Number.parseInt(formData.originalPrice).toLocaleString()}
                      </span>
                      <span className="text-xl font-bold text-green-700 ml-2">
                        KES {Number.parseInt(formData.discountedPrice).toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Save{" "}
                      {Math.round(
                        ((Number.parseInt(formData.originalPrice) - Number.parseInt(formData.discountedPrice)) /
                          Number.parseInt(formData.originalPrice)) *
                          100,
                      )}
                      %
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-amber-900 font-medium">
                Category *
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger className="border-amber-300 focus:border-emerald-500">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Video Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="has-video"
                  checked={formData.hasVideo}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, hasVideo: checked, videoUrl: checked ? formData.videoUrl : "" })
                  }
                />
                <Label htmlFor="has-video" className="text-amber-900 font-medium flex items-center">
                  <Video className="h-4 w-4 mr-2" />
                  This item has a video
                </Label>
              </div>

              {formData.hasVideo && (
                <div className="space-y-4">
                  {/* Video Type Warning */}
                  {videoType === "youtube" && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-yellow-800">
                          <p className="font-medium mb-1">YouTube URL Detected</p>
                          <p>
                            YouTube videos will be embedded as iframes. For better performance, consider uploading the
                            video directly or using a direct video file URL.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Video Mode Toggle */}
                  <div className="flex items-center space-x-4 p-3 bg-amber-50 rounded-lg">
                    <Button
                      type="button"
                      variant={videoMode === "url" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setVideoMode("url")}
                      className={videoMode === "url" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                    >
                      <Link className="h-4 w-4 mr-2" />
                      Video URL (Recommended)
                    </Button>
                    <Button
                      type="button"
                      variant={videoMode === "file" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setVideoMode("file")}
                      className={videoMode === "file" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload File
                    </Button>
                  </div>

                  {videoMode === "url" ? (
                    /* Video URL Input */
                    <div className="space-y-2">
                      <Label className="text-amber-900 font-medium">Video URL</Label>
                      <Input
                        value={formData.videoUrl || ""}
                        onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                        placeholder="https://blob.v0.dev/your-video-url.mp4"
                        className="border-amber-300 focus:border-emerald-500"
                      />
                      <div className="text-xs text-amber-600 space-y-1">
                        <p>
                          • <strong>Recommended:</strong> Direct video file URLs (.mp4, .webm, etc.)
                        </p>
                        <p>
                          • <strong>Supported:</strong> YouTube, Vimeo (will be embedded)
                        </p>
                        <p>
                          • <strong>Best:</strong> Blob URLs from v0 or cloud storage
                        </p>
                        <p>• Example: https://hebbkx1anhila5yf.public.blob.vercel-storage.com/video.mp4</p>
                      </div>
                      {formData.videoUrl && videoType === "direct" && (
                        <div className="mt-4 border-2 border-amber-300 rounded-lg p-4">
                          <video controls className="max-h-48 mx-auto rounded-lg w-full" src={formData.videoUrl}>
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      )}
                      {formData.videoUrl && videoType === "youtube" && (
                        <div className="mt-4 border-2 border-amber-300 rounded-lg p-4">
                          <p className="text-center text-amber-700 py-8">
                            YouTube video will be embedded on the product page
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Video File Upload */
                    <div className="border-2 border-dashed border-amber-300 rounded-lg p-6">
                      <div className="space-y-4 text-center">
                        <Video className="h-12 w-12 text-amber-400 mx-auto" />
                        <div>
                          <Label
                            htmlFor="video-upload"
                            className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg inline-block"
                          >
                            Choose Video File
                          </Label>
                          <Input
                            id="video-upload"
                            type="file"
                            accept="video/*"
                            onChange={handleVideoUpload}
                            className="hidden"
                          />
                        </div>
                        <div className="text-sm text-amber-600 space-y-1">
                          <p>• Upload video files (MP4, MOV, etc.)</p>
                          <p>• Maximum file size: 5MB</p>
                          <p>• For larger videos, use the URL option instead</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1 bg-transparent border-amber-300 text-amber-700 hover:bg-amber-100"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {loading ? "Updating..." : "Update Item"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
