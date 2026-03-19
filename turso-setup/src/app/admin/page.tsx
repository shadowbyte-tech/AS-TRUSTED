"use client";
import { useState, useEffect, useCallback } from "react";

// ─────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────
interface Plot {
  id: string; title: string; location: string; price_total: number;
  area_sqyd?: number; status: string; is_premium: boolean; is_featured: boolean;
  dtcp_approved: boolean; view_count: number; inquiry_count: number;
  save_count: number; created_at: string;
}
interface User {
  id: string; email: string; full_name?: string; phone?: string;
  role: string; is_premium: boolean; login_count: number; created_at: string;
}
interface Inquiry {
  id: string; name: string; phone: string; email?: string;
  message?: string; status: string; plot_title: string; created_at: string;
}
interface Visit {
  id: string; name: string; phone: string; visit_date: string;
  visit_time: string; status: string; plot_title: string; created_at: string;
}
interface Stats {
  plots: { total: number; active: number; sold: number; total_views: number };
  users: { total: number; premium: number };
  inquiries: { total: number; new_count: number };
  visits: { total: number; pending: number };
}

// ─────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────
const fmt = (n: number) =>
  n >= 10000000 ? `₹${(n / 10000000).toFixed(1)}Cr`
  : n >= 100000 ? `₹${(n / 100000).toFixed(1)}L`
  : `₹${n.toLocaleString("en-IN")}`;

const STATUS_COLORS: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  sold: "bg-blue-100 text-blue-700",
  paused: "bg-gray-100 text-gray-500",
  new: "bg-yellow-100 text-yellow-700",
  contacted: "bg-blue-100 text-blue-700",
  converted: "bg-green-100 text-green-700",
  closed: "bg-gray-100 text-gray-500",
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-600",
};

// ─────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────
export default function AdminDashboard() {
  const [secret, setSecret] = useState("");
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<"overview" | "plots" | "users" | "inquiries" | "visits">("overview");
  const [stats, setStats] = useState<Stats | null>(null);
  const [plots, setPlots] = useState<Plot[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddPlot, setShowAddPlot] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const headers = { "x-admin-secret": secret, "Content-Type": "application/json" };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [pRes, uRes, iRes, vRes] = await Promise.all([
        fetch("/api/plots", { headers }),
        fetch("/api/users", { headers }),
        fetch("/api/inquiries", { headers }),
        fetch("/api/site-visits", { headers }),
      ]);
      const [pd, ud, id2, vd] = await Promise.all([pRes.json(), uRes.json(), iRes.json(), vRes.json()]);
      const p: Plot[] = pd.plots ?? [];
      const u: User[] = ud.users ?? [];
      const inq: Inquiry[] = id2.inquiries ?? [];
      const vis: Visit[] = vd.visits ?? [];
      setPlots(p);
      setUsers(u);
      setInquiries(inq);
      setVisits(vis);
      setStats({
        plots: {
          total: p.length,
          active: p.filter((x) => x.status === "active").length,
          sold: p.filter((x) => x.status === "sold").length,
          total_views: p.reduce((s, x) => s + (x.view_count || 0), 0),
        },
        users: { total: u.filter(x => x.role !== "owner").length, premium: u.filter((x) => x.is_premium).length },
        inquiries: { total: inq.length, new_count: inq.filter((x) => x.status === "new").length },
        visits: { total: vis.length, pending: vis.filter((x) => x.status === "pending").length },
      });
    } catch { /* silent */ }
    setLoading(false);
  }, [secret]);

  const handleLogin = async () => {
    const res = await fetch("/api/plots", { headers: { "x-admin-secret": secret } });
    if (res.status === 401) { alert("Wrong password"); return; }
    setAuthed(true);
    load();
  };

  const updateInquiry = async (id: string, status: string) => {
    await fetch("/api/inquiries", { method: "PATCH", headers, body: JSON.stringify({ id, status }) });
    showToast("Inquiry updated");
    load();
  };

  const updateVisit = async (id: string, status: string) => {
    await fetch("/api/site-visits", { method: "PATCH", headers, body: JSON.stringify({ id, status }) });
    showToast("Visit status updated");
    load();
  };

  const deletePlot = async (id: string) => {
    if (!confirm("Delete this plot? This cannot be undone.")) return;
    await fetch(`/api/plots/${id}`, { method: "DELETE", headers });
    showToast("Plot deleted");
    load();
  };

  const toggleStatus = async (plot: Plot) => {
    const next = plot.status === "active" ? "paused" : "active";
    await fetch(`/api/plots/${plot.id}`, { method: "PUT", headers, body: JSON.stringify({ status: next }) });
    showToast(`Plot ${next}`);
    load();
  };

  // ─── LOGIN SCREEN ─────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-950 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm text-center">
          <div className="w-16 h-16 bg-blue-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mb-1">Admin Access</h1>
          <p className="text-slate-400 text-sm mb-6">AS Trusted Consultancy</p>
          <input
            type="password"
            placeholder="Enter admin password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 mb-3"
          />
          <button
            onClick={handleLogin}
            className="w-full py-3 bg-blue-900 hover:bg-blue-800 text-yellow-400 font-black text-sm rounded-xl transition-colors"
          >
            Enter Dashboard →
          </button>
        </div>
      </div>
    );
  }

  const TABS = [
    { key: "overview",   label: "Overview" },
    { key: "plots",      label: `Plots (${plots.length})` },
    { key: "users",      label: `Users (${users.filter(u=>u.role!=="owner").length})` },
    { key: "inquiries",  label: `Inquiries (${inquiries.filter(i=>i.status==="new").length} new)` },
    { key: "visits",     label: `Site Visits (${visits.filter(v=>v.status==="pending").length} pending)` },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white text-sm font-semibold px-5 py-3 rounded-xl shadow-lg">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-950 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-white font-black text-lg">AS Trusted Consultancy</h1>
            <p className="text-slate-400 text-xs">Admin Dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={load}
              disabled={loading}
              className="text-slate-400 hover:text-white text-xs border border-white/20 px-3 py-1.5 rounded-lg transition-colors"
            >
              {loading ? "Loading..." : "↻ Refresh"}
            </button>
            <button
              onClick={() => setShowAddPlot(true)}
              className="bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-bold text-xs px-4 py-2 rounded-lg transition-colors"
            >
              + Add Plot
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 px-6">
        <div className="max-w-7xl mx-auto flex gap-0 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-5 py-3.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                tab === t.key
                  ? "border-blue-900 text-blue-900"
                  : "border-transparent text-slate-400 hover:text-slate-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">

        {/* ── OVERVIEW ─────────────────────────── */}
        {tab === "overview" && stats && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Plots", value: stats.plots.total, sub: `${stats.plots.active} active · ${stats.plots.sold} sold`, color: "blue" },
                { label: "Total Views", value: stats.plots.total_views, sub: "across all plots", color: "purple" },
                { label: "Registered Users", value: stats.users.total, sub: `${stats.users.premium} premium`, color: "green" },
                { label: "New Inquiries", value: stats.inquiries.new_count, sub: `${stats.inquiries.total} total`, color: "amber" },
              ].map((s) => (
                <div key={s.label} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                  <div className="text-slate-400 text-xs font-medium mb-1">{s.label}</div>
                  <div className="text-3xl font-black text-slate-900">{s.value}</div>
                  <div className="text-slate-400 text-xs mt-1">{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Recent inquiries preview */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-800">Recent Inquiries</h3>
                <button onClick={() => setTab("inquiries")} className="text-blue-600 text-xs font-semibold">View all →</button>
              </div>
              <div className="divide-y divide-slate-100">
                {inquiries.slice(0, 5).map((inq) => (
                  <div key={inq.id} className="px-6 py-3 flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-slate-800 text-sm">{inq.name}</div>
                      <div className="text-slate-400 text-xs truncate">{inq.plot_title}</div>
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[inq.status]}`}>{inq.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming visits */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-800">Upcoming Site Visits</h3>
                <button onClick={() => setTab("visits")} className="text-blue-600 text-xs font-semibold">View all →</button>
              </div>
              <div className="divide-y divide-slate-100">
                {visits.filter(v => v.status === "pending" || v.status === "confirmed").slice(0, 5).map((v) => (
                  <div key={v.id} className="px-6 py-3 flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-slate-800 text-sm">{v.name} — {v.phone}</div>
                      <div className="text-slate-400 text-xs">{v.plot_title} · {v.visit_date} at {v.visit_time}</div>
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[v.status]}`}>{v.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── PLOTS ────────────────────────────── */}
        {tab === "plots" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    {["Plot", "Location", "Price", "Area", "Status", "Views", "Inq.", "Actions"].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {plots.map((plot) => (
                    <tr key={plot.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {plot.is_premium && <span className="bg-yellow-400 text-yellow-950 text-xs font-bold px-1.5 py-0.5 rounded">P</span>}
                          {plot.is_featured && <span className="bg-blue-100 text-blue-700 text-xs font-bold px-1.5 py-0.5 rounded">★</span>}
                          <span className="font-medium text-slate-800 truncate max-w-[160px]">{plot.title}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-500">{plot.location}</td>
                      <td className="px-4 py-3 font-semibold text-slate-800">{fmt(plot.price_total)}</td>
                      <td className="px-4 py-3 text-slate-500">{plot.area_sqyd ? `${plot.area_sqyd} sq.yd` : "—"}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[plot.status]}`}>
                          {plot.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500">{plot.view_count}</td>
                      <td className="px-4 py-3 text-slate-500">{plot.inquiry_count}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleStatus(plot)}
                            className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
                          >
                            {plot.status === "active" ? "Pause" : "Activate"}
                          </button>
                          <button
                            onClick={() => deletePlot(plot.id)}
                            className="text-xs text-red-500 hover:text-red-700 font-semibold"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── USERS ────────────────────────────── */}
        {tab === "users" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    {["Name", "Email", "Phone", "Role", "Logins", "Joined"].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.filter(u => u.role !== "owner").map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-800">{u.full_name || "—"}</td>
                      <td className="px-4 py-3 text-slate-500">{u.email}</td>
                      <td className="px-4 py-3 text-slate-500">{u.phone || "—"}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          u.is_premium ? "bg-yellow-100 text-yellow-700" : "bg-slate-100 text-slate-500"
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500">{u.login_count}</td>
                      <td className="px-4 py-3 text-slate-400 text-xs">{new Date(u.created_at).toLocaleDateString("en-IN")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── INQUIRIES ────────────────────────── */}
        {tab === "inquiries" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-100">
              {inquiries.map((inq) => (
                <div key={inq.id} className="px-6 py-4 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-black text-sm shrink-0">
                    {inq.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-bold text-slate-800 text-sm">{inq.name}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[inq.status]}`}>{inq.status}</span>
                    </div>
                    <div className="text-slate-500 text-xs mb-1">
                      {inq.phone}{inq.email ? ` · ${inq.email}` : ""} · {inq.plot_title}
                    </div>
                    {inq.message && <div className="text-slate-600 text-sm italic">"{inq.message}"</div>}
                  </div>
                  <div className="flex flex-col gap-1.5 shrink-0">
                    {inq.status === "new" && (
                      <button onClick={() => updateInquiry(inq.id, "contacted")}
                        className="text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg font-semibold hover:bg-blue-100 transition-colors">
                        Mark Contacted
                      </button>
                    )}
                    {inq.status === "contacted" && (
                      <button onClick={() => updateInquiry(inq.id, "converted")}
                        className="text-xs bg-green-50 text-green-700 px-3 py-1.5 rounded-lg font-semibold hover:bg-green-100 transition-colors">
                        Mark Converted
                      </button>
                    )}
                    <a href={`https://wa.me/91${inq.phone}`} target="_blank" rel="noopener noreferrer"
                      className="text-xs bg-green-500 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-green-600 transition-colors text-center">
                      WhatsApp
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SITE VISITS ──────────────────────── */}
        {tab === "visits" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-100">
              {visits.map((v) => (
                <div key={v.id} className="px-6 py-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-bold text-slate-800 text-sm">{v.name}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[v.status]}`}>{v.status}</span>
                    </div>
                    <div className="text-slate-500 text-xs">
                      {v.phone} · {v.plot_title}
                    </div>
                    <div className="text-blue-700 text-xs font-semibold mt-0.5">
                      {new Date(v.visit_date).toLocaleDateString("en-IN", { weekday:"short", day:"numeric", month:"short" })} at {v.visit_time}
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {v.status === "pending" && (
                      <button onClick={() => updateVisit(v.id, "confirmed")}
                        className="text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg font-semibold hover:bg-blue-100 transition-colors">
                        Confirm
                      </button>
                    )}
                    {v.status === "confirmed" && (
                      <button onClick={() => updateVisit(v.id, "completed")}
                        className="text-xs bg-green-50 text-green-700 px-3 py-1.5 rounded-lg font-semibold hover:bg-green-100 transition-colors">
                        Complete
                      </button>
                    )}
                    <a href={`https://wa.me/91${v.phone}?text=${encodeURIComponent(`Hi ${v.name}, your site visit for ${v.plot_title} is confirmed for ${v.visit_date} at ${v.visit_time}. - AS Trusted Consultancy`)}`}
                      target="_blank" rel="noopener noreferrer"
                      className="text-xs bg-green-500 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-green-600 transition-colors">
                      WhatsApp
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── ADD PLOT MODAL ───────────────────── */}
      {showAddPlot && (
        <AddPlotModal
          onClose={() => setShowAddPlot(false)}
          onSave={async (data) => {
            await fetch("/api/plots", { method: "POST", headers, body: JSON.stringify(data) });
            showToast("Plot added successfully!");
            setShowAddPlot(false);
            load();
          }}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────
// ADD PLOT MODAL
// ─────────────────────────────────────────
function AddPlotModal({ onClose, onSave }: { onClose: () => void; onSave: (d: unknown) => void }) {
  const [form, setForm] = useState({
    title: "", description: "", location: "Kamareddy",
    price_total: "", area_sqyd: "", price_per_sqyd: "",
    is_premium: false, is_featured: false, dtcp_approved: false, vastu_certified: false,
    status: "active", facing: "", road_width_ft: "",
    images: "", amenities: "",
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.title || !form.location || !form.price_total) {
      alert("Title, location and price are required"); return;
    }
    setSaving(true);
    await onSave({
      ...form,
      price_total: Number(form.price_total),
      area_sqyd: form.area_sqyd ? Number(form.area_sqyd) : null,
      price_per_sqyd: form.price_per_sqyd ? Number(form.price_per_sqyd) : null,
      road_width_ft: form.road_width_ft ? Number(form.road_width_ft) : null,
      images: form.images ? form.images.split(",").map(s => s.trim()).filter(Boolean) : [],
      amenities: form.amenities ? form.amenities.split(",").map(s => s.trim()).filter(Boolean) : [],
    });
    setSaving(false);
  };

  const f = (key: string, val: string | boolean) => setForm(p => ({ ...p, [key]: val }));

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="font-black text-slate-900 text-lg">Add New Plot</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-xl">✕</button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-xs font-semibold text-slate-500 mb-1 block">Title *</label>
              <input value={form.title} onChange={e => f("title", e.target.value)}
                placeholder="e.g. Highway Facing Premium Plot"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">Location *</label>
              <select value={form.location} onChange={e => f("location", e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 bg-white">
                {["Kamareddy","Hyderabad","Medchal","Sangareddy","Shankarpally","Nizamsagar Rd","Other"].map(l =>
                  <option key={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">Status</label>
              <select value={form.status} onChange={e => f("status", e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 bg-white">
                <option>active</option><option>paused</option><option>sold</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">Total Price (₹) *</label>
              <input type="number" value={form.price_total} onChange={e => f("price_total", e.target.value)}
                placeholder="1500000"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">Area (sq.yd)</label>
              <input type="number" value={form.area_sqyd} onChange={e => f("area_sqyd", e.target.value)}
                placeholder="200"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">Price/sq.yd (₹)</label>
              <input type="number" value={form.price_per_sqyd} onChange={e => f("price_per_sqyd", e.target.value)}
                placeholder="7500"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">Facing</label>
              <select value={form.facing} onChange={e => f("facing", e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 bg-white">
                <option value="">Select</option>
                {["North","South","East","West","North-East","North-West","South-East","South-West"].map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">Road Width (ft)</label>
              <input type="number" value={form.road_width_ft} onChange={e => f("road_width_ft", e.target.value)}
                placeholder="30"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500" />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-semibold text-slate-500 mb-1 block">Description</label>
              <textarea value={form.description} onChange={e => f("description", e.target.value)}
                rows={3} placeholder="Describe the plot..."
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 resize-none" />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-semibold text-slate-500 mb-1 block">Image URLs (comma separated)</label>
              <input value={form.images} onChange={e => f("images", e.target.value)}
                placeholder="https://..., https://..."
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500" />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-semibold text-slate-500 mb-1 block">Amenities (comma separated)</label>
              <input value={form.amenities} onChange={e => f("amenities", e.target.value)}
                placeholder="Corner plot, Park facing, Water connection"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500" />
            </div>
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            {([
              { key: "is_premium", label: "Premium Listing" },
              { key: "is_featured", label: "Featured" },
              { key: "dtcp_approved", label: "DTCP Approved" },
              { key: "vastu_certified", label: "Vastu Certified" },
            ] as const).map(({ key, label }) => (
              <label key={key} className="flex items-center gap-3 cursor-pointer p-3 border border-slate-200 rounded-xl hover:bg-slate-50">
                <div
                  className={`w-10 h-5 rounded-full transition-colors relative ${form[key] ? "bg-blue-900" : "bg-slate-200"}`}
                  onClick={() => f(key, !form[key])}
                >
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form[key] ? "translate-x-5" : "translate-x-0.5"}`} />
                </div>
                <span className="text-sm font-medium text-slate-700">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-slate-200 flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-3 border border-slate-200 text-slate-600 font-semibold text-sm rounded-xl hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 py-3 bg-blue-900 hover:bg-blue-800 disabled:opacity-60 text-yellow-400 font-black text-sm rounded-xl transition-colors">
            {saving ? "Saving..." : "Save Plot →"}
          </button>
        </div>
      </div>
    </div>
  );
}
