"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, User, Delete } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { loginAdmin } from "./actions";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleKeypadPress = (num: string) => {
    if (password.length < 6) {
      setPassword((prev) => prev + num);
    }
  };

  const handleKeypadDelete = () => {
    setPassword((prev) => prev.slice(0, -1));
  };

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await loginAdmin(email, password);

    if (res.error) {
      setError(res.error);
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-5">
      <div className="relative group">
        <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40 transition-colors group-focus-within:text-accent" />
        <input
          type="text"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Nom d'utilisateur"
          className="w-full rounded-2xl border border-white/10 dark:border-white/10 bg-black/5 dark:bg-white/5 pl-12 pr-4 py-4 text-sm font-medium text-foreground placeholder:text-foreground/30 focus:border-accent focus:bg-background focus:ring-1 focus:ring-accent focus:outline-none transition-all"
        />
      </div>

      <div className="relative group">
        <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40 transition-colors group-focus-within:text-accent" />
        <input
          type={showPassword ? "text" : "password"}
          required
          readOnly
          value={password}
          placeholder="Code PIN"
          className="w-full rounded-2xl border border-white/10 dark:border-white/10 bg-black/5 dark:bg-white/5 pl-12 pr-12 py-4 text-sm font-bold tracking-[0.3em] text-foreground placeholder:text-foreground/30 placeholder:tracking-normal placeholder:font-medium focus:border-accent focus:bg-background focus:ring-1 focus:ring-accent focus:outline-none transition-all cursor-default"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-accent transition-colors"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {/* Clavier visuel premium */}
      <div className="mt-2 mb-2 select-none">
        <div className="grid grid-cols-3 gap-3">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleKeypadPress(num)}
              className="flex h-14 items-center justify-center rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-xl font-medium text-foreground/80 hover:bg-accent hover:text-white hover:border-accent hover:shadow-[0_0_15px_rgba(109,93,252,0.4)] transition-all duration-200 active:scale-90"
            >
              {num}
            </button>
          ))}
          <div className="flex items-center justify-center"></div>
          <button
            type="button"
            onClick={() => handleKeypadPress("0")}
            className="flex h-14 items-center justify-center rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-xl font-medium text-foreground/80 hover:bg-accent hover:text-white hover:border-accent hover:shadow-[0_0_15px_rgba(109,93,252,0.4)] transition-all duration-200 active:scale-90"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleKeypadDelete}
            className="flex h-14 items-center justify-center rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-xl font-medium text-foreground/60 hover:bg-red-50 hover:text-white hover:border-red-500 hover:bg-red-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all duration-200 active:scale-90"
          >
            <Delete size={22} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.p 
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            className="text-sm text-red-500 text-center font-medium bg-red-500/10 py-3 rounded-xl border border-red-500/20"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <button
        type="submit"
        disabled={loading || password.length === 0 || email.length === 0}
        className="mt-2 flex w-full items-center justify-center rounded-2xl bg-accent px-6 py-4 text-sm font-semibold text-white transition-all hover:bg-accent/90 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none shadow-[0_0_20px_rgba(109,93,252,0.3)] hover:shadow-[0_0_30px_rgba(109,93,252,0.5)]"
      >
        {loading ? (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
        ) : (
          "Déverrouiller"
        )}
      </button>
    </form>
  );
}
