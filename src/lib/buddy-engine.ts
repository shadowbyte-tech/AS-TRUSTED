// ────────────────────────────────────────────────────────────────
// BUDDY ENGINE SYSTEM
// Three-layer architecture: Context Engine, Data Engine, Action Engine
// ────────────────────────────────────────────────────────────────

// ─── CONTEXT ENGINE ─────────────────────────────────────────────
// Knows where the owner is and reacts accordingly.
// ────────────────────────────────────────────────────────────────

export interface PageContext {
  path: string;
  pageType: 'dashboard' | 'inquiries' | 'registrations' | 'upload' | 'properties' | 'premium' | 'owner-portal' | 'home' | 'other';
  label: string;
  buddyHint: string; // What Buddy says proactively on this page
}

const PAGE_MAP: Record<string, Omit<PageContext, 'path'>> = {
  '/dashboard':               { pageType: 'dashboard',     label: 'Dashboard',       buddyHint: 'I can show you today\'s briefing, analytics, or forecast.' },
  '/dashboard/inquiries':     { pageType: 'inquiries',     label: 'Inquiries',       buddyHint: 'I can help you draft replies, classify leads, or analyze inquiry trends.' },
  '/dashboard/registrations': { pageType: 'registrations', label: 'Registrations',   buddyHint: 'I can show user stats and buyer segment analysis.' },
  '/upload':                  { pageType: 'upload',        label: 'Upload Property', buddyHint: 'Need a title or description? I\'m here to help!' },
  '/properties':              { pageType: 'properties',    label: 'Properties',      buddyHint: 'Ask me to search — "plots in Kamareddy" or "plots above 10L".' },
  '/premium-properties':      { pageType: 'premium',       label: 'Premium',         buddyHint: 'Premium listings page. I can generate marketing content!' },
  '/owner-portal':               { pageType: 'owner-portal',    label: 'Owner Portal',    buddyHint: 'I can show you system stats and security status.' },
  '/':                        { pageType: 'home',          label: 'Home',            buddyHint: 'Type "briefing" for today\'s summary or ask me anything!' },
};

export function resolvePageContext(pathname: string): PageContext {
  // Exact match first
  const exact = PAGE_MAP[pathname];
  if (exact) return { path: pathname, ...exact };

  // Prefix match
  for (const [prefix, ctx] of Object.entries(PAGE_MAP)) {
    if (pathname.startsWith(prefix) && prefix !== '/') return { path: pathname, ...ctx };
  }

  return { path: pathname, pageType: 'other', label: 'Page', buddyHint: 'I\'m here to help. Type "help" to see what I can do!' };
}

// ─── DATA ENGINE ────────────────────────────────────────────────
// All database access goes through API endpoints — never scrapes pages.
// ────────────────────────────────────────────────────────────────

export interface BuddyAnalytics {
  summary: {
    totalProperties: number; availableProperties: number; soldProperties: number;
    totalUsers: number; todayUsers: number; weekUsers: number;
    totalInquiries: number; todayInquiries: number; yesterdayInquiries: number;
    weekInquiries: number; inquiryChange: number; conversionRate: number;
  };
  propertyInsights: {
    typeCounts: { Plot: number; House: number; Land: number };
    priceRangeData: { label: string; count: number }[];
    topPriceRange: { label: string; count: number } | null;
    topLocation: { name: string; count: number } | null;
    locationMap: Record<string, number>;
  };
  leads: {
    hot: number; warm: number; cold: number;
    hotLeadDetails: { name: string; phone: string }[];
  };
  generatedAt: string;
}

export async function fetchBuddyAnalytics(): Promise<BuddyAnalytics | null> {
  try {
    const res = await fetch('/api/buddy/analytics');
    if (res.ok) return await res.json();
    return null;
  } catch { return null; }
}

// ─── ACTION ENGINE ──────────────────────────────────────────────
// Converts text commands into platform actions.
// ────────────────────────────────────────────────────────────────

export interface BuddyAction {
  type: 'navigate' | 'notify' | 'none';
  target?: string;       // URL for navigate
  description?: string;  // Human-readable
}

const NAVIGATION_INTENTS: [RegExp, string, string][] = [
  [/dashboard|go\s*to\s*dash|open\s*dash/i,                      '/dashboard',               '📋 Opening Dashboard...'],
  [/upload|add\s*(new\s*)?(property|plot|land|house)|new\s*listing/i, '/upload',              '⬆️ Opening Upload page...'],
  [/inquir|view\s*inquir|show\s*inquir|check\s*inquir/i,          '/dashboard/inquiries',     '💬 Opening Inquiries...'],
  [/registr|show\s*registr|view\s*user/i,                         '/dashboard/registrations', '👥 Opening Registrations...'],
  [/premium.*prop|vip.*prop/i,                                    '/premium-properties',      '⭐ Opening Premium Properties...'],
  [/home\s*page|\bgo\s*home\b/i,                                  '/',                        '🏠 Taking you Home!'],
  [/properties|all\s*prop|show\s*prop/i,                          '/properties',              '🏘️ Opening Properties...'],
  [/owner.?portal|owner\s*panel/i,                                   '/owner-portal',            '🔐 Opening Owner Portal...'],
  [/site\s*visit|visits/i,                                        '/dashboard',               '📍 Site visits are in your Dashboard!'],
  [/add\s*prop|new\s*prop/i,                                      '/upload',                  '⬆️ Opening property form...'],
];

export function parseAction(input: string): BuddyAction {
  const q = input.toLowerCase().trim();
  for (const [pattern, target, description] of NAVIGATION_INTENTS) {
    if (pattern.test(q)) return { type: 'navigate', target, description };
  }
  return { type: 'none' };
}

// ─── SMART SEARCH ───────────────────────────────────────────────
// Parses search queries from natural language.
// ────────────────────────────────────────────────────────────────

export interface SearchQuery {
  type: 'location' | 'price' | 'status' | 'none';
  value?: string;
  navigate?: string;
}

export function parseSearchQuery(input: string): SearchQuery {
  const q = input.toLowerCase().trim();
  const loc = q.match(/(?:show\s+)?plots?\s+in\s+(.+)/i)?.[1] || q.match(/properties?\s+in\s+(.+)/i)?.[1];
  if (loc) return { type: 'location', value: loc, navigate: `/properties?location=${encodeURIComponent(loc)}` };

  const price = q.match(/plots?\s+above\s+(\d+)\s*l/i)?.[1];
  if (price) return { type: 'price', value: price, navigate: `/properties?minPrice=${parseInt(price) * 100000}` };

  if (/unsold|available\s*plots?/i.test(q)) return { type: 'status', value: 'Available', navigate: `/properties?status=Available` };

  return { type: 'none' };
}

// ─── EVENT SYSTEM ───────────────────────────────────────────────
// Platform event bus for real-time notifications.
// ────────────────────────────────────────────────────────────────

export type BuddyEventType = 'newInquiry' | 'plotUploaded' | 'userRegistered' | 'loginAlert' | 'custom';

export interface BuddyEvent {
  type: BuddyEventType;
  message: string;
  timestamp: Date;
  data?: Record<string, unknown>;
}

type BuddyEventListener = (event: BuddyEvent) => void;

class BuddyEventBus {
  private listeners: Map<BuddyEventType, BuddyEventListener[]> = new Map();

  on(type: BuddyEventType, listener: BuddyEventListener) {
    const list = this.listeners.get(type) || [];
    list.push(listener);
    this.listeners.set(type, list);
  }

  off(type: BuddyEventType, listener: BuddyEventListener) {
    const list = this.listeners.get(type) || [];
    this.listeners.set(type, list.filter(l => l !== listener));
  }

  emit(type: BuddyEventType, message: string, data?: Record<string, unknown>) {
    const event: BuddyEvent = { type, message, timestamp: new Date(), data };
    const list = this.listeners.get(type) || [];
    list.forEach(l => l(event));
    // Also dispatch to DOM for cross-component listening
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('buddy-event', { detail: event }));
    }
  }
}

// Singleton instance
export const buddyEvents = new BuddyEventBus();

// ─── MEMORY SYSTEM ──────────────────────────────────────────────
// Persistent localStorage-based memory.
// ────────────────────────────────────────────────────────────────

export interface TaskReminder {
  id: number;
  task: string;
  createdAt: string;
  done: boolean;
}

export interface ConversationEntry {
  role: 'user' | 'buddy';
  text: string;
  timestamp: string;
}

export interface BuddyMemory {
  tasks: TaskReminder[];
  lastSeen: string;
  uploadCount: number;
  preferredTime?: string;
  sessionCount: number;
  lastPage?: string;
  // User Profile / Investment Profiling
  role?: 'Owner' | 'Client' | 'Visitor';
  name?: string;
  budget?: string;
  locationInterest?: string[];
  propertyTypeInterest?: string[];
  hasInquired?: boolean;
  investmentGoal?: string;
  // Conversation Memory (last 20 turns)
  conversationHistory?: ConversationEntry[];
  lastInquiredProperty?: string;
  viewedPlots?: string[];
  // AI usage tracking
  dailyQueryCount?: number;
  lastQueryDate?: string;
  totalTokensUsed?: number;
}

const MEMORY_KEY = 'buddy_memory_v2';

export function loadMemory(): BuddyMemory {
  if (typeof window === 'undefined') return { tasks: [], lastSeen: '', uploadCount: 0, sessionCount: 0 };
  try {
    const raw = localStorage.getItem(MEMORY_KEY);
    return raw ? JSON.parse(raw) : { tasks: [], lastSeen: '', uploadCount: 0, sessionCount: 0, conversationHistory: [] };
  } catch { return { tasks: [], lastSeen: '', uploadCount: 0, sessionCount: 0, conversationHistory: [] }; }
}

export const getMemory = loadMemory;

export function saveMemory(m: BuddyMemory) {
  if (typeof window !== 'undefined') localStorage.setItem(MEMORY_KEY, JSON.stringify(m));
}

/**
 * Persists a new conversation exchange to the memory store.
 * Keeps only the last 20 turns to avoid unbounded localStorage growth.
 */
export function addToConversationHistory(memory: BuddyMemory, userText: string, buddyText: string): BuddyMemory {
  const history = memory.conversationHistory ?? [];
  const newHistory: ConversationEntry[] = [
    ...history,
    { role: 'user' as const, text: userText, timestamp: new Date().toISOString() },
    { role: 'buddy' as const, text: buddyText, timestamp: new Date().toISOString() },
  ].slice(-40); // keep last 20 exchanges (40 entries)

  return { ...memory, conversationHistory: newHistory };
}

/**
 * Updates memory based on a user message (extracts intent clues).
 */
export function updateMemoryWithInteraction(memory: BuddyMemory, userText?: string): BuddyMemory {
  if (!userText) return memory; // Allow passing only memory for usage updates
  const updated = { ...memory };
  const l = userText.toLowerCase();

  // Extract location interest
  const locations = ['kamareddy', 'hyderabad', 'nizamabad', 'sangareddy', 'medchal', 'siddipet', 'kokapet', 'gachibowli'];
  for (const loc of locations) {
    if (l.includes(loc)) {
      updated.locationInterest = [...new Set([...(updated.locationInterest ?? []), loc])];
    }
  }

  // Extract property type interest
  if (l.includes('plot') || l.includes('land')) {
    updated.propertyTypeInterest = [...new Set([...(updated.propertyTypeInterest ?? []), 'Plot'])];
  }
  if (l.includes('house') || l.includes('villa') || l.includes('apartment')) {
    updated.propertyTypeInterest = [...new Set([...(updated.propertyTypeInterest ?? []), 'House'])];
  }

  return updated;
}

/**
 * ─── COST CONTROL & CACHING ─────────────────────────────────────
 */

const MAX_DAILY_QUERIES = 50;

export function isWithinLimit(memory: BuddyMemory): boolean {
  const today = new Date().toISOString().split('T')[0];
  if (memory.lastQueryDate !== today) {
    return true; // New day, reset happens on update
  }
  return (memory.dailyQueryCount ?? 0) < MAX_DAILY_QUERIES;
}

export function updateUsage(memory: BuddyMemory): BuddyMemory {
  const today = new Date().toISOString().split('T')[0];
  if (memory.lastQueryDate !== today) {
    return {
      ...memory,
      lastQueryDate: today,
      dailyQueryCount: 1,
    };
  }
  return {
    ...memory,
    dailyQueryCount: (memory.dailyQueryCount ?? 0) + 1,
  };
}

const RESPONSE_CACHE_KEY = 'buddy_response_cache_v1';

export function getCachedResponse(prompt: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(RESPONSE_CACHE_KEY);
    const cache = raw ? JSON.parse(raw) : {};
    return cache[prompt.toLowerCase().trim()] || null;
  } catch { return null; }
}

export function cacheResponse(prompt: string, response: string) {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(RESPONSE_CACHE_KEY);
    const cache = raw ? JSON.parse(raw) : {};
    cache[prompt.toLowerCase().trim()] = response;
    // Keep cache at reasonable size (e.g., last 50 queries)
    const keys = Object.keys(cache);
    if (keys.length > 50) delete cache[keys[0]];
    localStorage.setItem(RESPONSE_CACHE_KEY, JSON.stringify(cache));
  } catch {}
}

// ─── KNOWLEDGE GRAPH ────────────────────────────────────────────
// Maps system concepts so Buddy understands platform structure.
// ────────────────────────────────────────────────────────────────

export const SYSTEM_KNOWLEDGE = {
  owner: 'Sri Swamy',
  company: 'AS Trusted Consultancy',
  avgROI: '18%',
  focus: 'Real estate — plots, houses, and land',
  regions: ['Kamareddy', 'Hyderabad Corridor', 'Nizamabad', 'Telangana'],
  priceRange: '₹5L – ₹30L+',
  platformPages: {
    dashboard: { path: '/dashboard', purpose: 'Main analytics & property management' },
    inquiries: { path: '/dashboard/inquiries', purpose: 'View & respond to customer inquiries' },
    registrations: { path: '/dashboard/registrations', purpose: 'View new user registrations' },
    upload: { path: '/upload', purpose: 'Upload new properties (plot/house/land)' },
    properties: { path: '/properties', purpose: 'View all property listings' },
    premium: { path: '/premium-properties', purpose: 'Premium property showcase' },
    ownerPortal: { path: '/owner-portal', purpose: 'Owner portal with system stats' },
  },
} as const;

// ─── ALERT GENERATOR ────────────────────────────────────────────
// Creates smart alerts from analytics data.
// ────────────────────────────────────────────────────────────────

export function generateSmartAlerts(data: BuddyAnalytics): string[] {
  const alerts: string[] = [];
  if (data.leads.hot > 0) alerts.push(`🔥 ${data.leads.hot} hot lead${data.leads.hot > 1 ? 's' : ''} ready to close!`);
  if (data.summary.todayInquiries > 3) alerts.push(`📬 ${data.summary.todayInquiries} inquiries today — great traction!`);
  if (data.summary.inquiryChange > 30) alerts.push(`📈 Inquiries up ${data.summary.inquiryChange}% vs yesterday!`);
  if (data.summary.conversionRate < 3) alerts.push(`⚠️ Conversion rate is low (${data.summary.conversionRate}%). Consider faster follow-ups.`);
  if (data.summary.todayUsers > 3) alerts.push(`👥 ${data.summary.todayUsers} new users signed up today!`);
  return alerts;
}
