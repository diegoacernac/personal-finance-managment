-- ENUMS
create type transaction_type as enum ('income', 'expense', 'installment');
create type transaction_status as enum ('pending', 'completed');
create type recurrence_frequency as enum ('monthly');
create type share_status as enum ('unpaid', 'paid');

-- CATEGORIES
create table categories (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) default auth.uid(),
  name text not null,
  type transaction_type not null,
  color text default '#64748b',
  icon text,
  is_system boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (owner_id, name, type)
);

-- CONTACTS (debtors / subscription-sharers)
create table contacts (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) default auth.uid(),
  name text not null,
  notes text,
  created_at timestamptz not null default now(),
  unique (owner_id, name)
);

-- RECURRING TEMPLATES (income / expense / installment)
create table recurring_templates (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) default auth.uid(),
  category_id uuid not null references categories(id) on delete restrict,
  type transaction_type not null,
  description text not null,
  amount numeric(12,2) not null check (amount >= 0), -- installment: monthly cuota
  total_amount numeric(12,2), -- installment only: total debt
  day_of_month smallint not null check (day_of_month between 1 and 31),
  frequency recurrence_frequency not null default 'monthly',
  is_active boolean not null default true,
  start_date date not null default current_date,
  end_date date,
  installments_total integer,
  installments_paid_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- TRANSACTIONS (auto-generated instances OR manual one-offs)
create table transactions (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) default auth.uid(),
  category_id uuid not null references categories(id) on delete restrict,
  template_id uuid references recurring_templates(id) on delete set null,
  subscription_id uuid, -- FK added after subscriptions table below
  type transaction_type not null,
  description text not null,
  amount numeric(12,2) not null check (amount >= 0),
  transaction_date date not null,
  period date not null, -- first-of-month marker, e.g. 2026-06-01
  status transaction_status not null default 'pending',
  completed_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (template_id, period)
);
create index idx_transactions_owner_period on transactions(owner_id, period);
create index idx_transactions_category on transactions(category_id);

-- SUBSCRIPTIONS (specialized expense sub-type; NO credentials storage - out of scope)
create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) default auth.uid(),
  category_id uuid not null references categories(id) on delete restrict,
  platform text not null,
  billing_day smallint not null check (billing_day between 1 and 31),
  total_plan_amount numeric(12,2) not null check (total_plan_amount >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table transactions
  add constraint fk_transactions_subscription
  foreign key (subscription_id) references subscriptions(id) on delete set null;
create unique index uniq_transactions_subscription_period
  on transactions(subscription_id, period) where subscription_id is not null;

-- SUBSCRIPTION SHARES (static per-person default amount owed)
create table subscription_shares (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) default auth.uid(),
  subscription_id uuid not null references subscriptions(id) on delete cascade,
  contact_id uuid not null references contacts(id) on delete restrict,
  amount numeric(12,2) not null check (amount >= 0),
  created_at timestamptz not null default now(),
  unique (subscription_id, contact_id)
);

-- SUBSCRIPTION SHARE PAYMENTS (per-cycle paid/unpaid instance)
create table subscription_share_payments (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) default auth.uid(),
  subscription_share_id uuid not null references subscription_shares(id) on delete cascade,
  period date not null,
  amount numeric(12,2) not null,
  status share_status not null default 'unpaid',
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  unique (subscription_share_id, period)
);
create index idx_sub_share_pay_owner_period on subscription_share_payments(owner_id, period);

-- BUDGETS (per category, or overall when category_id is null)
create table budgets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) default auth.uid(),
  category_id uuid references categories(id) on delete cascade,
  limit_amount numeric(12,2) not null check (limit_amount >= 0),
  warning_threshold_pct smallint not null default 80,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (owner_id, category_id)
);

-- updated_at trigger
create or replace function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_templates_updated before update on recurring_templates
  for each row execute function set_updated_at();
create trigger trg_transactions_updated before update on transactions
  for each row execute function set_updated_at();
create trigger trg_subscriptions_updated before update on subscriptions
  for each row execute function set_updated_at();
create trigger trg_budgets_updated before update on budgets
  for each row execute function set_updated_at();
