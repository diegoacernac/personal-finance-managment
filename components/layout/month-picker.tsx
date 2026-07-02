import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { formatPeriodLabel, shiftPeriod } from '@/lib/period'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function MonthPicker({ period, basePath }: { period: string; basePath: string }) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        nativeButton={false}
        render={
          <Link href={`${basePath}?period=${shiftPeriod(period, -1)}`}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        }
      />
      <span className="min-w-40 text-center text-sm font-medium capitalize">
        {formatPeriodLabel(period)}
      </span>
      <Button
        variant="outline"
        size="icon"
        nativeButton={false}
        render={
          <Link href={`${basePath}?period=${shiftPeriod(period, 1)}`}>
            <ChevronRight className="h-4 w-4" />
          </Link>
        }
      />
    </div>
  )
}
