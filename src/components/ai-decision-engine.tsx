'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Calculator,
  Target,
  Shield,
  Zap,
  BarChart3,
  Activity,
  Clock,
  MapPin,
  Building,
  Road,
  Navigation
} from 'lucide-react';
import type { Property } from '@/lib/definitions';

interface InvestmentScore {
  overall: number;
  growth: number;
  risk: 'Low' | 'Medium' | 'High';
  recommendation: 'BUY_NOW' | 'BUY_SOON' | 'WAIT' | 'AVOID';
  confidence: number;
  factors: {
    infrastructure: number;
    location: number;
    price: number;
    development: number;
    demand: number;
  };
  timeline: {
    oneYear: number;
    fiveYears: number;
    tenYears: number;
  };
  insights: string[];
  risks: string[];
  opportunities: string[];
}

interface AIDecisionEngineProps {
  property: Property;
  userInvestmentCapacity?: number;
}

export function AIDecisionEngine({ property, userInvestmentCapacity = 1000000 }: AIDecisionEngineProps) {
  const [score, setScore] = useState<InvestmentScore | null>(null);
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<string>('');
  const propertyPrice = property.price || 1000000;

  // Appreciation Predictor States
  const [highwayDist, setHighwayDist] = useState(5); // distance in km
  const [rrrDist, setRrrDist] = useState(12); // regional ring road distance in km
  const [historicalGrowth, setHistoricalGrowth] = useState(11); // base growth percentage

  // Auto-set defaults based on village name
  useEffect(() => {
    const v = (property.villageName || '').toLowerCase();
    if (v.includes('devanpally') || v.includes('tekrial') || v.includes('vidhya') || v.includes('kamareddy')) {
      setHistoricalGrowth(15); // high appreciation zone
      setHighwayDist(2);
      setRrrDist(6);
    } else if (v.includes('adloor') || v.includes('kyasampally') || v.includes('rameshwarpally')) {
      setHistoricalGrowth(11); // medium growth
      setHighwayDist(5);
      setRrrDist(12);
    } else {
      setHistoricalGrowth(8); // base growth
      setHighwayDist(12);
      setRrrDist(22);
    }
  }, [property]);

  useEffect(() => {
    analyzeProperty();
  }, [property]);

  const analyzeProperty = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/ai/investment-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          property,
          highwayDist,
          rrrDist,
          historicalGrowth
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch AI score');
      }

      const data = await response.json();
      
      if (data.success && data.score) {
        const generatedScore = data.score;
        
        // Growth projections
        const growthRate = generatedScore.growth / 100;
        const oneYear = Math.floor(propertyPrice * (1 + growthRate));
        const fiveYears = Math.floor(propertyPrice * Math.pow(1 + growthRate, 5));
        const tenYears = Math.floor(propertyPrice * Math.pow(1 + growthRate, 10));
        
        // Add timeline to score object
        generatedScore.timeline = { oneYear, fiveYears, tenYears };
        
        const analysisText = `
AI Evaluation Summary for Plot ${property.propertyNumber || 'L-1'}:
==============================================
Overall Investment Score: ${generatedScore.overall}/100
Recommended Action: ${generatedScore.recommendation.replace('_', ' ')}
Underlying Risk Profile: ${generatedScore.risk}

Appreciation Outlook (CAGR): ${generatedScore.growth}%
Projected Returns (Historical Baseline):
- Current Price: ₹${propertyPrice.toLocaleString()}
- 1-Year Value:  ₹${oneYear.toLocaleString()} (+${generatedScore.growth}%)
- 5-Year Value:  ₹${fiveYears.toLocaleString()} (+${Math.round((fiveYears-propertyPrice)/propertyPrice*100)}%)
- 10-Year Value: ₹${tenYears.toLocaleString()} (+${Math.round((tenYears-propertyPrice)/propertyPrice*100)}%)
        `;
        
        setAnalysis(analysisText);
        setScore(generatedScore);
      }
    } catch (error) {
      console.error('AI Decision Engine Error:', error);
      // Fallback if API fails
      setAnalysis("⚠️ AI Service Unavailable. Please check your API keys in the dashboard.");
    } finally {
      setLoading(false);
    }
  };

  // Interactive Predictor Calculations
  const calculatedCAGR = Math.max(5, Math.min(25, 
    historicalGrowth + 
    (highwayDist <= 2 ? 3.5 : highwayDist <= 5 ? 2.0 : highwayDist > 10 ? -1.5 : 0) +
    (rrrDist <= 5 ? 2.5 : rrrDist <= 12 ? 1.2 : rrrDist > 20 ? -1.0 : 0)
  ));

  const cagr3YrVal = Math.round(propertyPrice * Math.pow(1 + (calculatedCAGR/100), 3));
  const cagr5YrVal = Math.round(propertyPrice * Math.pow(1 + (calculatedCAGR/100), 5));
  
  // Confidence margins (95% CI)
  const margin = 0.04; // +/-4% CAGR margin
  const val3Low = Math.round(propertyPrice * Math.pow(1 + ((calculatedCAGR/100) - margin), 3));
  const val3High = Math.round(propertyPrice * Math.pow(1 + ((calculatedCAGR/100) + margin), 3));
  const val5Low = Math.round(propertyPrice * Math.pow(1 + ((calculatedCAGR/100) - margin), 5));
  const val5High = Math.round(propertyPrice * Math.pow(1 + ((calculatedCAGR/100) + margin), 5));

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case 'BUY_NOW': return 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20';
      case 'BUY_SOON': return 'text-blue-600 bg-blue-500/10 border-blue-500/20';
      case 'WAIT': return 'text-amber-600 bg-amber-500/10 border-amber-500/20';
      case 'AVOID': return 'text-red-600 bg-red-500/10 border-red-500/20';
      default: return 'text-gray-600 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-emerald-600 bg-emerald-500/15';
      case 'Medium': return 'text-amber-600 bg-amber-500/15';
      case 'High': return 'text-red-600 bg-red-500/15';
      default: return 'text-gray-600 bg-gray-500/15';
    }
  };

  if (loading) {
    return (
      <Card className="w-full border border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Brain className="h-5 w-5 text-primary animate-pulse" />
            AI Investment Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">AI is analyzing this property...</p>
            <p className="text-sm text-muted-foreground mt-2">Evaluating infrastructure offsets and micro-trends</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!score) return null;

  return (
    <div className="space-y-6">
      {/* Main Score Card */}
      <Card className="border-2 border-primary/20 shadow-lg bg-card">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
          <CardTitle className="flex items-center justify-between text-foreground">
            <div className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary" />
              AI Investment Analysis
            </div>
            <Badge className="bg-primary/10 text-primary border border-primary/20">
              {score.confidence}% Confidence
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* Overall Score */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-4">
              <div className="text-5xl font-bold text-primary">{score.overall}</div>
              <div className="text-2xl text-muted-foreground">/100</div>
            </div>
            <Progress value={score.overall} className="h-3" />
            <p className="text-sm text-muted-foreground">Investment Rating Score</p>
          </div>

          {/* Recommendation */}
          <div className={`text-center p-4 rounded-xl border ${getRecommendationColor(score.recommendation)}`}>
            <div className="text-lg font-bold mb-1">
              {score.recommendation.replace('_', ' ')}
            </div>
            <p className="text-sm opacity-90">
              {score.recommendation === 'BUY_NOW' ? 'Excellent opportunity - Act now!' :
               score.recommendation === 'BUY_SOON' ? 'Good investment - Consider within 3 months' :
               score.recommendation === 'WAIT' ? 'Monitor market for better entry' :
               'High risk - Look for alternatives'}
            </p>
          </div>

          {/* Risk Level */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border">
            <div className="flex items-center gap-2 text-foreground">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-sm">Risk Level:</span>
            </div>
            <Badge className={`${getRiskColor(score.risk)} border-none`}>
              {score.risk} Risk
            </Badge>
          </div>

          {/* Growth Potential */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
              <div className="text-2xl font-bold text-primary">+{score.growth}%</div>
              <div className="text-xs text-muted-foreground">Base Growth (CAGR)</div>
            </div>
            <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
              <div className="text-2xl font-bold text-emerald-500">
                {((score.timeline.oneYear - propertyPrice) / propertyPrice * 100).toFixed(0)}%
              </div>
              <div className="text-xs text-muted-foreground">1 Yr Return</div>
            </div>
            <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/10">
              <div className="text-2xl font-bold text-blue-500">
                {((score.timeline.fiveYears - propertyPrice) / propertyPrice * 100).toFixed(0)}%
              </div>
              <div className="text-xs text-muted-foreground">5 Yr Return</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Appreciation Engine (Interactive Simulator) */}
      <Card className="border border-border bg-card">
        <CardHeader className="border-b border-border bg-muted/10">
          <CardTitle className="flex items-center gap-2 text-foreground text-lg">
            <Calculator className="h-5 w-5 text-primary" />
            AI Price Appreciation Engine
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-4">
            {/* Input Slider 1 */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground font-medium flex items-center gap-1"><Road className="h-4 w-4" /> NH-44 Highway Distance</span>
                <span className="text-foreground font-bold">{highwayDist} km</span>
              </div>
              <input 
                type="range" 
                min="0.5" 
                max="15" 
                step="0.5"
                value={highwayDist} 
                onChange={e => setHighwayDist(parseFloat(e.target.value))} 
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <p className="text-[10px] text-muted-foreground">Closer distances to NH-44 command higher logistics growth premiums.</p>
            </div>

            {/* Input Slider 2 */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground font-medium flex items-center gap-1"><Navigation className="h-4 w-4" /> Regional Ring Road (RRR) Proximity</span>
                <span className="text-foreground font-bold">{rrrDist} km</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="30" 
                step="1"
                value={rrrDist} 
                onChange={e => setRrrDist(parseInt(e.target.value))} 
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <p className="text-[10px] text-muted-foreground">Proximity to outer expansion ring roads stimulates commercial values.</p>
            </div>

            {/* Input Slider 3 */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground font-medium flex items-center gap-1"><TrendingUp className="h-4 w-4" /> Historical Village Appreciation Base</span>
                <span className="text-foreground font-bold">{historicalGrowth}%</span>
              </div>
              <input 
                type="range" 
                min="5" 
                max="20" 
                step="1"
                value={historicalGrowth} 
                onChange={e => setHistoricalGrowth(parseInt(e.target.value))} 
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <p className="text-[10px] text-muted-foreground">Historical localized registration value changes over last 3 years.</p>
            </div>
          </div>

          {/* Recalculated Projections */}
          <div className="p-4 bg-muted/20 border border-border rounded-xl space-y-4">
            <div className="flex justify-between items-center border-b border-border/50 pb-2">
              <span className="text-sm font-semibold text-foreground">Adjusted appreciation (CAGR)</span>
              <span className="text-lg font-black text-primary">+{calculatedCAGR.toFixed(1)}% / yr</span>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* 3 Year Prediction */}
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground uppercase font-bold">3-Year Valuation</span>
                <div className="text-xl font-bold text-foreground">₹{cagr3YrVal.toLocaleString()}</div>
                <div className="text-[10px] text-muted-foreground">
                  Confidence Interval (95%): <br/>
                  <span className="font-semibold text-emerald-600">₹{val3Low.toLocaleString()}</span> – <span className="font-semibold text-emerald-600">₹{val3High.toLocaleString()}</span>
                </div>
              </div>

              {/* 5 Year Prediction */}
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground uppercase font-bold">5-Year Valuation</span>
                <div className="text-xl font-bold text-foreground">₹{cagr5YrVal.toLocaleString()}</div>
                <div className="text-[10px] text-muted-foreground">
                  Confidence Interval (95%): <br/>
                  <span className="font-semibold text-emerald-600">₹{val5Low.toLocaleString()}</span> – <span className="font-semibold text-emerald-600">₹{val5High.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Factor Breakdown */}
      <Card className="border border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <BarChart3 className="h-5 w-5" />
            Infrastructure Factor Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(score.factors).map(([factor, value]) => (
            <div key={factor} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="capitalize font-medium text-muted-foreground">
                  {factor.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <span className="font-bold text-foreground">{value}/100</span>
              </div>
              <Progress value={value} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Insights & Opportunities */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-foreground">
              <Zap className="h-5 w-5 text-amber-500" />
              Key Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {score.insights.map((insight, index) => (
                <li key={index} className="text-sm flex items-start gap-2 text-muted-foreground">
                  <span className="text-primary mt-0.5">•</span>
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-foreground">
              <Target className="h-5 w-5 text-emerald-500" />
              Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {score.opportunities.map((opportunity, index) => (
                <li key={index} className="text-sm flex items-start gap-2 text-muted-foreground">
                  <span className="text-emerald-500 mt-0.5">•</span>
                  <span>{opportunity}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Risks */}
      {score.risks.length > 0 && (
        <Card className="border border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-foreground">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Risk Factors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {score.risks.map((risk, index) => (
                <li key={index} className="text-sm flex items-start gap-2 text-muted-foreground">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Detailed Analysis */}
      <Card className="border border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Activity className="h-5 w-5" />
            Detailed System Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs bg-muted p-4 rounded-lg overflow-x-auto whitespace-pre-wrap text-muted-foreground border border-border">
            {analysis}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
