import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContextType, AuthState } from "../utils/type";


const AuthContext = createContext<AuthContextType | null>(null);
const defaultAuth: AuthState = {
    user: null,
    accessToken: null,
    refreshToken: null,
    loading: true
  }

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [auth, setAuth] = useState<AuthState>(defaultAuth)
  // const [baseUrl, setBaseUrl] = useState<string | undefined>("http://192.168.0.117:5000/api/v1");
  const [baseUrl, setBaseUrl] = useState<string | undefined>("https://8e70f3d2a8e2.ngrok-free.app/api/v1");

  useEffect(()=>{
    const bootstrap = async ()=>{
         try{
          const storedAuth = JSON.parse(await AsyncStorage.getItem('storedAuth') || '{}');

          if(storedAuth && storedAuth.accessToken){
            setAuth({...storedAuth,loading: false});
            setToken(storedAuth.accessToken);
          }
         }catch{
           console.log('Something went wrong with AsyncStorage');
         }finally{
           setAuth((s)=>({...s,loading: false}));
         }
    }
    bootstrap();
  },[]);

  const login = (authState: AuthState) => {
     setAuth(authState);
     setToken(authState.accessToken);
  };

  const storeBaseUrl = (url: string | undefined) => {
     setBaseUrl(url);
  }

  const logout = async () => {
    setToken(null);
    setAuth({...defaultAuth, loading: false});
    await AsyncStorage.removeItem('storedAuth');
  };

  return (
    <AuthContext.Provider value={{baseUrl, token, login, logout, storeBaseUrl,auth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside provider");
  return ctx;
};
