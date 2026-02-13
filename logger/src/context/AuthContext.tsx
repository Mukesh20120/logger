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
  const [auth, setAuth] = useState<AuthState>(defaultAuth)
  // const [baseUrl, setBaseUrl] = useState<string | undefined>("http://192.168.0.117:5000/api/v1");
  const [baseUrl, setBaseUrl] = useState<string | undefined>("https://8e70f3d2a8e2.ngrok-free.app/api/v1");

  useEffect(()=>{
    const bootstrap = async ()=>{
         try{
          const storedAuthStr = await AsyncStorage.getItem('storedAuth');
          const storedBaseUrlStr = await AsyncStorage.getItem('storedBaseUrl');
          const storedAuth = storedAuthStr ? JSON.parse(storedAuthStr) : {};

          if(storedAuth && storedAuth.accessToken){
            setAuth({...storedAuth,loading: false});
          }
          if(storedBaseUrlStr){
            setBaseUrl(storedBaseUrlStr);
          }
         }catch{
           console.log('Something went wrong with AsyncStorage');
         }finally{
            setAuth(prev=>({...prev, loading: false}));
         }
        }
    bootstrap();
  },[]);

  const login = (authState: AuthState) => {
     setAuth(authState);
  };

  const storeBaseUrl = async(url: string | undefined) => {
     setBaseUrl(url);
     if(url)
       await AsyncStorage.setItem('storedBaseUrl', url);
  }

  const logout = async () => {
    setAuth({...defaultAuth, loading: false});
    await AsyncStorage.removeItem('storedAuth');
  };

  return (
    <AuthContext.Provider value={{baseUrl, token: auth.accessToken, login, logout, storeBaseUrl,auth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside provider");
  return ctx;
};
