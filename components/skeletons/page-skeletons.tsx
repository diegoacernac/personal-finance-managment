import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

function HeaderSkeleton({ withActions = true }: { withActions?: boolean }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      {withActions && <Skeleton className="h-9 w-56" />}
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Cargando">
      <HeaderSkeleton />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <Card key={i} className="gap-3 p-5">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-36" />
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="p-4 lg:col-span-2">
          <Skeleton className="h-64 w-full" />
        </Card>
        <Card className="gap-3 p-4">
          {[0, 1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-5 w-full" />
          ))}
        </Card>
      </div>
    </div>
  )
}

export function TransactionsSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Cargando">
      <HeaderSkeleton />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <Card key={i} className="gap-3 p-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-6 w-28" />
            </div>
            {[0, 1, 2, 3].map((j) => (
              <Skeleton key={j} className="h-11 w-full" />
            ))}
          </Card>
        ))}
      </div>
    </div>
  )
}

export function ListSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Cargando">
      <HeaderSkeleton />
      <Card className="gap-0 divide-y p-0">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-3 w-3 rounded-full" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-56" />
              </div>
            </div>
            <Skeleton className="h-8 w-20" />
          </div>
        ))}
      </Card>
    </div>
  )
}
