import { AuthForm } from "@/components/auth-form"
import { FloatingWhatsApp } from "@/components/floating-whatsapp"

export default function AuthPage() {
  return (
    <main className="min-h-screen bg-cream-50 flex items-center justify-center">
      <AuthForm />
      <FloatingWhatsApp />
    </main>
  )
}
