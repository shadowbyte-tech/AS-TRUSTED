// ✅ FIXED: uses "/http" import path which forces HTTP-only transport
// This avoids the native WebSocket binary that causes hanging on Windows + Next.js 15
import { createClient } from "@libsql/client/http";

// ─────────────────────────────────────────
// VALIDATE ENV VARS ON STARTUP
// ─────────────────────────────────────────
const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url) throw new Error("❌ TURSO_DATABASE_URL is missing from .env.local");
if (!authToken) throw new Error("❌ TURSO_AUTH_TOKEN is missing from .env.local");

// ─────────────────────────────────────────
// DB CLIENT — singleton pattern for Next.js
// ─────────────────────────────────────────
declare global {
  // eslint-disable-next-line no-var
  var _tursoClient: ReturnType<typeof createClient> | undefined;
}

function getClient() {
  if (!global._tursoClient) {
    global._tursoClient = createClient({ url: url!, authToken });
  }
  return global._tursoClient;
}

export const db = getClient();

// ─────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────
export interface Plot {
  id: string;
  title: string;
  description?: string;
  location: string;
  area_sqyd?: number;
  price_total: number;
  price_per_sqyd?: number;
  is_premium: boolean;
  is_featured: boolean;
  status: "active" | "sold" | "paused";
  dtcp_approved: boolean;
  vastu_certified: boolean;
  facing?: string;
  road_width_ft?: number;
  images: string[];
  amenities: string[];
  latitude?: number;
  longitude?: number;
  view_count: number;
  inquiry_count: number;
  save_count: number;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  role: "owner" | "premium" | "user";
  is_premium: boolean;
  premium_paid_at?: string;
  budget_range?: string;
  preferred_locations?: string[];
  investment_timeline?: string;
  referral_code?: string;
  referred_by?: string;
  login_count: number;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Inquiry {
  id: string;
  plot_id: string;
  user_id?: string;
  name: string;
  phone: string;
  email?: string;
  message?: string;
  status: "new" | "contacted" | "converted" | "closed";
  created_at: string;
  plot_title?: string;
}

export interface SiteVisit {
  id: string;
  plot_id: string;
  user_id?: string;
  name: string;
  phone: string;
  visit_date: string;
  visit_time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  notes?: string;
  created_at: string;
  plot_title?: string;
}

// ─────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parsePlot(row: Record<string, any>): Plot {
  return {
    ...row,
    is_premium: row.is_premium === 1 || row.is_premium === true,
    is_featured: row.is_featured === 1 || row.is_featured === true,
    dtcp_approved: row.dtcp_approved === 1 || row.dtcp_approved === true,
    vastu_certified: row.vastu_certified === 1 || row.vastu_certified === true,
    images: row.images ? tryParse(row.images, []) : [],
    amenities: row.amenities ? tryParse(row.amenities, []) : [],
  } as Plot;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseUser(row: Record<string, any>): User {
  return {
    ...row,
    is_premium: row.is_premium === 1 || row.is_premium === true,
    preferred_locations: row.preferred_locations
      ? tryParse(row.preferred_locations, [])
      : [],
  } as User;
}

function tryParse<T>(val: string, fallback: T): T {
  try { return JSON.parse(val); } catch { return fallback; }
}

// ─────────────────────────────────────────
// PLOTS
// ─────────────────────────────────────────
export async function getAllPlots(filters?: {
  location?: string;
  status?: string;
  is_premium?: boolean;
  limit?: number;
}): Promise<Plot[]> {
  let sql = "SELECT * FROM plots WHERE 1=1";
  const args: (string | number)[] = [];

  if (filters?.location) {
    sql += " AND location LIKE ?";
    args.push(`%${filters.location}%`);
  }
  if (filters?.status) {
    sql += " AND status = ?";
    args.push(filters.status);
  }
  if (filters?.is_premium !== undefined) {
    sql += " AND is_premium = ?";
    args.push(filters.is_premium ? 1 : 0);
  }
  sql += " ORDER BY is_featured DESC, created_at DESC";
  if (filters?.limit) {
    sql += " LIMIT ?";
    args.push(filters.limit);
  }

  const result = await db.execute({ sql, args });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return result.rows.map((r) => parsePlot(r as any));
}

export async function getPlotById(id: string): Promise<Plot | null> {
  const result = await db.execute({
    sql: "SELECT * FROM plots WHERE id = ?",
    args: [id],
  });
  if (!result.rows[0]) return null;
  await db.execute({
    sql: "UPDATE plots SET view_count = view_count + 1 WHERE id = ?",
    args: [id],
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return parsePlot(result.rows[0] as any);
}

export async function createPlot(
  data: Omit<Plot, "id" | "view_count" | "inquiry_count" | "save_count" | "created_at" | "updated_at">
): Promise<Plot> {
  const id = crypto.randomUUID();
  await db.execute({
    sql: `INSERT INTO plots
      (id, title, description, location, area_sqyd, price_total, price_per_sqyd,
       is_premium, is_featured, status, dtcp_approved, vastu_certified,
       facing, road_width_ft, images, amenities, latitude, longitude)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    args: [
      id,
      data.title,
      data.description ?? null,
      data.location,
      data.area_sqyd ?? null,
      data.price_total,
      data.price_per_sqyd ?? null,
      data.is_premium ? 1 : 0,
      data.is_featured ? 1 : 0,
      data.status ?? "active",
      data.dtcp_approved ? 1 : 0,
      data.vastu_certified ? 1 : 0,
      data.facing ?? null,
      data.road_width_ft ?? null,
      JSON.stringify(data.images ?? []),
      JSON.stringify(data.amenities ?? []),
      data.latitude ?? null,
      data.longitude ?? null,
    ],
  });
  return (await getPlotById(id))!;
}

export async function updatePlot(
  id: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>
): Promise<Plot | null> {
  const map: Record<string, unknown> = {
    title: data.title,
    description: data.description ?? null,
    location: data.location,
    price_total: data.price_total,
    area_sqyd: data.area_sqyd ?? null,
    price_per_sqyd: data.price_per_sqyd ?? null,
    is_premium: data.is_premium !== undefined ? (data.is_premium ? 1 : 0) : undefined,
    is_featured: data.is_featured !== undefined ? (data.is_featured ? 1 : 0) : undefined,
    status: data.status,
    dtcp_approved: data.dtcp_approved !== undefined ? (data.dtcp_approved ? 1 : 0) : undefined,
    vastu_certified: data.vastu_certified !== undefined ? (data.vastu_certified ? 1 : 0) : undefined,
    facing: data.facing ?? null,
    road_width_ft: data.road_width_ft ?? null,
    images: data.images !== undefined ? JSON.stringify(data.images) : undefined,
    amenities: data.amenities !== undefined ? JSON.stringify(data.amenities) : undefined,
  };

  const fields = Object.entries(map)
    .filter(([, v]) => v !== undefined)
    .map(([k]) => `${k} = ?`);
  const args = Object.entries(map)
    .filter(([, v]) => v !== undefined)
    .map(([, v]) => v as string | number | null);

  if (fields.length === 0) return getPlotById(id);
  args.push(id);

  await db.execute({
    sql: `UPDATE plots SET ${fields.join(", ")} WHERE id = ?`,
    args,
  });
  return getPlotById(id);
}

export async function deletePlot(id: string): Promise<boolean> {
  const result = await db.execute({
    sql: "DELETE FROM plots WHERE id = ?",
    args: [id],
  });
  return (result.rowsAffected ?? 0) > 0;
}

// ─────────────────────────────────────────
// USERS
// ─────────────────────────────────────────
export async function getAllUsers(): Promise<User[]> {
  const result = await db.execute({
    sql: "SELECT * FROM users ORDER BY created_at DESC",
    args: [],
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return result.rows.map((r) => parseUser(r as any));
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const result = await db.execute({
    sql: "SELECT * FROM users WHERE email = ?",
    args: [email],
  });
  if (!result.rows[0]) return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return parseUser(result.rows[0] as any);
}

export async function getUserById(id: string): Promise<User | null> {
  const result = await db.execute({
    sql: "SELECT * FROM users WHERE id = ?",
    args: [id],
  });
  if (!result.rows[0]) return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return parseUser(result.rows[0] as any);
}

export async function createUser(data: {
  email: string;
  full_name?: string;
  phone?: string;
  role?: "owner" | "premium" | "user";
}): Promise<User> {
  const id = crypto.randomUUID();
  const referral_code = Math.random().toString(36).substring(2, 8).toUpperCase();
  await db.execute({
    sql: `INSERT INTO users (id, email, full_name, phone, role, referral_code)
          VALUES (?, ?, ?, ?, ?, ?)`,
    args: [id, data.email, data.full_name ?? null, data.phone ?? null, data.role ?? "user", referral_code],
  });
  return (await getUserById(id))!;
}

export async function upgradeToPremium(userId: string): Promise<void> {
  await db.execute({
    sql: `UPDATE users SET is_premium = 1, role = 'premium',
          premium_paid_at = datetime('now') WHERE id = ?`,
    args: [userId],
  });
}

export async function updateUserPreferences(
  userId: string,
  prefs: { budget_range?: string; preferred_locations?: string[]; investment_timeline?: string }
): Promise<void> {
  await db.execute({
    sql: `UPDATE users SET budget_range = ?, preferred_locations = ?, investment_timeline = ? WHERE id = ?`,
    args: [
      prefs.budget_range ?? null,
      prefs.preferred_locations ? JSON.stringify(prefs.preferred_locations) : null,
      prefs.investment_timeline ?? null,
      userId,
    ],
  });
}

// ─────────────────────────────────────────
// INQUIRIES
// ─────────────────────────────────────────
export async function createInquiry(data: {
  plot_id: string; user_id?: string; name: string;
  phone: string; email?: string; message?: string;
}): Promise<Inquiry> {
  const id = crypto.randomUUID();
  await db.execute({
    sql: `INSERT INTO inquiries (id, plot_id, user_id, name, phone, email, message)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: [id, data.plot_id, data.user_id ?? null, data.name, data.phone, data.email ?? null, data.message ?? null],
  });
  const r = await db.execute({ sql: "SELECT * FROM inquiries WHERE id = ?", args: [id] });
  return r.rows[0] as unknown as Inquiry;
}

export async function getAllInquiries(): Promise<Inquiry[]> {
  const result = await db.execute({
    sql: `SELECT i.*, p.title as plot_title
          FROM inquiries i LEFT JOIN plots p ON i.plot_id = p.id
          ORDER BY i.created_at DESC`,
    args: [],
  });
  return result.rows as unknown as Inquiry[];
}

export async function updateInquiryStatus(id: string, status: Inquiry["status"]): Promise<void> {
  await db.execute({ sql: "UPDATE inquiries SET status = ? WHERE id = ?", args: [status, id] });
}

// ─────────────────────────────────────────
// SITE VISITS
// ─────────────────────────────────────────
export async function createSiteVisit(data: {
  plot_id: string; user_id?: string; name: string;
  phone: string; visit_date: string; visit_time: string;
}): Promise<SiteVisit> {
  const id = crypto.randomUUID();
  await db.execute({
    sql: `INSERT INTO site_visits (id, plot_id, user_id, name, phone, visit_date, visit_time)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: [id, data.plot_id, data.user_id ?? null, data.name, data.phone, data.visit_date, data.visit_time],
  });
  const r = await db.execute({ sql: "SELECT * FROM site_visits WHERE id = ?", args: [id] });
  return r.rows[0] as unknown as SiteVisit;
}

export async function getAllSiteVisits(): Promise<SiteVisit[]> {
  const result = await db.execute({
    sql: `SELECT sv.*, p.title as plot_title
          FROM site_visits sv LEFT JOIN plots p ON sv.plot_id = p.id
          ORDER BY sv.visit_date ASC, sv.visit_time ASC`,
    args: [],
  });
  return result.rows as unknown as SiteVisit[];
}

export async function updateVisitStatus(id: string, status: SiteVisit["status"]): Promise<void> {
  await db.execute({ sql: "UPDATE site_visits SET status = ? WHERE id = ?", args: [status, id] });
}

// ─────────────────────────────────────────
// SAVES
// ─────────────────────────────────────────
export async function savePlot(userId: string, plotId: string): Promise<void> {
  await db.execute({
    sql: "INSERT OR IGNORE INTO saves (id, user_id, plot_id) VALUES (?, ?, ?)",
    args: [crypto.randomUUID(), userId, plotId],
  });
}

export async function unsavePlot(userId: string, plotId: string): Promise<void> {
  await db.execute({
    sql: "DELETE FROM saves WHERE user_id = ? AND plot_id = ?",
    args: [userId, plotId],
  });
}

export async function getUserSaves(userId: string): Promise<Plot[]> {
  const result = await db.execute({
    sql: `SELECT p.* FROM saves s JOIN plots p ON s.plot_id = p.id
          WHERE s.user_id = ? ORDER BY s.created_at DESC`,
    args: [userId],
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return result.rows.map((r) => parsePlot(r as any));
}

// ─────────────────────────────────────────
// DASHBOARD STATS
// ─────────────────────────────────────────
export async function getDashboardStats() {
  const [p, u, i, v] = await Promise.all([
    db.execute({ sql: "SELECT COUNT(*) as total, SUM(CASE WHEN status='active' THEN 1 ELSE 0 END) as active, SUM(CASE WHEN status='sold' THEN 1 ELSE 0 END) as sold, COALESCE(SUM(view_count),0) as total_views FROM plots", args: [] }),
    db.execute({ sql: "SELECT COUNT(*) as total, SUM(is_premium) as premium FROM users WHERE role != 'owner'", args: [] }),
    db.execute({ sql: "SELECT COUNT(*) as total, SUM(CASE WHEN status='new' THEN 1 ELSE 0 END) as new_count FROM inquiries", args: [] }),
    db.execute({ sql: "SELECT COUNT(*) as total, SUM(CASE WHEN status='pending' THEN 1 ELSE 0 END) as pending FROM site_visits", args: [] }),
  ]);
  return { plots: p.rows[0], users: u.rows[0], inquiries: i.rows[0], visits: v.rows[0] };
}
