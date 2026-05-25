"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, Users, Server, Activity, DollarSign, Bell, Settings, LogOut, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Data
const MOCK_REVENUE = "$2.4M";
const MOCK_SERVERS = [{ name: "US-East-1", status: "Optimal", load: 45 }, { name: "EU-West-2", status: "Warning", load: 88 }];
const MOCK_LOGS = [
  { id: 1, action: "System Update Complete", time: "2 mins ago" },
  { id: 2, action: "New Node Connected", time: "15 mins ago" },
  { id: 3, action: "Security Scan Clear", time: "1 hour ago" }
];

const UserManagementView = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('omnibox_token');
        const res = await fetch('/api/v1/dashboard/admin/users', {
          headers: { 'Authorization': 'Bearer ' + token }
        });
        if (res.ok) {
          const json = await res.json();
          if (active) setUsers(json.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (active) setIsLoading(false);
      }
    };
    fetchUsers();
    return () => { active = false; };
  }, []);

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-white/50">
        <Loader2 className="w-8 h-8 animate-spin text-omni-cyan mb-4" />
        <p className="text-sm font-mono tracking-widest uppercase animate-pulse">Loading Users...</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-8 rounded-3xl overflow-hidden">
      <h2 className="text-xl font-heading font-bold text-white mb-6">User Management & Analytics</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-omni-silver">
          <thead className="text-xs uppercase bg-black/20 text-omni-silver-dark border-b border-white/10">
            <tr>
              <th className="px-6 py-4 font-bold">User Identity</th>
              <th className="px-6 py-4 font-bold">Files on Cloud</th>
              <th className="px-6 py-4 font-bold">Storage Usage</th>
              <th className="px-6 py-4 font-bold">Access Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => {
              const usagePercent = Math.min((u.storage_used / u.storage_limit) * 100, 100);
              return (
                <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-white font-medium">{u.name}</div>
                    <div className="text-xs text-omni-silver-dark">{u.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="px-3 py-1 bg-omni-cyan/10 text-omni-cyan border border-omni-cyan/20 rounded-full inline-block font-bold">
                      {u.total_files} Files
                    </div>
                  </td>
                  <td className="px-6 py-4 w-64">
                    <div className="flex justify-between text-xs mb-2">
                      <span className="font-medium text-white">{formatBytes(u.storage_used)}</span>
                      <span className="text-omni-silver-dark">{formatBytes(u.storage_limit)}</span>
                    </div>
                    <div className="h-1.5 w-full bg-black rounded-full overflow-hidden ring-1 ring-white/10">
                      <div className="h-full bg-gradient-to-r from-omni-blue to-omni-cyan" style={{ width: `${usagePercent}%` }} />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn("px-2 py-1 text-xs rounded font-medium", u.role === 'admin' ? "bg-purple-500/20 text-purple-400" : "bg-white/10 text-white")}>
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  return (
    <div className="min-h-screen bg-omni-black flex text-omni-silver font-sans">

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-64 border-r border-white/5 bg-omni-black-lighter/50 backdrop-blur-xl hidden md:flex flex-col p-8"
      >
        <div className="mb-16">
          <h1 className="font-heading text-2xl font-black tracking-widest text-white">OMNIBOX</h1>
          <span className="text-omni-cyan text-xs tracking-[0.2em] uppercase font-semibold">Admin Protocol</span>
        </div>

        <nav className="flex-1 space-y-6">
          {[
            { id: "overview", icon: LayoutDashboard, label: "Overview" },
            { id: "users", icon: Users, label: "User Management" },
            { id: "analytics", icon: Activity, label: "Analytics" },
          ].map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "flex items-center gap-4 cursor-pointer group p-3 rounded-2xl transition-all duration-300",
                activeTab === item.id
                  ? "bg-omni-cyan/10 text-omni-cyan shadow-[inset_0_0_20px_rgba(0,240,255,0.05)] border border-omni-cyan/20"
                  : "text-omni-silver-dark hover:text-white border border-transparent"
              )}
            >
              <item.icon className={cn("w-5 h-5", activeTab === item.id ? "drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]" : "group-hover:scale-110 transition-transform")} />
              <span className="font-medium tracking-wide">{item.label}</span>
            </div>
          ))}
        </nav>

        <div className="mt-auto space-y-6 pt-8 border-t border-white/5">
          <div className="flex items-center gap-4 text-omni-silver-dark hover:text-white cursor-pointer transition-colors">
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </div>
          <div className="flex items-center gap-4 text-red-400 hover:text-red-300 cursor-pointer transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Terminate Session</span>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Topbar */}
        <header className="h-24 border-b border-white/5 flex items-center justify-between px-12 bg-omni-black/50 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 rounded-full bg-omni-cyan animate-pulse shadow-[0_0_10px_rgba(0,240,255,0.8)]" />
            <span className="text-sm font-medium tracking-widest text-omni-silver-dark uppercase">System Online</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative cursor-pointer">
              <Bell className="w-5 h-5 text-omni-silver hover:text-white transition-colors" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
            </div>
            <div className="flex items-center gap-3 bg-omni-black-lighter px-4 py-2 rounded-full border border-white/10">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-omni-blue to-omni-cyan flex items-center justify-center text-white font-bold text-xs">
                AD
              </div>
              <span className="text-sm font-medium pr-2">Admin Prime</span>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-12 space-y-8">
          <AnimatePresence mode="wait">
            {activeTab === "users" ? (
              <UserManagementView key="users" />
            ) : (
              <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                  {/* Revenue Card */}
                  <div className="glass-panel rounded-3xl p-8 col-span-1 md:col-span-2 relative overflow-hidden group hover:border-omni-cyan/30 transition-colors duration-500">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                      <DollarSign className="w-32 h-32 text-omni-cyan" />
                    </div>
                    <h3 className="text-omni-silver-dark font-medium tracking-wider mb-2">NET REVENUE (YTD)</h3>
                    <div className="font-heading text-7xl font-black text-white drop-shadow-lg tracking-tight mb-4">
                      {MOCK_REVENUE}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-400">
                      <span className="px-2 py-1 bg-green-400/10 rounded-md font-bold">+14.2%</span>
                      <span className="text-omni-silver-dark">vs last cycle</span>
                    </div>
                  </div>

                  {/* User Mgmt Card */}
                  <div className="glass-panel rounded-3xl p-8 relative overflow-hidden group hover:border-omni-blue-light transition-colors duration-500">
                    <h3 className="text-omni-silver-dark font-medium tracking-wider mb-6">ACTIVE USERS</h3>
                    <div className="font-heading text-5xl font-bold text-white mb-6">14,208</div>
                    <div className="space-y-4">
                      {[
                        { level: "Level 2 (Premium)", count: 4200, color: "bg-omni-cyan shadow-[0_0_10px_rgba(0,240,255,0.5)]" },
                        { level: "Level 1 (Standard)", count: 10008, color: "bg-omni-blue-light" }
                      ].map((tier, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={cn("w-3 h-3 rounded-full", tier.color)} />
                            <span className="text-sm text-omni-silver">{tier.level}</span>
                          </div>
                          <span className="text-sm font-bold">{tier.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                  {/* Server Metrics */}
                  <div className="glass-panel rounded-3xl p-8">
                    <h3 className="text-omni-silver-dark font-medium tracking-wider mb-8">NODE INFRASTRUCTURE</h3>
                    <div className="space-y-8">
                      {MOCK_SERVERS.map((server, i) => (
                        <div key={i} className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-white">{server.name}</span>
                            <span className={cn("text-xs px-3 py-1 rounded-full font-bold", server.status === "Optimal" ? "bg-omni-cyan/10 text-omni-cyan" : "bg-orange-500/10 text-orange-400")}>
                              {server.status}
                            </span>
                          </div>
                          <div className="h-2 w-full bg-omni-black rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${server.load}%` }}
                              transition={{ duration: 1.5, delay: 0.5 }}
                              className={cn("h-full rounded-full", server.load > 80 ? "bg-orange-400 shadow-[0_0_10px_rgba(251,146,60,0.8)]" : "bg-omni-cyan shadow-[0_0_10px_rgba(0,240,255,0.8)]")}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Activity Logs */}
                  <div className="glass-panel rounded-3xl p-8">
                    <h3 className="text-omni-silver-dark font-medium tracking-wider mb-8">SYSTEM LOGS</h3>
                    <div className="space-y-6">
                      {MOCK_LOGS.map((log) => (
                        <div key={log.id} className="flex gap-4 group cursor-default">
                          <div className="w-10 h-10 rounded-full bg-omni-black-lighter border border-white/5 flex items-center justify-center group-hover:border-omni-cyan/50 transition-colors">
                            <Activity className="w-4 h-4 text-omni-silver-dark group-hover:text-omni-cyan transition-colors" />
                          </div>
                          <div>
                            <div className="text-white font-medium mb-1">{log.action}</div>
                            <div className="text-xs text-omni-silver-dark">{log.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
