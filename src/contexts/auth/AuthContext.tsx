import { createContext, useContext } from "react";
import type { Auth } from "./type";

export const AuthContext = createContext<Auth | undefined>(undefined);

export function useAuth(): Auth {
  const auth = useContext(AuthContext);

  if (auth === undefined) {
    throw new Error("useAuth 必须在 AuthContext 内部使用");
  }

  return auth;
}
