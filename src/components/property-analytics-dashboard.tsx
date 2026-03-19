"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Eye, 
  TrendingUp, 
  Users, 
  Home, 
  Building, 
  MapPin, 
  Calendar,
  BarChart3,
  Activity,
  ArrowUp,
  ArrowDown,
  Clock,
  Star
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface PropertyAnalytics {
  totalViews: number;
  uniqueVisitors: number;
  topProperties: Property[];
  dailyViews: DailyView[];
  categoryStats: CategoryStats[];
  locationStats: LocationStats[];
  summary: {
    totalProperties: number;
    totalViews: number;
    uniqueVisitors: number;
    period: string;
  };
}

interface Property {
  id: string;
  propertyNumber: string;
  propertyType: string;
  villageName: string;
  areaName: string;
  views: number;
  lastViewedAt: string;
  price: number;
  status: string;
  category: string;
}

interface DailyView {
  date: string;
  views: number;
  uniqueVisitors: number;
}

interface CategoryStats {
  category: string;
  count: number;
  totalViews: number;
  avgViews: number;
}

interface LocationStats {
  villageName: string;
  count: number;
  totalViews: number;
  avgPrice: number;
}

export default function PropertyAnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<PropertyAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("7");

  useEffect(() => {
    fetchAnalytics();
  }, [selectedPeriod]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/analytics/property-views?days=${selectedPeriod}`);
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="col-span-full">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analytics) {
    return (
      <Card className="col-span-full">
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Unable to load analytics data</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const growthPercentage = selectedPeriod === "7" ? 15 : 28; // Mock growth data
  const isGrowthPositive = growthPercentage > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Property Analytics</h2>
          <p className="text-gray-300 text-sm sm:text-base">Track performance and engagement</p>
        </div>
        <select 
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="px-3 py-2 bg-slate-800 text-white border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary w-full md:w-auto"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">Total Views</p>
                <p className="text-2xl font-bold text-white">
                  {(analytics?.totalViews ?? 0).toLocaleString()}
                </p>
                <div className="flex items-center mt-1">
                  {isGrowthPositive ? (
                    <ArrowUp className="h-3 w-3 text-green-400 mr-1" />
                  ) : (
                    <ArrowDown className="h-3 w-3 text-red-400 mr-1" />
                  )}
                  <span className={`text-xs ${isGrowthPositive ? 'text-green-400' : 'text-red-400'}`}>
                    {Math.abs(growthPercentage)}%
                  </span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Eye className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">Unique Visitors</p>
                <p className="text-2xl font-bold text-white">
                  {(analytics?.uniqueVisitors ?? 0).toLocaleString()}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {analytics?.totalViews && analytics.totalViews > 0 ? 
                    Math.round(((analytics.uniqueVisitors || 0) / analytics.totalViews) * 100) : 0
                  }% engagement rate
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">Active Properties</p>
                <p className="text-2xl font-bold text-white">
                  {analytics.summary?.totalProperties || 0}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {analytics.topProperties?.length || 0} trending
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Home className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">Avg. Views/Property</p>
                <p className="text-2xl font-bold text-white">
                  {analytics?.summary?.totalProperties && analytics.summary.totalProperties > 0 ? 
                    Math.round((analytics.totalViews || 0) / analytics.summary.totalProperties) : 0
                  }
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Last {selectedPeriod} days
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <BarChart3 className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Properties */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Top Performing Properties
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.topProperties?.slice(0, 5).map((property, index) => (
              <div key={property.id} className="flex flex-col sm:flex-row items-center sm:items-center justify-between p-4 bg-slate-800/10 border border-white/5 rounded-lg gap-4">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full flex-shrink-0">
                    <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-100">{property.propertyNumber}</p>
                    <p className="text-sm text-slate-400">
                      {property.propertyType} • {property.villageName}
                    </p>
                  </div>
                </div>
                <div className="flex sm:flex-col justify-between items-center sm:items-end w-full sm:w-auto mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
                  <p className="font-bold text-slate-100">{property.views} views</p>
                  <Badge variant={property.category === 'Premium' ? 'default' : 'secondary'} className="h-6">
                    {property.category}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Category & Location Stats */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Performance by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.categoryStats?.map((stat) => (
                <div key={stat.category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{stat.category}</span>
                    <span className="text-sm text-gray-600">
                      {stat.count} properties • {stat.totalViews} views
                    </span>
                  </div>
                  <Progress value={(stat.avgViews / 100) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Top Locations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.locationStats?.slice(0, 5).map((location, index) => (
                <div key={`${location.villageName}-${index}`} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-6 h-6 bg-green-100 rounded-full">
                      <span className="text-xs font-bold text-green-600">{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{location.villageName}</p>
                      <p className="text-xs text-gray-600">
                        {location.count} properties • Avg: ₹{Math.round(location.avgPrice / 100000)}L
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{location.totalViews}</p>
                    <p className="text-xs text-gray-500">views</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
