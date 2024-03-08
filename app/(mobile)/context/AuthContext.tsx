import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import SecureStore from "expo-secure-store";
import { useStorageState } from "./useStorageState";
import { router, useRouter } from "expo-router";
import { Slot } from "expo-router";
import { SafeAreaView } from "react-native";
import { jwtDecode } from "jwt-decode";
import  JWT from 'expo-jwt'; 
interface AuthProps {
  authState?: { token: string | null; authenticated: boolean | null };
  onLogin?: (phone: string, password: string) => Promise<any>;
  onLogout?: () => Promise<any>;
}

const TOKEN_KEY = "JWT";
export const API_URL = "https://api.developbetterapps.com";

const AuthContext = createContext<{
  signIn: (phone: string, password: string) => Promise<any>;
  signOut: () => Promise<any>;
  authState: { token: string | null; authenticated: boolean | null };
  session?: string | null;
  isLoading: boolean;
  user: any;
}>({
  signIn: () => Promise.resolve({}),
  signOut: () => Promise.resolve({}),
  authState: { token: null, authenticated: null },
  session: null,
  isLoading: false,
  user:null
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
  const [user, setUser] = useState<any>(null);
  // useEffect(() => {
  //   const loadToken = async () => {
  //     const token = await SecureStore.getItemAsync(TOKEN_KEY);
  //     console.log("stored:", token);
  //     if (token) {
  //       setAuthState({
  //         token: token,
  //         authenticated: true,
  //       });
  //       setUser(jwtDecode(token));
  //     }
  //   };
  //   loadToken();
  // }, []);

  const login = async (phone: string, password: string) => {
    try {
      const result = await axios.post(`https://abmscapstone2024.azurewebsites.net/api/v1/account/loginByPhone`, { 
        phoneNumber: phone,
        password:password
       },{
        timeout:10000
       });
      setAuthState({
        authenticated: true,
        token: result.data.data,
      });
        setSession(result.data.data);
        return result;
    } catch (e) {
      if(axios.isCancel(e)){
        return{
          error:true,
          msg:"Request timed out"
        }
      }
      return {
        error: true,
        msg: e,

      };
    }
  };

  const logout = async () => {
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
        user:user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
