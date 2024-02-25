import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import * as SecureStore from "expo-secure-store";
import axios from "axios";

interface AuthContextType {
  user: any; // Define a more specific type based on your user data
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   const initializeAuth = async () => {
  //     const token = await SecureStore.getItemAsync("userToken");
  //     // Assuming you have a way to validate the token or retrieve user data based on this token
  //     if (token) {
  //       // Here, you would ideally verify the token's validity and fetch the user's data
  //       // For demonstration, we're directly setting the user if a token exists
  //       setUser({ token }); // Replace with actual user data fetching logic
  //     }
  //     setIsLoading(false);
  //   };

  //   initializeAuth();
  // }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    // try {
    //   const response = await axios.post("https://yourapi.com/api/login", {
    //     email,
    //     password,
    //   });

    //   const { token } = response.data;
    //   if (token) {
    //     await SecureStore.setItemAsync("userToken", token);
    //     setUser({ email, token }); // Or adjust according to your needs
    //   } else {
    //     console.error("Login failed: No token returned");
    //     setUser(null);
    //   }
    // } catch (error) {
    //   console.error("Login error:", error);
    //   setUser(null);
    // } finally {
    //   setIsLoading(false);
    // }
    setUser("lmo");
    setIsLoading(false);
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("userToken");
    setUser(null);
  };

  // const makeAuthenticatedRequest = async (url: string, method: string = 'GET', data: any = {}) => {
  //   const token = await SecureStore.getItemAsync("userToken");

  //   const headers = {
  //     'Authorization': `Bearer ${token}`,
  //   };

  //   try {
  //     const response = await axios({
  //       url,
  //       method,
  //       headers,
  //       data,
  //     });
  //     return response.data;
  //   } catch (error) {
  //     console.error('Authenticated request error:', error);
  //     throw error;
  //   }
  // };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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
