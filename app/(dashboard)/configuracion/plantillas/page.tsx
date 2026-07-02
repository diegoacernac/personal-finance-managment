import { getTemplates } from '@/lib/queries/templates'
import { getCategories } from '@/lib/queries/categories'
import { formatPEN } from '@/lib/currency'
import { TemplateFormDialog } from '@/components/templates/template-form-dialog'
import { ToggleTemplateActive } from '@/components/templates/toggle-template-active'
import { DeleteTemplateButton } from '@/components/templates/delete-template-button'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/layout/page-header'

const TYPE_LABELS = {
  income: 'Ingreso fijo',
  expense: 'Gasto fijo',
  installment: 'Cuota',
} as const

export default async function PlantillasPage() {
  const [templates, categories] = await Promise.all([getTemplates(), getCategories()])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Plantillas recurrentes"
        subtitle="Se generan automáticamente cada mes en el día indicado"
        actions={<TemplateFormDialog categories={categories} />}
      />

      <div className="divide-y rounded-lg border">
        {templates.map((template) => (
          <div
            key={template.id}
            className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-3">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: template.categories?.color ?? '#64748b' }}
              />
              <div>
                <p className="font-medium">{template.description}</p>
                <p className="text-sm text-muted-foreground">
                  {template.categories?.name ?? '—'} · día {template.day_of_month} ·{' '}
                  {TYPE_LABELS[template.type]}
                  {template.type === 'installment' && template.installments_total && (
                    <> · cuota {template.installments_paid_count}/{template.installments_total}</>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-semibold">{formatPEN(template.amount)}</span>
              <ToggleTemplateActive id={template.id} isActive={template.is_active} />
              <TemplateFormDialog categories={categories} template={template} />
              <DeleteTemplateButton id={template.id} />
            </div>
          </div>
        ))}
        {templates.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">
            No tienes plantillas todavía. Crea una para tu sueldo, Netflix, préstamos, etc.
          </p>
        )}
      </div>
    </div>
  )
}
