'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  TrendingUp, 
  MapPin, 
  Building, 
  Route, 
  Factory, 
  Laptop, 
  Calendar,
  Download,
  Eye,
  ArrowRight,
  BarChart3,
  Target,
  Zap,
  Globe
} from 'lucide-react';

export default function InvestmentReportsPage() {
  const reports = [
    {
      id: 1,
      title: "Hyderabad Regional Ring Road Impact",
      category: "Infrastructure",
      date: "March 2024",
      readTime: "8 min read",
      description: "Comprehensive analysis of how the Regional Ring Road is transforming land values and creating new investment hotspots in Hyderabad's periphery.",
      image: "/api/placeholder/400/250?text=Ring+Road",
      stats: {
        expectedROI: "22%",
        timeframe: "3-5 years",
        riskLevel: "Low"
      },
      highlights: [
        "42km development corridor",
        "15x land appreciation potential",
        "IT and pharma hub expansion"
      ]
    },
    {
      id: 2,
      title: "Pharma City Development Analysis",
      category: "Industrial",
      date: "February 2024",
      readTime: "12 min read",
      description: "Deep dive into the upcoming Pharma City development and its impact on surrounding residential and commercial land values.",
      image: "/api/placeholder/400/250?text=Pharma+City",
      stats: {
        expectedROI: "28%",
        timeframe: "2-4 years",
        riskLevel: "Medium"
      },
      highlights: [
        "₹16,000 crore investment",
        "50,000 job creation",
        "Supporting infrastructure development"
      ]
    },
    {
      id: 3,
      title: "IT Expansion Zones in Telangana",
      category: "Technology",
      date: "January 2024",
      readTime: "10 min read",
      description: "Analysis of emerging IT corridors and their influence on residential land investments in Telangana.",
      image: "/api/placeholder/400/250?text=IT+Expansion",
      stats: {
        expectedROI: "18%",
        timeframe: "4-6 years",
        riskLevel: "Low"
      },
      highlights: [
        "3 new IT parks announced",
        "2 lakh employment generation",
        "Ancillary development boom"
      ]
    },
    {
      id: 4,
      title: "Telangana Land Market Trends 2024",
      category: "Market Analysis",
      date: "March 2024",
      readTime: "15 min read",
      description: "Quarterly market analysis covering price trends, demand patterns, and future projections for Telangana real estate.",
      image: "/api/placeholder/400/250?text=Market+Trends",
      stats: {
        expectedROI: "15%",
        timeframe: "Ongoing",
        riskLevel: "Low"
      },
      highlights: [
        "18% average price increase",
        "High demand for DTCP plots",
        "NRI investment surge"
      ]
    }
  ];

  const marketInsights = [
    {
      title: "Infrastructure Boom",
      value: "₹2.4L Crore",
      description: "Government investment in infrastructure projects",
      icon: Route,
      color: "text-blue-600"
    },
    {
      title: "Industrial Growth",
      value: "47%",
      description: "Increase in industrial land allocation",
      icon: Factory,
      color: "text-purple-600"
    },
    {
      title: "IT Expansion",
      value: "3.2x",
      description: "Growth in IT corridor development",
      icon: Laptop,
      color: "text-emerald-600"
    },
    {
      title: "ROI Potential",
      value: "22%",
      description: "Average expected ROI on strategic investments",
      icon: TrendingUp,
      color: "text-amber-600"
    }
  ];

  const upcomingProjects = [
    {
      name: "Hyderabad Metro Phase 2",
      impact: "High",
      timeline: "2025-2028",
      description: "72km extension connecting new corridors"
    },
    {
      name: "Regional Ring Road",
      impact: "Very High",
      timeline: "2024-2027",
      description: "158km outer ring development"
    },
    {
      name: "Pharma City Phase 2",
      impact: "High",
      timeline: "2025-2029",
      description: "Additional 2,000 acres development"
    },
    {
      name: "ITIR Expansion",
      impact: "Medium",
      timeline: "2026-2030",
      description: "Information Technology Investment Region"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background">
      <Header />
      
      {/* Hero Section */}
      <div className="container px-4 py-16">
        <div className="text-center space-y-6 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 mb-4">
            <BarChart3 className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-semibold text-amber-600">Investment Intelligence</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black font-headline tracking-tighter">
            Investment <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">Reports</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            In-depth analysis of Telangana land market trends, upcoming government projects, 
            and growth zones to help you make informed investment decisions.
          </p>
        </div>

        {/* Market Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {marketInsights.map((insight, index) => (
            <Card key={index} className="border-primary/20 bg-gradient-to-br from-background via-primary/5 to-background">
              <CardContent className="p-6 text-center">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mx-auto mb-4`}>
                  <insight.icon className={`h-6 w-6 ${insight.color}`} />
                </div>
                <div className="text-2xl font-black text-primary mb-2">{insight.value}</div>
                <div className="font-medium mb-1">{insight.title}</div>
                <div className="text-sm text-muted-foreground">{insight.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Reports Grid */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold font-headline">Latest Reports</h2>
            <Badge className="bg-gradient-to-r from-primary to-accent text-white border-none">
              Updated Weekly
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {reports.map((report) => (
              <Card key={report.id} className="border-primary/20 bg-gradient-to-br from-background via-primary/5 to-background hover:scale-[1.02] transition-all duration-500 cursor-pointer group">
                <div className="aspect-video relative overflow-hidden rounded-t-lg">
                  <img
                    src={report.image}
                    alt={report.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-primary/90 text-white border-none">
                      {report.category}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-2">{report.title}</h3>
                    <p className="text-white/80 text-sm line-clamp-2">{report.description}</p>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {report.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {report.readTime}
                      </span>
                    </div>
                    <Button size="sm" variant="outline" className="border-primary/20">
                      <Download className="h-4 w-4 mr-1" />
                      PDF
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-3 bg-emerald-500/10 rounded-lg">
                      <div className="text-lg font-bold text-emerald-600">{report.stats.expectedROI}</div>
                      <div className="text-xs text-muted-foreground">Expected ROI</div>
                    </div>
                    <div className="text-center p-3 bg-blue-500/10 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">{report.stats.timeframe}</div>
                      <div className="text-xs text-muted-foreground">Timeframe</div>
                    </div>
                    <div className="text-center p-3 bg-purple-500/10 rounded-lg">
                      <div className="text-lg font-bold text-purple-600">{report.stats.riskLevel}</div>
                      <div className="text-xs text-muted-foreground">Risk Level</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    {report.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <Target className="h-4 w-4 text-primary" />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                    Read Full Report
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Upcoming Projects */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold font-headline mb-8">Upcoming Government Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingProjects.map((project, index) => (
              <Card key={index} className="border-primary/20 bg-gradient-to-br from-background via-primary/5 to-background">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold mb-2">{project.name}</h3>
                      <p className="text-muted-foreground text-sm">{project.description}</p>
                    </div>
                    <Badge className={
                      project.impact === 'Very High' ? 'bg-red-500 text-white' :
                      project.impact === 'High' ? 'bg-orange-500 text-white' :
                      'bg-yellow-500 text-white'
                    }>
                      {project.impact} Impact
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{project.timeline}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="border-primary/20 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 p-8 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <Zap className="h-12 w-12 text-amber-500 mx-auto" />
            <h2 className="text-3xl font-bold font-headline">
              Get Personalized Investment Insights
            </h2>
            <p className="text-muted-foreground">
              Subscribe to receive exclusive investment reports and market analysis 
              tailored to your investment goals and budget.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                Subscribe to Reports
              </Button>
              <Button variant="outline" className="border-primary/20">
                <Globe className="h-4 w-4 mr-2" />
                View All Reports
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
