import { FurnitureCard } from "@/components/furniture-card"

interface FurnitureItem {
  id: string
  name: string
  description: string
  price: string
  image: string
  hasVideo: boolean
  videoId?: string
}

interface RoomSectionProps {
  id: string
  title: string
  items: FurnitureItem[]
}

export function RoomSection({ id, title, items }: RoomSectionProps) {
  return (
    <section id={id} className="mb-16">
      <h3 className="text-2xl md:text-3xl font-serif font-bold text-primary mb-8 text-center">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => (
          <FurnitureCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  )
}
