import { useAuth } from "../context/AuthContext";
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import { Mic, LogOut } from 'lucide-react-native';

const HomeScreen = ({ navigation }: any) => {
  const { logout } = useAuth();
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Logger Home</Text>
        <TouchableOpacity onPress={logout} style={styles.logoutCircle}>
          <LogOut color="#FF4B4B" size={18} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.micCircle}>
            <Mic color="#007AFF" size={40} strokeWidth={1.5} />
          </View>
          
          <Text style={styles.cardTitle}>Ready to record?</Text>
          <Text style={styles.cardSub}>
            Your thoughts, saved instantly to the cloud.
          </Text>

          <TouchableOpacity 
            style={styles.primaryBtn}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Voice')}
          >
            <Text style={styles.btnText}>Open Voice Logger</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F4F7' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 24, 
    paddingVertical: 20 
  },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#1A1C1E' },
  logoutCircle: { 
    width: 40, height: 40, borderRadius: 20, 
    backgroundColor: '#FFE5E5', justifyContent: 'center', alignItems: 'center' 
  },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  card: { 
    backgroundColor: '#FFFFFF', borderRadius: 32, padding: 32, 
    alignItems: 'center', elevation: 8, shadowColor: '#000', 
    shadowOpacity: 0.08, shadowRadius: 15, shadowOffset: { width: 0, height: 10 } 
  },
  micCircle: { 
    width: 100, height: 100, borderRadius: 50, 
    backgroundColor: '#E6F2FF', justifyContent: 'center', alignItems: 'center', 
    marginBottom: 24 
  },
  cardTitle: { fontSize: 24, fontWeight: '700', color: '#1A1C1E', marginBottom: 12 },
  cardSub: { 
    fontSize: 16, color: '#636E72', textAlign: 'center', 
    lineHeight: 22, marginBottom: 32 
  },
  primaryBtn: { 
    backgroundColor: '#007AFF', width: '100%', paddingVertical: 18, 
    borderRadius: 16, alignItems: 'center' 
  },
  btnText: { color: '#FFF', fontSize: 16, fontWeight: '700' }
});

export default HomeScreen;