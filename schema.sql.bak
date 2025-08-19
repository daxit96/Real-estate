-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tenants table - Core multi-tenant structure
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    subdomain VARCHAR(50) UNIQUE,
    status TEXT NOT NULL DEFAULT 'trial' CHECK (status IN ('active', 'suspended', 'trial', 'expired')),
    subscription_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone VARCHAR(20),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- User-Tenant relationship with roles
CREATE TABLE user_tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('OWNER', 'ADMIN', 'AGENT', 'LISTING_MANAGER', 'ACCOUNT')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Pipelines - Customizable sales pipelines per tenant
CREATE TABLE pipelines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Stages within pipelines
CREATE TABLE stages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    pipeline_id UUID NOT NULL REFERENCES pipelines(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    color VARCHAR(7) DEFAULT '#3b82f6',
    position INTEGER NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Properties - Core real estate inventory
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    pincode VARCHAR(10),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    property_type TEXT NOT NULL CHECK (property_type IN ('apartment', 'villa', 'penthouse', 'studio', 'office', 'commercial')),
    listing_type TEXT NOT NULL CHECK (listing_type IN ('sale', 'rent', 'both')),
    price DECIMAL(15,2) NOT NULL,
    rent_price DECIMAL(15,2),
    area DECIMAL(10,2),
    bedrooms INTEGER,
    bathrooms INTEGER,
    parking INTEGER,
    amenities JSONB DEFAULT '[]',
    images JSONB DEFAULT '[]',
    rera_id TEXT,
    status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'sold', 'rented', 'hold')),
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Contacts - Clients and prospects
CREATE TABLE contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT,
    phone VARCHAR(20) NOT NULL,
    alternate_phone VARCHAR(20),
    address TEXT,
    city TEXT,
    contact_type TEXT NOT NULL CHECK (contact_type IN ('buyer', 'seller', 'tenant', 'landlord', 'investor')),
    source TEXT CHECK (source IN ('website', 'referral', 'advertisement', 'cold_call', 'social_media')),
    assigned_to UUID REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Leads - Potential clients
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT,
    phone VARCHAR(20) NOT NULL,
    source TEXT CHECK (source IN ('website', 'referral', 'advertisement', 'cold_call', 'social_media')),
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'unqualified', 'converted')),
    budget DECIMAL(15,2),
    requirements TEXT,
    assigned_to UUID REFERENCES users(id),
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'hot')),
    last_contact_date TIMESTAMP WITH TIME ZONE,
    next_follow_up TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Deals - Active transactions in pipeline
CREATE TABLE deals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    pipeline_id UUID NOT NULL REFERENCES pipelines(id) ON DELETE CASCADE,
    stage_id UUID NOT NULL REFERENCES stages(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id),
    contact_id UUID REFERENCES contacts(id),
    value DECIMAL(15,2) NOT NULL,
    commission DECIMAL(15,2),
    assigned_to UUID NOT NULL REFERENCES users(id),
    probability INTEGER DEFAULT 50,
    expected_close_date TIMESTAMP WITH TIME ZONE,
    actual_close_date TIMESTAMP WITH TIME ZONE,
    position INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Site visits scheduling
CREATE TABLE site_visits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    deal_id UUID REFERENCES deals(id),
    scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
    duration INTEGER DEFAULT 60, -- minutes
    agent_id UUID NOT NULL REFERENCES users(id),
    status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
    feedback TEXT,
    follow_up_required BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Files and documents
CREATE TABLE files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    original_name TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    size INTEGER NOT NULL,
    path TEXT NOT NULL,
    entity_type TEXT CHECK (entity_type IN ('property', 'deal', 'contact', 'tenant')),
    entity_id UUID,
    uploaded_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Automation rules
CREATE TABLE automation_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    trigger_type TEXT NOT NULL CHECK (trigger_type IN ('stage_change', 'time_based', 'property_update', 'visit_scheduled')),
    trigger_params JSONB DEFAULT '{}',
    action_type TEXT NOT NULL CHECK (action_type IN ('send_email', 'send_whatsapp', 'create_task', 'update_field')),
    action_params JSONB DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Audit logs for compliance
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    action TEXT NOT NULL,
    entity_type TEXT,
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX user_tenant_idx ON user_tenants(user_id, tenant_id);
CREATE INDEX pipeline_tenant_idx ON pipelines(tenant_id);
CREATE INDEX stage_tenant_idx ON stages(tenant_id);
CREATE INDEX stage_pipeline_idx ON stages(pipeline_id);
CREATE INDEX property_tenant_idx ON properties(tenant_id);
CREATE INDEX property_status_idx ON properties(status);
CREATE INDEX property_city_idx ON properties(city);
CREATE INDEX contact_tenant_idx ON contacts(tenant_id);
CREATE INDEX contact_phone_idx ON contacts(phone);
CREATE INDEX contact_email_idx ON contacts(email);
CREATE INDEX lead_tenant_idx ON leads(tenant_id);
CREATE INDEX lead_status_idx ON leads(status);
CREATE INDEX lead_priority_idx ON leads(priority);
CREATE INDEX deal_tenant_idx ON deals(tenant_id);
CREATE INDEX deal_stage_idx ON deals(stage_id);
CREATE INDEX deal_assigned_idx ON deals(assigned_to);
CREATE INDEX site_visit_tenant_idx ON site_visits(tenant_id);
CREATE INDEX site_visit_date_idx ON site_visits(scheduled_date);
CREATE INDEX file_tenant_idx ON files(tenant_id);
CREATE INDEX file_entity_idx ON files(entity_type, entity_id);
CREATE INDEX automation_tenant_idx ON automation_rules(tenant_id);
CREATE INDEX audit_tenant_idx ON audit_logs(tenant_id);
CREATE INDEX audit_entity_idx ON audit_logs(entity_type, entity_id);

-- Row Level Security (RLS) Examples
-- Enable RLS on tables (uncomment when ready to use)
-- ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE deals ENABLE ROW LEVEL SECURITY;

-- Example RLS policies (uncomment when ready to use)
-- CREATE POLICY tenant_isolation_properties ON properties FOR ALL TO authenticated USING (tenant_id = current_setting('app.current_tenant_id')::uuid);
-- CREATE POLICY tenant_isolation_contacts ON contacts FOR ALL TO authenticated USING (tenant_id = current_setting('app.current_tenant_id')::uuid);
-- CREATE POLICY tenant_isolation_deals ON deals FOR ALL TO authenticated USING (tenant_id = current_setting('app.current_tenant_id')::uuid);
