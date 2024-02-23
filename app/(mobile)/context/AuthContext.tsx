import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios';
import SecureStore from 'expo-secure-store';
interface AuthProps{
    authState?: {token: string | null; authenticated:boolean|null};
    onLogin?:(phone:string,password:string) => Promise<any>;
    onLogout?:(phone:string,password:string) => Promise<any>; 
}

const TOKEN_KEY = '';
export const API_URL = "https://api.developbetterapps.com";
const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthProvider = ({children}:any) => {
    const [authState, setAuthState] = useState<{
        token: string |null;
        authenticated:boolean|null;
    }>({
        token:null,
        authenticated:null
    });
    useEffect(() => {
      const loadToken = async() => {
        const token = await SecureStore.getItemAsync(TOKEN_KEY);
        console.log("stored:", token)

        if(token){
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            setAuthState({
                token: token,
                authenticated: true
            })
        }
    }
        loadToken();
      return () => {
      }
    }, [])
    

    const login = async (phone: string, password: string)=>{
        try{
            const result = await axios.post(`${API_URL}/auth`, {phone,password});
            console.log(result);
            setAuthState({
                authenticated: true,
                token: result.data.token

            })

            axios.defaults.headers.common['Authorization'] = `Bearer ${result.data.token}`;
            
            await SecureStore.setItemAsync(TOKEN_KEY, result.data.token);
            return result;
        }
        catch(e){
            return{
                error:true,
                msg:(e as any).response.data.msg
            };
        }
    }

    const logout = async () => {
        await SecureStore.deleteItemAsync(TOKEN_KEY);

        axios.defaults.headers.common['Authorization'] = '';
        setAuthState({
            token: null,
            authenticated:false
        })
    }

    const value = {
        onLogin: login,
        onLogout: logout,
        authState
    };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}