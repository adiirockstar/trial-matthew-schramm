'use client';

import { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface FileUploadProps {
  onUploadComplete?: () => void;
}

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  message?: string;
}

export default function FileUpload({ onUploadComplete }: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    addFiles(selectedFiles);
  };

  const addFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter(file => {
      const ext = file.name.toLowerCase().split('.').pop();
      return ['pdf', 'md', 'txt'].includes(ext || '');
    });

    const uploadFiles: UploadedFile[] = validFiles.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'pending'
    }));

    setFiles(prev => [...prev, ...uploadFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    const pendingFiles = files.filter(f => f.status === 'pending');
    
    for (let i = 0; i < pendingFiles.length; i++) {
      const fileIndex = files.findIndex(f => f.name === pendingFiles[i].name);
      if (fileIndex === -1) continue;

      setFiles(prev => prev.map((f, idx) => 
        idx === fileIndex ? { ...f, status: 'uploading' } : f
      ));

      try {
        const formData = new FormData();
        const file = pendingFiles[i];
        const fileInput = fileInputRef.current;
        
        if (fileInput?.files) {
          const actualFile = Array.from(fileInput.files).find(f => f.name === file.name);
          if (actualFile) {
            formData.append('file', actualFile);
            
            const response = await fetch('/api/upload', {
              method: 'POST',
              body: formData
            });

            if (response.ok) {
              setFiles(prev => prev.map((f, idx) => 
                idx === fileIndex ? { ...f, status: 'success', message: 'Uploaded successfully' } : f
              ));
            } else {
              throw new Error('Upload failed');
            }
          }
        }
      } catch (error) {
        setFiles(prev => prev.map((f, idx) => 
          idx === fileIndex ? { 
            ...f, 
            status: 'error', 
            message: error instanceof Error ? error.message : 'Upload failed' 
          } : f
        ));
      }
    }

    setIsUploading(false);
    onUploadComplete?.();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: UploadedFile['status']) => {
    switch (status) {
      case 'pending':
        return <FileText className="h-4 w-4 text-gray-400" />;
      case 'uploading':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: UploadedFile['status']) => {
    switch (status) {
      case 'pending':
        return 'text-gray-600';
      case 'uploading':
        return 'text-blue-600';
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Documents
        </CardTitle>
        <CardDescription>
          Add new documents to your personal knowledge base. Supported formats: PDF, Markdown, and Text files.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.md,.txt"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Drop Zone */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-700 mb-2">
            Drop files here or click to browse
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Supports PDF, Markdown (.md), and Text (.txt) files
          </p>
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            Choose Files
          </Button>
        </div>

        {/* File List */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-sm text-gray-700">
              Selected Files ({files.length})
            </h4>
          </div>

          {files.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <Upload className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>No files selected yet.</p>
                <p className="text-sm">Upload some files to see them here!</p>
              </div>
            </div>
          ) : (
            <ScrollArea className="h-64">
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {getStatusIcon(file.status)}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{file.name}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{formatFileSize(file.size)}</span>
                          {file.message && (
                            <>
                              <span>•</span>
                              <span className={getStatusColor(file.status)}>
                                {file.message}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        disabled={file.status === 'uploading'}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        {/* Upload Button */}
        {files.length > 0 && (
          <div className="flex gap-2">
            <Button
              onClick={uploadFiles}
              disabled={isUploading || files.every(f => f.status === 'success')}
              className="flex-1"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload {files.filter(f => f.status === 'pending').length} Files
                </>
              )}
            </Button>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-sm text-blue-800 mb-2">After Upload:</h4>
          <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
            <li>Files will be saved to your data directory</li>
            <li>Run <code className="bg-blue-100 px-1 rounded">npm run ingest</code> to process new files</li>
            <li>New documents will be available in your chat immediately</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}
