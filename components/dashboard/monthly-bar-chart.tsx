'use client'

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card } from '@/components/ui/card'
import { formatPEN } from '@/lib/currency'
import type { MonthlyTotal } from '@/lib/types'
import { BarChart3 } from 'lucide-react'

function monthLabel(period: string) {
  const [year, month] = period.split('-').map(Number)
  return new Date(year, month - 1, 1).toLocaleDateString('es-PE', { month: 'short' })
}

export function MonthlyBarChart({ data }: { data: MonthlyTotal[] }) {
  const chartData = data.map((d) => ({
    month: monthLabel(d.period),
    Ingresos: d.income_total ?? 0,
    Gastos: d.expense_total ?? 0,
  }))

  return (
    <Card className="animate-in fade-in slide-in-from-bottom-2 p-4 delay-300 duration-500">
      <div className="mb-4 flex items-center gap-2">
        <BarChart3 className="h-4 w-4 text-primary" />
        <p className="text-sm font-medium text-muted-foreground">Ingresos vs. Gastos</p>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
            <YAxis
              tickLine={false}
              axisLine={false}
              fontSize={12}
              tickFormatter={(value) => `S/ ${value}`}
              width={70}
            />
            <Tooltip
              formatter={(value) => formatPEN(Number(value))}
              cursor={{ fill: 'var(--accent)' }}
              contentStyle={{
                backgroundColor: 'var(--popover)',
                color: 'var(--popover-foreground)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                fontSize: 12,
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="Ingresos" fill="#10b981" radius={[6, 6, 0, 0]} />
            <Bar dataKey="Gastos" fill="#ef4444" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
