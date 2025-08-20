'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Settings, Upload, Database, RefreshCw, ArrowLeft } from 'lucide-react';
import FileUpload from './FileUpload';
import DatasetManager from './DatasetManager';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('upload');
  const [refreshKey, setRefreshKey] = useState(0);
  const router = useRouter();

  const handleUploadComplete = () => {
    // Switch to dataset tab and refresh
    setActiveTab('dataset');
    setRefreshKey(prev => prev + 1);
  };

  const handleIngestComplete = () => {
    // Refresh the dataset view
    setRefreshKey(prev => prev + 1);
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToHome}
            className="p-2 h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Knowledge Base Administration
            </CardTitle>
            <CardDescription>
              Manage your personal knowledge base documents and ingestion processes.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload Documents
            </TabsTrigger>
            <TabsTrigger value="dataset" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Manage Dataset
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-6">
            <FileUpload onUploadComplete={handleUploadComplete} />
          </TabsContent>

          <TabsContent value="dataset" className="mt-6">
            <DatasetManager 
              key={refreshKey}
              onIngestComplete={handleIngestComplete} 
            />
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-sm text-gray-700 mb-3">Quick Actions:</h4>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab('upload')}
            >
              <Upload className="h-4 w-4 mr-2" />
              Add New Documents
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab('dataset')}
            >
              <Database className="h-4 w-4 mr-2" />
              View Dataset
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRefreshKey(prev => prev + 1)}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh All
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

