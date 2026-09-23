-- Performance: wrap auth.uid() in a sub-select so Postgres evaluates it once per
-- query (initPlan) instead of once per row. Same semantics as 0002_rls.sql.
-- https://supabase.com/docs/guides/database/postgres/row-level-security#call-functions-with-select

drop policy "owner_select" on categories;
drop policy "owner_insert" on categories;
drop policy "owner_update" on categories;
drop policy "owner_delete" on categories;
create policy "owner_select" on categories for select using (owner_id = (select auth.uid()));
create policy "owner_insert" on categories for insert with check (owner_id = (select auth.uid()));
create policy "owner_update" on categories for update using (owner_id = (select auth.uid()));
create policy "owner_delete" on categories for delete using (owner_id = (select auth.uid()));

drop policy "owner_select" on contacts;
drop policy "owner_insert" on contacts;
drop policy "owner_update" on contacts;
drop policy "owner_delete" on contacts;
create policy "owner_select" on contacts for select using (owner_id = (select auth.uid()));
create policy "owner_insert" on contacts for insert with check (owner_id = (select auth.uid()));
create policy "owner_update" on contacts for update using (owner_id = (select auth.uid()));
create policy "owner_delete" on contacts for delete using (owner_id = (select auth.uid()));

drop policy "owner_select" on recurring_templates;
drop policy "owner_insert" on recurring_templates;
drop policy "owner_update" on recurring_templates;
drop policy "owner_delete" on recurring_templates;
create policy "owner_select" on recurring_templates for select using (owner_id = (select auth.uid()));
create policy "owner_insert" on recurring_templates for insert with check (owner_id = (select auth.uid()));
create policy "owner_update" on recurring_templates for update using (owner_id = (select auth.uid()));
create policy "owner_delete" on recurring_templates for delete using (owner_id = (select auth.uid()));

drop policy "owner_select" on transactions;
drop policy "owner_insert" on transactions;
drop policy "owner_update" on transactions;
drop policy "owner_delete" on transactions;
create policy "owner_select" on transactions for select using (owner_id = (select auth.uid()));
create policy "owner_insert" on transactions for insert with check (owner_id = (select auth.uid()));
create policy "owner_update" on transactions for update using (owner_id = (select auth.uid()));
create policy "owner_delete" on transactions for delete using (owner_id = (select auth.uid()));

drop policy "owner_select" on subscriptions;
drop policy "owner_insert" on subscriptions;
drop policy "owner_update" on subscriptions;
drop policy "owner_delete" on subscriptions;
create policy "owner_select" on subscriptions for select using (owner_id = (select auth.uid()));
create policy "owner_insert" on subscriptions for insert with check (owner_id = (select auth.uid()));
create policy "owner_update" on subscriptions for update using (owner_id = (select auth.uid()));
create policy "owner_delete" on subscriptions for delete using (owner_id = (select auth.uid()));

drop policy "owner_select" on subscription_shares;
drop policy "owner_insert" on subscription_shares;
drop policy "owner_update" on subscription_shares;
drop policy "owner_delete" on subscription_shares;
create policy "owner_select" on subscription_shares for select using (owner_id = (select auth.uid()));
create policy "owner_insert" on subscription_shares for insert with check (owner_id = (select auth.uid()));
create policy "owner_update" on subscription_shares for update using (owner_id = (select auth.uid()));
create policy "owner_delete" on subscription_shares for delete using (owner_id = (select auth.uid()));

drop policy "owner_select" on subscription_share_payments;
drop policy "owner_insert" on subscription_share_payments;
drop policy "owner_update" on subscription_share_payments;
drop policy "owner_delete" on subscription_share_payments;
create policy "owner_select" on subscription_share_payments for select using (owner_id = (select auth.uid()));
create policy "owner_insert" on subscription_share_payments for insert with check (owner_id = (select auth.uid()));
create policy "owner_update" on subscription_share_payments for update using (owner_id = (select auth.uid()));
create policy "owner_delete" on subscription_share_payments for delete using (owner_id = (select auth.uid()));

drop policy "owner_select" on budgets;
drop policy "owner_insert" on budgets;
drop policy "owner_update" on budgets;
drop policy "owner_delete" on budgets;
create policy "owner_select" on budgets for select using (owner_id = (select auth.uid()));
create policy "owner_insert" on budgets for insert with check (owner_id = (select auth.uid()));
create policy "owner_update" on budgets for update using (owner_id = (select auth.uid()));
create policy "owner_delete" on budgets for delete using (owner_id = (select auth.uid()));

-- Owner indexes for tables filtered only by RLS (transactions and share payments
-- already have composite owner/period indexes).
create index if not exists idx_categories_owner on categories(owner_id, sort_order);
create index if not exists idx_contacts_owner on contacts(owner_id);
create index if not exists idx_templates_owner on recurring_templates(owner_id);
create index if not exists idx_subscriptions_owner on subscriptions(owner_id);
create index if not exists idx_subscription_shares_owner on subscription_shares(owner_id);
create index if not exists idx_subscription_shares_contact on subscription_shares(contact_id);
