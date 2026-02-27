import { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContextType, AuthState } from '../utils/type';

const AuthContext = createContext<AuthContextType | null>(null);
const defaultAuth: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  loading: true,
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuth] = useState<AuthState>(defaultAuth);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const storedAuthStr = await AsyncStorage.getItem('storedAuth');
        const storedAuth = storedAuthStr ? JSON.parse(storedAuthStr) : {};

        if (storedAuth && storedAuth.accessToken) {
          setAuth({ ...storedAuth, loading: false });
        }
      } catch {
        console.log('Something went wrong with AsyncStorage');
      } finally {
        setAuth(prev => ({ ...prev, loading: false }));
      }
    };
    bootstrap();
  }, []);

  const login = (authState: AuthState) => {
    setAuth(authState);
  };

  const logout = async () => {
    setAuth({ ...defaultAuth, loading: false });
    await AsyncStorage.removeItem('storedAuth');
  };

  return (
    <AuthContext.Provider
      value={{
        token: auth.accessToken,
        login,
        logout,
        auth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside provider');
  return ctx;
};
