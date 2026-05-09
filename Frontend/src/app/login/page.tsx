"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Lock, ArrowRight, Loader2, AlertTriangle } from "lucide-react";
import { StickerInput } from "@/components/ui/StickerInput";
import { GlossyButton } from "@/components/ui/GlossyButton";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated, redirect
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [authLoading, isAuthenticated, router]);

  if (!authLoading && isAuthenticated) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await login(email, password);

    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.error ?? "Login failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 sm:p-8">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-omni-cyan/10 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute top-[60%] right-[0%] w-[40%] h-[60%] bg-omni-blue-light/20 blur-[150px] rounded-full mix-blend-screen" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md glass-panel p-8 sm:p-12 rounded-[2.5rem] relative z-10"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="font-heading text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-omni-silver to-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] mb-2">
            ACCESS OMNIBOX
          </h1>
          <p className="text-omni-silver-dark font-sans">Enter the next dimension of storage.</p>
        </motion.div>

        {/* Error Banner */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="mb-6 flex items-start gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm"
          >
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-400" />
            <span>{error}</span>
          </motion.div>
        )}

        <motion.form
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.15, delayChildren: 0.3 }
            }
          }}
          className="flex flex-col gap-6"
          onSubmit={handleSubmit}
        >
          <motion.div variants={{ hidden: { x: -20, opacity: 0 }, visible: { x: 0, opacity: 1 } }}>
            <StickerInput
              label="Username or Email"
              type="email"
              placeholder="commander@omnibox.io"
              icon={<User className="w-5 h-5" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </motion.div>

          <motion.div variants={{ hidden: { x: -20, opacity: 0 }, visible: { x: 0, opacity: 1 } }}>
            <StickerInput
              label="Secure Password"
              type="password"
              placeholder="••••••••"
              icon={<Lock className="w-5 h-5" />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            <div className="flex justify-end mt-2">
              <a href="#" className="text-sm text-omni-cyan hover:underline hover:text-white transition-colors">
                Forgot access codes?
              </a>
            </div>
          </motion.div>

          <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }} className="mt-4">
            <GlossyButton
              className="w-full"
              glowColor="cyan"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Connecting...
                </>
              ) : (
                <>
                  Initialize Uplink <ArrowRight className="w-5 h-5" />
                </>
              )}
            </GlossyButton>
          </motion.div>
        </motion.form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center text-omni-silver-dark"
        >
          New to the network?{" "}
          <a href="/register" className="text-white hover:text-omni-cyan font-semibold transition-colors">
            Request Access
          </a>
        </motion.div>
      </motion.div>
    </main>
  );
}
