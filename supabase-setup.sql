-- Create tables for AS Trusted Consultancy

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'User',
    phone TEXT,
    location TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Plots table (properties)
CREATE TABLE IF NOT EXISTS plots (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    price DECIMAL,
    location TEXT,
    area DECIMAL,
    type TEXT,
    status TEXT DEFAULT 'available',
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inquiries table
CREATE TABLE IF NOT EXISTS inquiries (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT,
    plot_id TEXT REFERENCES plots(id),
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Registrations table
CREATE TABLE IF NOT EXISTS registrations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    location TEXT,
    preferred_property_type TEXT,
    budget_range TEXT,
    message TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contacts table
CREATE TABLE IF NOT EXISTS contacts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default admin user
INSERT INTO users (id, email, name, role) 
VALUES 
    ('admin-001', 'admin@astrustedconsultancy.com', 'Admin', 'Owner')
ON CONFLICT (email) DO NOTHING;

-- Insert sample plots data
INSERT INTO plots (id, title, description, price, location, area, type, status) 
VALUES 
    ('plot-001', 'Premium Residential Plot', 'Beautiful residential plot in prime location', 5000000, 'Hyderabad', 1200, 'Residential', 'available'),
    ('plot-002', 'Commercial Space', 'Ideal for office or retail business', 8000000, 'Bangalore', 2000, 'Commercial', 'available'),
    ('plot-003', 'Agricultural Land', 'Fertile agricultural land with water access', 2000000, 'Rural Area', 5000, 'Agricultural', 'available')
ON CONFLICT (id) DO NOTHING;
