-- Generate/backfill recurring template instances for a given month
create or replace function generate_transactions_for_period(p_period date)
returns void as $$
begin
  insert into transactions (owner_id, category_id, template_id, type, description, amount, transaction_date, period, status)
  select
    t.owner_id,
    t.category_id,
    t.id,
    t.type,
    t.description,
    t.amount,
    least(t.day_of_month, extract(day from (p_period + interval '1 month' - interval '1 day'))::int)
      + (date_trunc('month', p_period))::date - 1,
    p_period,
    'pending'
  from recurring_templates t
  where t.owner_id = auth.uid()
    and t.is_active
    and t.start_date <= (p_period + interval '1 month' - interval '1 day')::date
    and (t.end_date is null or t.end_date >= p_period)
  on conflict (template_id, period) do nothing;
end;
$$ language plpgsql security definer set search_path = public;

-- Generate subscription billing transaction + share_payment rows for a given month
create or replace function generate_subscription_period(p_period date)
returns void as $$
begin
  insert into transactions (owner_id, category_id, subscription_id, type, description, amount, transaction_date, period, status)
  select
    s.owner_id,
    s.category_id,
    s.id,
    'expense',
    s.platform,
    s.total_plan_amount,
    least(s.billing_day, extract(day from (p_period + interval '1 month' - interval '1 day'))::int)
      + (date_trunc('month', p_period))::date - 1,
    p_period,
    'pending'
  from subscriptions s
  where s.owner_id = auth.uid() and s.is_active
  on conflict (subscription_id, period) where subscription_id is not null do nothing;

  insert into subscription_share_payments (owner_id, subscription_share_id, period, amount, status)
  select ss.owner_id, ss.id, p_period, ss.amount, 'unpaid'
  from subscription_shares ss
  join subscriptions s on s.id = ss.subscription_id
  where s.owner_id = auth.uid() and s.is_active
  on conflict (subscription_share_id, period) do nothing;
end;
$$ language plpgsql security definer set search_path = public;

-- Monthly totals for bar chart (last N months)
create or replace function get_monthly_totals(p_months integer default 6)
returns table(period date, income_total numeric, expense_total numeric) as $$
  select period,
         sum(amount) filter (where type = 'income') as income_total,
         sum(amount) filter (where type in ('expense','installment')) as expense_total
  from transactions
  where owner_id = auth.uid()
    and period >= date_trunc('month', current_date) - (p_months || ' months')::interval
  group by period
  order by period;
$$ language sql stable security definer set search_path = public;

-- End of month projection
create or replace function get_month_projection(p_period date)
returns table(income_received numeric, income_pending numeric, expense_paid numeric,
              expense_pending numeric, projected_balance numeric) as $$
  select
    coalesce(sum(amount) filter (where type='income' and status='completed'), 0),
    coalesce(sum(amount) filter (where type='income' and status='pending'), 0),
    coalesce(sum(amount) filter (where type in ('expense','installment') and status='completed'), 0),
    coalesce(sum(amount) filter (where type in ('expense','installment') and status='pending'), 0),
    coalesce(sum(amount) filter (where type='income'), 0)
      - coalesce(sum(amount) filter (where type in ('expense','installment')), 0)
  from transactions
  where owner_id = auth.uid() and period = p_period;
$$ language sql stable security definer set search_path = public;

-- Budget status (semaforo) for a given period
create or replace function get_budget_status(p_period date)
returns table(budget_id uuid, category_id uuid, limit_amount numeric,
              warning_threshold_pct smallint, spent numeric, semaforo_status text) as $$
  select
    b.id, b.category_id, b.limit_amount, b.warning_threshold_pct,
    coalesce(t.spent, 0),
    case
      when coalesce(t.spent, 0) >= b.limit_amount then 'red'
      when coalesce(t.spent, 0) >= b.limit_amount * b.warning_threshold_pct / 100.0 then 'yellow'
      else 'green'
    end
  from budgets b
  left join lateral (
    select sum(amount) as spent
    from transactions tx
    where tx.owner_id = b.owner_id
      and tx.type in ('expense','installment')
      and (b.category_id is null or tx.category_id = b.category_id)
      and tx.period = p_period
  ) t on true
  where b.owner_id = auth.uid() and b.is_active;
$$ language sql stable security definer set search_path = public;

-- Diego's net subscription cost (view, derived not stored; RLS on subscriptions/shares still applies since not security definer)
create view subscription_net_cost as
select s.id as subscription_id, s.total_plan_amount,
       coalesce(sum(ss.amount), 0) as total_shared,
       s.total_plan_amount - coalesce(sum(ss.amount), 0) as diego_net_cost
from subscriptions s
left join subscription_shares ss on ss.subscription_id = s.id
group by s.id, s.total_plan_amount;
