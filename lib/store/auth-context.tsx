"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase, isAuthorizedAdmin, SUPER_ADMIN_EMAIL } from "@/lib/supabase/client";

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  city: string;
  address: string;
  createdAt: string;
}

interface AuthContextType {
  user: any | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    phone: string,
    city: string
  ) => Promise<{ error?: string; requiresConfirmation?: boolean }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load session & profile on mount
  useEffect(() => {
    let isMounted = true;

    async function loadAuth() {
      setIsLoading(true);

      // 1. Try Supabase Auth
      if (supabase) {
        try {
          const { data } = await supabase.auth.getSession();
          const sessionUser = data.session?.user;

          if (sessionUser && isMounted) {
            setUser(sessionUser);
            const email = sessionUser.email || "";
            const adminStatus = await isAuthorizedAdmin(email);
            setIsAdmin(adminStatus);

            // Extract profile from metadata or local cache
            const meta = sessionUser.user_metadata || {};
            const savedProfile = localStorage.getItem(`aura_user_profile_${sessionUser.id}`);
            const cached = savedProfile ? JSON.parse(savedProfile) : null;

            const loadedProfile: UserProfile = {
              id: sessionUser.id,
              email,
              fullName: cached?.fullName || meta.full_name || email.split("@")[0],
              phone: cached?.phone || meta.phone || "",
              city: cached?.city || meta.city || "Douala",
              address: cached?.address || meta.address || "",
              createdAt: sessionUser.created_at || new Date().toISOString(),
            };

            setProfile(loadedProfile);
            try {
              localStorage.setItem(`aura_user_profile_${sessionUser.id}`, JSON.stringify(loadedProfile));
            } catch {}
            setIsLoading(false);
            return;
          }
        } catch {
          // Fall back to local storage
        }
      }

      // 2. Local Fallback for Demo / Offline
      try {
        const localUserJson = localStorage.getItem("aura_client_user_v1");
        if (localUserJson && isMounted) {
          const parsed = JSON.parse(localUserJson);
          setUser({ id: parsed.id, email: parsed.email });
          setProfile(parsed);
          setIsAdmin(parsed.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase());
        }
      } catch {}

      if (isMounted) setIsLoading(false);
    }

    loadAuth();

    // Listen for Auth State Changes in Supabase
    if (supabase) {
      const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (!isMounted) return;
        if (session?.user) {
          const u = session.user;
          setUser(u);
          const email = u.email || "";
          const adminStatus = await isAuthorizedAdmin(email);
          setIsAdmin(adminStatus);

          const meta = u.user_metadata || {};
          const savedProfile = localStorage.getItem(`aura_user_profile_${u.id}`);
          const cached = savedProfile ? JSON.parse(savedProfile) : null;

          const loadedProfile: UserProfile = {
            id: u.id,
            email,
            fullName: cached?.fullName || meta.full_name || email.split("@")[0],
            phone: cached?.phone || meta.phone || "",
            city: cached?.city || meta.city || "Douala",
            address: cached?.address || meta.address || "",
            createdAt: u.created_at || new Date().toISOString(),
          };

          setProfile(loadedProfile);
        } else {
          setUser(null);
          setProfile(null);
          setIsAdmin(false);
          try {
            localStorage.removeItem("aura_client_user_v1");
          } catch {}
        }
      });

      return () => {
        isMounted = false;
        listener.subscription.unsubscribe();
      };
    }

    return () => {
      isMounted = false;
    };
  }, []);

  // Sign In
  const signIn = async (email: string, password: string): Promise<{ error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();

    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        if (error) {
          return { error: error.message };
        }

        if (data.user) {
          setUser(data.user);
          const adminStatus = await isAuthorizedAdmin(cleanEmail);
          setIsAdmin(adminStatus);

          const meta = data.user.user_metadata || {};
          const userProf: UserProfile = {
            id: data.user.id,
            email: cleanEmail,
            fullName: meta.full_name || cleanEmail.split("@")[0],
            phone: meta.phone || "",
            city: meta.city || "Douala",
            address: meta.address || "",
            createdAt: data.user.created_at || new Date().toISOString(),
          };

          setProfile(userProf);
          try {
            localStorage.setItem(`aura_user_profile_${data.user.id}`, JSON.stringify(userProf));
            localStorage.setItem("aura_client_user_v1", JSON.stringify(userProf));
          } catch {}
        }
        return {};
      } catch (err: any) {
        return { error: err.message || "Failed to sign in." };
      }
    }

    // Local Mock Sign In
    const mockId = `usr-${Date.now()}`;
    const userProf: UserProfile = {
      id: mockId,
      email: cleanEmail,
      fullName: cleanEmail.split("@")[0],
      phone: "+237 699 00 00 00",
      city: "Douala",
      address: "Akwa Centre",
      createdAt: new Date().toISOString(),
    };
    setUser({ id: mockId, email: cleanEmail });
    setProfile(userProf);
    setIsAdmin(cleanEmail === SUPER_ADMIN_EMAIL.toLowerCase());
    try {
      localStorage.setItem("aura_client_user_v1", JSON.stringify(userProf));
    } catch {}

    return {};
  };

  // Sign Up
  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    phone: string,
    city: string
  ): Promise<{ error?: string; requiresConfirmation?: boolean }> => {
    const cleanEmail = email.trim().toLowerCase();

    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              full_name: fullName.trim(),
              phone: phone.trim(),
              city: city.trim(),
            },
          },
        });

        if (error) {
          return { error: error.message };
        }

        if (data.user) {
          const userProf: UserProfile = {
            id: data.user.id,
            email: cleanEmail,
            fullName: fullName.trim(),
            phone: phone.trim(),
            city: city.trim(),
            address: "",
            createdAt: new Date().toISOString(),
          };

          setUser(data.user);
          setProfile(userProf);
          try {
            localStorage.setItem(`aura_user_profile_${data.user.id}`, JSON.stringify(userProf));
            localStorage.setItem("aura_client_user_v1", JSON.stringify(userProf));
          } catch {}

          if (!data.session) {
            return { requiresConfirmation: true };
          }
        }
        return {};
      } catch (err: any) {
        return { error: err.message || "Registration failed." };
      }
    }

    // Local Mock Sign Up
    const mockId = `usr-${Date.now()}`;
    const userProf: UserProfile = {
      id: mockId,
      email: cleanEmail,
      fullName: fullName.trim(),
      phone: phone.trim(),
      city: city.trim(),
      address: "",
      createdAt: new Date().toISOString(),
    };
    setUser({ id: mockId, email: cleanEmail });
    setProfile(userProf);
    setIsAdmin(cleanEmail === SUPER_ADMIN_EMAIL.toLowerCase());
    try {
      localStorage.setItem("aura_client_user_v1", JSON.stringify(userProf));
    } catch {}

    return {};
  };

  // Sign Out
  const signOut = async () => {
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch {}
    }
    setUser(null);
    setProfile(null);
    setIsAdmin(false);
    try {
      localStorage.removeItem("aura_client_user_v1");
    } catch {}
  };

  // Update Profile
  const updateProfile = async (updates: Partial<UserProfile>): Promise<{ error?: string }> => {
    if (!profile) return { error: "No active user profile." };

    const updated: UserProfile = { ...profile, ...updates };
    setProfile(updated);

    try {
      if (user?.id) {
        localStorage.setItem(`aura_user_profile_${user.id}`, JSON.stringify(updated));
      }
      localStorage.setItem("aura_client_user_v1", JSON.stringify(updated));
    } catch {}

    if (supabase && user) {
      try {
        await supabase.auth.updateUser({
          data: {
            full_name: updated.fullName,
            phone: updated.phone,
            city: updated.city,
            address: updated.address,
          },
        });
      } catch {}
    }

    return {};
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        isAdmin,
        signIn,
        signUp,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
