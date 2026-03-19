'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  MapPin,
  DollarSign,
  Zap,
  Eye,
  Users,
  Target,
  Star,
  Calendar,
  Activity,
  ArrowRight,
  X,
  Settings,
  Filter
} from 'lucide-react';

interface OpportunityAlert {
  id: string;
  type: 'price_drop' | 'high_demand' | 'new_listing' | 'infra_update' | 'limited_stock' | 'market_trend';
  title: string;
  description: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  propertyId?: string;
  propertyData?: {
    name: string;
    location: string;
    price: number;
    originalPrice?: number;
    image?: string;
  };
  timestamp: Date;
  expiresAt?: Date;
  actionUrl?: string;
  impact: {
    price_change?: number;
    demand_increase?: number;
    time_sensitivity?: string;
  };
  category: 'investment' | 'risk' | 'opportunity' | 'market';
  isRead: boolean;
}

interface RealTimeOpportunityAlertsProps {
  userId: string;
  userPreferences?: {
    locations: string[];
    priceRange: [number, number];
    propertyTypes: string[];
    alertTypes: string[];
  };
}

export function RealTimeOpportunityAlerts({ userId, userPreferences }: RealTimeOpportunityAlertsProps) {
  const [alerts, setAlerts] = useState<OpportunityAlert[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'investment' | 'urgent'>('all');
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    loadAlerts();
    const interval = setInterval(loadAlerts, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, [filter]);

  const loadAlerts = async () => {
    setLoading(true);
    
    // Simulate real-time alerts
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockAlerts: OpportunityAlert[] = [
      {
        id: '1',
        type: 'price_drop',
        title: '🔥 Price Drop Alert - Kamareddy',
        description: 'Plot K-102 in Kamareddy price reduced by 12% due to urgent seller requirement',
        urgency: 'high',
        propertyId: 'plot-102',
        propertyData: {
          name: 'Plot K-102',
          location: 'Kamareddy, Telangana',
          price: 880000,
          originalPrice: 1000000
        },
        timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
        actionUrl: '/properties/plot-102',
        impact: {
          price_change: -12,
          time_sensitivity: 'High - act within 24 hours'
        },
        category: 'opportunity',
        isRead: false
      },
      {
        id: '2',
        type: 'high_demand',
        title: '📈 High Demand Zone - Sircilla',
        description: 'Sircilla industrial belt showing 35% increase in property inquiries this week',
        urgency: 'medium',
        propertyData: {
          name: 'Sircilla Industrial Area',
          location: 'Sircilla, Telangana',
          price: 1200000
        },
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        impact: {
          demand_increase: 35,
          time_sensitivity: 'Medium - prices may rise soon'
        },
        category: 'market',
        isRead: false
      },
      {
        id: '3',
        type: 'limited_stock',
        title: '⚠️ Only 2 Premium Plots Left',
        description: 'Kamareddy Phase 2 has only 2 premium plots remaining. Expected sellout this week.',
        urgency: 'critical',
        propertyId: 'phase-2',
        timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3), // 3 days
        impact: {
          time_sensitivity: 'Critical - limited availability'
        },
        category: 'investment',
        isRead: false
      },
      {
        id: '4',
        type: 'infra_update',
        title: '🚧 Infrastructure Update - Metro Approved',
        description: 'Hyderabad Metro extension to Kamareddy approved by state government. Project starts Q2 2024.',
        urgency: 'medium',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        impact: {
          price_change: 15, // Expected appreciation
          time_sensitivity: 'Medium - 18-24 month timeline'
        },
        category: 'investment',
        isRead: true
      },
      {
        id: '5',
        type: 'new_listing',
        title: '🆕 New Premium Listing - Highway Front',
        description: 'New premium plot just listed near Hyderabad highway with excellent connectivity',
        urgency: 'low',
        propertyId: 'plot-201',
        propertyData: {
          name: 'Plot H-201',
          location: 'Hyderabad Highway, Kamareddy',
          price: 1500000
        },
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
        actionUrl: '/properties/plot-201',
        impact: {
          price_change: 5,
          time_sensitivity: 'Low - new listing'
        },
        category: 'opportunity',
        isRead: true
      },
      {
        id: '6',
        type: 'market_trend',
        title: '📊 Market Trend - Kamareddy Rising',
        description: 'Kamareddy property values up 8% this month. Best performing area in Telangana.',
        urgency: 'low',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
        impact: {
          price_change: 8,
          time_sensitivity: 'Ongoing trend'
        },
        category: 'market',
        isRead: true
      }
    ];
    
    setAlerts(mockAlerts);
    setLastUpdate(new Date());
    setLoading(false);
  };

  const markAsRead = (alertId: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId ? { ...alert, isRead: true } : alert
      )
    );
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'price_drop': return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'high_demand': return <Users className="h-4 w-4 text-orange-600" />;
      case 'new_listing': return <Star className="h-4 w-4 text-blue-600" />;
      case 'infra_update': return <Activity className="h-4 w-4 text-emerald-600" />;
      case 'limited_stock': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'market_trend': return <TrendingUp className="h-4 w-4 text-purple-600" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'investment': return 'text-emerald-600 bg-emerald-50';
      case 'opportunity': return 'text-blue-600 bg-blue-50';
      case 'market': return 'text-purple-600 bg-purple-50';
      case 'risk': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    switch (filter) {
      case 'unread': return !alert.isRead;
      case 'investment': return alert.category === 'investment';
      case 'urgent': return alert.urgency === 'high' || alert.urgency === 'critical';
      default: return true;
    }
  });

  const unreadCount = alerts.filter(alert => !alert.isRead).length;
  const urgentCount = alerts.filter(alert => alert.urgency === 'high' || alert.urgency === 'critical').length;

  const formatTimeAgo = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / (1000 * 60));
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 animate-pulse" />
            Real-time Opportunity Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Scanning for opportunities...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="border-2 border-primary/20">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-6 w-6 text-primary" />
              <span>Real-time Opportunity Alerts</span>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Badge className="bg-red-100 text-red-800">
                  {unreadCount} unread
                </Badge>
              )}
              {urgentCount > 0 && (
                <Badge className="bg-orange-100 text-orange-800">
                  {urgentCount} urgent
                </Badge>
              )}
              <Badge variant="outline" className="text-xs">
                <Clock className="h-3 w-3 mr-1" />
                {lastUpdate.toLocaleTimeString()}
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-red-5 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{urgentCount}</div>
              <div className="text-xs text-muted-foreground">Urgent Alerts</div>
            </div>
            <div className="p-3 bg-blue-5 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{unreadCount}</div>
              <div className="text-xs text-muted-foreground">Unread</div>
            </div>
            <div className="p-3 bg-emerald-5 rounded-lg">
              <div className="text-2xl font-bold text-emerald-600">
                {alerts.filter(a => a.category === 'opportunity').length}
              </div>
              <div className="text-xs text-muted-foreground">Opportunities</div>
            </div>
            <div className="p-3 bg-purple-5 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {alerts.filter(a => a.type === 'price_drop').length}
              </div>
              <div className="text-xs text-muted-foreground">Price Drops</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filter Tabs */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'All Alerts', count: alerts.length },
              { key: 'unread', label: 'Unread', count: unreadCount },
              { key: 'investment', label: 'Investment', count: alerts.filter(a => a.category === 'investment').length },
              { key: 'urgent', label: 'Urgent Only', count: urgentCount }
            ].map((tab) => (
              <Button
                key={tab.key}
                variant={filter === tab.key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(tab.key as any)}
                className="flex items-center gap-2"
              >
                {tab.label}
                {tab.count > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {tab.count}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No alerts found</h3>
              <p className="text-muted-foreground">
                {filter === 'unread' ? 'All caught up! No new alerts.' :
                 filter === 'urgent' ? 'No urgent alerts at the moment.' :
                 'No alerts in this category.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredAlerts.map((alert) => (
            <Card 
              key={alert.id} 
              className={`transition-all duration-200 ${
                !alert.isRead ? 'border-l-4 border-l-primary bg-primary/5' : 'opacity-75'
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {/* Alert Icon */}
                    <div className="p-2 bg-muted rounded-lg">
                      {getTypeIcon(alert.type)}
                    </div>
                    
                    {/* Alert Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-sm">{alert.title}</h4>
                        <Badge className={getUrgencyColor(alert.urgency)}>
                          {alert.urgency.toUpperCase()}
                        </Badge>
                        <Badge className={getCategoryColor(alert.category)}>
                          {alert.category}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">
                        {alert.description}
                      </p>
                      
                      {/* Property Details */}
                      {alert.propertyData && (
                        <div className="bg-muted/50 rounded-lg p-3 mb-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">{alert.propertyData.name}</div>
                              <div className="text-xs text-muted-foreground flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {alert.propertyData.location}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-primary">
                                ₹{alert.propertyData.price.toLocaleString()}
                              </div>
                              {alert.propertyData.originalPrice && (
                                <div className="text-xs text-emerald-600">
                                  Save ₹{(alert.propertyData.originalPrice - alert.propertyData.price).toLocaleString()}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Impact Info */}
                      {alert.impact && (
                        <div className="flex flex-wrap gap-2 text-xs">
                          {alert.impact.price_change && (
                            <Badge variant="outline">
                              {alert.impact.price_change > 0 ? '+' : ''}{alert.impact.price_change}% price impact
                            </Badge>
                          )}
                          {alert.impact.demand_increase && (
                            <Badge variant="outline">
                              +{alert.impact.demand_increase}% demand
                            </Badge>
                          )}
                          {alert.impact.time_sensitivity && (
                            <Badge variant="outline">
                              <Clock className="h-3 w-3 mr-1" />
                              {alert.impact.time_sensitivity}
                            </Badge>
                          )}
                        </div>
                      )}
                      
                      {/* Footer */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="text-xs text-muted-foreground">
                          {formatTimeAgo(alert.timestamp)}
                          {alert.expiresAt && (
                            <span className="ml-2 text-amber-600">
                              Expires in {Math.ceil((alert.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60))}h
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {alert.actionUrl && (
                            <Button size="sm" variant="outline" asChild>
                              <a href={alert.actionUrl}>
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </a>
                            </Button>
                          )}
                          
                          {!alert.isRead && (
                            <Button 
                              size="sm" 
                              onClick={() => markAsRead(alert.id)}
                              className="text-xs"
                            >
                              Mark Read
                            </Button>
                          )}
                          
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => dismissAlert(alert.id)}
                            className="text-xs text-red-600 hover:text-red-700"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
