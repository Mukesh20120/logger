import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import { useAuth } from "../context/AuthContext";
import VoiceLogScreen from "../screens/VoiceLogScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { token } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!token ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Voice" component={VoiceLogScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
