"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlossyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  glowColor?: "cyan" | "blue" | "white";
}

export function GlossyButton({
  children,
  className,
  glowColor = "cyan",
  ...props
}: GlossyButtonProps) {
  const glowMap = {
    cyan: "shadow-sticker hover:shadow-sticker-hover active:shadow-sticker-active border-omni-cyan",
    blue: "shadow-[0_4px_0px_0px_rgba(11,26,56,0.4),0_0_20px_rgba(11,26,56,0.2),inset_0_2px_4px_rgba(255,255,255,0.2)] hover:shadow-[0_6px_0px_0px_rgba(11,26,56,0.5),0_0_25px_rgba(11,26,56,0.3),inset_0_3px_5px_rgba(255,255,255,0.3)] border-omni-blue-light",
    white: "shadow-[0_4px_0px_0px_rgba(255,255,255,0.2),0_0_20px_rgba(255,255,255,0.1),inset_0_2px_4px_rgba(255,255,255,0.3)] hover:shadow-[0_6px_0px_0px_rgba(255,255,255,0.3),0_0_25px_rgba(255,255,255,0.2),inset_0_3px_5px_rgba(255,255,255,0.4)] border-omni-silver"
  };

  return (
    <motion.button
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ y: 2, scale: 0.98 }}
      className={cn(
        "relative px-8 py-4 rounded-full font-heading font-bold text-lg tracking-wider uppercase transition-all duration-300",
        "bg-omni-black-lighter border-2 text-omni-silver",
        "overflow-hidden group",
        glowMap[glowColor],
        className
      )}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
      {/* Liquid shine effect */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-[shimmer_1.5s_infinite] skew-x-[-20deg]" />
    </motion.button>
  );
}
