'use client'

import { useTransition } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { removeShare } from '@/lib/actions/subscriptions'
import { X } from 'lucide-react'

export function DeleteShareButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    startTransition(async () => {
      const result = await removeShare(id)
      if (result?.error) {
        toast.error(result.error)
        return
      }
      toast.success('Persona quitada')
    })
  }

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={handleDelete}
      disabled={isPending}
      className="text-muted-foreground"
    >
      <X className="h-3.5 w-3.5" />
    </Button>
  )
}
