-- AS Trusted Consultancy Database Schema
-- Run this with: turso db shell as-trusted-db < schema.sql

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('Owner', 'User')),
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Plots table
CREATE TABLE IF NOT EXISTS plots (
    id TEXT PRIMARY KEY,
    plot_number TEXT NOT NULL,
    village_name TEXT NOT NULL,
    area_name TEXT NOT NULL,
    plot_size TEXT NOT NULL,
    plot_facing TEXT NOT NULL CHECK (plot_facing IN ('North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West')),
    price INTEGER,
    price_negotiable BOOLEAN DEFAULT FALSE,
    description TEXT,
    image_url TEXT NOT NULL,
    image_hint TEXT,
    status TEXT DEFAULT 'Available' CHECK (status IN ('Available', 'Reserved', 'Sold', 'Under Negotiation')),
    is_dtcp_approved BOOLEAN DEFAULT FALSE,
    is_ready_to_construct BOOLEAN DEFAULT FALSE,
    has_highway_access BOOLEAN DEFAULT FALSE,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Inquiries table
CREATE TABLE IF NOT EXISTS inquiries (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    plot_number TEXT NOT NULL,
    received_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Contacts table
CREATE TABLE IF NOT EXISTS contacts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('Seller', 'Buyer')),
    notes TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Registrations table
CREATE TABLE IF NOT EXISTS registrations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    notes TEXT,
    is_new BOOLEAN DEFAULT TRUE,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Site visits table
CREATE TABLE IF NOT EXISTS site_visits (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    preferred_date TEXT NOT NULL,
    preferred_time TEXT NOT NULL,
    location TEXT NOT NULL,
    message TEXT,
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Confirmed', 'Completed', 'Cancelled')),
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT OR IGNORE INTO users (id, email, role) VALUES 
    ('u1', 'swamy@consult.com', 'Owner'),
    ('u2', 'user@consult.com', 'User'),
    ('u3', 'premium@consult.com', 'User'),
    ('u4', 'investor@consult.com', 'User');

-- Insert sample plots
INSERT OR IGNORE INTO plots (
    id, plot_number, village_name, area_name, plot_size, plot_facing, 
    price, description, image_url, status, is_dtcp_approved, 
    is_ready_to_construct, has_highway_access
) VALUES 
    ('plot-1', 'PLOT-001', 'Kamareddy', 'Hyderabad', '200 sq yards', 'North', 1200000, 
     'Premium DTCP approved plot in Kamareddy with excellent connectivity', 
     'https://images.unsplash.com/photo-1560449018-8e5f71b4c0c?w=800', 
     'Available', TRUE, TRUE, TRUE),
    ('plot-2', 'PLOT-002', 'Sangareddy', 'Hyderabad', '250 sq yards', 'East', 1500000, 
     'Spacious plot with highway access in Sangareddy', 
     'https://images.unsplash.com/photo-1560449018-8e5f71B4c0c?w=800', 
     'Available', TRUE, TRUE, FALSE),
    ('plot-3', 'PLOT-003', 'Siddipet', 'Hyderabad', '300 sq yards', 'South', 1800000, 
     'Prime location plot in Siddipet with great investment potential', 
     'https://images.unsplash.com/photo-1560449018-8e5f71B4c0c?w=800', 
     'Available', TRUE, FALSE, TRUE);
