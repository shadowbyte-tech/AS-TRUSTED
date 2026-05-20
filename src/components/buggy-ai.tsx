'use client';

// ============================================================
// BUGGY AI v3.0 — CONVERSION FUNNEL ENGINE (SRI SWAMY)
// ============================================================
// 1. Limited to 5 free messages (clear upgrade gate)
// 2. Timer-triggered conversion after 2 minutes
// 3. Redirects to /register (valid route)
// 4. High-engagement market insights
// ============================================================

import { useState, useEffect, useRef, memo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const FREE_MESSAGE_LIMIT = 5;

const BRAIN_DB: Record<string, string> = {
  kamareddy: "Kamareddy is Telangana's next investment capital! 📈 With the Hyderabad Pharma City and tech corridor expansion, land values have surged 35% in 2 years. I can tell you more, but Buddy AI has the secret pre-launch units! 🤫",
  kokapet: "Kokapet is the 'Golden Mile' of Hyderabad. With the 111 GO lift and direct ORR access, it's where the smart money is moving. Want exact ROI data? Buddy AI has all that! 🏆",
  gachibowli: "Gachibowli isn't just an IT hub; it's the heartbeat of Hyderabad's growth. Want to know which specific plots will double your ROI? Buddy AI has that data! 💎",
  market: "The 2026 outlook for Hyderabad is extremely bullish. 📈 Land demand is at an all-time high. I recommend starting your deep analysis with Buddy AI now before prices jump again!",
};

const SAMPLE_PROPERTIES = [
  { title: 'Kamareddy Growth Plot', price: '₹18L+', loc: 'Kamareddy' },
  { title: 'Nizamabad Highway Land', price: '₹12L+', loc: 'Nizamabad' },
  { title: 'Hyderabad Corridor Plot', price: '₹28L+', loc: 'Medchal' },
  { title: 'Premium AS Listing', price: '₹35L+', loc: 'Kamareddy' },
];

function BuggyAI() {
  const pathname = usePathname();
  const [phase, setPhase] = useState<'closed' | 'welcome' | 'chat'>('closed');
  const [messages, setMessages] = useState<{ role: string; text: string; showHint: boolean }[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [msgCount, setMsgCount] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to newest message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  // Timer: Open upgrade modal after 2 minutes of engagement
  useEffect(() => {
    if (phase === 'chat' && !showUpgrade) {
      const timer = setTimeout(() => setShowUpgrade(true), 2 * 60 * 1000);
      return () => clearTimeout(timer);
    }
  }, [phase, showUpgrade]);

  useEffect(() => {
    const openAI = () => setPhase('welcome');
    window.addEventListener('as-open-ai-assistant', openAI);
    return () => window.removeEventListener('as-open-ai-assistant', openAI);
  }, []);

  const isLimitReached = msgCount >= FREE_MESSAGE_LIMIT;
  const hideStandaloneToggle = ['/', '/about', '/services'].includes(pathname);

  const reply = (msg: string) => {
    if (isLimitReached) {
      setShowUpgrade(true);
      return;
    }

    setMessages(prev => [...prev, { role: 'user', text: msg, showHint: false }]);
    setTyping(true);
    const newCount = msgCount + 1;
    setMsgCount(newCount);

    setTimeout(() => {
      const l = msg.toLowerCase();
      let res = "I'm Buggy — your basic property guide! For a truly expert experience with exact ROI data, you need Buddy AI. ✨";

      if (l.includes('hi') || l.includes('hello')) {
        res = `Hey! 👋 I'm Buggy. I can show you property basics in Telangana. You have ${FREE_MESSAGE_LIMIT - newCount} free message${FREE_MESSAGE_LIMIT - newCount !== 1 ? 's' : ''} left. How can I help?`;
      } else if (l.includes('property') || l.includes('show') || l.includes('plot')) {
        res = `🏘️ Here are some trending listings:\n\n${SAMPLE_PROPERTIES.map(p => `• ${p.title} — ${p.price} (${p.loc})`).join('\n')}\n\nI can only show a few, but Buddy AI has the full database of 500+ properties!`;
      } else if (l.includes('kamareddy')) res = BRAIN_DB.kamareddy;
      else if (l.includes('kokapet')) res = BRAIN_DB.kokapet;
      else if (l.includes('gachibowli')) res = BRAIN_DB.gachibowli;
      else if (l.includes('market') || l.includes('price')) res = BRAIN_DB.market;

      const isNearLimit = newCount >= FREE_MESSAGE_LIMIT - 1;
      if (isNearLimit) {
        res += `\n\n⚠️ This is your last free message! Upgrade to Buddy AI to continue.`;
      }

      setMessages(prev => [...prev, { role: 'buggy', text: res, showHint: true }]);
      setTyping(false);

      if (newCount >= FREE_MESSAGE_LIMIT) {
        setTimeout(() => setShowUpgrade(true), 1000);
      }
    }, 700);
  };

  const send = (t: string) => {
    if (!t.trim() || typing) return;
    setInput('');
    reply(t);
  };

  return (
    <>
      <style>{`
        .bug-bg { background: #07070e !important; border: 1px solid rgba(201,168,76,0.3) !important; color: #fff; }
        .b-bubble { background: #151522; color: #fff; border: 1px solid rgba(201,168,76,0.1); padding: 12px 16px; border-radius: 18px 18px 18px 2px; font-size: 13px; line-height: 1.6; max-width: 85%; white-space: pre-line; }
        .u-bubble { background: #c9a84c; color: #000; font-weight: 700; padding: 12px 16px; border-radius: 18px 18px 2px 18px; font-size: 13px; max-width: 85%; }
        .b-scroll::-webkit-scrollbar { width: 3px; }
        .b-scroll::-webkit-scrollbar-thumb { background: #c9a84c; }
      `}</style>

      {/* Upgrade Gate Modal */}
      {showUpgrade && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 21000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <div style={{ background: '#0d0d19', border: '2px solid #c9a84c', borderRadius: 24, padding: 32, maxWidth: 400, textAlign: 'center', width: '100%' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🤖</div>
            <h2 style={{ fontSize: 24, color: '#c9a84c', marginBottom: 12, fontWeight: 900 }}>Unlock Buddy AI</h2>
            <p style={{ color: '#ccc', marginBottom: 8, fontSize: 14, lineHeight: 1.6 }}>
              You've used {FREE_MESSAGE_LIMIT} free messages. Unlock <strong>Buddy AI</strong> for:
            </p>
            <ul style={{ color: '#eee', marginBottom: 24, fontSize: 13, textAlign: 'left', padding: '0 16px' }}>
              <li>✅ Unlimited conversations</li>
              <li>✅ Real-time property insights</li>
              <li>✅ Exact ROI & growth projections</li>
              <li>✅ Personal investment advisor</li>
            </ul>
            <Link
              href="/register"
              style={{ display: 'block', width: '100%', background: '#c9a84c', padding: 16, borderRadius: 50, border: 'none', fontWeight: 900, cursor: 'pointer', color: '#000', textDecoration: 'none', fontSize: 15, marginBottom: 12 }}
            >
              GET STARTED FREE →
            </Link>
            <button
              onClick={() => setShowUpgrade(false)}
              style={{ color: '#555', fontSize: 12, cursor: 'pointer', background: 'none', border: 'none' }}
            >
              Continue with limited access
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      {!hideStandaloneToggle && (
        <div style={{ position: 'fixed', bottom: 28, right: 28, zIndex: 9999 }}>
          <button
            onClick={() => setPhase(p => p === 'closed' ? 'welcome' : 'closed')}
            style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg,#c9a84c,#8b6914)', border: '2px solid rgba(255,255,255,0.4)', boxShadow: '0 10px 40px rgba(0,0,0,0.5)', cursor: 'pointer', fontSize: 30, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            aria-label="Toggle Buggy AI chat"
          >
            {phase !== 'closed' ? '✕' : 'AI'}
          </button>
        </div>
      )}

      {phase !== 'closed' && (
        <div className="bug-bg" style={{ position: 'fixed', bottom: 100, right: 28, width: 380, maxWidth: 'calc(100vw - 40px)', height: 560, borderRadius: 24, display: 'flex', flexDirection: 'column', overflow: 'hidden', zIndex: 9998, boxShadow: '0 20px 80px rgba(0,0,0,0.9)' }}>
          
          {/* Header */}
          <div style={{ padding: '16px 20px', background: '#111', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 24 }}>🐞</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 800 }}>Buggy AI Advisor</div>
              <div style={{ fontSize: 10, color: '#c9a84c' }}>● Basic Engine · {Math.max(0, FREE_MESSAGE_LIMIT - msgCount)} messages left</div>
            </div>
          </div>

          {phase === 'welcome' ? (
            <div style={{ flex: 1, padding: 32, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 16 }}>
              <div style={{ fontSize: 48 }}>🐞</div>
              <h2 style={{ color: '#fff', fontSize: 22, fontWeight: 900 }}>Hi! I'm Buggy</h2>
              <p style={{ color: '#aaa', fontSize: 13 }}>Your free AI property guide for Telangana real estate. Get {FREE_MESSAGE_LIMIT} free messages.</p>
              <button onClick={() => setPhase('chat')} style={{ padding: 16, background: '#c9a84c', color: '#000', border: 'none', borderRadius: 12, fontWeight: 800, cursor: 'pointer', fontSize: 15 }}>
                START CHATTING →
              </button>
              <Link href="/register" style={{ color: '#c9a84c', fontSize: 12, textDecoration: 'none' }}>
                Upgrade for unlimited access ↗
              </Link>
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="b-scroll" style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {messages.length === 0 && (
                  <div style={{ color: '#666', fontSize: 12, textAlign: 'center', marginTop: 20 }}>
                    Ask me about Kamareddy, Hyderabad plots, ROI, or investment tips!
                  </div>
                )}
                {messages.map((m, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                    <div className={m.role === 'user' ? 'u-bubble' : 'b-bubble'}>{m.text}</div>
                    {m.showHint && m.role === 'buggy' && (
                      <button
                        onClick={() => setShowUpgrade(true)}
                        style={{ fontSize: 10, color: '#c9a84c', marginTop: 4, cursor: 'pointer', fontWeight: 800, background: 'none', border: 'none', padding: 0 }}
                      >
                        ✨ Unlock Expert Data with Buddy AI →
                      </button>
                    )}
                  </div>
                ))}
                {typing && <div style={{ fontSize: 11, color: '#c9a84c' }}>Buggy is checking basic data...</div>}
                <div ref={scrollRef} />
              </div>

              {/* Input */}
              <div style={{ padding: 16, background: '#111', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                {isLimitReached ? (
                  <Link
                    href="/register"
                    style={{ display: 'block', textAlign: 'center', padding: 14, background: '#c9a84c', borderRadius: 12, fontWeight: 900, color: '#000', textDecoration: 'none', fontSize: 14 }}
                  >
                    🔓 Upgrade to Continue →
                  </Link>
                ) : (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && send(input)}
                      placeholder="Ask Buggy about Telangana..."
                      style={{ flex: 1, background: '#222', border: '1px solid #333', borderRadius: 10, padding: 12, color: '#fff', fontSize: 13, outline: 'none' }}
                    />
                    <button
                      onClick={() => send(input)}
                      style={{ background: '#c9a84c', color: '#000', border: 'none', borderRadius: 10, padding: '0 16px', fontWeight: 900, cursor: 'pointer', fontSize: 13 }}
                    >
                      SEND
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}

const BuggyAIMemoized = memo(BuggyAI);
export default BuggyAIMemoized;
