'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { formatPEN } from '@/lib/currency'
import { SharePaymentToggle } from '@/components/subscriptions/share-payment-toggle'
import type { SubscriptionShareWithStatus } from '@/lib/types'
import { ChevronDown, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

export function SubscriptionSharesDisclosure({
  shares,
}: {
  shares: SubscriptionShareWithStatus[]
}) {
  const [open, setOpen] = useState(false)

  if (shares.length === 0) return null

  const paidCount = shares.filter((s) => s.payment_status === 'paid').length

  return (
    <div className="border-t bg-muted/30 px-2 py-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen((v) => !v)}
        className="h-6 gap-1 px-1 text-xs text-muted-foreground"
      >
        <Users className="h-3 w-3" />
        {paidCount}/{shares.length} pagaron
        <ChevronDown className={cn('h-3 w-3 transition-transform', open && 'rotate-180')} />
      </Button>

      {open && (
        <div className="mt-1 space-y-0.5 pb-1">
          {shares.map((share) => (
            <div key={share.id} className="flex items-center justify-between pl-4 text-xs">
              <span className="text-muted-foreground">
                {share.contact_name} · {formatPEN(share.amount)}
              </span>
              <SharePaymentToggle paymentId={share.payment_id} status={share.payment_status} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
