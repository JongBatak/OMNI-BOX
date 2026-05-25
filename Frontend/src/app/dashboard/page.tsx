"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Folder, HardDrive, Star, UploadCloud, File, Heart, MessageCircle, BarChart3, 
  CloudLightning, Globe, FolderLock, Terminal, Code2, Search, Box, Image as ImageIcon, FileText, Loader2, Play, LogOut 
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { DynamicFileWorkspace, FileType, WorkspaceFile } from "@/components/ui/DynamicFileWorkspace";
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { useAuth } from "@/context/AuthContext";

// Data & Mocks
const MOCK_FILES = [
  { name: "Project_Alpha_Assets.zip", size: "2.4 GB", date: "Today, 14:30", type: "archive" },
  { name: "Q3_Financial_Report.pdf", size: "4.1 MB", date: "Yesterday", type: "document" },
  { name: "Omni_Brand_Kit.fig", size: "128 MB", date: "Oct 24", type: "design" },
  { name: "Website_Redesign_V2.mp4", size: "1.2 GB", date: "Oct 20", type: "video" }
];

const ANALYTICS_DATA = [
  { name: "Videos", space: 45.2, count: 124, color: "#00F0FF" },
  { name: "Archives", space: 28.5, count: 45, color: "#0033FF" },
  { name: "Documents", space: 15.3, count: 890, color: "#A855F7" },
  { name: "Images", space: 8.7, count: 2310, color: "#EC4899" },
  { name: "Code", space: 2.3, count: 1450, color: "#FBBF24" }
];

// Views
const MyStorageView = ({ onFileClick }: { onFileClick: (file: WorkspaceFile) => void }) => {
  const [files, setFiles] = useState<ApiFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchRecent = async () => {
      try {
        const token = localStorage.getItem('omnibox_token');
        const res = await fetch('/api/v1/files/recent', {
          headers: {
            'Authorization': 'Bearer ' + token,
            'Accept': 'application/json'
          }
        });
        if (res.ok) {
          const json = await res.json();
          if (active) setFiles(json.data ?? json);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (active) setIsLoading(false);
      }
    };
    void fetchRecent();
    return () => { active = false; };
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8 h-full">
      <section>
        <h2 className="text-xl font-heading font-bold text-white mb-6">Quick Access</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {["Design", "Documents", "Videos", "Archives"].map((folder, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer group hover:border-omni-cyan/30 transition-colors">
              <Folder className="w-8 h-8 text-omni-blue-light group-hover:text-omni-cyan transition-colors" />
              <span className="text-sm font-medium">{folder}</span>
            </motion.div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-heading font-bold text-white mb-6">Recent Uploads</h2>
        <div className="glass-panel rounded-3xl overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10 text-white/50">
              <Loader2 className="w-6 h-6 animate-spin text-omni-cyan mb-2" />
              <p className="text-xs font-mono tracking-widest uppercase animate-pulse">Scanning Vectors...</p>
            </div>
          ) : files.length === 0 ? (
            <div className="flex items-center justify-center py-10">
              <p className="text-white/30 font-mono text-sm tracking-widest uppercase">No files found in this sector</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {files.map((file, i) => (
                <motion.div key={file.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + (i * 0.05) }} onClick={() => onFileClick(mapApiFileToWorkspace(file))} className="p-4 sm:p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-omni-black-lighter flex items-center justify-center group-hover:bg-omni-blue-light/20 transition-colors">
                      {getIconForType(file.type)}
                    </div>
                    <div>
                      <div className="font-medium text-white mb-1 group-hover:text-omni-cyan transition-colors truncate max-w-xs">{file.name}</div>
                      <div className="text-xs text-omni-silver-dark">{file.created_at || 'Recently uploaded'}</div>
                    </div>
                  </div>
                  <div className="hidden sm:block text-sm font-medium text-omni-silver-dark">{(file.size / 1024).toFixed(2)} KB</div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </motion.div>
  );
};


interface ApiFile {
  id: string;
  user_id: string;
  name: string;
  type: string;
  path: string;
  size: number;
  is_community_shared: boolean;
  is_starred: boolean;
  created_at?: string;
  updated_at?: string;
  url: string;
  likes_count?: number;
  comments?: any[];
  user?: {
    id: string;
    name: string;
    email?: string;
  };
}

const getIconForType = (type: string) => {
  switch (type) {
    case '3d': return <Box className="w-8 h-8 text-omni-cyan" />;
    case 'code': return <Code2 className="w-8 h-8 text-purple-400" />;
    case 'image': return <ImageIcon className="w-8 h-8 text-emerald-400" />;
    default: return <FileText className="w-8 h-8 text-blue-400" />;
  }
};

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const mapApiFileToWorkspace = (file: ApiFile, currentUserId?: string): WorkspaceFile => ({
  id: file.id.toString(),
  name: file.name,
  type: file.type as FileType,
  url: file.url,
  size: formatBytes(file.size),
  isOwner: !file.is_community_shared || file.user_id === currentUserId
});

const PersonalGalleryView = ({ onFileClick }: { onFileClick: (file: WorkspaceFile) => void }) => {
  const [files, setFiles] = useState<ApiFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchFiles = async () => {
      try {
        const token = localStorage.getItem('omnibox_token');
        const res = await fetch('/api/v1/gallery/personal', {
          headers: {
            'Authorization': 'Bearer ' + token,
            'Accept': 'application/json'
          }
        });
        if (res.ok) {
          const json = await res.json();
          if (active) setFiles(json.data ?? json);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (active) setIsLoading(false);
      }
    };
    void fetchFiles();
    return () => { active = false; };
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8 h-full">
      <h2 className="text-xl font-heading font-bold text-white mb-6">Personal Gallery</h2>
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-white/50">
          <Loader2 className="w-8 h-8 animate-spin text-omni-cyan mb-4" />
          <p className="text-sm font-mono tracking-widest uppercase animate-pulse">Syncing with Grid...</p>
        </div>
      ) : files.length === 0 ? (
        <div className="flex items-center justify-center py-20">
           <p className="text-white/30 font-mono text-sm tracking-widest uppercase">No files found in personal storage.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {files.map((file, i) => (
            <motion.div 
              key={file.id} 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ delay: i * 0.05 }} 
              onClick={() => onFileClick(mapApiFileToWorkspace(file))}
              className="relative group aspect-square rounded-2xl overflow-hidden bg-omni-black-lighter cursor-pointer ring-1 ring-white/10 hover:ring-omni-cyan/50 transition-all"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-omni-blue/20 to-omni-cyan/20 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
              {file.type === 'image' ? (
                <Image src={file.url} alt={file.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
                   {getIconForType(file.type)}
                   <p className="mt-4 text-xs font-mono text-white/50 px-4 text-center truncate w-full">{file.name}</p>
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 z-20 bg-black/40 transition-opacity">
                 <Search className="w-8 h-8 text-white drop-shadow-lg" />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

const CommunityGalleryView = ({ onFileClick }: { onFileClick: (file: WorkspaceFile) => void }) => {
  const [files, setFiles] = useState<ApiFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchFiles = async () => {
      try {
        const token = localStorage.getItem('omnibox_token');
        const res = await fetch('/api/v1/gallery/community', {
          headers: {
            'Authorization': 'Bearer ' + token,
            'Accept': 'application/json'
          }
        });
        if (res.ok) {
          const json = await res.json();
          if (active) setFiles(json.data ?? json);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (active) setIsLoading(false);
      }
    };
    void fetchFiles();
    return () => { active = false; };
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8 h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-bold text-white">Community Shared Feed</h2>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-omni-cyan/20 text-omni-cyan text-xs font-bold rounded-full border border-omni-cyan/30">Trending</span>
          <span className="px-3 py-1 bg-white/5 text-omni-silver text-xs font-bold rounded-full hover:bg-white/10 cursor-pointer">Recent</span>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-white/50">
          <Loader2 className="w-8 h-8 animate-spin text-purple-400 mb-4" />
          <p className="text-sm font-mono tracking-widest uppercase animate-pulse">Syncing Omniverse...</p>
        </div>
      ) : files.length === 0 ? (
        <div className="flex items-center justify-center py-20">
           <p className="text-white/30 font-mono text-sm tracking-widest uppercase">No files found in community feed.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {files.map((file, i) => (
            <motion.div 
              key={file.id} 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: i * 0.1 }} 
              className="glass-panel p-4 rounded-3xl group border border-white/10 hover:border-purple-500/50 transition-colors flex flex-col"
            >
              <div onClick={() => onFileClick(mapApiFileToWorkspace(file))} className="cursor-pointer aspect-video rounded-2xl overflow-hidden mb-4 relative bg-black/40 flex items-center justify-center">
                {file.type === 'image' ? (
                  <Image src={file.url} alt={file.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  getIconForType(file.type)
                )}
                <div className="absolute inset-0 bg-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-omni-blue to-purple-500" />
                  <div className="max-w-[150px]">
                    <p className="text-sm font-bold text-white truncate">{file.user?.name || 'Unknown'}</p>
                    <p className="text-xs text-omni-silver-dark truncate pr-2">{file.name}</p>
                  </div>
                </div>
                <div className="flex flex-shrink-0 items-center gap-4">
                  <div className="flex items-center gap-1 group/btn cursor-pointer" onClick={async () => {
                     try {
                        const token = localStorage.getItem('omnibox_token');
                        await fetch(`/api/v1/files/${file.id}/like`, { method: 'POST', headers: { 'Authorization': 'Bearer ' + token } });
                        setFiles(files.map(f => f.id === file.id ? { ...f, likes_count: (f.likes_count || 0) + 1 } : f));
                     } catch(e) {}
                  }}>
                    <Heart className="w-4 h-4 text-omni-silver-dark hover:text-red-500 transition-colors" />
                    <span className="text-[10px] text-omni-silver-dark font-bold">{file.likes_count || 0}</span>
                  </div>
                  <div className="flex items-center gap-1 group/btn cursor-pointer" onClick={async () => {
                     const content = window.prompt("Enter your comment:");
                     if (content) {
                        try {
                          const token = localStorage.getItem('omnibox_token');
                          await fetch(`/api/v1/files/${file.id}/comments`, { 
                            method: 'POST', 
                            headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
                            body: JSON.stringify({ content })
                          });
                          setFiles(files.map(f => f.id === file.id ? { ...f, comments: [...(f.comments || []), { content }] } : f));
                        } catch(e) {}
                     }
                  }}>
                    <MessageCircle className="w-4 h-4 text-omni-silver-dark hover:text-omni-cyan transition-colors" />
                    <span className="text-[10px] text-omni-silver-dark font-bold">{(file.comments || []).length}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};


const StarredView = ({ onFileClick }: { onFileClick: (file: WorkspaceFile) => void }) => {
  const [files, setFiles] = useState<ApiFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchStarred = async () => {
      try {
        const token = localStorage.getItem('omnibox_token');
        const res = await fetch('/api/v1/files/starred', {
          headers: {
            'Authorization': 'Bearer ' + token,
            'Accept': 'application/json'
          }
        });
        if (res.ok) {
          const json = await res.json();
          if (active) setFiles(json.data ?? json);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (active) setIsLoading(false);
      }
    };
    void fetchStarred();
    return () => { active = false; };
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8 h-full">
      <h2 className="text-xl font-heading font-bold text-white mb-6">Starred Items</h2>
      <div className="glass-panel rounded-3xl overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-white/50">
            <Loader2 className="w-8 h-8 animate-spin text-yellow-400 mb-4" />
            <p className="text-sm font-mono tracking-widest uppercase animate-pulse">Locating Stars...</p>
          </div>
        ) : files.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-white/30 font-mono text-sm tracking-widest uppercase">No files found in this sector</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {files.map((file, i) => (
              <motion.div key={file.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} onClick={() => onFileClick(mapApiFileToWorkspace(file))} className="p-4 sm:p-6 flex items-center justify-between hover:bg-white/[0.02] cursor-pointer group">
                <div className="flex items-center gap-4">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 group-hover:scale-110 transition-transform" />
                  <div className="w-10 h-10 rounded-xl bg-omni-black-lighter flex items-center justify-center">
                    {getIconForType(file.type)}
                  </div>
                  <div>
                    <div className="font-medium text-white mb-1 group-hover:text-omni-cyan transition-colors">{file.name}</div>
                    <div className="text-xs text-omni-silver-dark">{file.type.toUpperCase()} • Starred {file.created_at || 'recently'}</div>
                  </div>
                </div>
                <div className="hidden sm:block text-sm font-medium text-omni-silver-dark">{(file.size / 1024).toFixed(2)} KB</div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};


const AnalyticsView = ({ metrics }: { metrics: { total_storage_used: number, total_files: number, storage_limit: number } }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8 h-full flex flex-col">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-heading font-bold text-white">Storage Analytics</h2>
      <div className="flex gap-4">
        <div className="glass-panel px-4 py-2 rounded-xl border-white/5">
          <p className="text-[10px] text-omni-silver-dark uppercase tracking-widest mb-1">Total Files</p>
          <p className="text-lg font-bold text-white">{metrics.total_files}</p>
        </div>
        <div className="glass-panel px-4 py-2 rounded-xl border-white/5">
          <p className="text-[10px] text-omni-silver-dark uppercase tracking-widest mb-1">Used Space</p>
          <p className="text-lg font-bold text-omni-cyan">{formatBytes(metrics.total_storage_used)}</p>
        </div>
      </div>
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
      {/* Storage Breakdown Pie */}
      <div className="glass-panel p-6 rounded-3xl flex flex-col items-center">
        <h3 className="text-sm font-medium text-omni-silver-dark tracking-widest uppercase mb-4 self-start">Space by Format (GB)</h3>
        <div className="w-full h-full min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={ANALYTICS_DATA} cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={5} dataKey="space" stroke="none">
                {ANALYTICS_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#0A0A0A', borderColor: '#ffffff10', borderRadius: '12px' }}
                itemStyle={{ color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          {ANALYTICS_DATA.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
               <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}/>
               <span className="text-xs text-omni-silver">{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* File Count Bar Chart */}
      <div className="glass-panel p-6 rounded-3xl flex flex-col">
        <h3 className="text-sm font-medium text-omni-silver-dark tracking-widest uppercase mb-4">Total Files vs Format</h3>
        <div className="w-full h-full min-h-[300px] mt-auto">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ANALYTICS_DATA} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip cursor={{fill: '#ffffff05'}} contentStyle={{ backgroundColor: '#0A0A0A', borderColor: '#ffffff10', borderRadius: '12px' }}/>
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {ANALYTICS_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  </motion.div>
);

const CodeTerminalView = () => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="h-full flex flex-col">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-heading font-bold text-white flex items-center gap-3">
        <Terminal className="text-omni-cyan" /> Personal Code Terminal
      </h2>
      <div className="flex gap-2">
        <span className="w-3 h-3 rounded-full bg-red-500"></span>
        <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
        <span className="w-3 h-3 rounded-full bg-green-500"></span>
      </div>
    </div>
    <div className="flex-1 glass-panel rounded-3xl p-6 font-mono text-sm overflow-hidden bg-black/60 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] border-omni-cyan/20">
       <div className="text-omni-cyan mb-4">OmniBox Sandbox Engine v1.0.4 - Linux Container</div>
       <div className="text-white/70 mb-2">Welcome to your personal cloud terminal. Authorized as Developer.</div>
       <br />
       <div className="text-green-400">user@omnibox:~$ <span className="text-white ml-2">ls -la /storage/personal</span></div>
       <div className="text-white/60 mt-1 whitespace-pre">
drwxr-xr-x 4 root root  4096 Oct 24 14:00 .
drwxr-xr-x 8 root root  4096 Oct 24 14:00 ..
-rw-r--r-- 1 user user 12044 Oct 24 14:15 Omni_Brand_Kit.fig
-rw-r--r-- 1 user user  4096 Oct 24 14:20 Q3_Financial_Report.pdf
       </div>
       <div className="text-green-400 mt-4">user@omnibox:~$ <span className="text-white/50 ml-2 animate-pulse">_</span></div>
    </div>
  </motion.div>
);

const WebviewCompilerView = () => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="h-full flex flex-col">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-heading font-bold text-white flex items-center gap-3">
        <Code2 className="text-omni-cyan" /> Webview Compiler
      </h2>
      <button className="bg-omni-cyan text-black px-4 py-1.5 rounded-lg font-bold text-sm hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all">
        Deploy Preview
      </button>
    </div>
    <div className="flex-1 flex gap-4 overflow-hidden">
      {/* Editor */}
      <div className="w-1/2 glass-panel rounded-3xl p-4 flex flex-col border-omni-blue/30 bg-[#0d1117] font-mono text-sm leading-relaxed overflow-y-auto">
        <div className="text-white/40 mb-4 border-b border-white/10 pb-2">src/App.jsx</div>
        <div className="text-purple-400">import <span className="text-white">React</span> from <span className="text-green-300">&apos;react&apos;</span>;</div>
        <div className="text-purple-400 mt-2">export default function <span className="text-blue-300">App</span><span className="text-white">() {'{'}</span></div>
        <div className="text-white ml-4">return (</div>
        <div className="text-white ml-8">{"<"}<span className="text-red-400">div</span> className=<span className="text-green-300">&quot;omni-container&quot;</span>{">"}</div>
        <div className="text-white ml-12">{"<"}<span className="text-red-400">h1</span>{">"}Hello from Webview Compiler{"</"}<span className="text-red-400">h1</span>{">"}</div>
        <div className="text-white ml-12">{"<"}<span className="text-red-400">p</span>{">"}Rendered instantly on the cloud edge.{"</"}<span className="text-red-400">p</span>{">"}</div>
        <div className="text-white ml-8">{"</"}<span className="text-red-400">div</span>{">"}</div>
        <div className="text-white ml-4">);</div>
        <div className="text-white">{'}'}</div>
      </div>
      {/* Preview */}
      <div className="w-1/2 glass-panel rounded-3xl p-0 overflow-hidden flex flex-col bg-white">
        <div className="bg-gray-100 h-10 border-b flex items-center px-4 gap-2">
          <div className="w-full bg-white rounded flex items-center px-3 py-1 text-xs text-gray-500 shadow-sm">
            https://preview.omnibox.cloud/a8f93e
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center flex-col bg-[#fafafa]">
          <h1 className="text-2xl font-black text-black">Hello from Webview Compiler</h1>
          <p className="text-gray-600 mt-2">Rendered instantly on the cloud edge.</p>
        </div>
      </div>
    </div>
  </motion.div>
);

const TABS = [
  { id: "storage", icon: HardDrive, label: "My Storage" },
  { id: "personal-gallery", icon: FolderLock, label: "Personal Gallery" },
  { id: "community-gallery", icon: Globe, label: "Community Gallery" },
  { id: "starred", icon: Star, label: "Starred" },
  { id: "analytics", icon: BarChart3, label: "Analytics" },
  { id: "terminal", icon: Terminal, label: "Code Terminal" },
  { id: "compiler", icon: Code2, label: "Webview Compiler" }
];

export default function CustomerDashboard() {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("storage");
  const [activeWorkspaceFile, setActiveWorkspaceFile] = useState<WorkspaceFile | null>(null);
  const [metrics, setMetrics] = useState({ total_storage_used: 0, total_files: 0, storage_limit: 15000000 });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const uploadFile = e.target.files[0];
    
    setIsUploading(true);
    try {
      const token = localStorage.getItem('omnibox_token');
      const formData = new FormData();
      formData.append('file', uploadFile);
      
      let fileType = 'unknown';
      const ext = uploadFile.name.split('.').pop()?.toLowerCase() || '';
      if (['glb', 'gltf', 'obj', 'stl', 'fbx', 'blend'].includes(ext)) fileType = '3d';
      else if (['js', 'jsx', 'ts', 'tsx', 'py', 'cpp', 'c', 'java', 'css', 'json', 'php', 'rb', 'go', 'rs', 'sql', 'html'].includes(ext)) fileType = 'code';
      else if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'avif'].includes(ext)) fileType = 'image';
      else if (['mp4', 'webm', 'ogg', 'mov'].includes(ext)) fileType = 'video';
      else if (['pdf', 'doc', 'docx', 'txt', 'md', 'odt'].includes(ext)) fileType = 'document';
      
      formData.append('type', fileType);
      
      const res = await fetch('/api/v1/files', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Accept': 'application/json'
        },
        body: formData
      });
      
      if (res.ok) {
        window.location.reload(); 
      } else {
        const err = await res.json();
        alert('Upload failed: ' + (err.message || 'Unknown error'));
      }
    } catch (err) {
      alert('Upload failed: ' + err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeleteFile = async (id: string) => {
    try {
      const token = localStorage.getItem('omnibox_token');
      const res = await fetch(`/api/v1/files/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + token }
      });
      if (res.ok) {
        window.location.reload();
      }
    } catch (e) {
      console.error('Delete failed', e);
    }
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setIsMounted(true); }, []);

  // Fetch metrics
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const token = localStorage.getItem('omnibox_token');
        const res = await fetch('/api/user/metrics', {
          headers: {
            'Authorization': 'Bearer ' + token,
            'Accept': 'application/json'
          }
        });
        if (res.ok) {
          const json = await res.json();
          setMetrics(json);
        }
      } catch (err) {
        console.error("Failed to fetch metrics:", err);
      }
    };
    if (isAuthenticated) fetchMetrics();
  }, [isAuthenticated]);

  // Auth guard — redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to log out? You will need to sign in again.")) {
      await logout();
      router.push('/login');
    }
  };

  // Show loading while auth state resolves
  if (isLoading) {
    return (
      <div className="min-h-screen bg-omni-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-omni-cyan" />
          <p className="text-omni-silver-dark font-mono text-sm tracking-widest uppercase animate-pulse">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;
  if (!isMounted) return null;

  // Get user initials for avatar
  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  return (
    <div className="min-h-screen bg-omni-black flex text-omni-silver font-sans">
      
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-20 lg:w-68 xl:w-72 border-r border-white/5 bg-omni-black-lighter/50 backdrop-blur-xl hidden md:flex flex-col py-8 sticky top-0 h-screen"
      >
        <div className="px-8 mb-10 flex justify-center lg:justify-start items-center gap-3">
          <CloudLightning className="w-8 h-8 text-omni-cyan lg:hidden flex-shrink-0" />
          <CloudLightning className="w-7 h-7 text-omni-cyan hidden lg:block flex-shrink-0" />
          <h1 className="font-heading text-2xl font-black tracking-widest text-white hidden lg:block">OMNIBOX</h1>
        </div>

        <nav className="flex-1 space-y-1.5 px-4 overflow-y-auto">
          {TABS.map((item) => (
            <div 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "flex items-center gap-4 cursor-pointer p-3.5 rounded-2xl transition-all duration-300",
                activeTab === item.id 
                  ? "bg-omni-cyan/10 text-omni-cyan shadow-[inset_0_0_20px_rgba(0,240,255,0.05)] border border-omni-cyan/20" 
                  : "text-omni-silver-dark hover:bg-white/5 hover:text-white border border-transparent"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium tracking-wide text-sm hidden lg:block truncate">{item.label}</span>
            </div>
          ))}
        </nav>

        {/* Storage Meter */}
        <div className="mt-6 px-6 hidden lg:block flex-shrink-0">
          <div className="glass-panel p-5 rounded-2xl border-white/5">
            <div className="flex justify-between text-xs mb-3">
              <span className="text-omni-silver-dark">Storage Used</span>
              <span className="text-white font-bold tracking-wider">
                {formatBytes(metrics.total_storage_used)} 
                <span className="text-omni-silver-dark"> / {formatBytes(metrics.storage_limit)}</span>
              </span>
            </div>
            <div className="h-1.5 w-full bg-black rounded-full overflow-hidden mb-4 ring-1 ring-white/10">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((metrics.total_storage_used / metrics.storage_limit) * 100, 100)}%` }}
                transition={{ duration: 1.5, delay: 0.5 }}
                className="h-full bg-gradient-to-r from-omni-blue-light to-omni-cyan rounded-full relative"
              >
                 <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite] skew-x-[-20deg]" />
              </motion.div>
            </div>
            <div className="inline-flex items-center justify-center px-3 py-1.5 rounded-xl bg-omni-cyan/10 border border-omni-cyan/30 text-omni-cyan text-xs font-bold w-full uppercase tracking-widest">
              {metrics.total_storage_used > 10000000 ? "Power User" : "Premium Tier"}
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Cool Background Morphing (Subtle) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
           <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-omni-blue-light/5 blur-[120px]" />
           <div className="absolute bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-omni-cyan/5 blur-[120px]" />
        </div>

        {/* Topbar */}
        <header className="h-20 lg:h-24 border-b border-white/5 flex items-center justify-between px-6 lg:px-10 bg-omni-black/50 backdrop-blur-md z-10 sticky top-0">
          <div className="relative w-full max-w-md hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-omni-silver-dark w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search the omniverse..." 
              className="w-full bg-omni-black-lighter border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-omni-cyan focus:shadow-[0_0_15px_rgba(0,240,255,0.15)] transition-all font-medium text-white placeholder-omni-silver-dark"
            />
          </div>
          <div className="flex items-center gap-4 md:gap-6 ml-auto">
            {/* Hidden File Input */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleUpload} 
              className="hidden" 
              disabled={isUploading}
            />
            <motion.button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              whileHover={isUploading ? {} : { scale: 1.05 }}
              whileTap={isUploading ? {} : { scale: 0.95 }}
              className="flex items-center gap-2 bg-omni-cyan text-omni-black px-4 py-2 sm:px-5 sm:py-2.5 rounded-full font-bold text-sm shadow-[0_0_15px_rgba(0,240,255,0.4)] hover:shadow-[0_0_25px_rgba(0,240,255,0.6)] transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
              ) : (
                <UploadCloud className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-y-0.5 transition-transform" />
              )}
              <span className="hidden sm:inline tracking-wide">{isUploading ? 'Uploading...' : 'Upload'}</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white/5 border border-white/10 text-omni-silver-dark hover:text-red-400 hover:border-red-400/30 px-3 py-2 sm:px-4 sm:py-2.5 rounded-full font-bold text-sm transition-all group"
              title="Logout"
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-0.5 transition-transform" />
              <span className="hidden sm:inline tracking-wide">Logout</span>
            </motion.button>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-purple-500 to-omni-cyan flex items-center justify-center text-white font-bold text-sm border border-white/20 cursor-pointer shadow-lg ring-2 ring-omni-black ring-offset-1 ring-offset-omni-cyan/30 hover:ring-offset-omni-cyan transition-all">
              {initials}
            </div>
          </div>
        </header>

        {/* Dynamic Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 z-10">
          <AnimatePresence mode="wait">
             <div key={activeTab} className="h-full">
               {activeTab === "storage" && <MyStorageView onFileClick={setActiveWorkspaceFile} />}
               {activeTab === "personal-gallery" && <PersonalGalleryView onFileClick={setActiveWorkspaceFile} />}
               {activeTab === "community-gallery" && <CommunityGalleryView onFileClick={setActiveWorkspaceFile} />}
               {activeTab === "starred" && <StarredView onFileClick={setActiveWorkspaceFile} />}
               {activeTab === "analytics" && <AnalyticsView metrics={metrics} />}
               {activeTab === "terminal" && <CodeTerminalView />}
               {activeTab === "compiler" && <WebviewCompilerView />}
             </div>
          </AnimatePresence>
        </div>
        <DynamicFileWorkspace 
           file={activeWorkspaceFile} 
           onClose={() => setActiveWorkspaceFile(null)} 
           onDelete={handleDeleteFile}
        />
      </main>
    </div>
  );
}