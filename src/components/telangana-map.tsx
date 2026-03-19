"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Zone {
  id: string;
  name: string;
  tagline: string;
  roi: string;
  plots: number;
  priceRange: string;
  highlights: string[];
  cx: number;
  cy: number;
  tier: "premium" | "high" | "emerging";
}

const ZONES: Zone[] = [
  {
    id: "hyderabad",
    name: "Hyderabad",
    tagline: "IT Corridor & Metro Growth",
    roi: "22%",
    plots: 18,
    priceRange: "₹45L – ₹2.5Cr",
    highlights: ["HMDA approved", "Metro connectivity", "IT hub proximity"],
    cx: 210,
    cy: 285,
    tier: "premium",
  },
  {
    id: "medchal",
    name: "Medchal",
    tagline: "North Hyderabad Expansion",
    roi: "26%",
    plots: 9,
    priceRange: "₹18L – ₹80L",
    highlights: ["ORR access", "DTCP approved", "Rapid development"],
    cx: 240,
    cy: 218,
    tier: "high",
  },
  {
    id: "shankarpally",
    name: "Shankarpally",
    tagline: "West Hyderabad Premium",
    roi: "24%",
    plots: 7,
    priceRange: "₹22L – ₹1.2Cr",
    highlights: ["Pharma City belt", "Greenfield township", "Highway access"],
    cx: 148,
    cy: 298,
    tier: "high",
  },
  {
    id: "sangareddy",
    name: "Sangareddy",
    tagline: "Industrial & Pharma Belt",
    roi: "19%",
    plots: 11,
    priceRange: "₹8L – ₹45L",
    highlights: ["Pharma cluster", "NH-65 highway", "MIDC zone"],
    cx: 130,
    cy: 222,
    tier: "emerging",
  },
  {
    id: "kamareddy",
    name: "Kamareddy",
    tagline: "High-Growth Land Investment",
    roi: "28%",
    plots: 14,
    priceRange: "₹5L – ₹30L",
    highlights: ["DTCP plots", "Highway frontage", "28% avg ROI"],
    cx: 195,
    cy: 128,
    tier: "premium",
  },
];

const tierColor = {
  premium: { dot: "#eab308", ring: "#eab308", label: "Top Pick" },
  high:    { dot: "#3b82f6", ring: "#3b82f6", label: "High Growth" },
  emerging:{ dot: "#22c55e", ring: "#22c55e", label: "Emerging" },
};

export default function TelanganaMap() {
  const [active, setActive] = useState<Zone>(ZONES[4]); // default Kamareddy
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="py-16 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">

        {/* Header */}
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full px-4 py-1.5 mb-4">
            <motion.span 
              className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse inline-block"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
            <span className="text-yellow-400 text-xs font-semibold tracking-widest uppercase">
              Investment Zones
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
            Telangana{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200">
              Investment Map
            </span>
          </h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Click any zone to explore plots, ROI data, and investment highlights
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">

          {/* MAP */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="bg-white/5 border border-white/10 rounded-3xl p-4 backdrop-blur-sm">
              <svg
                viewBox="0 0 400 480"
                className="w-full max-w-lg mx-auto"
                style={{ filter: "drop-shadow(0 0 40px rgba(59,130,246,0.08))" }}
              >
                {/* Telangana outline — simplified polygon */}
                <polygon
                  points="
                    120,40  155,30  200,38  245,32  280,48
                    315,70  330,100 325,135 310,160 320,190
                    315,225 295,255 300,285 285,315 270,340
                    255,365 235,390 210,405 185,400 160,385
                    135,360 115,335 100,305  95,275 105,248
                     90,220  85,190  95,160  88,130 100,105
                    108,78
                  "
                  fill="#1e3a8a"
                  fillOpacity="0.35"
                  stroke="#3b82f6"
                  strokeWidth="1.5"
                  strokeOpacity="0.5"
                />

                {/* District grid lines (subtle) */}
                {[100, 160, 220, 280, 340].map((y, i) => (
                  <motion.line 
                    key={`h-${y}`}
                    x1="80" y1={y} x2="340" y2={y}
                    stroke="#3b82f6" strokeWidth="0.3" strokeOpacity="0.15" strokeDasharray="4 6"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                  />
                ))}
                {[120, 180, 240, 300].map((x, i) => (
                  <motion.line 
                    key={`v-${x}`}
                    x1={x} y1="30" x2={x} y2="420"
                    stroke="#3b82f6" strokeWidth="0.3" strokeOpacity="0.15" strokeDasharray="4 6"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: i * 0.1 + 0.2, duration: 0.5 }}
                  />
                ))}

                {/* Connection lines between zones */}
                {ZONES.map((z) =>
                  ZONES.filter((t) => t.id !== z.id && Math.hypot((t.cx || 0) - (z.cx || 0), (t.cy || 0) - (z.cy || 0)) < 130).map((t) => (
                    <motion.line
                      key={`${z.id}-${t.id}`}
                      x1={z.cx || 0} y1={z.cy || 0} x2={t.cx || 0} y2={t.cy || 0}
                      stroke="#eab308" strokeWidth="0.6" strokeOpacity="0.12"
                      strokeDasharray="3 5"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                    />
                  ))
                )}

                {/* Zone markers */}
                {ZONES.map((zone, idx) => {
                  const isActive = active.id === zone.id;
                  const isHovered = hoveredZone === zone.id;
                  const c = tierColor[zone.tier];
                  return (
                    <g
                      key={zone.id}
                      onClick={() => setActive(zone)}
                      onMouseEnter={() => setHoveredZone(zone.id)}
                      onMouseLeave={() => setHoveredZone(null)}
                      style={{ cursor: "pointer" }}
                    >
                      {/* Pulse rings */}
                      <AnimatePresence>
                        {(isActive || isHovered) && (
                          <>
                            <motion.circle
                              cx={zone.cx || 0} cy={zone.cy || 0} r="28"
                              fill={c.ring} fillOpacity={0.08}
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                            />
                            <motion.circle
                              cx={zone.cx || 0} cy={zone.cy || 0} r="20"
                              fill={c.ring} fillOpacity={0.12}
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              transition={{ delay: 0.1, duration: 0.3 }}
                            />
                          </>
                        )}
                      </AnimatePresence>

                      {/* Outer ring */}
                      <motion.circle
                        cx={zone.cx || 0} cy={zone.cy || 0} r="13"
                        fill={c.dot} fillOpacity={Number(isActive ? 0.25 : 0.1)}
                        stroke={c.dot} strokeWidth={isActive ? "1.5" : "1"}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: idx * 0.1, duration: 0.5 }}
                      />

                      {/* Inner dot */}
                      <motion.circle
                        cx={zone.cx || 0} cy={zone.cy || 0} r={Number(isActive ? 7 : 5)}
                        fill={c.dot} fillOpacity={Number(isActive ? 1 : 0.7)}
                        animate={{ 
                          scale: isActive || isHovered ? 1.2 : 1,
                          r: Number(isActive ? 7 : isHovered ? 6 : 5)
                        }}
                        transition={{ duration: 0.2 }}
                      />

                      {/* ROI label */}
                      <motion.text
                        x={zone.cx || 0} y={(zone.cy || 0) + 2}
                        textAnchor="middle" dominantBaseline="central"
                        fontSize="7" fontWeight="700"
                        fill={zone.tier === "premium" ? "#422006" : "#fff"}
                        animate={{ scale: isActive || isHovered ? 1.1 : 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        {zone.roi}
                      </motion.text>

                      {/* Name label */}
                      <motion.text
                        x={zone.cx}
                        y={zone.cy + (zone.id === "hyderabad" ? 26 : -20)}
                        textAnchor="middle"
                        fontSize="10"
                        fontWeight={isActive ? "700" : "500"}
                        fill={isActive ? c.dot : "#94a3b8"}
                        animate={{ 
                          scale: isActive || isHovered ? 1.05 : 1,
                          fill: isActive ? c.dot : isHovered ? "#cbd5e1" : "#94a3b8"
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        {zone.name}
                      </motion.text>
                    </g>
                  );
                })}

                {/* Compass rose */}
                <motion.g transform="translate(358,42)" initial={{ rotate: 0 }} animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
                  <circle cx="0" cy="0" r="14" fill="#0f172a" stroke="#334155" strokeWidth="0.8" />
                  <polygon points="0,-10 3,-4 0,-6 -3,-4" fill="#eab308" />
                  <polygon points="0,10 3,4 0,6 -3,4" fill="#475569" />
                  <polygon points="-10,0 -4,-3 -6,0 -4,3" fill="#475569" />
                  <polygon points="10,0 4,-3 6,0 4,3" fill="#475569" />
                  <text x="0" y="-13" textAnchor="middle" fontSize="6" fill="currentColor" className="fill-foreground dark:fill-[#eab308]" fontWeight="700">N</text>
                </motion.g>

                {/* Legend */}
                <motion.g transform="translate(16, 410)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                  {Object.entries(tierColor).map(([tier, c], i) => (
                    <motion.g key={tier} transform={`translate(${i * 110}, 0)`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 + i * 0.1 }}>
                      <circle cx="5" cy="5" r="4" fill={c.dot} fillOpacity={0.8} />
                      <text x="14" y="9" fontSize="8" fill="currentColor" className="fill-muted-foreground dark:fill-[#94a3b8]">{c.label}</text>
                    </motion.g>
                  ))}
                </motion.g>
              </svg>
            </div>
          </motion.div>

          {/* DETAIL PANEL */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {/* Active zone card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <motion.span
                        className="text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{
                          background: tierColor[active.tier].dot + "22",
                          color: tierColor[active.tier].dot,
                          border: `1px solid ${tierColor[active.tier].dot}44`,
                        }}
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        {tierColor[active.tier].label}
                      </motion.span>
                    </div>
                    <h3 className="text-2xl font-black text-white">{active.name}</h3>
                    <p className="text-slate-400 text-sm mt-0.5">{active.tagline}</p>
                  </div>
                  <motion.div 
                    className="text-right"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <motion.div 
                      className="text-3xl font-black text-yellow-400"
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      +{active.roi}
                    </motion.div>
                    <div className="text-slate-400 text-xs">avg annual ROI</div>
                  </motion.div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <motion.div 
                    className="bg-white/5 rounded-xl p-3"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="text-slate-400 text-xs mb-1">Available Plots</div>
                    <motion.div 
                      className="text-white font-black text-lg"
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
                    >
                      {active.plots}
                    </motion.div>
                  </motion.div>
                  <motion.div 
                    className="bg-white/5 rounded-xl p-3"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="text-slate-400 text-xs mb-1">Price Range</div>
                    <div className="text-yellow-400 font-bold text-sm">{active.priceRange}</div>
                  </motion.div>
                </div>

                {/* Highlights */}
                <div className="space-y-2 mb-5">
                  {active.highlights.map((h, i) => (
                    <motion.div 
                      key={h} 
                      className="flex items-center gap-2"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                    >
                      <svg className="w-4 h-4 text-yellow-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-slate-300 text-sm">{h}</span>
                    </motion.div>
                  ))}
                </div>

                <motion.a
                  href={`/properties?location=${active.id}`}
                  className="block text-center bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-slate-900 font-black text-sm py-3 rounded-xl transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  View {active.plots} Properties in {active.name} →
                </motion.a>
              </motion.div>
            </AnimatePresence>

            {/* All zones list */}
            <motion.div 
              className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">
                All Investment Zones
              </p>
              <div className="space-y-2">
                {ZONES.map((zone, idx) => (
                  <motion.button
                    key={zone.id}
                    onClick={() => setActive(zone)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 ${
                      active.id === zone.id
                        ? "bg-yellow-400/10 border border-yellow-400/30"
                        : "hover:bg-white/5 border border-transparent"
                    }`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + idx * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ background: tierColor[zone.tier].dot }}
                      animate={{ 
                        scale: active.id === zone.id ? 1.2 : 1,
                        opacity: active.id === zone.id ? 1 : 0.8
                      }}
                    />
                    <span className={`flex-1 text-sm font-semibold ${active.id === zone.id ? "text-yellow-300" : "text-slate-300"}`}>
                      {zone.name}
                    </span>
                    <span className="text-xs text-slate-500">{zone.plots} properties</span>
                    <span className="text-xs font-bold text-yellow-500">+{zone.roi}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* CTA */}
            <motion.a
              href="/properties"
              className="block text-center bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-semibold text-sm py-3 rounded-xl transition-colors"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Browse All 47 Properties Across Telangana
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
