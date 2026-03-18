import React, { createContext, useState, useEffect } from "react";

export interface LocalUser {
  id: number;
  email: string;
  name: string;
}

interface LocalAuthContextType {
  user: LocalUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (user: LocalUser) => void;
  logout: () => void;
}

export const LocalAuthContext = createContext<LocalAuthContextType | undefined>(undefined);

export function LocalAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<LocalUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 从 localStorage 恢复用户信息
  useEffect(() => {
    const storedUser = localStorage.getItem("localUser");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("localUser");
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData: LocalUser) => {
    setUser(userData);
    localStorage.setItem("localUser", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("localUser");
  };

  return (
    <LocalAuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </LocalAuthContext.Provider>
  );
}

export function useLocalAuth() {
  const context = React.useContext(LocalAuthContext);
  if (context === undefined) {
    throw new Error("useLocalAuth must be used within LocalAuthProvider");
  }
  return context;
}
