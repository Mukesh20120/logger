import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import { useAuth } from '../context/AuthContext';
import VoiceLogScreen from '../screens/VoiceLogScreen';
import LogHistoryScreen from '../screens/LogHistoryScreen';
import { QueryClientProvider } from '@tanstack/react-query';
import {queryClient} from '../utils/queryClient'
import Toast from 'react-native-toast-message';
import SplashScreen from '../screens/SplashScreen';
import LogDetailScreen from '../screens/LogDetailScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { token, auth } = useAuth();
 console.log(JSON.stringify(auth));
if (auth && auth.loading) {
  return <SplashScreen />;
}

  return (
    <>
    <QueryClientProvider client={queryClient}>
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {!auth?.accessToken ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Voice" component={VoiceLogScreen} />
            <Stack.Screen name="List" component={LogHistoryScreen} />
            <Stack.Screen name="LogDetails" component={LogDetailScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
    </QueryClientProvider>
    <Toast/>
    </>
  );
}
