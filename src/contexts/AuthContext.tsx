"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { AuthService, User, Restaurant } from "@/lib/auth";

/* =========================
   TIPOS
========================= */
interface RegisterData {
  name: string;
  email: string;
  password: string;
  type: "user" | "business";
  restaurantData?: {
    name: string;
    description: string;
    address: string;
    phone: string;
    plan: "free" | "pro";
  };
}

interface AuthContextType {
  user: User | null;
  restaurant: Restaurant | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

/* =========================
   CONTEXTO
========================= */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* =========================
   PROVIDER
========================= */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /* ✅ RODA APENAS NO BROWSER */
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const currentUser = AuthService.getCurrentUser();
      const currentRestaurant = AuthService.getCurrentRestaurant();

      setUser(currentUser);
      setRestaurant(currentRestaurant);
    } catch (error) {
      console.error("[RTA] Falha ao restaurar sessão:", error);
      setUser(null);
      setRestaurant(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /* ===== LOGIN ===== */
  async function login(email: string, password: string) {
    setIsLoading(true);
    try {
      const result = await AuthService.login(email, password);
      setUser(result.user);
      setRestaurant(result.restaurant ?? null);
    } finally {
      setIsLoading(false);
    }
  }

  /* ===== REGISTER ===== */
  async function register(userData: RegisterData) {
    setIsLoading(true);
    try {
      const result = await AuthService.register(userData);
      setUser(result.user);
      setRestaurant(result.restaurant ?? null);
    } finally {
      setIsLoading(false);
    }
  }

  /* ===== LOGOUT ===== */
  function logout() {
    if (typeof window !== "undefined") {
      AuthService.logout();
    }
    setUser(null);
    setRestaurant(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        restaurant,
        login,
        register,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* =========================
   HOOK
========================= */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
  }
  return context;
}

