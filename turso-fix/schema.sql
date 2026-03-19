-- ============================================================
-- AS TRUSTED CONSULTANCY — Turso/SQLite Schema
-- Run: turso db shell as-trusted-db < schema.sql
-- ============================================================

PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

-- ─────────────────────────────────────────
-- USERS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id                   TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  email                TEXT UNIQUE NOT NULL,
  full_name            TEXT,
  phone                TEXT,
  role                 TEXT NOT NULL DEFAULT 'user'
                         CHECK (role IN ('owner', 'premium', 'user')),
  is_premium           INTEGER NOT NULL DEFAULT 0,
  premium_paid_at      TEXT,
  budget_range         TEXT,
  preferred_locations  TEXT,        -- JSON array stored as text
  investment_timeline  TEXT,
  referral_code        TEXT UNIQUE,
  referred_by          TEXT,
  login_count          INTEGER DEFAULT 0,
  last_login_at        TEXT,
  created_at           TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at           TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ─────────────────────────────────────────
-- PLOTS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS plots (
  id               TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  title            TEXT NOT NULL,
  description      TEXT,
  location         TEXT NOT NULL,
  area_sqyd        REAL,
  price_total      INTEGER NOT NULL,      -- in rupees
  price_per_sqyd   INTEGER,
  is_premium       INTEGER NOT NULL DEFAULT 0,
  is_featured      INTEGER NOT NULL DEFAULT 0,
  status           TEXT NOT NULL DEFAULT 'active'
                     CHECK (status IN ('active', 'sold', 'paused')),
  dtcp_approved    INTEGER NOT NULL DEFAULT 0,
  vastu_certified  INTEGER NOT NULL DEFAULT 0,
  facing           TEXT,                  -- North/South/East/West
  road_width_ft    INTEGER,
  images           TEXT,                  -- JSON array of image URLs
  amenities        TEXT,                  -- JSON array
  latitude         REAL,
  longitude        REAL,
  view_count       INTEGER NOT NULL DEFAULT 0,
  inquiry_count    INTEGER NOT NULL DEFAULT 0,
  save_count       INTEGER NOT NULL DEFAULT 0,
  created_at       TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at       TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ─────────────────────────────────────────
-- INQUIRIES
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS inquiries (
  id          TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  plot_id     TEXT NOT NULL REFERENCES plots(id) ON DELETE CASCADE,
  user_id     TEXT REFERENCES users(id) ON DELETE SET NULL,
  name        TEXT NOT NULL,
  phone       TEXT NOT NULL,
  email       TEXT,
  message     TEXT,
  status      TEXT NOT NULL DEFAULT 'new'
                CHECK (status IN ('new', 'contacted', 'converted', 'closed')),
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ─────────────────────────────────────────
-- SITE VISITS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS site_visits (
  id           TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  plot_id      TEXT NOT NULL REFERENCES plots(id) ON DELETE CASCADE,
  user_id      TEXT REFERENCES users(id) ON DELETE SET NULL,
  name         TEXT NOT NULL,
  phone        TEXT NOT NULL,
  visit_date   TEXT NOT NULL,
  visit_time   TEXT NOT NULL,
  status       TEXT NOT NULL DEFAULT 'pending'
                 CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  notes        TEXT,
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ─────────────────────────────────────────
-- SAVES (Wishlist)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS saves (
  id         TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plot_id    TEXT NOT NULL REFERENCES plots(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(user_id, plot_id)
);

-- ─────────────────────────────────────────
-- INDEXES for fast queries
-- ─────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_plots_location   ON plots(location);
CREATE INDEX IF NOT EXISTS idx_plots_status     ON plots(status);
CREATE INDEX IF NOT EXISTS idx_plots_is_premium ON plots(is_premium);
CREATE INDEX IF NOT EXISTS idx_users_email      ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role       ON users(role);
CREATE INDEX IF NOT EXISTS idx_inquiries_plot   ON inquiries(plot_id);
CREATE INDEX IF NOT EXISTS idx_visits_plot      ON site_visits(plot_id);
CREATE INDEX IF NOT EXISTS idx_saves_user       ON saves(user_id);

-- ─────────────────────────────────────────
-- TRIGGERS: auto-update updated_at
-- ─────────────────────────────────────────
CREATE TRIGGER IF NOT EXISTS plots_updated_at
  AFTER UPDATE ON plots
  BEGIN
    UPDATE plots SET updated_at = datetime('now') WHERE id = NEW.id;
  END;

CREATE TRIGGER IF NOT EXISTS users_updated_at
  AFTER UPDATE ON users
  BEGIN
    UPDATE users SET updated_at = datetime('now') WHERE id = NEW.id;
  END;

-- ─────────────────────────────────────────
-- TRIGGERS: keep counts in sync
-- ─────────────────────────────────────────
CREATE TRIGGER IF NOT EXISTS inc_inquiry_count
  AFTER INSERT ON inquiries
  BEGIN
    UPDATE plots SET inquiry_count = inquiry_count + 1 WHERE id = NEW.plot_id;
  END;

CREATE TRIGGER IF NOT EXISTS inc_save_count
  AFTER INSERT ON saves
  BEGIN
    UPDATE plots SET save_count = save_count + 1 WHERE id = NEW.plot_id;
  END;

CREATE TRIGGER IF NOT EXISTS dec_save_count
  AFTER DELETE ON saves
  BEGIN
    UPDATE plots SET save_count = MAX(0, save_count - 1) WHERE id = OLD.plot_id;
  END;

-- ─────────────────────────────────────────
-- SEED: Owner account
-- ─────────────────────────────────────────
INSERT OR IGNORE INTO users (id, email, full_name, phone, role, is_premium)
VALUES (
  'owner-swamy-001',
  'swamy@as-trusted.com',
  'Sri Swamy Goud',
  '9866404090',
  'owner',
  1
);
