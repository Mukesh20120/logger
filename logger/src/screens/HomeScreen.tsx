import { View, Text, Button, StyleSheet } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function HomeScreen({navigation}: any) {
  const { logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎙 Logger Home</Text>
      <Button title="Logout" onPress={logout} />
      <Button title="Voice Logger" onPress={()=>{navigation.navigate('Voice')}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, marginBottom: 20 },
});
