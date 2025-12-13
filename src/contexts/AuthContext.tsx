"use client";

import React, {
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
const AuthContext = createContext<AuthContextType | null>(null);

/* =========================
   PROVIDER
========================= */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const currentUser = AuthService.getCurrentUser();
      const currentRestaurant = AuthService.getCurrentRestaurant();

      setUser(currentUser);
      setRestaurant(currentRestaurant);
    } catch (err) {
      console.error("[RTA] Erro ao carregar sessão:", err);
      setUser(null);
      setRestaurant(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /* ===== LOGIN ===== */
  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const result = await AuthService.login(email, password);
      setUser(result.user);
      setRestaurant(result.restaurant ?? null);
    } catch (err) {
      throw err instanceof Error
        ? err
        : new Error("Erro ao realizar login");
    } finally {
      setIsLoading(false);
    }
  };

  /* ===== REGISTER ===== */
  const register = async (userData: RegisterData): Promise<void> => {
    setIsLoading(true);
    try {
      const result = await AuthService.register(userData);
      setUser(result.user);
      setRestaurant(result.restaurant ?? null);
    } catch (err) {
      throw err instanceof Error
        ? err
        : new Error("Erro ao realizar cadastro");
    } finally {
      setIsLoading(false);
    }
  };

  /* ===== LOGOUT ===== */
  const logout = (): void => {
    AuthService.logout();
    setUser(null);
    setRestaurant(null);
  };

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
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
}

