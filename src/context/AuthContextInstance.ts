import { createContext } from "react";
import { AuthContextType } from "../types/global/user";



export const AuthContext = createContext<AuthContextType | undefined>(undefined);
