import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import SecureStore from "expo-secure-store";
import { useStorageState } from "./useStorageState";
import { useRouter } from "expo-router";
import { Slot } from "expo-router";
import { SafeAreaView } from "react-native";
interface AuthProps {
  authState?: { token: string | null; authenticated: boolean | null };
  onLogin?: (phone: string, password: string) => Promise<any>;
  onLogout?: () => Promise<any>;
}

const TOKEN_KEY = "";
export const API_URL = "https://api.developbetterapps.com";

const AuthContext = createContext<{
  signIn: (phone: string, password: string) => Promise<any>;
  signOut: () => Promise<any>;
  authState: { token: string | null; authenticated: boolean | null };
  session?: string | null;
  isLoading: boolean;
}>({
  signIn: () => Promise.resolve({}),
  signOut: () => Promise.resolve({}),
  authState: { token: null, authenticated: null },
  session: null,
  isLoading: false,
});

export function useSession() {
  const value = useContext(AuthContext);
  return value;
}

export const AuthProvider = ({ children }: any) => {
  const [authState, setAuthState] = useState<{
    token: string | null;
    authenticated: boolean | null;
  }>({
    token: null,
    authenticated: null,
  });
  const [[isLoading, session], setSession] = useStorageState("session");
  // useEffect(() => {
  //   const loadToken = async () => {
  //     const token = await SecureStore.getItemAsync(TOKEN_KEY);
  //     console.log("stored:", token);
  //     if (token) {
  //       axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  //       setAuthState({
  //         token: token,
  //         authenticated: true,
  //       });
  //     }
  //   };
  //   loadToken();
  //   return () => {};
  // }, []);

  const login = async (phone: string, password: string) => {
    // try {
    //   const result = await axios.post(`${API_URL}/auth`, { phone, password });
    //   console.log("lmao");
    //   console.log(result);
    //   setAuthState({
    //     authenticated: true,
    //     token: result.data.token,
    //   });

    //   axios.defaults.headers.common["Authorization"] =
    //     `Bearer ${result.data.token}`;

    //   await SecureStore.setItemAsync(TOKEN_KEY, result.data.token);
    //   setSession(result.data.token);
    //   return result;
    // } catch (e) {
    //   return {
    //     error: true,
    //     msg: (e as any).response.data.msg,
    //   };
    // }
    setSession("aa");
  };

  const logout = async () => {
    // await SecureStore.deleteItemAsync(TOKEN_KEY);
    // setSession(null);

    // axios.defaults.headers.common["Authorization"] = "";
    // setAuthState({
    //   token: null,
    //   authenticated: false,
    // });
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        signIn: login,
        signOut: logout,
        authState: authState,
        session: session,
        isLoading: isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
