'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Building, 
  Zap, 
  TrendingUp, 
  AlertTriangle,
  Clock,
  CheckCircle,
  Activity,
  Navigation,
  Train,
  Truck,
  Construction,
  Satellite,
  Calendar,
  DollarSign
} from 'lucide-react';

interface InfrastructureProject {
  id: string;
  name: string;
  type: 'road' | 'metro' | 'it-park' | 'highway' | 'airport' | 'hospital' | 'school';
  status: 'planned' | 'under-construction' | 'completed' | 'delayed';
  progress: number;
  estimatedCompletion: string;
  impact: 'high' | 'medium' | 'low';
  distance: number;
  description: string;
}

interface SatelliteChange {
  date: string;
  type: 'construction' | 'vegetation' | 'urban' | 'infrastructure';
  confidence: number;
  description: string;
}

interface LiveInfrastructureIntelligenceProps {
  propertyLocation: string;
  propertyId: string;
}

export function LiveInfrastructureIntelligence({ propertyLocation, propertyId }: LiveInfrastructureIntelligenceProps) {
  const [projects, setProjects] = useState<InfrastructureProject[]>([]);
  const [satelliteChanges, setSatelliteChanges] = useState<SatelliteChange[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    loadInfrastructureData();
    const interval = setInterval(loadInfrastructureData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [propertyLocation]);

  const loadInfrastructureData = async () => {
    setLoading(true);
    
    // Simulate real-time infrastructure tracking
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockProjects: InfrastructureProject[] = [
      {
        id: '1',
        name: 'Hyderabad Metro Extension',
        type: 'metro',
        status: 'under-construction',
        progress: 65,
        estimatedCompletion: '2025-06',
        impact: 'high',
        distance: 2.5,
        description: 'Metro line extension connecting to IT corridor'
      },
      {
        id: '2',
        name: 'Outer Ring Road Phase 2',
        type: 'highway',
        status: 'under-construction',
        progress: 40,
        estimatedCompletion: '2025-12',
        impact: 'high',
        distance: 5.2,
        description: '6-lane highway with service roads'
      },
      {
        id: '3',
        name: 'Regional IT Park',
        type: 'it-park',
        status: 'planned',
        progress: 10,
        estimatedCompletion: '2026-03',
        impact: 'high',
        distance: 3.8,
        description: '50-acre IT SEZ with 2M sqft development'
      },
      {
        id: '4',
        name: 'Super Specialty Hospital',
        type: 'hospital',
        status: 'under-construction',
        progress: 25,
        estimatedCompletion: '2025-09',
        impact: 'medium',
        distance: 1.2,
        description: '500-bed multi-specialty hospital'
      }
    ];

    const mockChanges: SatelliteChange[] = [
      {
        date: '2024-03-15',
        type: 'construction',
        confidence: 92,
        description: 'New road construction detected north of property'
      },
      {
        date: '2024-03-10',
        type: 'urban',
        confidence: 87,
        description: 'Residential development activity increased by 23%'
      },
      {
        date: '2024-03-05',
        type: 'infrastructure',
        confidence: 95,
        description: 'Utility line installation completed'
      }
    ];

    setProjects(mockProjects);
    setSatelliteChanges(mockChanges);
    setLastUpdate(new Date());
    setLoading(false);
  };

  const getProjectIcon = (type: string) => {
    switch (type) {
      case 'metro': return <Train className="h-4 w-4" />;
      case 'highway':
      case 'road': return <Truck className="h-4 w-4" />;
      case 'it-park': return <Building className="h-4 w-4" />;
      case 'hospital': return <Activity className="h-4 w-4" />;
      case 'school': return <Building className="h-4 w-4" />;
      default: return <Construction className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'under-construction': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'planned': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'delayed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-amber-600 bg-amber-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const calculateInfrastructureScore = () => {
    const highImpactProjects = projects.filter(p => p.impact === 'high').length;
    const activeProjects = projects.filter(p => p.status === 'under-construction').length;
    const avgProgress = projects.reduce((sum, p) => sum + p.progress, 0) / projects.length;
    
    return Math.min(100, (highImpactProjects * 20) + (activeProjects * 15) + avgProgress);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Satellite className="h-5 w-5 animate-pulse" />
            Live Infrastructure Intelligence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Scanning satellite data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Infrastructure Score */}
      <Card className="border-2 border-primary/20">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Satellite className="h-6 w-6 text-primary" />
              Infrastructure Intelligence
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-100 text-emerald-800">
                {calculateInfrastructureScore()}/100
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Clock className="h-3 w-3 mr-1" />
                {lastUpdate.toLocaleTimeString()}
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 bg-primary/5 rounded-lg">
              <div className="text-2xl font-bold text-primary">{projects.length}</div>
              <div className="text-xs text-muted-foreground">Total Projects</div>
            </div>
            <div className="text-center p-3 bg-blue-5 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {projects.filter(p => p.status === 'under-construction').length}
              </div>
              <div className="text-xs text-muted-foreground">Under Construction</div>
            </div>
            <div className="text-center p-3 bg-amber-5 rounded-lg">
              <div className="text-2xl font-bold text-amber-600">
                {projects.filter(p => p.impact === 'high').length}
              </div>
              <div className="text-xs text-muted-foreground">High Impact</div>
            </div>
            <div className="text-center p-3 bg-emerald-5 rounded-lg">
              <div className="text-2xl font-bold text-emerald-600">
                {Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length)}%
              </div>
              <div className="text-xs text-muted-foreground">Avg Progress</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Projects */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Construction className="h-5 w-5" />
            Live Infrastructure Projects
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {getProjectIcon(project.type)}
                    </div>
                    <div>
                      <h4 className="font-semibold">{project.name}</h4>
                      <p className="text-sm text-muted-foreground">{project.description}</p>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <Badge className={getStatusColor(project.status)}>
                      {project.status.replace('-', ' ')}
                    </Badge>
                    <Badge className={getImpactColor(project.impact)}>
                      {project.impact} impact
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{project.distance} km away</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{project.estimatedCompletion}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <span>{project.progress}% complete</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span>Value driver</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Satellite Change Detection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Satellite className="h-5 w-5" />
            Satellite Change Detection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {satelliteChanges.map((change, index) => (
              <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Satellite className="h-4 w-4 text-amber-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h5 className="font-medium capitalize">{change.type} Change</h5>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{change.date}</Badge>
                      <Badge className="bg-blue-100 text-blue-800">
                        {change.confidence}% confidence
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{change.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Growth Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Infrastructure Growth Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center p-6 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg">
              <div className="text-3xl font-bold text-primary mb-2">18-24 Months</div>
              <div className="text-muted-foreground">Estimated Infrastructure Maturity</div>
              <div className="text-sm text-muted-foreground mt-2">
                Property value expected to appreciate 25-35% upon project completion
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-xl font-bold text-emerald-600 mb-1">Q2 2025</div>
                <div className="text-sm text-muted-foreground">Metro Phase 1</div>
                <div className="text-xs text-emerald-600 mt-1">+12% value impact</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-xl font-bold text-blue-600 mb-1">Q4 2025</div>
                <div className="text-sm text-muted-foreground">Highway Completion</div>
                <div className="text-xs text-blue-600 mt-1">+18% value impact</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-xl font-bold text-amber-600 mb-1">Q1 2026</div>
                <div className="text-sm text-muted-foreground">IT Park Launch</div>
                <div className="text-xs text-amber-600 mt-1">+22% value impact</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
