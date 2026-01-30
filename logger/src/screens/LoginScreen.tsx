import React, { useEffect, useState } from "react";
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
import { loginApi } from "../api/auth.api";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, Globe, ArrowRight, UserPlus } from "lucide-react-native";
import { useMutation } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { toast } from "../utils/toast";

export default function LoginScreen({ navigation }: any) {
  const { login, baseUrl, storeBaseUrl } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [url, setUrl] = useState(baseUrl);
  const [isFocused, setIsFocused] = useState<string | null>(null);


const loginMutation = useMutation({
  mutationFn: loginApi,

  onSuccess: async (data) => {

    // Store token in auth context
    login(data.accessToken);

    Toast.show({
      type: 'success',
      text1: 'Welcome back 👋',
      text2: 'Login successful',
    });
  },

  onError: (error: any) => {

    Toast.show({
      type: 'error',
      text1: 'Login failed',
      text2: error.message || 'Invalid credentials',
    });
  },
});

const handleLogin = () => {
  if (!email || !password || !url) {
    Toast.show({
      type: 'error',
      text1: 'Please provide require data.'
    })
    return;
  }

  loginMutation.mutate({
    email,
    password,
    baseUrl: url,
  });
};

const handleSaveUrl = () =>{
   storeBaseUrl(url);
}

useEffect(()=>{
  (async()=>{
  const res = await fetch('http://localhost:5000');
  const data = await res.json();
  toast.success(JSON.stringify(data));
  })();
},[]);
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inner}
      >
        <View style={styles.headerContainer}>
          <View style={styles.logoCircle}>
            <Lock color="#3b82f6" size={32} />
          </View>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to your logger account</Text>
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
              placeholder="••••••••"
              placeholderTextColor="#64748b"
              secureTextEntry
              style={styles.input}
              onChangeText={setPassword}
              onFocus={() => setIsFocused('password')}
              onBlur={() => setIsFocused(null)}
            />
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin} activeOpacity={0.8}>
            <Text style={styles.loginButtonText}>Sign In</Text>
            <ArrowRight color="#fff" size={20} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={styles.registerText}>
              Don't have an account? <Text style={styles.registerLink}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
          {/* Base URL Input - Styled as a secondary settings section */}
          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>SERVER SETTINGS</Text>
            <View style={styles.divider} />
          </View>

          <View style={[styles.inputWrapper, isFocused === 'url' && styles.inputFocused, { marginBottom: 10 }]}>
            <Globe color={isFocused === 'url' ? "#3b82f6" : "#64748b"} size={20} style={styles.inputIcon} />
            <TextInput
              placeholder="Server Base URL"
              placeholderTextColor="#64748b"
              value={url}
              style={styles.input}
              onChangeText={setUrl}
              onFocus={() => setIsFocused('url')}
              onBlur={() => setIsFocused(null)}
            />
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleSaveUrl} activeOpacity={0.8}>
            <Text style={styles.loginButtonText}>Save Url</Text>
            <ArrowRight color="#fff" size={20} />
          </TouchableOpacity>

        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A", // Dark Slate to match Logger
  },
  inner: {
    flex: 1,
    padding: 28,
    justifyContent: "center",
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
  },
  form: {
    width: "100%",
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#94A3B8",
    marginBottom: 8,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
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
    backgroundColor: "#1E293B",
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
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#334155",
  },
  dividerText: {
    color: "#64748B",
    fontSize: 10,
    fontWeight: "800",
    marginHorizontal: 10,
    letterSpacing: 2,
  },
  errorText: {
    color: "#F87171",
    fontSize: 14,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "500",
  },
  loginButton: {
    backgroundColor: "#3b82f6",
    flexDirection: 'row',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginRight: 8,
  },
  registerButton: {
    marginTop: 30,
    alignItems: "center",
  },
  registerText: {
    fontSize: 15,
    color: "#94A3B8",
  },
  registerLink: {
    color: "#3b82f6",
    fontWeight: "700",
  },
});