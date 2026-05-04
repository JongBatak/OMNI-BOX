"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock } from "lucide-react";
import { cn } from "@/lib/utils";

interface R4XRobotProps {
  status: "idle" | "typing" | "weak-password" | "strong-password";
  className?: string;
}

export function R4XRobot({ status, className }: R4XRobotProps) {
  return (
    <div className={cn("relative w-64 h-64 flex items-center justify-center", className)}>
      <motion.div
        className="relative w-48 h-48 bg-omni-black-lighter rounded-[3rem] border-4 border-omni-blue-light shadow-glass flex flex-col items-center justify-center overflow-hidden"
        animate={{
          y: status === "idle" ? [0, -10, 0] : 0,
          scale: status === "strong-password" ? [1, 1.05, 1] : 1,
        }}
        transition={{
          y: { repeat: Infinity, duration: 4, ease: "easeInOut" },
          scale: { duration: 0.3 },
        }}
      >
        {/* Antenna */}
        <div className="absolute -top-12 w-2 h-12 bg-omni-blue-light rounded-t-full">
          <motion.div 
            className="absolute -top-3 -left-2 w-6 h-6 rounded-full bg-omni-cyan shadow-[0_0_15px_rgba(0,240,255,0.8)]"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        </div>

        {/* Face Screen */}
        <div className="w-40 h-24 bg-black rounded-2xl border-2 border-omni-blue relative overflow-hidden flex items-center justify-center">
          <AnimatePresence mode="wait">
            {status === "idle" && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex gap-6"
              >
                {/* Eyes */}
                <motion.div 
                  className="w-8 h-8 rounded-full bg-omni-cyan shadow-[0_0_15px_rgba(0,240,255,0.5)]"
                  animate={{ scaleY: [1, 0.1, 1] }}
                  transition={{ repeat: Infinity, duration: 5, times: [0, 0.1, 0.2] }}
                />
                <motion.div 
                  className="w-8 h-8 rounded-full bg-omni-cyan shadow-[0_0_15px_rgba(0,240,255,0.5)]"
                  animate={{ scaleY: [1, 0.1, 1] }}
                  transition={{ repeat: Infinity, duration: 5, times: [0, 0.1, 0.2] }}
                />
              </motion.div>
            )}

            {status === "typing" && (
              <motion.div
                key="typing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex gap-2 items-center"
              >
                <div className="w-6 h-6 rounded-full bg-omni-silver" />
                <div className="w-12 h-2 rounded-full bg-omni-silver" />
              </motion.div>
            )}

            {status === "weak-password" && (
              <motion.div
                key="weak"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="relative"
              >
                <Unlock className="w-12 h-12 text-red-500 animate-pulse drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
                <motion.div className="absolute -bottom-4 -right-4 w-4 h-4 bg-omni-cyan rounded-full" />
              </motion.div>
            )}

            {status === "strong-password" && (
              <motion.div
                key="strong"
                initial={{ scale: 0.5, opacity: 0, rotate: -180 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="relative"
              >
                <Lock className="w-16 h-16 text-omni-cyan drop-shadow-[0_0_20px_rgba(0,240,255,0.8)]" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Hands */}
        <motion.div
          className="absolute left-[-20px] w-12 h-24 bg-omni-blue-light rounded-full border-2 border-omni-blue origin-bottom"
          animate={{
            rotate: (status === "weak-password" || status === "strong-password") ? 130 : 0,
            y: (status === "weak-password" || status === "strong-password") ? -60 : 0,
            x: (status === "weak-password" || status === "strong-password") ? 40 : 0,
          }}
          transition={{ type: "spring", stiffness: 100 }}
        />
        <motion.div
          className="absolute right-[-20px] w-12 h-24 bg-omni-blue-light rounded-full border-2 border-omni-blue origin-bottom"
          animate={{
            rotate: (status === "weak-password" || status === "strong-password") ? -130 : 0,
            y: (status === "weak-password" || status === "strong-password") ? -60 : 0,
            x: (status === "weak-password" || status === "strong-password") ? -40 : 0,
          }}
          transition={{ type: "spring", stiffness: 100 }}
        />
      </motion.div>
    </div>
  );
}
