"use client"

import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function FloatingWhatsApp() {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative">
        {showTooltip && (
          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap">
            Contact Us
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        )}
        <a href="https://wa.me/message/5R7YM6GS4HIRF1" target="_blank" rel="noopener noreferrer">
          <Button
            size="lg"
            className="bg-green-500 hover:bg-green-600 text-white rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <MessageCircle className="h-6 w-6" />
            <span className="sr-only">Contact us on WhatsApp</span>
          </Button>
        </a>
      </div>
    </div>
  )
}
