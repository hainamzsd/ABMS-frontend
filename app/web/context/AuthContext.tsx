import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { useStorageState } from "./SecureStorage";
interface AuthContextType {
  user: any; 
  login: (phone: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  session?: string | null;
}

const AuthContext = createContext<{
  signIn: (phone: string, password: string) => Promise<any>;
  signOut: () => Promise<any>;
  session?: string | null;
  isLoading: boolean;
}>({
  signIn: () => Promise.resolve({}),
  signOut: () => Promise.resolve({}),
  session: null,
  isLoading: false,
});
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<any>(null);
  const [[isLoading, session], setSession] = useStorageState("sessionWeb");
  const login = async (phone: string, password: string) => {
    try {
      const result = await axios.post(`http://localhost:5108/api/v1/account/loginByPhone`, { 
        phoneNumber: phone,
        password:password
       },
       {
        timeout:10000
       });
        setSession(result.data.data);
        return result;
    } catch (e) {
      if(axios.isCancel(e)){
        return e;
      }
      return {
        error: true,
        msg: e,

      };
    }
  };

  const logout = async () => {
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ signIn:login, signOut:logout, session,isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
