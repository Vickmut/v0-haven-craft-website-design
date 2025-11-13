import Image from "next/image"
import { MessageCircle, Truck, Clock, CreditCard, CheckCircle, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface ItemDetailProps {
  item: {
    id: string
    name: string
    description: string
    price: string
    dimensions: string
    material: string
    image: string
    hasVideo: boolean
    videoUrl?: string
  }
}

// Helper function to detect video URL type
const getVideoType = (url: string) => {
  if (!url) return "none"

  // YouTube detection (including Shorts)
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    return "youtube"
  }

  // Vimeo detection
  if (url.includes("vimeo.com")) {
    return "vimeo"
  }

  // Direct video file detection
  if (url.match(/\.(mp4|webm|ogg|mov|avi)(\?.*)?$/i) || url.startsWith("data:video/") || url.includes("blob.vercel")) {
    return "direct"
  }

  return "unknown"
}

// Helper function to get YouTube embed URL
const getYouTubeEmbedUrl = (url: string) => {
  // Handle different YouTube URL formats
  let videoId = ""

  if (url.includes("youtube.com/shorts/")) {
    videoId = url.split("/shorts/")[1].split("?")[0]
  } else if (url.includes("youtube.com/watch?v=")) {
    videoId = url.split("v=")[1].split("&")[0]
  } else if (url.includes("youtu.be/")) {
    videoId = url.split("youtu.be/")[1].split("?")[0]
  }

  return videoId ? `https://www.youtube.com/embed/${videoId}` : null
}

export function ItemDetail({ item }: ItemDetailProps) {
  const videoType = getVideoType(item.videoUrl || "")
  const youtubeEmbedUrl = videoType === "youtube" ? getYouTubeEmbedUrl(item.videoUrl || "") : null

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Image/Video Section */}
        <div className="space-y-4">
          <Card className="overflow-hidden rounded-2xl">
            <Image
              src={item.image || "/placeholder.svg"}
              alt={item.name}
              width={600}
              height={400}
              className="w-full h-96 object-cover"
            />
          </Card>

          {item.hasVideo && item.videoUrl && (
            <Card className="overflow-hidden rounded-2xl">
              <CardContent className="p-0">
                {videoType === "youtube" && youtubeEmbedUrl ? (
                  // YouTube embed
                  <div className="relative w-full h-64">
                    <iframe
                      src={youtubeEmbedUrl}
                      title="Product Video"
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : videoType === "direct" ? (
                  // Direct video file
                  <video controls className="w-full h-64 object-cover" poster={item.image}>
                    <source src={item.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  // Fallback for unsupported video types
                  <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
                    <div className="text-center p-6">
                      <p className="text-gray-600 mb-4">Video not supported for direct playback</p>
                      <a
                        href={item.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Watch on External Site
                      </a>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Details Section */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">{item.name}</h1>
            <p className="text-2xl font-semibold text-primary mb-6">{item.price}</p>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">{item.description}</p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Dimensions</h3>
              <p className="text-muted-foreground">{item.dimensions}</p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Material</h3>
              <p className="text-muted-foreground">{item.material}</p>
            </div>
          </div>

          {/* Payment & Delivery Information */}
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4 text-green-800 flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Payment & Delivery Information
              </h3>
              <ul className="space-y-3 text-green-700">
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 mt-0.5 text-green-600 flex-shrink-0" />
                  <span>
                    <strong>Payment:</strong> Payment after delivery - Pay only when you receive your furniture
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <Truck className="h-5 w-5 mt-0.5 text-green-600 flex-shrink-0" />
                  <span>
                    <strong>Fast Delivery:</strong> Delivery completed in less than 5 hours within Nairobi
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 mt-0.5 text-green-600 flex-shrink-0" />
                  <span>
                    <strong>Same Day Service:</strong> Order today, receive today (conditions apply)
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 mt-0.5 text-green-600 flex-shrink-0" />
                  <span>
                    <strong>Quality Guarantee:</strong> Inspect your furniture before payment
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <div className="pt-6">
            <a href="https://wa.me/message/5R7YM6GS4HIRF1" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="w-full bg-green-600 hover:bg-green-700 text-white rounded-2xl py-4 text-lg">
                <MessageCircle className="mr-2 h-5 w-5" />
                Contact Seller on WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
