import { getCategories } from '@/lib/queries/categories'
import { CategoryFormDialog } from '@/components/categories/category-form-dialog'
import { DeleteCategoryButton } from '@/components/categories/delete-category-button'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/layout/page-header'

const TYPE_LABELS = {
  income: 'Ingreso',
  expense: 'Gasto',
  installment: 'Cuota',
} as const

export default async function CategoriasPage() {
  const categories = await getCategories()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categorías"
        subtitle="Organiza tus ingresos y gastos"
        actions={<CategoryFormDialog />}
      />

      <div className="divide-y rounded-lg border">
        {categories.map((category) => (
          <div key={category.id} className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <span className="font-medium">{category.name}</span>
              <Badge variant="secondary">{TYPE_LABELS[category.type]}</Badge>
              {category.is_system && (
                <Badge variant="outline" className="text-muted-foreground">
                  Sistema
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1">
              <CategoryFormDialog category={category} />
              {!category.is_system && <DeleteCategoryButton id={category.id} />}
            </div>
          </div>
        ))}
        {categories.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">
            No tienes categorías todavía.
          </p>
        )}
      </div>
    </div>
  )
}
