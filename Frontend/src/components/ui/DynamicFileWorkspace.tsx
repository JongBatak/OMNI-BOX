"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Maximize2, Minimize2, Download, Play, Terminal, 
  Box, FileText, Image as ImageIcon, Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { ThreeDViewer } from './ThreeDViewer';

export type FileType = '3d' | 'code' | 'image' | 'document' | 'video' | 'audio' | 'archive' | 'unknown' | 'html';

export interface WorkspaceFile {
  id: string;
  name: string;
  type: FileType;
  url: string;
  size?: string;
  content?: string;
  isOwner?: boolean;
}

interface DynamicFileWorkspaceProps {
  file: WorkspaceFile | null;
  onClose: () => void;
  onDelete?: (id: string) => void;
}

const getFileMetadata = (filename: string) => {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  if (['html'].includes(ext)) return 'html';
  if (['js', 'jsx', 'ts', 'tsx', 'py', 'cpp', 'c', 'java', 'css', 'json', 'php', 'rb', 'go', 'rs', 'sql'].includes(ext)) return 'code';
  if (['glb', 'gltf', 'obj', 'stl', 'fbx'].includes(ext)) return '3d';
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'avif'].includes(ext)) return 'image';
  if (['mp4', 'webm', 'ogg', 'mov'].includes(ext)) return 'video';
  if (['pdf', 'doc', 'docx', 'txt', 'md', 'odt'].includes(ext)) return 'document';
  return 'unknown';
};

export const DynamicFileWorkspace: React.FC<DynamicFileWorkspaceProps> = ({ file, onClose, onDelete }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [fileContent, setFileContent] = useState<string>('');
  const [isFetching, setIsFetching] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // SAFE PROXY URL: Diproses di top-level komponen agar bisa dipakai di useEffect dan renderContent
  const proxiedUrl = file ? file.url.replace(/^https?:\/\/[^\/]+/, '') : '';

  useEffect(() => {
    if (!file || !proxiedUrl) return;
    
    const type = getFileMetadata(file.name);
    if (type === 'code' || type === 'html' || file.name.endsWith('.txt')) {
      const loadContent = async () => {
        setIsFetching(true);
        try {
          const res = await fetch(proxiedUrl);
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          const text = await res.text();
          setFileContent(text);
        } catch (err) {
          setFileContent('Error loading file content: ' + err);
        } finally {
          setIsFetching(false);
        }
      };
      loadContent();
    }
  }, [file, proxiedUrl]);

  if (!isMounted) return null;

  const handleRun = () => {
    if (!file) return;
    setIsExecuting(true);
    setTerminalOutput([`[SYS] Compiling ${file.name}...`]);
    
    setTimeout(() => {
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      const outputs: string[] = [];
      const lines = fileContent.split('\n');
      
      lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed.startsWith('//') || trimmed.startsWith('#')) return;

        if (['js', 'ts', 'jsx', 'tsx'].includes(ext)) {
          const matches = [...line.matchAll(/console\.log\(\s*['"`](.*?)['"`]\s*\)/g)];
          matches.forEach(m => outputs.push(`> ${m[1]}`));
        } else if (ext === 'py') {
          const matches = [...line.matchAll(/print\(\s*['"`](.*?)['"`]\s*\)/g)];
          matches.forEach(m => outputs.push(`> ${m[1]}`));
        } else if (['cpp', 'c'].includes(ext)) {
          if (line.includes('cout') || line.includes('printf')) {
            const stringRegex = /"([^"\\]*(?:\\.[^"\\]*)*)"/g;
            let strMatch;
            let combined = '';
            while ((strMatch = stringRegex.exec(line)) !== null) {
               const txt = strMatch[1];
               if (txt === '\\n' || txt === ' \\n ') continue;
               combined += txt.replace(/\\n/g, '') + ' ';
            }
            if (combined.trim()) outputs.push(`> ${combined.trim()}`);
          }
        } else if (ext === 'php') {
          const matches = [...line.matchAll(/echo\s+['"](.*?)['"]/g)];
          matches.forEach(m => outputs.push(`> ${m[1]}`));
        } else {
          const m = line.match(/(?:print|echo|console\.log|printf|cout).*?['"](.*?)['"]/);
          if (m && m[1]) outputs.push(`> ${m[1].replace(/\\n/g, '')}`);
        }
      });

      setTerminalOutput(prev => [
        ...prev, 
        `[EXEC] Process finished with exit code 0.`,
        ...outputs
      ]);

      if (outputs.length === 0) {
         setTerminalOutput(prev => [...prev, `> (No standard output emitted)`]);
      }
      
      setIsExecuting(false);
    }, 1200);
  };

  const renderContent = () => {
    if (!file) return null;
    const type = getFileMetadata(file.name);

    if (type === 'code' || type === 'html' || file.name.endsWith('.txt')) {
      return (
        <div className="flex w-full h-full overflow-hidden">
          <div className="w-1/2 h-full bg-gray-900 border-r border-white/10 overflow-y-auto p-4">
            {isFetching ? <Loader2 className="animate-spin text-omni-cyan" /> : <pre className="whitespace-pre-wrap text-sm text-gray-300 font-mono">{fileContent}</pre>}
          </div>
          <div className="w-1/2 h-full bg-black relative">
            {type === 'html' ? (
              <iframe srcDoc={fileContent} className="w-full h-full bg-white border-0" title="Preview" />
            ) : (
              <div className="flex flex-col h-full">
                <div className="p-4 border-b border-white/10 flex justify-between items-center">
                  <span className="text-omni-cyan font-mono text-sm flex items-center gap-2"><Terminal className="w-4 h-4"/> Personal Code Terminal</span>
                  <button onClick={handleRun} disabled={isExecuting} className="px-4 py-1 bg-omni-cyan/20 text-omni-cyan rounded-md flex items-center gap-2 hover:bg-omni-cyan/30 text-sm">
                    {isExecuting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                    Run
                  </button>
                </div>
                <div className="flex-1 p-4 font-mono text-sm text-green-400 overflow-auto bg-black/50">
                  {terminalOutput.map((l, i) => <div key={i}>{l}</div>)}
                  {isExecuting && <div className="animate-pulse">_</div>}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (type === 'image') {
      return <div className="relative w-full h-full flex items-center justify-center bg-black/20"><Image src={proxiedUrl} alt={file.name} fill className="object-contain" /></div>;
    }

    if (type === 'video') {
      return <video src={proxiedUrl} controls className="w-full h-full object-contain bg-black/20" />;
    }

    if (type === 'document' || type === 'unknown') {
      return <iframe src={proxiedUrl} className="w-full h-full bg-white" title={file.name} />;
    }
    
    if (type === '3d') {
      const ext = file.name.split('.').pop() || '';
      return (
        <div className="w-full h-full flex flex-col relative bg-black/90 text-white/50">
          <ThreeDViewer url={proxiedUrl} extension={ext} />
          <a href={proxiedUrl} download className="absolute bottom-4 right-4 z-10 px-6 py-2 bg-omni-cyan/20 text-omni-cyan rounded-full flex items-center gap-2 hover:bg-omni-cyan/30">
            <Download className="w-4 h-4" /> Download Asset
          </a>
        </div>
      );
    }
    
    return null;
  };

  return (
    <AnimatePresence>
      {file && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-12 bg-black/80 backdrop-blur-md">
          <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className={cn("bg-omni-black-lighter border border-white/10 flex flex-col overflow-hidden shadow-2xl relative transition-all duration-300", isFullscreen ? "fixed inset-0 rounded-none w-full h-full" : "w-full max-w-6xl aspect-16/10 rounded-3xl")}>
            <div className="h-14 border-b border-white/10 flex items-center justify-between px-4 bg-black/20 select-none">
              <div className="flex items-center gap-3">
                <div className="font-medium text-white truncate max-w-50 sm:max-w-xs">{file.name}</div>
              </div>
              <div className="flex items-center gap-2">
                {file.isOwner && onDelete && (
                  <button onClick={() => { if(confirm('Delete this file?')) { onDelete(file.id); onClose(); } }} className="px-3 py-1 bg-red-500/20 text-red-500 rounded text-xs font-bold hover:bg-red-500/30 mr-2">Delete</button>
                )}
                <button onClick={() => setIsFullscreen(!isFullscreen)} className="p-2 hover:bg-white/10 rounded-lg text-omni-silver-dark transition-colors">{isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}</button>
                <button onClick={onClose} className="p-2 hover:bg-red-500/20 hover:text-red-500 rounded-lg text-omni-silver-dark transition-colors"><X className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden relative">
              {renderContent()}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};