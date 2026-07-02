'use client'

import { useTransition } from 'react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { toggleTemplateActive } from '@/lib/actions/templates'

export function ToggleTemplateActive({ id, isActive }: { id: string; isActive: boolean }) {
  const [isPending, startTransition] = useTransition()

  const handleToggle = () => {
    startTransition(async () => {
      const result = await toggleTemplateActive(id, !isActive)
      if (result?.error) {
        toast.error(result.error)
        return
      }
      toast.success(isActive ? 'Plantilla pausada' : 'Plantilla activada')
    })
  }

  return (
    <button type="button" onClick={handleToggle} disabled={isPending}>
      <Badge variant={isActive ? 'default' : 'outline'} className="cursor-pointer">
        {isActive ? 'Activa' : 'Pausada'}
      </Badge>
    </button>
  )
}
