import { Card } from '@/components/ui/card'
import { PageHeader } from '@/components/layout/page-header'
import { PieChart } from 'lucide-react'

export default function ReportesPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Reportes" subtitle="Tendencias y comparativas de tus finanzas" />

      <Card className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <PieChart className="h-7 w-7" />
        </div>
        <div>
          <p className="font-medium">Próximamente</p>
          <p className="mx-auto max-w-sm text-sm text-muted-foreground">
            Aquí verás tendencias históricas mes a mes y comparativas por categoría.
          </p>
        </div>
      </Card>
    </div>
  )
}
