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
      router.push(redirectTarget);
    }
  };

  // Handle Sign Up Submit
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (signUpPassword.length < 6) {
      setErrorMessage("Password must contain at least 6 characters.");
      return;
    }

    if (signUpPassword !== signUpConfirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    const res = await signUp(
      signUpEmail,
      signUpPassword,
      signUpName.trim(),
      signUpPhone.trim(),
      signUpCity
    );

    setIsLoading(false);

    if (res.error) {
      setErrorMessage(res.error);
    } else {
      setSuccessMessage(
        "Account created successfully. Logging you into your boutique session..."
      );
      setTimeout(() => {
        router.push(redirectTarget);
      }, 1200);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] flex flex-col justify-center py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8 relative z-10">
        <Link href="/" className="inline-flex flex-col items-center gap-2 group">
          <div className="w-12 h-12 rounded-none bg-black border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] font-mono font-black text-xl shadow-xl">
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
        <p className="mt-2 text-xs text-zinc-400 font-mono">
          [ ACCESS ORDERS • LIVE TRACKING • VIP GUARANTEES ]
        </p>
      </div>

      {/* Auth Card */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-[#0E0E12] border border-white/10 p-6 sm:p-8 shadow-2xl relative rounded-none">
          {/* Corner crosshairs */}
          <span className="absolute -top-1 -left-1 text-[#D4AF37] font-mono text-[9px]">+</span>
          <span className="absolute -top-1 -right-1 text-[#D4AF37] font-mono text-[9px]">+</span>
          <span className="absolute -bottom-1 -left-1 text-[#D4AF37] font-mono text-[9px]">+</span>
          <span className="absolute -bottom-1 -right-1 text-[#D4AF37] font-mono text-[9px]">+</span>

          {/* Tab Switcher */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-black border border-white/10 mb-6 font-mono text-xs">
            <button
              onClick={() => {
                setTab("signin");
                setErrorMessage(null);
              }}
              className={`py-2 text-xs font-bold uppercase tracking-wider transition-all rounded-none cursor-pointer ${
                tab === "signin"
                  ? "bg-[#D4AF37] text-black"
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
              className={`py-2 text-xs font-bold uppercase tracking-wider transition-all rounded-none cursor-pointer ${
                tab === "signup"
                  ? "bg-[#D4AF37] text-black"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Feedback Messages */}
          {errorMessage && (
            <div className="mb-5 p-3.5 bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-start gap-2.5 animate-in fade-in rounded-none">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 p-3.5 bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-start gap-2.5 animate-in fade-in rounded-none">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* TAB 1: SIGN IN */}
          {tab === "signin" && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5">
                  [ EMAIL ADDRESS ]
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="email"
                    required
                    placeholder="client@example.com"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    className="w-full bg-[#121217] border border-white/15 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white focus:border-[#D4AF37] focus:outline-none transition-colors rounded-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5">
                  [ PASSWORD ]
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type={showSignInPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    className="w-full bg-[#121217] border border-white/15 pl-10 pr-10 py-2.5 text-xs sm:text-sm text-white focus:border-[#D4AF37] focus:outline-none transition-colors rounded-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignInPassword(!showSignInPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 p-1 cursor-pointer"
                  >
                    {showSignInPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3.5 px-4 gold-gradient-bg text-black font-mono font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-amber-500/15 hover:opacity-95 transition-all disabled:opacity-50 rounded-none cursor-pointer"
              >
                {isLoading ? (
                  <span>AUTHENTICATING...</span>
                ) : (
                  <>
                    <span>SIGN IN TO BOUTIQUE</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* TAB 2: CREATE ACCOUNT */}
          {tab === "signup" && (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5">
                  [ FULL NAME * ]
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Roland Ebong"
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    className="w-full bg-[#121217] border border-white/15 pl-10 pr-4 py-2 text-xs sm:text-sm text-white focus:border-[#D4AF37] focus:outline-none transition-colors rounded-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5">
                    [ EMAIL * ]
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="email"
                      required
                      placeholder="client@mail.com"
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      className="w-full bg-[#121217] border border-white/15 pl-10 pr-3 py-2 text-xs sm:text-sm text-white focus:border-[#D4AF37] focus:outline-none transition-colors rounded-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5">
                    [ WHATSAPP * ]
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="tel"
                      required
                      placeholder="+237 6..."
                      value={signUpPhone}
                      onChange={(e) => setSignUpPhone(e.target.value)}
                      className="w-full bg-[#121217] border border-white/15 pl-10 pr-3 py-2 text-xs sm:text-sm text-white focus:border-[#D4AF37] focus:outline-none transition-colors font-mono rounded-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5">
                  [ DELIVERY HUB ]
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <select
                    value={signUpCity}
                    onChange={(e) => setSignUpCity(e.target.value)}
                    className="w-full bg-[#121217] border border-white/15 pl-10 pr-4 py-2 text-xs sm:text-sm text-white focus:border-[#D4AF37] focus:outline-none transition-colors rounded-none font-sans"
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
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5">
                    [ PASSWORD * ]
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                      type={showSignUpPassword ? "text" : "password"}
                      required
                      placeholder="Min 6 chars"
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      className="w-full bg-[#121217] border border-white/15 pl-10 pr-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none rounded-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5">
                    [ CONFIRM * ]
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                      type={showSignUpPassword ? "text" : "password"}
                      required
                      placeholder="Repeat"
                      value={signUpConfirmPassword}
                      onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                      className="w-full bg-[#121217] border border-white/15 pl-10 pr-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none rounded-none font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 bg-black border border-white/10 text-[11px] font-mono text-zinc-400 space-y-1 rounded-none">
                <div className="flex items-center gap-1.5 text-[#D4AF37] font-bold uppercase">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>AURA VIP Privilege Benefits</span>
                </div>
                <p className="font-sans text-zinc-400">
                  Automatic 12-month warranty logging, order tracking updates, and preferential pricing on trade-in swaps.
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 gold-gradient-bg text-black font-mono font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-amber-500/15 hover:opacity-95 transition-all disabled:opacity-50 rounded-none cursor-pointer"
              >
                {isLoading ? (
                  <span>CREATING ACCOUNT...</span>
                ) : (
                  <>
                    <span>CREATE MY AURA ACCOUNT</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Storefront return */}
          <div className="mt-6 pt-4 border-t border-white/10 text-center font-mono text-xs">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors uppercase tracking-wider"
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
        <div className="min-h-screen bg-[#09090B] flex items-center justify-center text-white font-mono text-xs">
          <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent animate-spin rounded-none" />
        </div>
      }
    >
      <AccountLoginContent />
    </Suspense>
  );
}
