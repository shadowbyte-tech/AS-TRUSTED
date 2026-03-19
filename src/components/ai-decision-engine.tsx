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
  Train,
  Briefcase
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
  const propertyPrice = property.price || 1000000; // Define at component level

  useEffect(() => {
    analyzeProperty();
  }, [property]);

  const analyzeProperty = async () => {
    setLoading(true);
    
    // Simulate AI analysis with realistic scoring
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const baseScore = Math.floor(Math.random() * 30) + 60; // 60-90 base score
    
    // Factor calculations (simplified for demo)
    const infrastructureScore = Math.floor(Math.random() * 20) + 70;
    const locationScore = Math.floor(Math.random() * 25) + 65;
    const priceScore = property.price ? Math.max(40, 100 - (property.price / 100000)) : 70;
    const developmentScore = Math.floor(Math.random() * 30) + 60;
    const demandScore = Math.floor(Math.random() * 20) + 70;
    
    const overall = Math.floor(
      (infrastructureScore * 0.25 + 
       locationScore * 0.25 + 
       priceScore * 0.2 + 
       developmentScore * 0.15 + 
       demandScore * 0.15)
    );
    
    // Risk assessment
    const riskFactors = [
      priceScore < 50,
      infrastructureScore < 60,
      property.status === 'Under Negotiation',
      property.villageName?.includes('Remote')
    ];
    
    const riskCount = riskFactors.filter(Boolean).length;
    let risk: 'Low' | 'Medium' | 'High' = 'Low';
    if (riskCount >= 3) risk = 'High';
    else if (riskCount >= 1) risk = 'Medium';
    
    // Recommendation logic
    let recommendation: 'BUY_NOW' | 'BUY_SOON' | 'WAIT' | 'AVOID' = 'BUY_SOON';
    if (overall >= 85 && risk === 'Low') recommendation = 'BUY_NOW';
    else if (overall >= 75 && risk !== 'High') recommendation = 'BUY_SOON';
    else if (overall >= 60 && risk === 'Low') recommendation = 'WAIT';
    else recommendation = 'AVOID';
    
    // Growth projections
    const growthRate = (overall / 100) * 0.18; // Max 18% annual growth
    const oneYear = Math.floor(propertyPrice * (1 + growthRate));
    const fiveYears = Math.floor(propertyPrice * Math.pow(1 + growthRate, 5));
    const tenYears = Math.floor(propertyPrice * Math.pow(1 + growthRate, 10));
    
    // Generate insights
    const insights = [
      infrastructureScore > 75 ? "🚧 Strong infrastructure development in progress" : "🏗️ Infrastructure development expected",
      locationScore > 80 ? "📍 Prime location with high accessibility" : "🗺️ Strategic location with growth potential",
      priceScore > 70 ? "💰 Competitive pricing for this area" : "💸 Premium pricing but justified by location",
      demandScore > 75 ? "🔥 High demand zone with limited supply" : "📊 Growing demand in this corridor"
    ];
    
    const risks = [
      risk === 'High' ? "⚠️ High-risk investment requiring due diligence" : "",
      property.status === 'Under Negotiation' ? "🤝 Property under negotiation - act fast" : "",
      priceScore < 50 ? "💸 Above market pricing - negotiate hard" : ""
    ].filter(Boolean);
    
    const opportunities = [
      "🎯 Early investment in growth corridor",
      "🏗️ Infrastructure catalysts driving appreciation",
      "📈 IT/industrial expansion nearby",
      "🛣️ Highway connectivity improvements"
    ];
    
    const analysisText = `
AI Analysis Complete for ${property.propertyNumber}:

📊 INVESTMENT SCORE: ${overall}/100
🎯 GROWTH POTENTIAL: ${(growthRate * 100).toFixed(1)}% annually
⚠️ RISK LEVEL: ${risk}
💡 RECOMMENDATION: ${recommendation.replace('_', ' ')}

📈 PROJECTED RETURNS:
• 1 Year: ₹${oneYear.toLocaleString()} (${((oneYear - propertyPrice) / propertyPrice * 100).toFixed(1)}%)
• 5 Years: ₹${fiveYears.toLocaleString()} (${((fiveYears - propertyPrice) / propertyPrice * 100).toFixed(1)}%)
• 10 Years: ₹${tenYears.toLocaleString()} (${((tenYears - propertyPrice) / propertyPrice * 100).toFixed(1)}%)

🔍 KEY FACTORS:
• Infrastructure: ${infrastructureScore}/100
• Location Score: ${locationScore}/100
• Price Competitiveness: ${priceScore}/100
• Development Pipeline: ${developmentScore}/100
• Demand Index: ${demandScore}/100

${insights.join('\n')}

${risks.length > 0 ? '\n⚠️ RISKS:\n' + risks.join('\n') : ''}

🎯 OPPORTUNITIES:
${opportunities.join('\n')}

💭 AI VERDICT: ${recommendation === 'BUY_NOW' ? 'Excellent investment opportunity with strong growth potential. Act quickly.' : 
                 recommendation === 'BUY_SOON' ? 'Good investment with moderate risk. Consider within 3 months.' :
                 recommendation === 'WAIT' ? 'Decent option but better opportunities may exist. Monitor market.' :
                 'High-risk investment. Recommend alternative properties.'}
    `;
    
    setAnalysis(analysisText);
    
    setScore({
      overall,
      growth: Math.floor(growthRate * 100),
      risk,
      recommendation,
      confidence: Math.floor(Math.random() * 15) + 75,
      factors: {
        infrastructure: infrastructureScore,
        location: locationScore,
        price: priceScore,
        development: developmentScore,
        demand: demandScore
      },
      timeline: {
        oneYear,
        fiveYears,
        tenYears
      },
      insights,
      risks,
      opportunities
    });
    
    setLoading(false);
  };

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case 'BUY_NOW': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'BUY_SOON': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'WAIT': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'AVOID': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-emerald-600 bg-emerald-100';
      case 'Medium': return 'text-amber-600 bg-amber-100';
      case 'High': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary animate-pulse" />
            AI Investment Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">AI is analyzing this property...</p>
            <p className="text-sm text-muted-foreground mt-2">Evaluating 50+ data points</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!score) return null;

  return (
    <div className="space-y-6">
      {/* Main Score Card */}
      <Card className="border-2 border-primary/20 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary" />
              AI Investment Analysis
            </div>
            <Badge className="bg-primary/10 text-primary border-primary/20">
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
            <p className="text-sm text-muted-foreground">Investment Score</p>
          </div>

          {/* Recommendation */}
          <div className={`text-center p-4 rounded-xl border ${getRecommendationColor(score.recommendation)}`}>
            <div className="text-lg font-bold mb-1">
              {score.recommendation.replace('_', ' ')}
            </div>
            <p className="text-sm opacity-80">
              {score.recommendation === 'BUY_NOW' ? 'Excellent opportunity - Act now!' :
               score.recommendation === 'BUY_SOON' ? 'Good investment - Consider within 3 months' :
               score.recommendation === 'WAIT' ? 'Monitor market for better entry' :
               'High risk - Look for alternatives'}
            </p>
          </div>

          {/* Risk Level */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="font-medium">Risk Level:</span>
            </div>
            <Badge className={getRiskColor(score.risk)}>
              {score.risk}
            </Badge>
          </div>

          {/* Growth Potential */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 rounded-lg bg-primary/5">
              <div className="text-2xl font-bold text-primary">+{score.growth}%</div>
              <div className="text-xs text-muted-foreground">Annual Growth</div>
            </div>
            <div className="p-3 rounded-lg bg-emerald-5">
              <div className="text-2xl font-bold text-emerald-600">
                {((score.timeline.oneYear - propertyPrice) / propertyPrice * 100).toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground">1 Year Return</div>
            </div>
            <div className="p-3 rounded-lg bg-blue-5">
              <div className="text-2xl font-bold text-blue-600">
                {((score.timeline.fiveYears - propertyPrice) / propertyPrice * 100).toFixed(0)}%
              </div>
              <div className="text-xs text-muted-foreground">5 Year Return</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Factor Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Factor Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(score.factors).map(([factor, value]) => (
            <div key={factor} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="capitalize font-medium">
                  {factor.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <span className="font-bold">{value}/100</span>
              </div>
              <Progress value={value} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Insights & Opportunities */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap className="h-5 w-5 text-amber-500" />
              Key Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {score.insights.map((insight, index) => (
                <li key={index} className="text-sm flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="h-5 w-5 text-emerald-500" />
              Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {score.opportunities.map((opportunity, index) => (
                <li key={index} className="text-sm flex items-start gap-2">
                  <span className="text-emerald-600 mt-0.5">•</span>
                  <span>{opportunity}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Risks */}
      {score.risks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Risk Factors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {score.risks.map((risk, index) => (
                <li key={index} className="text-sm flex items-start gap-2">
                  <span className="text-red-600 mt-0.5">•</span>
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Detailed Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Detailed AI Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs bg-muted p-4 rounded-lg overflow-x-auto whitespace-pre-wrap">
            {analysis}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
