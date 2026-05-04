"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Lock, Shield } from "lucide-react";
import { StickerInput } from "@/components/ui/StickerInput";
import { GlossyButton } from "@/components/ui/GlossyButton";
import { R4XRobot } from "@/components/ui/R4XRobot";

type RobotStatus = "idle" | "typing" | "weak-password" | "strong-password";

export default function RegisterPage() {
  const [robotStatus, setRobotStatus] = useState<RobotStatus>("idle");
  const [password, setPassword] = useState("");

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    if (val.length === 0) {
      setRobotStatus("idle");
    } else if (val.length < 8) {
      setRobotStatus("weak-password");
    } else {
      setRobotStatus("strong-password");
    }
  };

  const handleFocus = (field: string) => {
    if (field === "password") {
      setRobotStatus(password.length >= 8 ? "strong-password" : "weak-password");
    } else {
      setRobotStatus("typing");
    }
  };

  const handleBlur = () => {
    setRobotStatus("idle");
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 sm:p-8 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[60%] w-[50%] h-[50%] bg-omni-blue-light/30 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute top-[60%] left-[10%] w-[30%] h-[40%] bg-omni-cyan/20 blur-[100px] rounded-full mix-blend-screen" />
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* Left Side - The Robot */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:flex flex-col items-center justify-center order-2 lg:order-1"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-omni-cyan/10 blur-3xl rounded-full scale-150 animate-pulse-cyan" />
            <R4XRobot status={robotStatus} />
          </div>
          <div className="mt-12 text-center max-w-sm">
            <h2 className="font-heading text-2xl font-bold text-white mb-2">R4X Security Protocol</h2>
            <p className="text-omni-silver-dark text-sm">
              I am monitoring your credentials. Please ensure your password meets the Omniverse security standards.
            </p>
          </div>
        </motion.div>

        {/* Right Side - The Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="glass-panel p-8 sm:p-12 rounded-[2.5rem] order-1 lg:order-2 w-full max-w-md mx-auto"
        >
          <div className="text-left mb-10">
            <h1 className="font-heading text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-omni-silver mb-2">
              JOIN THE OMNIVERSE
            </h1>
            <p className="text-omni-silver-dark font-sans">Establish your identity to begin.</p>
          </div>

          <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
            <StickerInput
              label="Commander Name"
              type="text"
              placeholder="John Doe"
              icon={<User className="w-5 h-5" />}
              onFocus={() => handleFocus("name")}
              onBlur={handleBlur}
            />

            <StickerInput
              label="Comms Channel (Email)"
              type="email"
              placeholder="commander@omnibox.io"
              icon={<Mail className="w-5 h-5" />}
              onFocus={() => handleFocus("email")}
              onBlur={handleBlur}
            />

            <StickerInput
              label="Secure Password"
              type="password"
              placeholder="••••••••"
              icon={<Lock className="w-5 h-5" />}
              value={password}
              onChange={handlePasswordChange}
              onFocus={() => handleFocus("password")}
              onBlur={handleBlur}
            />

            <div className="mt-4">
              <GlossyButton className="w-full" glowColor="blue" type="submit">
                Initialize Account <Shield className="w-5 h-5 ml-2" />
              </GlossyButton>
            </div>
          </form>

          <div className="mt-8 text-center text-omni-silver-dark text-sm">
            Already have clearance?{" "}
            <a href="/login" className="text-white hover:text-omni-blue-light font-semibold transition-colors">
              Access Terminal
            </a>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
