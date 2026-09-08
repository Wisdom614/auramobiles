"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  User,
  Lock,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  Store,
} from "lucide-react";
import { useAuth } from "@/lib/store/auth-context";

function AccountLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "/account";

  const { user, signIn, signUp } = useAuth();

  const [tab, setTab] = useState<"signin" | "signup">("signin");

  // Sign In State
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [showSignInPassword, setShowSignInPassword] = useState(false);

  // Sign Up State
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPhone, setSignUpPhone] = useState("+237 ");
  const [signUpCity, setSignUpCity] = useState("Douala");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState("");
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);

  // Status & Alerts
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // If already logged in, redirect immediately
  React.useEffect(() => {
    if (user) {
      router.replace(redirectTarget);
    }
  }, [user, redirectTarget, router]);

  // Handle Sign In Submit
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    const res = await signIn(signInEmail, signInPassword);
    setIsLoading(false);

    if (res.error) {
      setErrorMessage(res.error);
    } else {
      setSuccessMessage("Signed in successfully! Opening your account...");
      setTimeout(() => {
        router.replace(redirectTarget);
      }, 500);
    }
  };

  // Handle Sign Up Submit
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (signUpPassword !== signUpConfirmPassword) {
      setErrorMessage("Passwords do not match. Please re-enter.");
      return;
    }

    if (signUpPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);

    const res = await signUp(
      signUpEmail,
      signUpPassword,
      signUpName,
      signUpPhone,
      signUpCity
    );
    setIsLoading(false);

    if (res.error) {
      setErrorMessage(res.error);
    } else if (res.requiresConfirmation) {
      setSuccessMessage(
        "Account created! Please check your email inbox to confirm your registration, then sign in."
      );
      setTab("signin");
      setSignInEmail(signUpEmail);
    } else {
      setSuccessMessage("Account created successfully! Welcome to AURA Luxe.");
      setTimeout(() => {
        router.replace(redirectTarget);
      }, 600);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle Luxury Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8 relative z-10">
        <Link href="/" className="inline-flex flex-col items-center gap-2 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1A1A24] to-[#0F0F14] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] font-black text-xl shadow-xl shadow-amber-500/10 group-hover:scale-105 transition-transform">
            A
          </div>
          <div>
            <span className="text-xl font-black tracking-[0.25em] text-white uppercase block">
              AURA
            </span>
            <span className="text-[10px] tracking-[0.35em] text-[#D4AF37] uppercase font-mono font-semibold">
              LUXE MOBILE ACCOUNT
            </span>
          </div>
        </Link>
        <p className="mt-2 text-xs text-zinc-400">
          Access your orders, concierge live tracking, and VIP member guarantees.
        </p>
      </div>

      {/* Auth Card */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-[#121217] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          {/* Tab Switcher */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-black/50 border border-white/5 rounded-xl mb-6">
            <button
              onClick={() => {
                setTab("signin");
                setErrorMessage(null);
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                tab === "signin"
                  ? "bg-[#D4AF37] text-black shadow-md shadow-amber-500/15"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setTab("signup");
                setErrorMessage(null);
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                tab === "signup"
                  ? "bg-[#D4AF37] text-black shadow-md shadow-amber-500/15"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Feedback Messages */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-950/60 border border-red-500/30 text-red-200 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-200 text-xs flex items-start gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* TAB 1: SIGN IN */}
          {tab === "signin" && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="email"
                    required
                    placeholder="client@example.com"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    className="w-full bg-[#181820] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white focus:border-[#D4AF37] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type={showSignInPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    className="w-full bg-[#181820] border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-white focus:border-[#D4AF37] focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignInPassword(!showSignInPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 p-1"
                  >
                    {showSignInPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 rounded-xl gold-gradient-bg text-black font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/15 hover:opacity-95 transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Sign In to Boutique</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* TAB 2: CREATE ACCOUNT */}
          {tab === "signup" && (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Roland Ebong"
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    className="w-full bg-[#181820] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white focus:border-[#D4AF37] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="email"
                      required
                      placeholder="client@mail.com"
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      className="w-full bg-[#181820] border border-white/10 rounded-xl pl-10 pr-3 py-2 text-xs sm:text-sm text-white focus:border-[#D4AF37] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Phone (WhatsApp) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="tel"
                      required
                      placeholder="+237 6..."
                      value={signUpPhone}
                      onChange={(e) => setSignUpPhone(e.target.value)}
                      className="w-full bg-[#181820] border border-white/10 rounded-xl pl-10 pr-3 py-2 text-xs sm:text-sm text-white focus:border-[#D4AF37] focus:outline-none transition-colors font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Primary Delivery City
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <select
                    value={signUpCity}
                    onChange={(e) => setSignUpCity(e.target.value)}
                    className="w-full bg-[#181820] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white focus:border-[#D4AF37] focus:outline-none transition-colors"
                  >
                    <option value="Douala">Douala (Same-Day Handover)</option>
                    <option value="Yaoundé">Yaoundé (Same-Day Handover)</option>
                    <option value="Bafoussam">Bafoussam (Express 24h)</option>
                    <option value="Kribi">Kribi (Express 24h)</option>
                    <option value="Limbe/Buea">Limbe / Buea</option>
                    <option value="Garoua">Garoua / North Region</option>
                    <option value="Bamenda">Bamenda</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                      type={showSignUpPassword ? "text" : "password"}
                      required
                      placeholder="Min 6 chars"
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      className="w-full bg-[#181820] border border-white/10 rounded-xl pl-10 pr-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                      type={showSignUpPassword ? "text" : "password"}
                      required
                      placeholder="Repeat password"
                      value={signUpConfirmPassword}
                      onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                      className="w-full bg-[#181820] border border-white/10 rounded-xl pl-10 pr-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-[11px] text-zinc-400 space-y-1">
                <div className="flex items-center gap-1.5 text-amber-300 font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>AURA Privilege Benefits</span>
                </div>
                <p>
                  Automatic warranty logging, live order notifications, and preferential pricing on trade-in swaps.
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl gold-gradient-bg text-black font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/15 hover:opacity-95 transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Creating Account...</span>
                ) : (
                  <>
                    <span>Create My AURA Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Storefront return */}
          <div className="mt-6 pt-4 border-t border-white/10 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
            >
              <Store className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Return to Storefront</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AccountLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#09090B] flex items-center justify-center text-white">
          <div className="w-8 h-8 rounded-full border-2 border-[#D4AF37] border-t-transparent animate-spin" />
        </div>
      }
    >
      <AccountLoginContent />
    </Suspense>
  );
}
