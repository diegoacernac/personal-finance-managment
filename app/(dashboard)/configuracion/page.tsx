import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { PageHeader } from '@/components/layout/page-header'
import { Tag, Repeat, Tv, Users, Wallet, ChevronRight } from 'lucide-react'

const SECTIONS = [
  { href: '/configuracion/categorias', label: 'Categorías', description: 'Organiza tus ingresos y gastos', icon: Tag },
  { href: '/configuracion/plantillas', label: 'Plantillas recurrentes', description: 'Sueldo, suscripciones, préstamos y cuotas fijas', icon: Repeat },
  { href: '/configuracion/suscripciones', label: 'Suscripciones', description: 'Netflix, Disney+, y quién comparte cada plan', icon: Tv },
  { href: '/configuracion/contactos', label: 'Contactos', description: 'Personas que te deben por suscripciones compartidas', icon: Users },
  { href: '/presupuestos', label: 'Presupuestos', description: 'Límites mensuales con alerta visual', icon: Wallet },
]

export default function ConfiguracionPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Configuración"
        subtitle="Administra los datos que alimentan tu dashboard"
      />
      <div className="grid gap-3 sm:grid-cols-2">
        {SECTIONS.map((section) => (
          <Link key={section.href} href={section.href} className="group">
            <Card
              className="flex flex-row items-center gap-4 p-4 hover:shadow-md"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-105">
                <section.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium">{section.label}</p>
                <p className="text-sm text-muted-foreground">{section.description}</p>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
