-- Links an auto-generated income transaction to the subscription share payment that
-- produced it, so marking a debtor's payment back to "unpaid" can cleanly remove it.
alter table transactions
  add column subscription_share_payment_id uuid
    references subscription_share_payments(id) on delete cascade;

create unique index uniq_transactions_share_payment
  on transactions(subscription_share_payment_id)
  where subscription_share_payment_id is not null;
