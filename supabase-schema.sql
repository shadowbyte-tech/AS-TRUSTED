-- AS Trusted Consultancy: Supabase PostgreSQL Schema

-- 1. Users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('Owner', 'User', 'Premium', 'Elite')),
    name TEXT,
    phone TEXT,
    location TEXT,
    refresh_token TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Passwords table
CREATE TABLE IF NOT EXISTS passwords (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL REFERENCES users(email) ON DELETE CASCADE,
    hashed_password TEXT NOT NULL,
    is_migrated BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Properties table (Unified)
CREATE TABLE IF NOT EXISTS properties (
    id TEXT PRIMARY KEY,
    property_number TEXT NOT NULL,
    property_type TEXT NOT NULL CHECK (property_type IN ('Plot', 'House', 'Land')),
    village_name TEXT NOT NULL,
    area_name TEXT NOT NULL,
    image_url TEXT,
    image_hint TEXT DEFAULT 'custom upload',
    description TEXT,
    price BIGINT,
    price_negotiable BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'Available' CHECK (status IN ('Available', 'Reserved', 'Sold', 'Under Negotiation')),
    category TEXT DEFAULT 'Normal' CHECK (category IN ('Normal', 'Premium')),
    images TEXT[], -- Array of strings
    
    -- Plot Specific
    plot_number TEXT,
    plot_size TEXT,
    plot_facing TEXT CHECK (plot_facing IN ('North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West')),
    price_per_sqft NUMERIC,
    is_dtcp_approved BOOLEAN DEFAULT FALSE,
    is_ready_to_construct BOOLEAN DEFAULT FALSE,
    has_highway_access BOOLEAN DEFAULT FALSE,
    
    -- House Specific
    house_size TEXT,
    bedrooms INTEGER,
    bathrooms INTEGER,
    floors INTEGER,
    house_type TEXT CHECK (house_type IN ('Independent', 'Villa', 'Apartment', 'Duplex', 'Penthouse')),
    furnished BOOLEAN DEFAULT FALSE,
    parking BOOLEAN DEFAULT FALSE,
    amenities TEXT[],
    year_built INTEGER,
    
    -- Land Specific
    land_size TEXT,
    land_type TEXT CHECK (land_type IN ('Agricultural', 'Commercial', 'Residential', 'Industrial')),
    zoning TEXT,
    road_access BOOLEAN DEFAULT FALSE,
    water_connection BOOLEAN DEFAULT FALSE,
    electricity_connection BOOLEAN DEFAULT FALSE,
    soil_type TEXT,
    topography TEXT,

    -- Analytics
    views INTEGER DEFAULT 0,
    last_viewed_at TIMESTAMP WITH TIME ZONE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Leads (Registrations) table
CREATE TABLE IF NOT EXISTS leads (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    notes TEXT,
    is_unread BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Inquiries table
CREATE TABLE IF NOT EXISTS inquiries (
    id TEXT PRIMARY KEY,
    plot_number TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    received_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Contacts table
CREATE TABLE IF NOT EXISTS contacts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('Seller', 'Buyer', 'Investor', 'Agent', 'Other')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Favorites table
CREATE TABLE IF NOT EXISTS favorites (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    property_id TEXT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    notes TEXT,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Audit Logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    action TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('AUTH', 'ADMIN', 'DATABASE', 'SECURITY')),
    user_id TEXT,
    user_email TEXT,
    ip TEXT,
    user_agent TEXT,
    resource_id TEXT,
    details JSONB,
    status TEXT DEFAULT 'SUCCESS' CHECK (status IN ('SUCCESS', 'FAILURE')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Create Indexes
CREATE INDEX IF NOT EXISTS idx_properties_village_area ON properties(village_name, area_name);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
