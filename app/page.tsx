import { Hero } from "@/components/hero"
import { CuratedRooms } from "@/components/curated-rooms"
import { RecentlyAdded } from "@/components/recently-added"
import { StyledByDesigners } from "@/components/styled-by-designers"
import { Contact } from "@/components/contact"
import { FloatingWhatsApp } from "@/components/floating-whatsapp"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-cream-50">
      <Hero />
      <CuratedRooms />
      <RecentlyAdded />
      <StyledByDesigners />
      <Contact />
      <FloatingWhatsApp />
    </main>
  )
}
