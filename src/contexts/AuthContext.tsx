"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthService, User, Restaurant } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  restaurant: Restaurant | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se há usuário logado no localStorage
    const currentUser = AuthService.getCurrentUser();
    const currentRestaurant = AuthService.getCurrentRestaurant();
    
    setUser(currentUser);
    setRestaurant(currentRestaurant);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await AuthService.login(email, password);
      setUser(result.user);
      setRestaurant(result.restaurant || null);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any) => {
    setIsLoading(true);
    try {
      const result = await AuthService.register(userData);
      setUser(result.user);
      setRestaurant(result.restaurant || null);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
    setRestaurant(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      restaurant,
      login,
      register,
      logout,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}