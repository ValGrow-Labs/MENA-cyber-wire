"use client";

import { createContext, useContext } from "react";

export interface AdminContextType {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatarUrl?: string;
  } | null;
  notify: (text: string, type?: "success" | "error" | "info" | "warning") => void;
  logout: () => void;
}

export const AdminContext = createContext<AdminContextType>({
  user: null,
  notify: () => {},
  logout: () => {},
});

export const useAdmin = () => useContext(AdminContext);
