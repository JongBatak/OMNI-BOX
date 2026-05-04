"use client";

import { motion } from "framer-motion";
import { Folder, HardDrive, Share2, Star, UploadCloud, File, Heart, MessageCircle, BarChart3, CloudLightning } from "lucide-react";
import { cn } from "@/lib/utils";

const MOCK_FILES = [
  { name: "Project_Alpha_Assets.zip", size: "2.4 GB", date: "Today, 14:30" },
  { name: "Q3_Financial_Report.pdf", size: "4.1 MB", date: "Yesterday" },
  { name: "Omni_Brand_Kit.fig", size: "128 MB", date: "Oct 24" }
];

const MOCK_FEED = [
  { user: "Sarah Jenkins", action: "shared a folder with you", target: "Design Resources", time: "2h ago", avatar: "SJ" },
  { user: "Alex Chen", action: "commented on", target: "Q3_Financial_Report.pdf", time: "5h ago", avatar: "AC" }
];

export default function CustomerDashboard() {
  return (
    <div className="min-h-screen bg-omni-black flex text-omni-silver font-sans">
      
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-20 lg:w-64 border-r border-white/5 bg-omni-black-lighter/50 backdrop-blur-xl hidden md:flex flex-col py-8"
      >
        <div className="px-8 mb-12 flex justify-center lg:justify-start">
          <CloudLightning className="w-8 h-8 text-omni-cyan lg:hidden" />
          <h1 className="font-heading text-2xl font-black tracking-widest text-white hidden lg:block">OMNIBOX</h1>
        </div>

        <nav className="flex-1 space-y-2 px-4">
          {[
            { icon: HardDrive, label: "My Storage", active: true },
            { icon: Share2, label: "Shared Network" },
            { icon: Star, label: "Starred" },
            { icon: BarChart3, label: "Analytics" }
          ].map((item, idx) => (
            <div 
              key={idx}
              className={cn(
                "flex items-center gap-4 cursor-pointer p-4 rounded-2xl transition-all duration-300",
                item.active ? "bg-omni-cyan/10 text-omni-cyan shadow-[inset_0_0_20px_rgba(0,240,255,0.05)]" : "text-omni-silver-dark hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium tracking-wide hidden lg:block">{item.label}</span>
            </div>
          ))}
        </nav>

        {/* Storage Meter */}
        <div className="mt-auto px-6 hidden lg:block">
          <div className="glass-panel p-4 rounded-2xl">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-omni-silver-dark">Storage Used</span>
              <span className="text-white font-bold">45%</span>
            </div>
            <div className="h-1.5 w-full bg-black rounded-full overflow-hidden mb-3">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "45%" }}
                transition={{ duration: 1.5, delay: 0.5 }}
                className="h-full bg-gradient-to-r from-omni-blue-light to-omni-cyan rounded-full"
              />
            </div>
            <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-omni-blue-light/20 border border-omni-cyan/30 text-omni-cyan text-xs font-bold w-full uppercase tracking-widest">
              Premium Tier
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Topbar */}
        <header className="h-24 border-b border-white/5 flex items-center justify-between px-8 lg:px-12 bg-omni-black/50 backdrop-blur-md">
          <div className="relative w-full max-w-md hidden md:block">
            <input 
              type="text" 
              placeholder="Search the omniverse..." 
              className="w-full bg-omni-black-lighter border border-white/10 rounded-full py-3 pl-6 pr-4 text-sm focus:outline-none focus:border-omni-cyan focus:shadow-[0_0_15px_rgba(0,240,255,0.15)] transition-all"
            />
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-omni-cyan text-omni-black px-5 py-2.5 rounded-full font-bold text-sm shadow-[0_0_15px_rgba(0,240,255,0.4)] hover:shadow-[0_0_25px_rgba(0,240,255,0.6)] transition-all"
            >
              <UploadCloud className="w-4 h-4" />
              <span className="hidden sm:inline">Upload</span>
            </motion.button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-omni-cyan flex items-center justify-center text-white font-bold text-sm border-2 border-white/10 cursor-pointer shadow-lg">
              JS
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-8 lg:p-12">
          
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            
            {/* Left Column (Wider) */}
            <div className="xl:col-span-2 space-y-8">
              
              {/* Quick Access */}
              <section>
                <h2 className="text-xl font-heading font-bold text-white mb-6">Quick Access</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {["Design", "Documents", "Videos", "Archives"].map((folder, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer group hover:border-omni-cyan/30 transition-colors"
                    >
                      <Folder className="w-8 h-8 text-omni-blue-light group-hover:text-omni-cyan transition-colors" />
                      <span className="text-sm font-medium">{folder}</span>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* Recent Files */}
              <section>
                <h2 className="text-xl font-heading font-bold text-white mb-6">Recent Uploads</h2>
                <div className="glass-panel rounded-3xl overflow-hidden">
                  <div className="divide-y divide-white/5">
                    {MOCK_FILES.map((file, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + (i * 0.1) }}
                        className="p-4 sm:p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-omni-black-lighter flex items-center justify-center group-hover:bg-omni-blue-light/20 transition-colors">
                            <File className="w-5 h-5 text-omni-silver-dark group-hover:text-omni-cyan" />
                          </div>
                          <div>
                            <div className="font-medium text-white mb-1 group-hover:text-omni-cyan transition-colors">{file.name}</div>
                            <div className="text-xs text-omni-silver-dark">{file.date}</div>
                          </div>
                        </div>
                        <div className="text-sm font-medium text-omni-silver-dark">{file.size}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Upload Progress Placeholder */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="glass-panel rounded-2xl p-6 border border-omni-cyan/20 bg-omni-cyan/5"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <UploadCloud className="w-5 h-5 text-omni-cyan" />
                    <span className="text-sm font-bold text-white">Syncing 'Project_Beta_Raw.mp4'</span>
                  </div>
                  <span className="text-xs font-bold text-omni-cyan">72%</span>
                </div>
                <div className="h-2 w-full bg-black rounded-full overflow-hidden">
                  <div className="h-full bg-omni-cyan w-[72%] shadow-[0_0_10px_rgba(0,240,255,0.8)] relative">
                    <div className="absolute inset-0 bg-white/20 animate-[shimmer_1s_infinite] skew-x-[-20deg]" />
                  </div>
                </div>
              </motion.div>

            </div>

            {/* Right Column (Sidebar-ish) */}
            <div className="space-y-8">
              
              {/* Community Feed */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-heading font-bold text-white">Network Activity</h2>
                  <span className="text-xs text-omni-cyan font-bold cursor-pointer hover:underline">View All</span>
                </div>
                
                <div className="space-y-4">
                  {MOCK_FEED.map((feed, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + (i * 0.1) }}
                      className="glass-panel p-5 rounded-2xl relative overflow-hidden group hover:border-white/20 transition-all duration-300 transform perspective-1000 hover:rotate-y-[-2deg] hover:translate-z-4"
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-omni-black-lighter flex items-center justify-center font-bold text-sm text-omni-silver-dark shadow-[inset_0_2px_4px_rgba(255,255,255,0.05)] border border-white/5">
                          {feed.avatar}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-omni-silver leading-relaxed">
                            <span className="font-bold text-white">{feed.user}</span> {feed.action} <span className="font-medium text-omni-cyan">{feed.target}</span>
                          </p>
                          <div className="flex items-center gap-4 mt-3">
                            <span className="text-xs text-omni-silver-dark">{feed.time}</span>
                            <div className="flex items-center gap-3 ml-auto">
                              <Heart className="w-3.5 h-3.5 text-omni-silver-dark hover:text-red-400 cursor-pointer transition-colors" />
                              <MessageCircle className="w-3.5 h-3.5 text-omni-silver-dark hover:text-omni-cyan cursor-pointer transition-colors" />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Subtle 3D highlight effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* Analytics Mini-Card */}
              <section>
                <div className="glass-panel p-6 rounded-3xl mt-8">
                  <h3 className="text-sm font-medium text-omni-silver-dark mb-4 uppercase tracking-widest">Weekly Bandwidth</h3>
                  <div className="flex items-end gap-2 h-24 mt-4">
                    {[40, 70, 45, 90, 65, 80, 100].map((height, i) => (
                      <div key={i} className="flex-1 bg-omni-black-lighter rounded-t-md relative group overflow-hidden">
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: `${height}%` }}
                          transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                          className={cn("absolute bottom-0 w-full rounded-t-md transition-colors", i === 6 ? "bg-omni-cyan" : "bg-omni-blue-light group-hover:bg-omni-blue")}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-omni-silver-dark mt-3">
                    <span>Mon</span>
                    <span className="text-omni-cyan font-bold">Sun</span>
                  </div>
                </div>
              </section>

            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
