import { getSubscriptionsWithShares } from '@/lib/queries/subscriptions'
import { getCategories } from '@/lib/queries/categories'
import { getContacts } from '@/lib/queries/contacts'
import { currentPeriod } from '@/lib/period'
import { MonthPicker } from '@/components/layout/month-picker'
import { SubscriptionFormDialog } from '@/components/subscriptions/subscription-form-dialog'
import { SubscriptionCard } from '@/components/subscriptions/subscription-card'
import { PageHeader } from '@/components/layout/page-header'

export default async function SuscripcionesPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>
}) {
  const params = await searchParams
  const period = params.period ?? currentPeriod()

  const [subscriptions, categories, contacts] = await Promise.all([
    getSubscriptionsWithShares(period),
    getCategories(),
    getContacts(),
  ])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Suscripciones"
        subtitle="El estado de pago de cada persona corresponde al mes seleccionado"
        actions={
          <>
            <MonthPicker period={period} basePath="/configuracion/suscripciones" />
            <SubscriptionFormDialog categories={categories} />
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {subscriptions.map((subscription) => (
          <SubscriptionCard
            key={subscription.id}
            subscription={subscription}
            categories={categories}
            contacts={contacts}
          />
        ))}
      </div>

      {subscriptions.length === 0 && (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No tienes suscripciones todavía.
        </p>
      )}
    </div>
  )
}
