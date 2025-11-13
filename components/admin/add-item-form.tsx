"use client"

import type React from "react"

import { useState } from "react"
import { X, Upload, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

interface FurnitureItem {
  name: string
  description: string
  price: string
  originalPrice?: string
  discountedPrice?: string
  category: string
  image: string
  hasVideo: boolean
  videoUrl?: string
}

interface AddItemFormProps {
  onSubmit: (item: FurnitureItem) => void
  onCancel: () => void
}

const categories = ["Living Room", "Bedroom", "Office", "Outdoor", "Dining"]

export function AddItemForm({ onSubmit, onCancel }: AddItemFormProps) {
  const [formData, setFormData] = useState<FurnitureItem>({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    discountedPrice: "",
    category: "",
    image: "",
    hasVideo: false,
    videoUrl: "",
  })
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string>("")

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
      // Check file size (20MB limit - reduced for better performance)
      if (file.size > 20 * 1024 * 1024) {
        alert("Video file is too large. Please choose a file smaller than 20MB.")
        return
      }

      // Check file type
      if (!file.type.startsWith("video/")) {
        alert("Please select a valid video file.")
        return
      }

      // Store the file and create preview URL
      setVideoFile(file)
      const previewUrl = URL.createObjectURL(file)
      setVideoPreviewUrl(previewUrl)

      // For now, we'll store a placeholder that indicates a file was uploaded
      setFormData({
        ...formData,
        videoUrl: `local-file:${file.name}`,
      })
    }
  }

  const handleVideoUrlChange = (url: string) => {
    setVideoFile(null)
    setVideoPreviewUrl(url)
    setFormData({ ...formData, videoUrl: url })
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
      }

      // If there's a video file, we need to handle it
      if (videoFile) {
        // For demo purposes, we'll convert small videos to base64
        // In production, you'd upload to cloud storage
        if (videoFile.size <= 5 * 1024 * 1024) {
          // 5MB limit for base64
          try {
            const reader = new FileReader()
            const readFileAsDataURL = (): Promise<string> => {
              return new Promise((resolve, reject) => {
                reader.onload = (e) => resolve(e.target?.result as string)
                reader.onerror = () => reject(new Error("Failed to read file"))
                reader.readAsDataURL(videoFile)
              })
            }

            const videoDataUrl = await readFileAsDataURL()
            finalFormData.videoUrl = videoDataUrl
          } catch (error) {
            console.error("Video processing error:", error)
            alert("Failed to process video file. Please try a smaller file or use a URL instead.")
            setLoading(false)
            return
          }
        } else {
          // File too large for base64, suggest using URL
          alert(
            "Video file is too large to store directly. Please use a video URL instead, or choose a smaller file (under 5MB).",
          )
          setLoading(false)
          return
        }
      }

      console.log("Submitting item:", finalFormData)
      onSubmit(finalFormData)
    } catch (error) {
      console.error("Error adding item:", error)
      alert("Failed to add item. Please check all fields and try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-cream-50 to-amber-50 border-amber-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-2xl font-serif text-amber-900">Add New Furniture Item</CardTitle>
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
                        setImagePreview("")
                        setFormData({ ...formData, image: "" })
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
                      <Input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                    <p className="text-sm text-amber-600">Upload a high-quality image of the furniture</p>
                  </div>
                )}
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
                  {/* Video Preview */}
                  {videoPreviewUrl && (
                    <div className="border-2 border-amber-300 rounded-lg p-4">
                      <video controls className="max-h-48 mx-auto rounded-lg w-full" src={videoPreviewUrl}>
                        Your browser does not support the video tag.
                      </video>
                      <p className="text-sm text-amber-600 text-center mt-2">
                        {videoFile ? `File: ${videoFile.name}` : "Video preview"}
                      </p>
                    </div>
                  )}

                  {/* Video Upload */}
                  <div className="border-2 border-dashed border-amber-300 rounded-lg p-6">
                    <div className="space-y-4 text-center">
                      <Video className="h-12 w-12 text-amber-400 mx-auto" />
                      <div>
                        <Label
                          htmlFor="video-upload"
                          className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg inline-block"
                        >
                          {videoFile ? "Change Video File" : "Choose Video File"}
                        </Label>
                        <Input
                          id="video-upload"
                          type="file"
                          accept="video/*"
                          onChange={handleVideoUpload}
                          className="hidden"
                        />
                      </div>
                      <p className="text-sm text-amber-600">Upload a video file (MP4, MOV, etc.)</p>
                      <p className="text-xs text-amber-500">
                        <strong>Recommended:</strong> Files under 5MB for best performance
                      </p>
                      <p className="text-xs text-amber-500">Maximum: 20MB</p>
                    </div>
                  </div>

                  {/* Video URL Alternative */}
                  <div className="space-y-2">
                    <Label className="text-amber-900 font-medium text-sm">Or enter video URL</Label>
                    <Input
                      value={formData.videoUrl?.startsWith("local-file:") ? "" : formData.videoUrl || ""}
                      onChange={(e) => handleVideoUrlChange(e.target.value)}
                      placeholder="https://example.com/video.mp4"
                      className="border-amber-300 focus:border-emerald-500"
                    />
                    <p className="text-xs text-amber-600">
                      For large videos, we recommend using a video URL (like YouTube, Vimeo, or cloud storage)
                    </p>
                  </div>
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
                {loading ? "Adding..." : "Add Item"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
