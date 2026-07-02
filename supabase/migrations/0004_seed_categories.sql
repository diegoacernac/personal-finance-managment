-- Seeds default categories automatically whenever a new user signs up (via Google OAuth),
-- so you never need to run this manually with the right auth context.
create or replace function handle_new_user_categories()
returns trigger as $$
begin
  insert into categories (owner_id, name, type, sort_order, is_system) values
    (new.id, 'Ingresos Fijos', 'income', 1, true),
    (new.id, 'Ingresos Variables', 'income', 2, true),
    (new.id, 'Servicios y Cuentas', 'expense', 3, true),
    (new.id, 'Comida', 'expense', 4, true),
    (new.id, 'Casa', 'expense', 5, true),
    (new.id, 'Pagos a Personas', 'expense', 6, true),
    (new.id, 'Suscripciones', 'expense', 7, true),
    (new.id, 'Pagos a Cuotas', 'installment', 8, true);
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created_seed_categories
  after insert on auth.users
  for each row execute function handle_new_user_categories();

-- One-off backfill for your existing user (the account you already logged in with):
-- replace the email below with your own, then run this block once.
insert into categories (owner_id, name, type, sort_order, is_system)
select u.id, c.name, c.type::transaction_type, c.sort_order, true
from auth.users u
cross join (values
  ('Ingresos Fijos', 'income', 1),
  ('Ingresos Variables', 'income', 2),
  ('Servicios y Cuentas', 'expense', 3),
  ('Comida', 'expense', 4),
  ('Casa', 'expense', 5),
  ('Pagos a Personas', 'expense', 6),
  ('Suscripciones', 'expense', 7),
  ('Pagos a Cuotas', 'installment', 8)
) as c(name, type, sort_order)
where u.email = 'dcerna@develovers.com.pe'
on conflict (owner_id, name, type) do nothing;

-- Block deletion of system categories at the DB level (not just in the UI)
create or replace function prevent_system_category_delete()
returns trigger as $$
begin
  if old.is_system then
    raise exception 'No se puede eliminar una categoría del sistema';
  end if;
  return old;
end;
$$ language plpgsql;

create trigger trg_prevent_system_category_delete
  before delete on categories
  for each row execute function prevent_system_category_delete();
