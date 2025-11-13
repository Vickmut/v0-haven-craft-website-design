"use client"

import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SignOutDialogProps {
  onConfirm: () => void
  onCancel: () => void
}

export function SignOutDialog({ onConfirm, onCancel }: SignOutDialogProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <LogOut className="h-6 w-6 text-orange-600" />
          </div>
          <CardTitle className="text-xl font-serif text-orange-900">Sign Out</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-orange-800">Are you sure you want to sign out?</p>
          <p className="text-sm text-orange-600">You'll need to sign in again to access your wishlist.</p>

          <div className="flex space-x-4 pt-4">
            <Button
              variant="outline"
              onClick={onCancel}
              className="flex-1 bg-transparent border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button onClick={onConfirm} className="flex-1 bg-orange-600 hover:bg-orange-700 text-white">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
