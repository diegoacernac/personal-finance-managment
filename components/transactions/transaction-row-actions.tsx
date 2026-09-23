'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { TransactionFormDialog } from '@/components/transactions/transaction-form-dialog'
import { deleteTransaction } from '@/lib/actions/transactions'
import type { Category, TransactionWithCategory } from '@/lib/types'
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'

export function TransactionRowActions({
  transaction,
  categories,
}: {
  transaction: TransactionWithCategory
  categories: Category[]
}) {
  const [editOpen, setEditOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    if (!confirm('¿Eliminar este movimiento?')) return

    startTransition(async () => {
      const result = await deleteTransaction(transaction.id)
      if (result?.error) {
        toast.error(result.error)
        return
      }
      toast.success('Movimiento eliminado')
    })
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              disabled={isPending}
              aria-label="Acciones"
              className="text-muted-foreground opacity-70 transition-opacity group-hover/row:opacity-100 data-popup-open:opacity-100"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="w-36">
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <Pencil />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive" onClick={handleDelete}>
            <Trash2 />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Mounted only while open so each row doesn't hydrate a full form. */}
      {editOpen && (
        <TransactionFormDialog
          categories={categories}
          transaction={transaction}
          open={editOpen}
          onOpenChange={setEditOpen}
        />
      )}
    </>
  )
}
