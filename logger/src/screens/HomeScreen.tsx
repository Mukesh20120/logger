import { useAuth } from "../context/AuthContext";
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mic, LogOut, History, ChevronRight } from 'lucide-react-native';

const HomeScreen = ({ navigation }: any) => {
  const { logout } = useAuth();
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello!</Text>
          <Text style={styles.headerTitle}>Logger Home</Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutCircle}>
          <LogOut color="#FF4B4B" size={18} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Record Card (Main Action) */}
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

        {/* History Action (Secondary Action) */}
        <TouchableOpacity 
          style={styles.historyCard}
          activeOpacity={0.9}
          onPress={() => navigation.navigate('List')} // Ensure this name matches your Navigator
        >
          <View style={styles.historyIconCircle}>
            <History color="#8B5CF6" size={24} />
          </View>
          <View style={styles.historyTextContainer}>
            <Text style={styles.historyTitle}>View History</Text>
            <Text style={styles.historySub}>Check your previous voice logs</Text>
          </View>
          <ChevronRight color="#C7C7CC" size={20} />
        </TouchableOpacity>
      </ScrollView>
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
  greeting: { fontSize: 14, color: '#636E72', fontWeight: '500' },
  headerTitle: { fontSize: 24, fontWeight: '700', color: '#1A1C1E' },
  logoutCircle: { 
    width: 40, height: 40, borderRadius: 20, 
    backgroundColor: '#FFE5E5', justifyContent: 'center', alignItems: 'center' 
  },
  content: { paddingHorizontal: 24, paddingBottom: 30 },
  
  // Main Record Card
  card: { 
    backgroundColor: '#FFFFFF', borderRadius: 32, padding: 32, 
    alignItems: 'center', elevation: 8, shadowColor: '#000', 
    shadowOpacity: 0.08, shadowRadius: 15, shadowOffset: { width: 0, height: 10 },
    marginBottom: 20
  },
  micCircle: { 
    width: 90, height: 90, borderRadius: 45, 
    backgroundColor: '#E6F2FF', justifyContent: 'center', alignItems: 'center', 
    marginBottom: 20 
  },
  cardTitle: { fontSize: 22, fontWeight: '700', color: '#1A1C1E', marginBottom: 8 },
  cardSub: { 
    fontSize: 15, color: '#636E72', textAlign: 'center', 
    lineHeight: 20, marginBottom: 28 
  },
  primaryBtn: { 
    backgroundColor: '#007AFF', width: '100%', paddingVertical: 18, 
    borderRadius: 18, alignItems: 'center' 
  },
  btnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },

  // History Card
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4
  },
  historyIconCircle: {
    width: 50, height: 50, borderRadius: 15,
    backgroundColor: '#F5F3FF', // Light purple
    justifyContent: 'center', alignItems: 'center',
    marginRight: 16
  },
  historyTextContainer: { flex: 1 },
  historyTitle: { fontSize: 18, fontWeight: '700', color: '#1A1C1E' },
  historySub: { fontSize: 14, color: '#636E72', marginTop: 2 }
});

export default HomeScreen;