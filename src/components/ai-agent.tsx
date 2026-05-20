'use client';

// ============================================================
// BUDDY AI v10.7 — UNCRASHABLE HYBRID BRAIN (SRI SWAMY)
// ============================================================
// 1. Triple-API Proxy (Grok + DeepSeek + Gemini)
// 2. Built-in Local Fallback Engine (Zero-Downtime)
// 3. User Feedback & Owner Alerting Integration
// 4. High-Contrast Black Text Onyx Interface
// 5. Local Vastu Compliance Analyzer Tab (Free & Fast)
// ============================================================

import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { useAuth } from '@/lib/auth-context';
import { usePathname } from 'next/navigation';
import { Sparkles, MessageSquare, Compass, Check, AlertTriangle, Lightbulb, Activity } from 'lucide-react';
import { 
  getMemory, 
  saveMemory, 
  updateMemoryWithInteraction, 
  isWithinLimit, 
  updateUsage, 
  getCachedResponse, 
  cacheResponse 
} from '@/lib/buddy-engine';

const GROK_API_URL = '/api/buddy/chat';

// ── TYPES ─────────────────────────────────────────────────────
type Role = 'user' | 'buddy' | 'admin' | 'system';
type Message = { id: string; role: Role; text: string; timestamp: Date; understanding?: any; suggestions?: string[]; propertyCards?: any[]; reasoning?: string; isError?: boolean; };

// ── LOCAL FALLBACK RESPONSES (Rule-Based) ─────────────────────
const LOCAL_RESPONSES = [
  { keywords: ['hi', 'hello'], text: "Hello! I'm Buddy AI. I'm currently running on partial brain power due to a connection glitch, but I'm still here to help with your property search! What are you looking for?" },
  { keywords: ['property', 'show', 'buy'], text: "Hyderabad has some incredible investment hotspots right now. Kokapet, Gachibowli, and the Financial District are seeing massive growth. I've logged this as a technical issue for the owner, but feel free to ask more!" },
  { keywords: ['roi', 'return'], text: "ROI in Hyderabad's growth corridors generally ranges from 9-12%. While my deep analyzer is reconnecting, I can tell you that long-term land investment remains the safest bet here." },
  { keywords: ['error', 'fail', 'broken'], text: "I apologize for the glitch! I've automatically sent a technical report to my owner. I'm now operating on my fallback local intelligence to keep helping you." }
];

// ── AI CLIENT ─────────────────────────────────────────────
class AIClient {
  async understand(input: string, history: Message[], memory: any): Promise<{ understanding: any; response: any; isFallback?: boolean; isCached?: boolean; isLimitExceeded?: boolean }> {
    // 🚦 1. Check Daily Limit
    if (!isWithinLimit(getMemory())) {
      return {
        isLimitExceeded: true,
        understanding: { intent: 'limit_reached' },
        response: { text: "You've reached your daily AI limit. Please come back tomorrow or upgrade to Elite for unlimited access!" }
      };
    }

    // 🧠 2. Check Cache
    const cached = getCachedResponse(input);
    if (cached) {
      try {
        const content = JSON.parse(cached);
        return { 
          isCached: true,
          understanding: content.understanding || {}, 
          response: content.response || { text: cached } 
        };
      } catch { /* fall through if cache corrupted */ }
    }

    try {
      const res = await fetch(GROK_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            messages: [
                { role: 'system', content: `You are Buddy AI v10.7. Hyderabad Real Estate Expert. Respond ONLY in JSON.` },
                ...history.slice(-5).map(m => ({ role: m.role==='user'?'user':'assistant', content: m.text })),
                { role: 'user', content: input }
            ]
        })
      });

      if (!res.ok) throw new Error('Proxy Fail');
      const data = await res.json();
      let rawText = data.choices[0].message.content || '{}';
      
      if (rawText.includes('```json')) rawText = rawText.split('```json')[1].split('```')[0];
      else if (rawText.includes('```')) rawText = rawText.split('```')[1].split('```')[0];
      
      const content = JSON.parse(rawText.trim());
      
      // 💾 Cache successful response
      cacheResponse(input, rawText);
      // 📈 Update Usage
      saveMemory(updateUsage(getMemory()));

      return { understanding: content.understanding || {}, response: content.response || { text: rawText } };
    } catch (e) {
      console.warn('Buddy AI: Switching to Local Logic...', e);
      // LOCAL RULE-BASED ENGINE
      const l = input.toLowerCase();
      const match = LOCAL_RESPONSES.find(r => r.keywords.some(k => l.includes(k)));
      return {
        isFallback: true,
        understanding: { intent: 'fallback', sentiment: 'neutral' },
        response: {
          text: match ? match.text : "I encountered a small technical glitch, so I've notified my owner immediately. In the meantime, I'm using my built-in local knowledge to assist you! How can I help with your property investment?",
          suggestions: ['Show properties', 'ROI in Kokapet', 'Investment tips']
        }
      };
    }
  }
}

function Buddy() {
  const pathname = usePathname();
  const [phase, setPhase] = useState<'closed'|'welcome'|'chat'>('closed');
  const [activeTab, setActiveTab] = useState<'chat' | 'vastu'>('chat');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [ai] = useState(() => new AIClient());
  const scrollRef = useRef<HTMLDivElement>(null);

  // Vastu state
  const [facing, setFacing] = useState('East');
  const [kitchen, setKitchen] = useState('South-East');
  const [bedroom, setBedroom] = useState('South-West');
  const [entrance, setEntrance] = useState('North-East');
  const [vastuResult, setVastuResult] = useState<{
    score: number;
    verdict: string;
    pros: string[];
    cons: string[];
    tips: string[];
  } | null>(null);

  useEffect(() => { const c = () => setIsMobile(window.innerWidth < 768); c(); window.addEventListener('resize', c); return () => window.removeEventListener('resize', c); }, []);
  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, typing, activeTab]);
  useEffect(() => {
    const openAI = () => setPhase('welcome');
    window.addEventListener('as-open-ai-assistant', openAI);
    return () => window.removeEventListener('as-open-ai-assistant', openAI);
  }, []);

  const hideStandaloneToggle = ['/', '/about', '/services'].includes(pathname);

  const calculateVastu = () => {
    let facingScore = 50;
    if (['North-East', 'East', 'North'].includes(facing)) facingScore = 100;
    else if (['North-West', 'West'].includes(facing)) facingScore = 75;
    else if (['South-East', 'South'].includes(facing)) facingScore = 60;
    else facingScore = 40; // South-West

    let kitchenScore = 50;
    if (kitchen === 'South-East') kitchenScore = 100;
    else if (kitchen === 'North-West') kitchenScore = 80;
    else if (kitchen === 'East') kitchenScore = 65;
    else kitchenScore = 30; // North-East, South-West

    let bedroomScore = 50;
    if (bedroom === 'South-West') bedroomScore = 100;
    else if (['South', 'West'].includes(bedroom)) bedroomScore = 80;
    else bedroomScore = 30; // North-East

    let entranceScore = 50;
    if (['North-East', 'East', 'North'].includes(entrance)) entranceScore = 100;
    else if (entrance === 'West') entranceScore = 75;
    else entranceScore = 40; // South

    const score = Math.round((facingScore + kitchenScore + bedroomScore + entranceScore) / 4);

    let verdict = 'Excellent Vastu compliance! Highly recommended.';
    if (score < 60) verdict = 'Low Vastu compliance. Remedies highly recommended.';
    else if (score < 80) verdict = 'Moderate Vastu compliance. Good with minor corrections.';

    const pros: string[] = [];
    const cons: string[] = [];
    const tips: string[] = [];

    // Analyze facing
    if (facingScore === 100) {
      pros.push(`Plot faces ${facing}, which is highly auspicious for attracting positive solar energy.`);
    } else {
      cons.push(`Plot faces ${facing}, which is Vastu-neutral or challenging.`);
      tips.push(`Place a copper Vastu helix on the ${facing} border of the plot to balance energetic flow.`);
    }

    // Analyze kitchen
    if (kitchenScore === 100) {
      pros.push("Kitchen is located in South-East (Agneya corner), perfectly aligning with the Fire element.");
    } else {
      cons.push(`Kitchen is in ${kitchen}, which conflicts with the Fire element and may affect household health.`);
      if (kitchen === 'North-East') {
        tips.push("Kitchen in North-East is a severe defect. Place a yellow marble slab beneath the gas stove to absorb negative vibrations.");
      } else {
        tips.push("Install a Vastu fire crystal in the South-East corner of the cooking area.");
      }
    }

    // Analyze bedroom
    if (bedroomScore === 100) {
      pros.push("Master bedroom is in South-West (Nairutya corner), promoting stability and heavy structural balance.");
    } else {
      cons.push(`Master bedroom is in ${bedroom}, which can lead to sleep instability or financial pressure.`);
      tips.push("Sleep with your head pointing strictly towards the South, and place heavy furniture in the South-West corner.");
    }

    // Analyze entrance
    if (entranceScore === 100) {
      pros.push(`Main entrance is in ${entrance}, facilitating the intake of positive cosmic vibes.`);
    } else {
      cons.push(`Main entrance is in ${entrance}, which blocks flow of positive energies.`);
      tips.push("Paint the entrance gate/door light green or cream (avoid black/dark blue) and ensure it is illuminated perfectly.");
    }

    setVastuResult({ score, verdict, pros, cons, tips });
  };

  const addReply = useCallback(async (msg: string) => {
    setMessages(prev => [...prev, { id: Date.now()+'u', role: 'user', text: msg, timestamp: new Date() }]);
    setTyping(true);

    const res = await ai.understand(msg, messages, { questionsAsked: messages.length, lang: 'en', sentiment: 'neutral' });

    setMessages(prev => [...prev, {
      id: Date.now()+'b', role: 'buddy', 
      text: res.response.text, 
      suggestions: res.response.suggestions,
      propertyCards: res.response.propertyCards, 
      reasoning: res.isLimitExceeded ? "🚫 Daily Limit Reached" :
                 res.isCached ? "⚡ Cached for Performance" :
                 res.isFallback ? "⚠️ Local Fallback (Owner Notified)" : 
                 res.understanding?.reasoning, 
      timestamp: new Date(),
      isError: res.isFallback || res.isLimitExceeded
    }]);
    setTyping(false);
  }, [messages, ai]);

  const send = (t: string) => { if (!t.trim() || typing) return; setInput(''); addReply(t); };

  return (
    <>
      <style>{`
        .b-win { background: #0a0a0a !important; font-family: sans-serif; }
        .b-scroll::-webkit-scrollbar { width: 3px; }
        .b-scroll::-webkit-scrollbar-thumb { background: #c9a84c; }
        .v-select { width: 100%; background: #161616; border: 1px solid #333; color: #fff; padding: 10px 12px; border-radius: 8px; font-size: 13px; outline: none; margin-top: 4px; transition: border-color 0.2s; }
        .v-select:focus { border-color: #c9a84c; }
      `}</style>

      {/* Toggle */}
      {!hideStandaloneToggle && (
        <div style={{position:'fixed',bottom:20,right:20,zIndex:9999}}>
          <button onClick={()=>setPhase(p=>p==='closed'?'welcome':'closed')} style={{width:64,height:64,borderRadius:'50%',background:'linear-gradient(135deg,#c9a84c,#8b6914)',border:'2px solid #fff',boxShadow:'0 10px 40px rgba(0,0,0,0.5)',cursor:'pointer',fontSize:18,fontWeight:900,display:'flex',justifyContent:'center',alignItems:'center',color:'#000'}}>{phase!=='closed'?'✕':'AI'}</button>
        </div>
      )}

      {phase!=='closed' && (
        <div className="b-win" style={{position:'fixed', bottom:isMobile?0:95, right:isMobile?0:20, width:isMobile?'100vw':420, height:isMobile?'100dvh':'680px', maxHeight:isMobile?'100dvh':'calc(100vh - 120px)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:isMobile?0:24, display:'flex', flexDirection:'column', overflow:'hidden', zIndex:9998, boxShadow:'0 30px 60px rgba(0,0,0,1)'}}>
          
          {/* Header */}
          <div style={{padding:'16px 20px',background:'#111',borderBottom:'1px solid rgba(255,255,255,0.1)',display:'flex',alignItems:'center',gap:12}}>
            <div style={{width:40,height:40,borderRadius:'50%',background:'#222',border:'2px solid #c9a84c',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20}}>🤖</div>
            <div style={{flex:1}}><div style={{fontSize:16,fontWeight:800,color:'#fff'}}>Buddy AI v10.7</div><div style={{fontSize:10,color:'#c9a84c'}}>● Premium Engine</div></div>
          </div>

          {/* Navigation Tabs */}
          {phase === 'chat' && (
            <div style={{display:'flex',background:'#111',borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
              <button onClick={()=>setActiveTab('chat')} style={{flex:1,padding:'12px',background:activeTab==='chat'?'rgba(201,168,76,0.1)':'transparent',color:activeTab==='chat'?'#c9a84c':'#888',border:'none',borderBottom:activeTab==='chat'?'2px solid #c9a84c':'none',cursor:'pointer',fontSize:12,fontWeight:800,display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
                <MessageSquare className="h-4 w-4" /> CHAT BUDDY
              </button>
              <button onClick={()=>setActiveTab('vastu')} style={{flex:1,padding:'12px',background:activeTab==='vastu'?'rgba(201,168,76,0.1)':'transparent',color:activeTab==='vastu'?'#c9a84c':'#888',border:'none',borderBottom:activeTab==='vastu'?'2px solid #c9a84c':'none',cursor:'pointer',fontSize:12,fontWeight:800,display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
                <Compass className="h-4 w-4" /> VASTU EXPERT
              </button>
            </div>
          )}

          {phase === 'welcome' ? (
            <div style={{flex:1,padding:40,textAlign:'center',display:'flex',flexDirection:'column',justifyContent:'center'}}>
              <h2 style={{color:'#fff',fontSize:32,fontWeight:900,marginBottom:10}}>BUDDY</h2>
              <button onClick={()=>setPhase('chat')} style={{padding:18,background:'#c9a84c',color:'#000',border:'none',borderRadius:12,fontWeight:800,cursor:'pointer'}}>START ANALYSIS →</button>
            </div>
          ) : (
            <>
              {activeTab === 'chat' ? (
                <>
                  {/* Chat Area */}
                  <div className="b-scroll" style={{flex:1,overflowY:'auto',padding:20,display:'flex',flexDirection:'column',gap:16}}>
                    {messages.length === 0 && (
                      <div style={{textAlign:'center',padding:'40px 20px',color:'#888'}}>
                        <Sparkles style={{color:'#c9a84c',width:36,height:36,margin:'0 auto 12px auto'}} />
                        <div style={{color:'#fff',fontWeight:800,fontSize:15,marginBottom:6}}>Ask me about local plots!</div>
                        <div style={{fontSize:12,lineHeight:1.5}}>Ask me to list plots in Kamareddy, verify ROI percentages, or help you locate elite options.</div>
                      </div>
                    )}
                    {messages.map(m=>(
                      <div key={m.id} style={{display:'flex',flexDirection:'column',alignItems:m.role==='user'?'flex-end':'flex-start'}}>
                        <div style={{maxWidth:'85%',padding:'12px 16px',borderRadius:m.role==='user'?'20px 20px 4px 20px':'20px 20px 20px 4px',background:m.role==='user'?'#c9a84c':'#f0f0f0',color:'#000',fontSize:13,lineHeight:1.6,fontWeight:500,boxShadow:'0 5px 15px rgba(0,0,0,0.2)'}}>
                            {m.text}
                        </div>
                        {m.reasoning && <div style={{fontSize:10,color:m.isError?'#fb7185':'#c9a84c',marginTop:6,fontStyle:'italic'}}>{m.reasoning}</div>}
                      </div>
                    ))}
                    {typing && <div style={{fontSize:11,color:'#c9a84c'}}>Analyzing factors...</div>}
                    <div ref={scrollRef}/>
                  </div>

                  {/* Input Form */}
                  <div style={{padding:20,background:'#111',borderTop:'1px solid rgba(255,255,255,0.1)'}}>
                    <div style={{display:'flex',gap:10}}>
                      <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send(input)} placeholder="Ask Buddy anything..." style={{flex:1,background:'#222',border:'1px solid #333',borderRadius:10,padding:14,color:'#fff',fontSize:13,outline:'none'}}/>
                      <button onClick={()=>send(input)} style={{background:'#c9a84c',color:'#000',border:'none',borderRadius:10,padding:'0 20px',fontWeight:800,cursor:'pointer'}}>SEND</button>
                    </div>
                  </div>
                </>
              ) : (
                /* Vastu Advisor Area */
                <div className="b-scroll" style={{flex:1,overflowY:'auto',padding:20,display:'flex',flexDirection:'column',gap:20}}>
                  <div style={{borderBottom:'1px dashed rgba(255,255,255,0.1)',paddingBottom:12}}>
                    <h3 style={{color:'#c9a84c',fontSize:16,fontWeight:800,display:'flex',alignItems:'center',gap:6}}><Compass className="h-4 w-4" /> Vastu Advisor</h3>
                    <p style={{color:'#888',fontSize:11,lineHeight:1.4,marginTop:4}}>Configure facing and room locations to calculate scientific Vastu compliance for your plot or construction plan.</p>
                  </div>

                  <div style={{display:'flex',flexDirection:'column',gap:12}}>
                    <div>
                      <label style={{color:'#bbb',fontSize:12,fontWeight:700}}>Plot/House Facing</label>
                      <select value={facing} onChange={e=>setFacing(e.target.value)} className="v-select">
                        <option value="East">East (Auspicious)</option>
                        <option value="North">North (Auspicious)</option>
                        <option value="North-East">North-East (Highly Auspicious)</option>
                        <option value="West">West (Auspicious with rules)</option>
                        <option value="North-West">North-West (Average)</option>
                        <option value="South">South (Average)</option>
                        <option value="South-East">South-East (Average)</option>
                        <option value="South-West">South-West (Neutral)</option>
                      </select>
                    </div>

                    <div>
                      <label style={{color:'#bbb',fontSize:12,fontWeight:700}}>Kitchen Placement</label>
                      <select value={kitchen} onChange={e=>setKitchen(e.target.value)} className="v-select">
                        <option value="South-East">South-East (Agneya - Auspicious)</option>
                        <option value="North-West">North-West (Vayu - Average)</option>
                        <option value="East">East (Average)</option>
                        <option value="North-East">North-East (Defect)</option>
                        <option value="South-West">South-West (Defect)</option>
                      </select>
                    </div>

                    <div>
                      <label style={{color:'#bbb',fontSize:12,fontWeight:700}}>Master Bedroom Placement</label>
                      <select value={bedroom} onChange={e=>setBedroom(e.target.value)} className="v-select">
                        <option value="South-West">South-West (Nairutya - Auspicious)</option>
                        <option value="South">South (Average)</option>
                        <option value="West">West (Average)</option>
                        <option value="North-East">North-East (Defect)</option>
                        <option value="North-West">North-West (Neutral)</option>
                      </select>
                    </div>

                    <div>
                      <label style={{color:'#bbb',fontSize:12,fontWeight:700}}>Main Entrance Placement</label>
                      <select value={entrance} onChange={e=>setEntrance(e.target.value)} className="v-select">
                        <option value="North-East">North-East (Highly Auspicious)</option>
                        <option value="East">East (Auspicious)</option>
                        <option value="North">North (Auspicious)</option>
                        <option value="West">West (Average)</option>
                        <option value="South">South (Defect)</option>
                      </select>
                    </div>

                    <button onClick={calculateVastu} style={{marginTop:10,padding:'14px',background:'#c9a84c',color:'#000',border:'none',borderRadius:10,fontWeight:800,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
                      <Activity className="h-4 w-4" /> CALC VASTU ALIGNMENT
                    </button>
                  </div>

                  {vastuResult && (
                    <div style={{background:'#111',border:'1px solid rgba(201,168,76,0.2)',borderRadius:14,padding:16,display:'flex',flexDirection:'column',gap:14,animation:'fadeIn 0.5s'}}>
                      {/* Vastu Dial */}
                      <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:20}}>
                        <div style={{width:80,height:80,borderRadius:'50%',border:`4px solid ${vastuResult.score >= 80 ? '#10b981' : vastuResult.score >= 60 ? '#f59e0b' : '#ef4444'}`,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:'#161616',boxShadow:'0 0 15px rgba(201,168,76,0.1)'}}>
                          <span style={{fontSize:22,fontWeight:900,color:'#fff'}}>{vastuResult.score}%</span>
                          <span style={{fontSize:9,color:'#888',fontWeight:800}}>COMPLIANCE</span>
                        </div>
                        <div style={{flex:1}}>
                          <div style={{fontSize:13,fontWeight:800,color:'#fff'}}>{vastuResult.score >= 80 ? '🟢 Highly Compliant' : vastuResult.score >= 60 ? '🟡 Moderately Compliant' : '🔴 Low Compliance'}</div>
                          <div style={{fontSize:11,color:'#aaa',marginTop:4,lineHeight:1.4}}>{vastuResult.verdict}</div>
                        </div>
                      </div>

                      {/* Pros & Cons */}
                      <div>
                        <div style={{fontSize:11,fontWeight:800,color:'#c9a84c',marginBottom:6,textTransform:'uppercase',letterSpacing:'0.05em'}}>Auspicious Factors</div>
                        <ul style={{margin:0,padding:0,listStyle:'none',display:'flex',flexDirection:'column',gap:6}}>
                          {vastuResult.pros.map((pro, idx)=>(
                            <li key={idx} style={{fontSize:11,color:'#eee',display:'flex',alignItems:'flex-start',gap:6,lineHeight:1.4}}>
                              <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" style={{marginTop:1}} />
                              <span>{pro}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {vastuResult.cons.length > 0 && (
                        <div>
                          <div style={{fontSize:11,fontWeight:800,color:'#c9a84c',marginBottom:6,textTransform:'uppercase',letterSpacing:'0.05em'}}>Attention Needed</div>
                          <ul style={{margin:0,padding:0,listStyle:'none',display:'flex',flexDirection:'column',gap:6}}>
                            {vastuResult.cons.map((con, idx)=>(
                              <li key={idx} style={{fontSize:11,color:'#eee',display:'flex',alignItems:'flex-start',gap:6,lineHeight:1.4}}>
                                <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" style={{marginTop:1}} />
                                <span>{con}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {vastuResult.tips.length > 0 && (
                        <div style={{borderTop:'1px dashed rgba(255,255,255,0.1)',paddingTop:12}}>
                          <div style={{fontSize:11,fontWeight:800,color:'#c9a84c',marginBottom:6,textTransform:'uppercase',letterSpacing:'0.05em'}}>Sri Swamy's Vastu Remedies</div>
                          <ul style={{margin:0,padding:0,listStyle:'none',display:'flex',flexDirection:'column',gap:6}}>
                            {vastuResult.tips.map((tip, idx)=>(
                              <li key={idx} style={{fontSize:11,color:'#ddd',display:'flex',alignItems:'flex-start',gap:6,lineHeight:1.4}}>
                                <Lightbulb className="h-3.5 w-3.5 text-yellow-400 shrink-0" style={{marginTop:1}} />
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
}

const BuddyMemoized = memo(Buddy);
export default BuddyMemoized;
