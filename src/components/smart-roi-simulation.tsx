'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { 
  Calculator, 
  TrendingUp, 
  TrendingDown, 
  Target,
  DollarSign,
  Home,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  RefreshCw,
  Download
} from 'lucide-react';

interface ROIScenario {
  name: string;
  description: string;
  oneYear: number;
  threeYears: number;
  fiveYears: number;
  tenYears: number;
  risk: 'Low' | 'Medium' | 'High';
  confidence: number;
}

interface SimulationParams {
  investmentAmount: number;
  expectedGrowth: number;
  investmentPeriod: number;
  loanAmount: number;
  interestRate: number;
  downPayment: number;
  strategy: 'buy-and-hold' | 'flip' | 'development';
}

interface SmartROISimulationProps {
  propertyPrice: number;
  propertyLocation: string;
}

export function SmartROISimulation({ propertyPrice, propertyLocation }: SmartROISimulationProps) {
  const [params, setParams] = useState<SimulationParams>({
    investmentAmount: propertyPrice || 1000000,
    expectedGrowth: 12,
    investmentPeriod: 5,
    loanAmount: 0,
    interestRate: 8.5,
    downPayment: 20,
    strategy: 'buy-and-hold'
  });
  
  const [scenarios, setScenarios] = useState<ROIScenario[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<string>('realistic');

  useEffect(() => {
    runSimulation();
  }, [params]);

  const runSimulation = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const baseGrowth = params.expectedGrowth / 100;
    
    // Generate scenarios
    const newScenarios: ROIScenario[] = [
      {
        name: 'Conservative',
        description: 'Low risk, steady returns with minimal volatility',
        oneYear: params.investmentAmount * (1 + baseGrowth * 0.6),
        threeYears: params.investmentAmount * Math.pow(1 + baseGrowth * 0.6, 3),
        fiveYears: params.investmentAmount * Math.pow(1 + baseGrowth * 0.6, 5),
        tenYears: params.investmentAmount * Math.pow(1 + baseGrowth * 0.6, 10),
        risk: 'Low',
        confidence: 85
      },
      {
        name: 'Realistic',
        description: 'Most likely outcome based on current market trends',
        oneYear: params.investmentAmount * (1 + baseGrowth),
        threeYears: params.investmentAmount * Math.pow(1 + baseGrowth, 3),
        fiveYears: params.investmentAmount * Math.pow(1 + baseGrowth, 5),
        tenYears: params.investmentAmount * Math.pow(1 + baseGrowth, 10),
        risk: 'Medium',
        confidence: 70
      },
      {
        name: 'Optimistic',
        description: 'Best case scenario with favorable market conditions',
        oneYear: params.investmentAmount * (1 + baseGrowth * 1.4),
        threeYears: params.investmentAmount * Math.pow(1 + baseGrowth * 1.4, 3),
        fiveYears: params.investmentAmount * Math.pow(1 + baseGrowth * 1.4, 5),
        tenYears: params.investmentAmount * Math.pow(1 + baseGrowth * 1.4, 10),
        risk: 'High',
        confidence: 45
      }
    ];
    
    setScenarios(newScenarios);
    setLoading(false);
  };

  const calculateEMI = () => {
    if (params.loanAmount === 0) return 0;
    const monthlyRate = params.interestRate / 12 / 100;
    const months = params.investmentPeriod * 12;
    return (params.loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
           (Math.pow(1 + monthlyRate, months) - 1);
  };

  const calculateNetReturns = (scenario: ROIScenario) => {
    const emi = calculateEMI();
    const totalEMI = emi * params.investmentPeriod * 12;
    const totalInvestment = params.downPayment * params.investmentAmount / 100 + totalEMI;
    const returns = scenario.fiveYears - totalInvestment;
    const roiPercentage = (returns / totalInvestment) * 100;
    
    return {
      gross: scenario.fiveYears,
      net: returns,
      roiPercentage,
      totalInvestment
    };
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-emerald-600 bg-emerald-50';
      case 'Medium': return 'text-amber-600 bg-amber-50';
      case 'High': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStrategyMultiplier = () => {
    switch (params.strategy) {
      case 'buy-and-hold': return 1.0;
      case 'flip': return 0.7; // Lower returns but faster
      case 'development': return 1.3; // Higher returns but higher risk
      default: return 1.0;
    }
  };

  const selectedScenarioData = scenarios.find(s => s.name.toLowerCase() === selectedScenario);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 animate-pulse" />
            Smart ROI Simulation Lab
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Running advanced simulations...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-6 w-6" />
            Investment Parameters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Investment Amount */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Investment Amount</label>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <input
                  type="number"
                  value={params.investmentAmount}
                  onChange={(e) => setParams({...params, investmentAmount: Number(e.target.value)})}
                  className="w-full px-3 py-2 border rounded-lg"
                  min={100000}
                  max={10000000}
                  step={50000}
                />
              </div>
            </div>

            {/* Expected Growth */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Expected Annual Growth: {params.expectedGrowth}%
              </label>
              <Slider
                value={[params.expectedGrowth]}
                onValueChange={(value) => setParams({...params, expectedGrowth: value[0]})}
                max={30}
                min={5}
                step={1}
                className="w-full"
              />
            </div>

            {/* Investment Period */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Investment Period: {params.investmentPeriod} years
              </label>
              <Slider
                value={[params.investmentPeriod]}
                onValueChange={(value) => setParams({...params, investmentPeriod: value[0]})}
                max={20}
                min={1}
                step={1}
                className="w-full"
              />
            </div>

            {/* Strategy */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Investment Strategy</label>
              <div className="grid grid-cols-3 gap-2">
                {(['buy-and-hold', 'flip', 'development'] as const).map((strategy) => (
                  <Button
                    key={strategy}
                    variant={params.strategy === strategy ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setParams({...params, strategy})}
                    className="text-xs"
                  >
                    {strategy.replace('-', ' ')}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Loan Parameters */}
          <div className="border-t pt-4">
            <h4 className="font-medium mb-4">Financing Parameters</h4>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Down Payment (%)</label>
                <Slider
                  value={[params.downPayment]}
                  onValueChange={(value) => setParams({...params, downPayment: value[0]})}
                  max={100}
                  min={0}
                  step={5}
                  className="w-full"
                />
                <div className="text-xs text-muted-foreground">{params.downPayment}%</div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Interest Rate (%)</label>
                <Slider
                  value={[params.interestRate]}
                  onValueChange={(value) => setParams({...params, interestRate: value[0]})}
                  max={15}
                  min={6}
                  step={0.5}
                  className="w-full"
                />
                <div className="text-xs text-muted-foreground">{params.interestRate}%</div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Loan Amount</label>
                <div className="p-2 bg-muted rounded-lg">
                  <div className="text-lg font-bold">
                    ₹{((params.investmentAmount * (100 - params.downPayment)) / 100).toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    EMI: ₹{calculateEMI().toLocaleString()}/month
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Button onClick={runSimulation} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Run Simulation
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Scenario Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            Investment Scenarios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {scenarios.map((scenario) => (
              <div 
                key={scenario.name}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedScenario === scenario.name.toLowerCase() 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setSelectedScenario(scenario.name.toLowerCase())}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{scenario.name}</h4>
                  <Badge className={getRiskColor(scenario.risk)}>
                    {scenario.risk} Risk
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-3">{scenario.description}</p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>1 Year:</span>
                    <span className="font-medium">₹{scenario.oneYear.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>5 Years:</span>
                    <span className="font-bold text-primary">₹{scenario.fiveYears.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>10 Years:</span>
                    <span className="font-medium">₹{scenario.tenYears.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Confidence</span>
                    <div className="flex items-center gap-1">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${scenario.confidence}%` }}
                        />
                      </div>
                      <span className="text-xs">{scenario.confidence}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analysis */}
      {selectedScenarioData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-6 w-6" />
              {selectedScenarioData.name} Scenario Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {((selectedScenarioData.fiveYears - params.investmentAmount) / params.investmentAmount * 100).toFixed(1)}%
                </div>
                <div className="text-xs text-muted-foreground">Total Return</div>
              </div>
              <div className="text-center p-4 bg-emerald-5 rounded-lg">
                <div className="text-2xl font-bold text-emerald-600">
                  ₹{(selectedScenarioData.fiveYears - params.investmentAmount).toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">Net Profit</div>
              </div>
              <div className="text-center p-4 bg-blue-5 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {((selectedScenarioData.fiveYears / params.investmentAmount - 1) / params.investmentPeriod * 100).toFixed(1)}%
                </div>
                <div className="text-xs text-muted-foreground">Annualized</div>
              </div>
              <div className="text-center p-4 bg-amber-5 rounded-lg">
                <div className="text-2xl font-bold text-amber-600">
                  {params.strategy === 'buy-and-hold' ? 'Long-term' : 
                   params.strategy === 'flip' ? 'Short-term' : 'Value-add'}
                </div>
                <div className="text-xs text-muted-foreground">Strategy</div>
              </div>
            </div>

            {/* Strategy Comparison */}
            <div>
              <h4 className="font-medium mb-4">Strategy Comparison</h4>
              <div className="grid md:grid-cols-3 gap-4">
                {(['buy-and-hold', 'flip', 'development'] as const).map((strategy) => {
                  const multiplier = strategy === 'buy-and-hold' ? 1.0 : 
                                  strategy === 'flip' ? 0.7 : 1.3;
                  const adjustedReturns = selectedScenarioData.fiveYears * multiplier;
                  
                  return (
                    <div key={strategy} className="border rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Home className="h-4 w-4" />
                        <span className="font-medium capitalize">{strategy.replace('-', ' ')}</span>
                      </div>
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span>Returns:</span>
                          <span className="font-medium">₹{adjustedReturns.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Risk:</span>
                          <span className="text-amber-600">
                            {strategy === 'buy-and-hold' ? 'Low' :
                             strategy === 'flip' ? 'Medium' : 'High'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              <Button className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download Report
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Compare Properties
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
