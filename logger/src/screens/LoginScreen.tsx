import { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import { loginApi } from "../api/auth.api";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      const res = await loginApi(email, password);
      login(res.accessToken);
      console.log(JSON.stringify(res));
    } catch (err) {
      console.log('login error', err);
      setError("Invalid credentials");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput placeholder="Email" style={styles.input} onChangeText={setEmail} />
      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        onChangeText={setPassword}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}
      <View style={{marginVertical: 20}}>
      <Button title="Login" onPress={handleLogin} />
      </View>
      <Button title="Go to Register" onPress={() => navigation.navigate("Register")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 6 },
  error: { color: "red", marginBottom: 10 },
});
