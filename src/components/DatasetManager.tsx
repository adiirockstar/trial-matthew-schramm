'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { 
  Database, 
  FileText, 
  File, 
  Code, 
  RefreshCw, 
  Play, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Trash2,
  Download
} from 'lucide-react';

interface DatasetFile {
  name: string;
  size: number;
  type: string;
  lastModified: string;
  status: 'idle' | 'processing' | 'success' | 'error';
}

interface DatasetManagerProps {
  onIngestComplete?: () => void;
}

export default function DatasetManager({ onIngestComplete }: DatasetManagerProps) {
  const [files, setFiles] = useState<DatasetFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isIngesting, setIsIngesting] = useState(false);
  const [ingestStatus, setIngestStatus] = useState<string>('');

  useEffect(() => {
    loadDatasetFiles();
  }, []);

  const loadDatasetFiles = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/dataset');
      if (response.ok) {
        const data = await response.json();
        setFiles(data.files.map((file: DatasetFile) => ({
          ...file,
          status: 'idle' as const
        })));
      }
    } catch (error) {
      console.error('Failed to load dataset files:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const runIngest = async () => {
    setIsIngesting(true);
    setIngestStatus('Starting ingestion...');
    
    try {
      const response = await fetch('/api/ingest', {
        method: 'POST'
      });
      
      if (response.ok) {
        setIngestStatus('Ingestion completed successfully!');
        
        // Update file statuses
        setFiles(prev => prev.map(file => ({
          ...file,
          status: 'success' as const
        })));
        
        onIngestComplete?.();
      } else {
        const errorData = await response.json();
        setIngestStatus(`Ingestion failed: ${errorData.error}`);
        
        setFiles(prev => prev.map(file => ({
          ...file,
          status: 'error' as const
        })));
      }
    } catch (error) {
      setIngestStatus(`Ingestion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setFiles(prev => prev.map(file => ({
        ...file,
        status: 'error' as const
      })));
    } finally {
      setIsIngesting(false);
    }
  };

  const deleteFile = async (filename: string) => {
    try {
      const response = await fetch(`/api/dataset/${encodeURIComponent(filename)}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setFiles(prev => prev.filter(file => file.name !== filename));
      }
    } catch (error) {
      console.error('Failed to delete file:', error);
    }
  };

  const downloadFile = async (filename: string) => {
    try {
      const response = await fetch(`/api/dataset/${encodeURIComponent(filename)}/download`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Failed to download file:', error);
    }
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <File className="h-4 w-4 text-red-500" />;
    if (type.includes('markdown') || type.includes('md')) return <Code className="h-4 w-4 text-blue-500" />;
    return <FileText className="h-4 w-4 text-gray-500" />;
  };

  const getStatusIcon = (status: DatasetFile['status']) => {
    switch (status) {
      case 'idle':
        return null;
      case 'processing':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Dataset Manager
        </CardTitle>
        <CardDescription>
          Manage your personal knowledge base documents and run ingestion processes.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Actions */}
        <div className="flex gap-2">
          <Button
            onClick={runIngest}
            disabled={isIngesting || files.length === 0}
            className="flex-1"
          >
            {isIngesting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Ingesting...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Run Ingestion
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={loadDatasetFiles}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Status */}
        {ingestStatus && (
          <div className={`p-3 rounded-lg ${
            ingestStatus.includes('failed') || ingestStatus.includes('error')
              ? 'bg-red-50 text-red-700 border border-red-200'
              : ingestStatus.includes('completed')
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-blue-50 text-blue-700 border border-blue-200'
          }`}>
            {ingestStatus}
          </div>
        )}

        {/* File List */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-sm text-gray-700">
              Dataset Files ({files.length})
            </h4>
            {files.length > 0 && (
              <Badge variant="secondary">
                Total: {formatFileSize(files.reduce((sum, file) => sum + file.size, 0))}
              </Badge>
            )}
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : files.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Database className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>No documents in your dataset yet.</p>
              <p className="text-sm">Upload some files to get started!</p>
            </div>
          ) : (
            <ScrollArea className="h-64">
              <div className="space-y-2">
                {files.map((file) => (
                  <div
                    key={file.name}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {getFileIcon(file.type)}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{file.name}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{formatFileSize(file.size)}</span>
                          <span>•</span>
                          <span>{formatDate(file.lastModified)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {getStatusIcon(file.status)}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => downloadFile(file.name)}
                        className="h-8 w-8 p-0"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteFile(file.name)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-sm text-blue-800 mb-2">How it works:</h4>
          <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
            <li>Upload new documents using the file upload component</li>
            <li>Click &quot;Run Ingestion&quot; to process all documents</li>
            <li>Documents are chunked and embedded into your vector database</li>
            <li>New knowledge becomes available in your chat immediately</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}
