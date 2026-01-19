import { useState } from "react";
import { 
  View, 
  TextInput, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  SafeAreaView 
} from "react-native";
import { registerApi } from "../api/auth.api";

export default function RegisterScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleRegister = async () => {
    try {
      await registerApi(email, password);
      setMsg("Registered successfully!");
      // Adding a slight delay so the user can see the success message 
      // before being redirected
      setTimeout(() => navigation.navigate("Login"), 1500);
    } catch (err) {
      console.log('something went wrong', err); 
      setMsg("Registration failed. Try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inner}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join us to get started</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput 
            placeholder="example@mail.com" 
            style={styles.input} 
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            placeholder="Min. 8 characters"
            secureTextEntry
            style={styles.input}
            onChangeText={setPassword}
          />

          {msg ? (
            <Text style={[
              styles.messageText, 
              { color: msg.includes("successfully") ? "#34C759" : "#FF3B30" }
            ]}>
              {msg}
            </Text>
          ) : null}

          <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
            <Text style={styles.registerButtonText}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.loginLinkButton} 
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.loginLinkText}>
              Already have an account? <Text style={styles.loginLink}>Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  inner: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  headerContainer: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  form: {
    width: "100%",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#444",
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: "#F5F5F7",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  messageText: {
    fontSize: 14,
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "600",
  },
  registerButton: {
    backgroundColor: "#1A1A1A", // Dark theme button for Register to differentiate from Login
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  loginLinkButton: {
    marginTop: 25,
    alignItems: "center",
  },
  loginLinkText: {
    fontSize: 15,
    color: "#666",
  },
  loginLink: {
    color: "#007AFF",
    fontWeight: "700",
  },
});
