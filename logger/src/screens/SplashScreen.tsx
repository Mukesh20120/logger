// screens/SplashScreen.tsx
import { View, ActivityIndicator, Text } from 'react-native';

export default function SplashScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#020617',
      }}
    >
      <ActivityIndicator size="large" color="#22c55e" />
      <Text style={{ color: '#94a3b8', marginTop: 12 }}>
        Loading…
      </Text>
    </View>
  );
}
