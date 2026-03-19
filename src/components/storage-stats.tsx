'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, Database, HardDrive, FileText, Trash2 } from 'lucide-react';
import { getDBStatus } from '@/lib/mongodb-database';

interface StorageStats {
  totalFiles: number;
  totalPlots: number;
  totalSize: string;
  fileBreakdown: Array<{
    fileName: string;
    plotCount: number;
    fileSize: string;
    lastModified: string;
  }>;
}

interface DBStatus {
  connected: boolean;
  type: string;
  host?: string;
  error?: string;
  recommendation?: string;
  storageStats?: StorageStats;
}

export default function StorageStats() {
  const [dbStatus, setDbStatus] = useState<DBStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const status = await getDBStatus();
      setDbStatus(status);
    } catch (error) {
      console.error('Failed to fetch DB status:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Storage Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            Loading storage information...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!dbStatus) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Storage Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Failed to load storage information.</p>
          <Button onClick={fetchStatus} variant="outline" size="sm" className="mt-2">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Database Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database Status
            <Button onClick={fetchStatus} variant="ghost" size="sm">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant={dbStatus.connected ? "default" : "secondary"}>
              {dbStatus.connected ? "Connected" : "Disconnected"}
            </Badge>
            <span className="text-sm font-medium">{dbStatus.type}</span>
          </div>
          
          {dbStatus.connected && dbStatus.host && (
            <p className="text-sm text-muted-foreground">Host: {dbStatus.host}</p>
          )}
          
          {!dbStatus.connected && dbStatus.error && (
            <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded border">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Note:</strong> {dbStatus.recommendation}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Storage Statistics */}
      {dbStatus.storageStats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="h-5 w-5" />
              Multi-File Storage Statistics
            </CardTitle>
            <CardDescription>
              Your plots are automatically distributed across multiple files for optimal performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {dbStatus.storageStats.totalFiles}
                </div>
                <div className="text-sm text-muted-foreground">Storage Files</div>
              </div>
              <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {dbStatus.storageStats.totalPlots}
                </div>
                <div className="text-sm text-muted-foreground">Total Plots</div>
              </div>
              <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {dbStatus.storageStats.totalSize}
                </div>
                <div className="text-sm text-muted-foreground">Total Size</div>
              </div>
            </div>

            {/* File Breakdown */}
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <FileText className="h-4 w-4" />
                File Breakdown
              </h4>
              {dbStatus.storageStats.fileBreakdown.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono text-sm">{file.fileName}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{file.plotCount} plots</span>
                    <span>{file.fileSize}</span>
                    <span>{new Date(file.lastModified).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Performance Info */}
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
              <h4 className="font-medium text-green-800 dark:text-green-200 mb-1">
                ✅ Optimal Performance
              </h4>
              <p className="text-sm text-green-700 dark:text-green-300">
                Your multi-file storage system automatically splits data when files get too large, 
                ensuring fast loading times and efficient memory usage.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Storage Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Storage Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <p className="text-sm">Files automatically split when they reach 100 plots or 10MB</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <p className="text-sm">Empty files are automatically cleaned up when plots are deleted</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
            <p className="text-sm">System can handle 1000+ plots with excellent performance</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
            <p className="text-sm">Legacy plots.json is automatically migrated to multi-file system</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}