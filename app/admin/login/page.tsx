"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Store,
  Sparkles,
  KeyRound,
} from "lucide-react";
import { supabase, isAuthorizedAdmin, SUPER_ADMIN_EMAIL } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "setup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Check if already signed in
  useEffect(() => {
    async function checkSession() {
      if (!supabase) return;
      const { data } = await supabase.auth.getSession();
      if (data.session?.user?.email) {
        const authorized = await isAuthorizedAdmin(data.session.user.email);
        if (authorized) {
          router.replace("/admin");
        }
      }
    }
    checkSession();
  }, [router]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    if (!supabase) {
      setErrorMessage("Supabase is not configured in .env. Please check credentials.");
      setIsLoading(false);
      return;
    }

    try {
      const cleanEmail = email.trim().toLowerCase();
      // Verify authorization before or with sign in
      const authorized = await isAuthorizedAdmin(cleanEmail);
      if (!authorized) {
        setErrorMessage("Access Denied: This email does not have boutique administrator privileges.");
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        // Helpful message if user doesn't exist yet in Supabase Auth
        if (error.message.toLowerCase().includes("invalid login credentials")) {
          setErrorMessage(
            "Invalid credentials. If this is your first time logging in, please switch to the 'First-Time Setup' tab to register your password."
          );
        } else {
          setErrorMessage(error.message);
        }
        setIsLoading(false);
        return;
      }

      if (data.user) {
        setSuccessMessage("Authentication verified. Redirecting to boutique control center...");
        setTimeout(() => {
          router.replace("/admin");
        }, 800);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to authenticate.");
      setIsLoading(false);
    }
  };

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      setIsLoading(false);
      return;
    }

    if (!supabase) {
      setErrorMessage("Supabase is not configured in .env");
      setIsLoading(false);
      return;
    }

    try {
      const cleanEmail = email.trim().toLowerCase();
      const authorized = await isAuthorizedAdmin(cleanEmail);
      if (!authorized) {
        setErrorMessage(
          "Authorization Error: Only approved administrator emails can register. Contact the boutique owner."
        );
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: fullName.trim() || "Boutique Administrator",
            role: cleanEmail === SUPER_ADMIN_EMAIL.toLowerCase() ? "super_admin" : "admin",
          },
        },
      });

      if (error) {
        setErrorMessage(error.message);
        setIsLoading(false);
        return;
      }

      setSuccessMessage(
        "Admin account created successfully! You may now sign in or check your email if confirmation is enabled in your Supabase project."
      );
      setMode("signin");
      setIsLoading(false);
    } catch (err: any) {
      setErrorMessage(err.message || "Registration failed.");
      setIsLoading(false);
    }
  };

  const autofillSuperAdmin = () => {
    setEmail(SUPER_ADMIN_EMAIL);
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-white flex flex-col justify-between p-4 sm:p-8">
      {/* Top Header */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-[#17171F] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] font-bold text-lg group-hover:border-[#D4AF37] transition">
            A
          </div>
          <div>
            <div className="text-sm font-bold tracking-widest text-white uppercase">AURA LUXE</div>
            <div className="text-[10px] text-[#D4AF37] font-mono tracking-widest">MOBILE BOUTIQUE</div>
          </div>
        </Link>

        <Link
          href="/"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 text-xs font-medium transition"
        >
          <Store className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Client Storefront</span>
        </Link>
      </div>

      {/* Center Auth Card */}
      <div className="max-w-md w-full mx-auto my-12 bg-[#121217] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[#17171F] border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#D4AF37]/10">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-bold tracking-wide text-white">Boutique Administration</h1>
          <p className="text-xs text-white/50 mt-1">
            Restricted access for certified AURA Luxe operations personnel
          </p>
        </div>

        {/* Mode Tabs */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-black/40 border border-white/10 rounded-xl mb-6 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setMode("signin");
              setErrorMessage(null);
            }}
            className={`py-2 rounded-lg transition ${
              mode === "signin"
                ? "bg-[#D4AF37] text-black shadow font-bold"
                : "text-white/60 hover:text-white"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("setup");
              setErrorMessage(null);
            }}
            className={`py-2 rounded-lg transition ${
              mode === "setup"
                ? "bg-[#D4AF37] text-black shadow font-bold"
                : "text-white/60 hover:text-white"
            }`}
          >
            First-Time Setup
          </button>
        </div>

        {/* Alerts */}
        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-start gap-2.5 animate-fade-in">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-5 p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-start gap-2.5 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* SIGN IN FORM */}
        {mode === "signin" ? (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-white/80">Admin Email</label>
                <button
                  type="button"
                  onClick={autofillSuperAdmin}
                  className="text-[11px] text-[#D4AF37] hover:underline"
                >
                  Use Super Admin Email
                </button>
              </div>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="email"
                  required
                  placeholder="name@auramobiles.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#17171F] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/80 mb-1.5">Security Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#17171F] border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F26] text-black font-bold text-sm hover:brightness-110 transition shadow-lg flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Access Dashboard</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* FIRST TIME SETUP FORM */
          <form onSubmit={handleSetup} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-white/80">Authorized Admin Email</label>
                <button
                  type="button"
                  onClick={autofillSuperAdmin}
                  className="text-[11px] text-[#D4AF37] hover:underline"
                >
                  Use Super Admin Email
                </button>
              </div>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="email"
                  required
                  placeholder={SUPER_ADMIN_EMAIL}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#17171F] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/80 mb-1.5">Your Full Name</label>
              <input
                type="text"
                placeholder="Wisdom Besong"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-[#17171F] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/80 mb-1.5">Create Secure Password</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#17171F] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/80 mb-1.5">Confirm Password</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Repeat password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#17171F] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-[#D4AF37] text-black font-bold text-sm hover:bg-[#F3E5AB] transition shadow-lg flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              {isLoading ? (
                <span>Registering credentials...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Set Password & Activate</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Security Notice */}
        <div className="mt-6 pt-5 border-t border-white/5 text-[11px] text-white/40 text-center flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
          <span>Protected by Supabase Auth & Multi-Admin RBAC</span>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-md mx-auto text-center text-xs text-white/30">
        © {new Date().getFullYear()} AURA Luxe Mobile Boutique Ltd. All administrative activities are logged.
      </div>
    </div>
  );
}
