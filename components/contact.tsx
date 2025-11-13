import { MessageCircle, Mail, Instagram, Facebook } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function Contact() {
  return (
    <section className="py-16 bg-cream-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">Get in Touch</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions about our furniture? We're here to help you find the perfect pieces for your home.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <Card className="text-center rounded-2xl shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">WhatsApp</h3>
              <a href="https://wa.me/message/5R7YM6GS4HIRF1" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="rounded-full bg-transparent">
                  Chat Now
                </Button>
              </a>
            </CardContent>
          </Card>

          <Card className="text-center rounded-2xl shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Email</h3>
              <a
                href="mailto:trevormaxwell203@gmail.com"
                className="text-xs text-muted-foreground hover:text-primary transition-colors break-all"
              >
                trevormaxwell203@gmail.com
              </a>
            </CardContent>
          </Card>

          <Card className="text-center rounded-2xl shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Instagram className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Instagram</h3>
              <p className="text-sm text-muted-foreground">Coming Soon</p>
            </CardContent>
          </Card>

          <Card className="text-center rounded-2xl shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Facebook className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Facebook</h3>
              <p className="text-sm text-muted-foreground">Coming Soon</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
