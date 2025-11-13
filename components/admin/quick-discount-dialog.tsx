"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle } from "lucide-react"
import { updateItemDiscount } from "@/lib/firebase"

interface QuickDiscountDialogProps {
  itemId: string
  itemName: string
  currentPrice: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function QuickDiscountDialog({
  itemId,
  itemName,
  currentPrice,
  open,
  onOpenChange,
  onSuccess,
}: QuickDiscountDialogProps) {
  const [discountAmount, setDiscountAmount] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleApplyDiscount = async () => {
    if (!discountAmount || isNaN(Number.parseInt(discountAmount))) {
      setError("Please enter a valid discount amount")
      return
    }

    const discount = Number.parseInt(discountAmount)
    if (discount < 0) {
      setError("Discount cannot be negative")
      return
    }

    if (discount >= Number.parseInt(currentPrice)) {
      setError("Discount must be less than current price")
      return
    }

    setLoading(true)
    setError("")

    try {
      console.log("[v0] Applying discount to item:", itemId, "Discount:", discount)

      // Update discount in Firebase with real-time sync
      await updateItemDiscount(itemId, discount)

      console.log("[v0] Discount applied successfully")
      setSuccess(true)

      // Close dialog after 2 seconds
      setTimeout(() => {
        setDiscountAmount("")
        setSuccess(false)
        onOpenChange(false)
        onSuccess?.()
      }, 2000)
    } catch (err: any) {
      console.error("[v0] Error applying discount:", err)
      setError(err.message || "Failed to apply discount. Please try again.")
      setLoading(false)
    }
  }

  const handleRemoveDiscount = async () => {
    setLoading(true)
    setError("")

    try {
      console.log("[v0] Removing discount from item:", itemId)

      // Remove discount by setting to 0/null
      await updateItemDiscount(itemId, 0)

      console.log("[v0] Discount removed successfully")
      setSuccess(true)

      // Close dialog after 2 seconds
      setTimeout(() => {
        setDiscountAmount("")
        setSuccess(false)
        onOpenChange(false)
        onSuccess?.()
      }, 2000)
    } catch (err: any) {
      console.error("[v0] Error removing discount:", err)
      setError(err.message || "Failed to remove discount. Please try again.")
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-cream-50 to-amber-50 border-amber-200">
        <DialogHeader>
          <DialogTitle className="text-amber-900">Apply Quick Discount</DialogTitle>
        </DialogHeader>

        {success ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
            <p className="text-center text-green-700 font-medium">Discount applied successfully!</p>
            <p className="text-center text-sm text-amber-600">Changes will sync across all devices</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                <strong>Item:</strong> {itemName}
              </p>
              <p className="text-sm text-amber-800 mt-1">
                <strong>Current Price:</strong> KES {Number.parseInt(currentPrice).toLocaleString()}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="discount" className="text-amber-900 font-medium">
                Discounted Price (KES)
              </Label>
              <Input
                id="discount"
                type="number"
                value={discountAmount}
                onChange={(e) => {
                  setDiscountAmount(e.target.value)
                  setError("")
                }}
                placeholder="e.g., 15000"
                className="border-amber-300 focus:border-emerald-500"
                disabled={loading}
              />
              <p className="text-xs text-amber-600">Enter the new discounted price. Leave empty to remove discount.</p>
            </div>

            {error && (
              <div className="flex items-start space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {discountAmount && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700">
                  <strong>You save:</strong> KES{" "}
                  {(Number.parseInt(currentPrice) - Number.parseInt(discountAmount)).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        )}

        {!success && (
          <DialogFooter className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setDiscountAmount("")
                setError("")
                onOpenChange(false)
              }}
              disabled={loading}
              className="bg-transparent border-amber-300 text-amber-700 hover:bg-amber-100"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleRemoveDiscount}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700"
            >
              Remove Discount
            </Button>
            <Button
              type="button"
              onClick={handleApplyDiscount}
              disabled={loading || !discountAmount}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {loading ? "Applying..." : "Apply Discount"}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
