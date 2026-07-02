import { getContacts } from '@/lib/queries/contacts'
import { ContactFormDialog } from '@/components/contacts/contact-form-dialog'
import { DeleteContactButton } from '@/components/contacts/delete-contact-button'
import { PageHeader } from '@/components/layout/page-header'

export default async function ContactosPage() {
  const contacts = await getContacts()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Contactos"
        subtitle="Personas que comparten el costo de tus suscripciones"
        actions={<ContactFormDialog />}
      />

      <div className="divide-y rounded-lg border">
        {contacts.map((contact) => (
          <div key={contact.id} className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="font-medium">{contact.name}</p>
              {contact.notes && <p className="text-sm text-muted-foreground">{contact.notes}</p>}
            </div>
            <div className="flex items-center gap-1">
              <ContactFormDialog contact={contact} />
              <DeleteContactButton id={contact.id} />
            </div>
          </div>
        ))}
        {contacts.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">
            No tienes contactos todavía.
          </p>
        )}
      </div>
    </div>
  )
}
