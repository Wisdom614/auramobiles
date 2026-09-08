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
  KeyRound,
  Terminal,
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
        const msg = error.message.toLowerCase();
        if (msg.includes("email not confirmed")) {
          setErrorMessage(
            "Email not confirmed yet. Check your inbox for the Supabase confirmation link, or confirm the user in your Supabase Auth dashboard."
          );
        } else if (msg.includes("invalid login credentials")) {
          setErrorMessage(
            "Invalid credentials. If you just registered, your Supabase project may require clicking the email confirmation link sent to your inbox first, or re-check your password."
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

      if (data.session) {
        setSuccessMessage("Account created and verified! Redirecting to dashboard...");
        setTimeout(() => {
          router.replace("/admin");
        }, 800);
        return;
      }

      setSuccessMessage(
        `Admin registered! A confirmation email was sent to ${cleanEmail}. Please click the link in your inbox (or confirm in Supabase Auth > Users) to log in.`
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
    <div className="min-h-screen bg-[#09090B] text-white flex flex-col justify-between p-4 sm:p-8 font-sans">
      
      {/* Top Header */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between pb-4 border-b border-white/10">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 bg-black border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] font-bold text-base font-mono">
            A
          </div>
          <div>
            <div className="text-xs font-black tracking-widest text-white uppercase font-mono">AURA LUXE</div>
            <div className="text-[9px] text-[#D4AF37] font-mono tracking-widest">VAULT ADMINISTRATION</div>
          </div>
        </Link>

        <Link
          href="/"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#121217] hover:bg-[#181820] text-zinc-300 hover:text-white border border-white/10 text-xs font-mono transition"
        >
          <Store className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>[ CLIENT STOREFRONT ]</span>
        </Link>
      </div>

      {/* Center Auth Terminal Card */}
      <div className="max-w-md w-full mx-auto my-10 bg-[#0E0E12] border border-white/15 p-6 sm:p-8 relative">
        {/* Viewfinder crosshairs */}
        <span className="absolute top-2 left-2 text-[#D4AF37] font-mono text-xs select-none">+</span>
        <span className="absolute top-2 right-2 text-[#D4AF37] font-mono text-xs select-none">+</span>
        <span className="absolute bottom-2 left-2 text-[#D4AF37] font-mono text-xs select-none">+</span>
        <span className="absolute bottom-2 right-2 text-[#D4AF37] font-mono text-xs select-none">+</span>

        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-black border border-[#D4AF37]/50 text-[#D4AF37] flex items-center justify-center mx-auto mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] block">
            [ SYSTEM // VAULT SECURITY TERMINAL ]
          </span>
          <h1 className="text-lg font-bold tracking-tight text-white uppercase font-sans mt-0.5">
            Boutique Operations Access
          </h1>
          <p className="text-[11px] text-zinc-400 mt-1 font-mono">
            Restricted to certified AURA administrative personnel
          </p>
        </div>

        {/* Mode Switches (Teenage Engineering Hardware Style) */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-black border border-white/15 mb-6 text-xs font-mono">
          <button
            type="button"
            onClick={() => {
              setMode("signin");
              setErrorMessage(null);
            }}
            className={`py-2 transition cursor-pointer font-bold tracking-wider ${
              mode === "signin"
                ? "bg-[#D4AF37] text-black"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            [ SIGN IN ]
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("setup");
              setErrorMessage(null);
            }}
            className={`py-2 transition cursor-pointer font-bold tracking-wider ${
              mode === "setup"
                ? "bg-[#D4AF37] text-black"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            [ FIRST SETUP ]
          </button>
        </div>

        {/* Alerts */}
        {errorMessage && (
          <div className="mb-5 p-3.5 bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-start gap-2.5 font-mono">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-5 p-3.5 bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-start gap-2.5 font-mono">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* SIGN IN FORM */}
        {mode === "signin" ? (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5 font-mono text-[11px]">
                <label className="text-zinc-300 uppercase tracking-wider">Admin Email</label>
                <button
                  type="button"
                  onClick={autofillSuperAdmin}
                  className="text-[#D4AF37] hover:underline"
                >
                  [ Fill Super Admin ]
                </button>
              </div>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="email"
                  required
                  placeholder="name@auramobiles.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black border border-white/15 pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#D4AF37] font-mono transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-300 mb-1.5">
                Security Passcode
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black border border-white/15 pl-10 pr-10 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#D4AF37] font-mono transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 gold-gradient-bg text-black font-extrabold text-xs uppercase tracking-widest hover:opacity-95 transition flex items-center justify-center gap-2 mt-2 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <span className="font-mono">AUTHENTICATING TELEMETRY...</span>
              ) : (
                <>
                  <span>AUTHENTICATE CREDENTIALS</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* FIRST TIME SETUP FORM */
          <form onSubmit={handleSetup} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5 font-mono text-[11px]">
                <label className="text-zinc-300 uppercase tracking-wider">Authorized Email</label>
                <button
                  type="button"
                  onClick={autofillSuperAdmin}
                  className="text-[#D4AF37] hover:underline"
                >
                  [ Fill Super Admin ]
                </button>
              </div>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="email"
                  required
                  placeholder={SUPER_ADMIN_EMAIL}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black border border-white/15 pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#D4AF37] font-mono transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-300 mb-1.5">
                Full Legal Name
              </label>
              <input
                type="text"
                placeholder="Wisdom Besong"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-black border border-white/15 px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#D4AF37] transition font-sans"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-300 mb-1.5">
                Create Secure Password
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black border border-white/15 pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#D4AF37] font-mono transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-300 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Repeat password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-black border border-white/15 pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#D4AF37] font-mono transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 gold-gradient-bg text-black font-extrabold text-xs uppercase tracking-widest hover:opacity-95 transition flex items-center justify-center gap-2 mt-2 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <span className="font-mono">ACTIVATING CREDENTIALS...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>SET PASSCODE & ACTIVATE</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Security Notice */}
        <div className="mt-6 pt-4 border-t border-white/10 text-[10px] font-mono text-zinc-500 text-center flex items-center justify-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>[ PROTECTED BY SUPABASE AUTH & RBAC SECURITY ]</span>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-md mx-auto text-center text-[10px] font-mono text-zinc-600 uppercase tracking-wider">
        © {new Date().getFullYear()} AURA LUXE MOBILE • ALL ADMIN ACTIONS TELEMETERED
      </div>
    </div>
  );
}
