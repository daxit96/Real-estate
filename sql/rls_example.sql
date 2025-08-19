-- RLS example for 'deals' table
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

ALTER TABLE deals ENABLE ROW LEVEL SECURITY;

CREATE POLICY deals_tenant_isolation ON deals
  USING (tenant_id = current_setting('app.current_tenant')::uuid);

-- In your app, after validating JWT & tenant resolution, run:
-- SET app.current_tenant = '<tenant-uuid>';
