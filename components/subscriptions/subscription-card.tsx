import { Card } from '@/components/ui/card'
import { formatPEN } from '@/lib/currency'
import type { Category, Contact, SubscriptionWithShares } from '@/lib/types'
import { SubscriptionFormDialog } from '@/components/subscriptions/subscription-form-dialog'
import { DeleteSubscriptionButton } from '@/components/subscriptions/delete-subscription-button'
import { ToggleSubscriptionActive } from '@/components/subscriptions/toggle-subscription-active'
import { ShareFormDialog } from '@/components/subscriptions/share-form-dialog'
import { DeleteShareButton } from '@/components/subscriptions/delete-share-button'
import { SharePaymentToggle } from '@/components/subscriptions/share-payment-toggle'

export function SubscriptionCard({
  subscription,
  categories,
  contacts,
}: {
  subscription: SubscriptionWithShares
  categories: Category[]
  contacts: Contact[]
}) {
  const usedContactIds = new Set(subscription.shares.map((s) => s.contact_id))
  const availableContacts = contacts.filter((c) => !usedContactIds.has(c.id))

  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: subscription.categories?.color ?? '#64748b' }}
          />
          <div>
            <p className="font-semibold">{subscription.platform}</p>
            <p className="text-sm text-muted-foreground">
              Día {subscription.billing_day} · Plan {formatPEN(subscription.total_plan_amount)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ToggleSubscriptionActive id={subscription.id} isActive={subscription.is_active} />
          <SubscriptionFormDialog categories={categories} subscription={subscription} />
          <DeleteSubscriptionButton id={subscription.id} />
        </div>
      </div>

      <div className="mt-4 rounded-lg bg-muted/50 px-3 py-2 text-sm">
        <span className="text-muted-foreground">Costo neto para ti: </span>
        <span className="font-semibold">{formatPEN(subscription.net_cost)}</span>
      </div>

      <div className="mt-4 space-y-2">
        {subscription.shares.map((share) => (
          <div
            key={share.id}
            className="flex items-center justify-between rounded-md border px-3 py-2"
          >
            <div>
              <p className="text-sm font-medium">{share.contact_name}</p>
              <p className="text-xs text-muted-foreground">{formatPEN(share.amount)}/mes</p>
            </div>
            <div className="flex items-center gap-1">
              <SharePaymentToggle paymentId={share.payment_id} status={share.payment_status} />
              <DeleteShareButton id={share.id} />
            </div>
          </div>
        ))}
        {subscription.shares.length === 0 && (
          <p className="py-2 text-center text-sm text-muted-foreground">
            Nadie más comparte esta suscripción.
          </p>
        )}
      </div>

      <div className="mt-3">
        <ShareFormDialog subscriptionId={subscription.id} contacts={availableContacts} />
      </div>
    </Card>
  )
}
