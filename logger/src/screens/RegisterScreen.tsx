import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import { registerApi } from "../api/auth.api";
import { useAuth } from "../context/AuthContext";
import { UserPlus, Mail, Lock, ArrowRight, ChevronLeft } from "lucide-react-native";

export default function RegisterScreen({ navigation }: any) {
  const { baseUrl } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [isFocused, setIsFocused] = useState<string | null>(null);

  const handleRegister = async () => {
    setMsg("");
    try {
      await registerApi(email, password, baseUrl);
      setMsg("Registered successfully!");
      setTimeout(() => navigation.navigate("Login"), 1500);
    } catch (err) {
      console.log('something went wrong', err);
      setMsg("Registration failed. Try again.");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inner}
      >
        {/* Back Button */}
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <ChevronLeft color="#94A3B8" size={28} />
        </TouchableOpacity>

        <View style={styles.headerContainer}>
          <View style={styles.logoCircle}>
            <UserPlus color="#3b82f6" size={32} />
          </View>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join us to start logging your thoughts</Text>
        </View>

        <View style={styles.form}>
          {/* Email Input */}
          <Text style={styles.label}>Email Address</Text>
          <View style={[styles.inputWrapper, isFocused === 'email' && styles.inputFocused]}>
            <Mail color={isFocused === 'email' ? "#3b82f6" : "#64748b"} size={20} style={styles.inputIcon} />
            <TextInput
              placeholder="example@mail.com"
              placeholderTextColor="#64748b"
              style={styles.input}
              onChangeText={setEmail}
              onFocus={() => setIsFocused('email')}
              onBlur={() => setIsFocused(null)}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          {/* Password Input */}
          <Text style={styles.label}>Password</Text>
          <View style={[styles.inputWrapper, isFocused === 'password' && styles.inputFocused]}>
            <Lock color={isFocused === 'password' ? "#3b82f6" : "#64748b"} size={20} style={styles.inputIcon} />
            <TextInput
              placeholder="Min. 8 characters"
              placeholderTextColor="#64748b"
              secureTextEntry
              style={styles.input}
              onChangeText={setPassword}
              onFocus={() => setIsFocused('password')}
              onBlur={() => setIsFocused(null)}
            />
          </View>

          {msg ? (
            <View style={[
              styles.messageBox, 
              { backgroundColor: msg.includes("successfully") ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)" }
            ]}>
              <Text style={[
                styles.messageText,
                { color: msg.includes("successfully") ? "#4ade80" : "#f87171" }
              ]}>
                {msg}
              </Text>
            </View>
          ) : null}

          <TouchableOpacity 
            style={styles.registerButton} 
            onPress={handleRegister}
            activeOpacity={0.8}
          >
            <Text style={styles.registerButtonText}>Create Account</Text>
            <ArrowRight color="#fff" size={20} />
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
  },
  inner: {
    flex: 1,
    padding: 28,
    justifyContent: "center",
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#94A3B8",
    textAlign: 'center',
  },
  form: {
    width: "100%",
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#94A3B8",
    marginBottom: 8,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#1E293B",
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#334155",
    paddingHorizontal: 16,
  },
  inputFocused: {
    borderColor: "#3b82f6",
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: "#FFFFFF",
    paddingVertical: 14,
    fontSize: 16,
  },
  messageBox: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  messageText: {
    fontSize: 14,
    fontWeight: "600",
  },
  registerButton: {
    backgroundColor: "#3b82f6",
    flexDirection: 'row',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginRight: 8,
  },
  loginLinkButton: {
    marginTop: 30,
    alignItems: "center",
  },
  loginLinkText: {
    fontSize: 15,
    color: "#94A3B8",
  },
  loginLink: {
    color: "#3b82f6",
    fontWeight: "700",
  },
});