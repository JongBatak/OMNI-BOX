"use client";

import { motion } from "framer-motion";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface StickerInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
}

export const StickerInput = forwardRef<HTMLInputElement, StickerInputProps>(
  ({ label, className, icon, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2 w-full">
        <label className="text-omni-silver-dark font-sans text-sm uppercase tracking-widest font-semibold ml-2">
          {label}
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-omni-silver-dark group-focus-within:text-omni-cyan transition-colors">
            {icon}
          </div>
          <input
            ref={ref}
            className={cn(
              "w-full bg-omni-black-lighter border-2 border-omni-blue-light rounded-2xl py-4 pr-4 transition-all duration-300",
              "text-omni-silver font-sans text-lg placeholder:text-omni-silver-dark/50",
              "focus:outline-none focus:border-omni-cyan focus:shadow-sticker",
              icon ? "pl-12" : "pl-4",
              className
            )}
            {...props}
          />
        </div>
      </div>
    );
  }
);
StickerInput.displayName = "StickerInput";
