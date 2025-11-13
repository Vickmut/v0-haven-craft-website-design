import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Mail } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const designers = [
  {
    name: "Peter Mugo",
    email: "petermugoc@gmail.com",
    image: "/images/peter-mugo.jpeg",
    type: "image",
  },
  {
    name: "Maxewell Mutonyi",
    email: "trevormaxwell203@gmail.com",
    image: "/images/maxwell.jpeg",
    type: "image",
  },
  {
    name: "Victor Muthee",
    email: "vickmut148@gmail.com",
    image: null,
    type: "avatar",
  },
]

export function StyledByDesigners() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">Styled by Designers</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Meet the talented designers who curate our collections
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {designers.map((designer) => (
            <Card key={designer.name} className="text-center rounded-2xl shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  {designer.type === "image" ? (
                    <Image
                      src={designer.image || "/placeholder.svg"}
                      alt={designer.name}
                      fill
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <Avatar className="w-24 h-24">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback className="text-lg">
                        {designer.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
                <h3 className="font-serif font-semibold text-lg text-primary mb-2">{designer.name}</h3>
                <a
                  href={`mailto:${designer.email}`}
                  className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  <Mail className="h-4 w-4 mr-1" />
                  {designer.email}
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
