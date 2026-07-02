alter table categories enable row level security;
alter table contacts enable row level security;
alter table recurring_templates enable row level security;
alter table transactions enable row level security;
alter table subscriptions enable row level security;
alter table subscription_shares enable row level security;
alter table subscription_share_payments enable row level security;
alter table budgets enable row level security;

create policy "owner_select" on categories for select using (owner_id = auth.uid());
create policy "owner_insert" on categories for insert with check (owner_id = auth.uid());
create policy "owner_update" on categories for update using (owner_id = auth.uid());
create policy "owner_delete" on categories for delete using (owner_id = auth.uid());

create policy "owner_select" on contacts for select using (owner_id = auth.uid());
create policy "owner_insert" on contacts for insert with check (owner_id = auth.uid());
create policy "owner_update" on contacts for update using (owner_id = auth.uid());
create policy "owner_delete" on contacts for delete using (owner_id = auth.uid());

create policy "owner_select" on recurring_templates for select using (owner_id = auth.uid());
create policy "owner_insert" on recurring_templates for insert with check (owner_id = auth.uid());
create policy "owner_update" on recurring_templates for update using (owner_id = auth.uid());
create policy "owner_delete" on recurring_templates for delete using (owner_id = auth.uid());

create policy "owner_select" on transactions for select using (owner_id = auth.uid());
create policy "owner_insert" on transactions for insert with check (owner_id = auth.uid());
create policy "owner_update" on transactions for update using (owner_id = auth.uid());
create policy "owner_delete" on transactions for delete using (owner_id = auth.uid());

create policy "owner_select" on subscriptions for select using (owner_id = auth.uid());
create policy "owner_insert" on subscriptions for insert with check (owner_id = auth.uid());
create policy "owner_update" on subscriptions for update using (owner_id = auth.uid());
create policy "owner_delete" on subscriptions for delete using (owner_id = auth.uid());

create policy "owner_select" on subscription_shares for select using (owner_id = auth.uid());
create policy "owner_insert" on subscription_shares for insert with check (owner_id = auth.uid());
create policy "owner_update" on subscription_shares for update using (owner_id = auth.uid());
create policy "owner_delete" on subscription_shares for delete using (owner_id = auth.uid());

create policy "owner_select" on subscription_share_payments for select using (owner_id = auth.uid());
create policy "owner_insert" on subscription_share_payments for insert with check (owner_id = auth.uid());
create policy "owner_update" on subscription_share_payments for update using (owner_id = auth.uid());
create policy "owner_delete" on subscription_share_payments for delete using (owner_id = auth.uid());

create policy "owner_select" on budgets for select using (owner_id = auth.uid());
create policy "owner_insert" on budgets for insert with check (owner_id = auth.uid());
create policy "owner_update" on budgets for update using (owner_id = auth.uid());
create policy "owner_delete" on budgets for delete using (owner_id = auth.uid());
