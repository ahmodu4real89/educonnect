"use client";
import { storage } from "@/common/lib";
import { useRouter } from "next/navigation";
import { createContext, useContext, useState, ReactNode } from "react";
import { logout as signout } from "@/server/actions/auth.actions"

interface User {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string | null | undefined;
  level: string;
  gender: string;
  phoneNumber?: string | null | undefined;
  role: string;
}

interface UserContextType {
  user: User | null;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [user] = useState<User | null>(storage.get('user'));

  const logout = async () => {
    await signout()
    storage.set('user', '')
    router.push("/login");
  };
  return <UserContext.Provider value={{ user, logout }}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used inside UserProvider");
  return context;
};
