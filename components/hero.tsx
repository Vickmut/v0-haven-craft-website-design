import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{
          backgroundImage:
            "url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-XDAeo5SZNxKRG3nIKw6PgXsH2vHRcT.jpeg')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-cream-50/80 to-cream-100/80" />
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-primary mb-6 leading-tight">
          Discover Furniture that Complements You
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Curated room themes to inspire your space. Premium quality furniture crafted with care and attention to
          detail.
        </p>
        <Link href="#living-room">
          <Button
            size="lg"
            className="bg-primary hover:bg-brown-700 text-white px-8 py-4 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Browse Collections
          </Button>
        </Link>
      </div>
    </section>
  )
}
