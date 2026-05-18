"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Code2, Image as ImageIcon, FileText, Loader2 } from 'lucide-react';
import { DynamicFileWorkspace, FileType, WorkspaceFile } from './DynamicFileWorkspace';
import { cn } from '@/lib/utils';

interface ApiFile {
  id: number;
  user_id: number;
  name: string;
  type: string;
  path: string;
  size: number;
  is_community_shared: number;
  url: string;
  user?: {
    id: number;
    name: string;
  };
}

export function OmniGallery() {
  const [activeTab, setActiveTab] = useState<'personal' | 'community'>('personal');
  const [files, setFiles] = useState<ApiFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeWorkspaceFile, setActiveWorkspaceFile] = useState<WorkspaceFile | null>(null);

  useEffect(() => {
    let active = true;

    const fetchFiles = async (tab: 'personal' | 'community') => {
      setIsLoading(true);
      setError('');
      try {
        // FIX: Samakan key token dengan AuthContext.tsx yaitu 'omnibox_token'
        const token = localStorage.getItem('omnibox_token');
        if (!token) throw new Error('No authentication token found.');

        const endpoint = tab === 'personal' ? '/api/gallery/personal' : '/api/gallery/community';
        
        // FIX: Ubah ke relative path agar melewati jembatan proxy next.config.ts
        const response = await fetch(`${endpoint}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        if (!response.ok) throw new Error('Failed to fetch gallery data.');
        
        const data = await response.json();
        if (active) setFiles(data);
      } catch (err: unknown) {
        if (active && err instanceof Error) {
           setError(err.message || 'An error occurred.');
        }
      } finally {
        if (active) setIsLoading(false);
      }
    };

    void fetchFiles(activeTab);

    return () => { active = false; };
  }, [activeTab]);

  const getIconForType = (type: string) => {
    switch (type) {
      case '3d': return <Box className="w-8 h-8 text-omni-cyan" />;
      case 'code': return <Code2 className="w-8 h-8 text-purple-400" />;
      case 'image': return <ImageIcon className="w-8 h-8 text-emerald-400" />;
      default: return <FileText className="w-8 h-8 text-blue-400" />;
    }
  };

  const handleFileClick = (file: ApiFile) => {
    setActiveWorkspaceFile({
      id: file.id.toString(),
      name: file.name,
      type: file.type as FileType,
      url: file.url,
      size: (file.size / 1024).toFixed(2) + ' KB'
    });
  };

  return (
    <div className="flex flex-col h-full bg-omni-black/50 text-white rounded-3xl border border-white/10 overflow-hidden relative">
      {/* Tabs */}
      <div className="flex items-center gap-6 px-8 py-6 border-b border-white/5">
        <button
          onClick={() => setActiveTab('personal')}
          className={cn("text-lg font-bold tracking-widest uppercase transition-colors relative", activeTab === 'personal' ? "text-white" : "text-white/30 hover:text-white/60")}
        >
          My Space
          {activeTab === 'personal' && (
            <motion.div layoutId="galleryTab" className="absolute -bottom-6 left-0 right-0 h-0.5 bg-omni-cyan shadow-[0_0_10px_rgba(0,240,255,0.8)]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('community')}
          className={cn("text-lg font-bold tracking-widest uppercase transition-colors relative", activeTab === 'community' ? "text-white" : "text-white/30 hover:text-white/60")}
        >
          Omniverse
          {activeTab === 'community' && (
             <motion.div layoutId="galleryTab" className="absolute -bottom-6 left-0 right-0 h-0.5 bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
          )}
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-8 relative">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white/50">
            <Loader2 className="w-8 h-8 animate-spin text-omni-cyan mb-4" />
            <p className="text-sm font-mono tracking-widest uppercase animate-pulse">Syncing with Grid...</p>
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-red-400 font-mono text-sm border border-red-500/20 bg-red-500/10 px-4 py-2 rounded-md">{error}</p>
          </div>
        ) : files.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
             <p className="text-white/30 font-mono text-sm tracking-widest uppercase">No data found in this sector.</p>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {files.map((file) => (
              <motion.div 
                key={file.id}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleFileClick(file)}
                className="group cursor-pointer aspect-square rounded-2xl glass-panel bg-white/5 border border-white/10 flex flex-col items-center justify-center p-4 relative overflow-hidden backdrop-blur-md hover:bg-white/10 transition-colors hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]"
              >
                <div className={cn(
                  "absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-2xl",
                  file.type === '3d' ? "bg-omni-cyan" : file.type === 'code' ? "bg-purple-500" : "bg-blue-500"
                )} />

                <div className="relative z-10 mb-4 p-4 rounded-full bg-black/40 border border-white/5 shadow-inner">
                  {getIconForType(file.type)}
                </div>
                
                <h4 className="relative z-10 text-sm font-bold text-center truncate w-full px-2" title={file.name}>
                  {file.name}
                </h4>
                
                <div className="relative z-10 mt-2 flex flex-col items-center gap-1">
                  <span className="text-[10px] font-mono text-white/40 border border-white/10 px-2 py-0.5 rounded capitalize">
                    {file.type}
                  </span>
                  {activeTab === 'community' && file.user && (
                    <span className="text-[10px] text-white/50 bg-black/40 px-2 py-0.5 rounded-full border border-white/5 truncate max-w-[120px]">
                      By @{file.user.name}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <DynamicFileWorkspace 
         file={activeWorkspaceFile} 
         onClose={() => setActiveWorkspaceFile(null)} 
      />
    </div>
  );
}