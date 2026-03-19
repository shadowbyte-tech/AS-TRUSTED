import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, TrendingUp, DollarSign, MapPin, Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Market Intelligence | AS Trusted Consultancy',
  description: 'Detailed market analysis, ROI projections, and investment recommendations',
};

export default function MarketIntelligencePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/premium-dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Market Intelligence</h1>
          <p className="text-xl text-gray-600">
            Comprehensive market analysis and investment insights for informed property decisions
          </p>
        </div>

        {/* Market Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average ROI</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">24.5%</div>
              <p className="text-xs text-muted-foreground">+2.1% from last quarter</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Market Growth</CardTitle>
              <BarChart3 className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">18.2%</div>
              <p className="text-xs text-muted-foreground">Year over year</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Price/Sqft</CardTitle>
              <DollarSign className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">₹2,850</div>
              <p className="text-xs text-muted-foreground">+12% from last year</p>
            </CardContent>
          </Card>
        </div>
        {/* Detailed Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                Market Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Residential Plots</span>
                  <span className="text-sm text-green-600">+15.2%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Commercial Plots</span>
                  <span className="text-sm text-green-600">+22.8%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Agricultural Land</span>
                  <span className="text-sm text-green-600">+8.5%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-purple-600" />
                Top Investment Areas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Hyderabad Outskirts</span>
                  <span className="text-sm font-bold text-purple-600">High ROI</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Warangal Urban</span>
                  <span className="text-sm font-bold text-blue-600">Medium ROI</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Karimnagar</span>
                  <span className="text-sm font-bold text-green-600">Emerging</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Investment Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Investment Recommendations
            </CardTitle>
            <CardDescription>
              Based on current market analysis and future growth projections
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-green-600 mb-2">Short Term (1-2 years)</h3>
                <p className="text-sm text-gray-600 mb-2">Focus on developed areas with immediate infrastructure</p>
                <p className="text-sm font-medium">Expected ROI: 15-20%</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-blue-600 mb-2">Medium Term (3-5 years)</h3>
                <p className="text-sm text-gray-600 mb-2">Invest in upcoming infrastructure corridors</p>
                <p className="text-sm font-medium">Expected ROI: 25-35%</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-purple-600 mb-2">Long Term (5+ years)</h3>
                <p className="text-sm text-gray-600 mb-2">Strategic locations near planned metro/highway</p>
                <p className="text-sm font-medium">Expected ROI: 40-60%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}