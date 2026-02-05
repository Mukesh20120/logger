import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Calendar,
  Clock,
  Mic,
  MessageSquare,
  ChevronRight,
  Filter,
  ChevronLeft,
} from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { DailyLog } from '../utils/type';
import { useQuery } from '@tanstack/react-query';
import { fetchLogs } from '../api/log.api';

export default function LogHistoryScreen({ navigation }: any) {
  const { token, baseUrl } = useAuth();
  const [filter, setFilter] = useState('7'); // '7', '30', or 'custom'

  //toast error message if any one not available
  if (!token || !baseUrl) return;

  const {
    data: logs = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['logs', filter],
    queryFn: () => fetchLogs({ days: filter, token, baseUrl }),
    enabled: !!token,
  });

  if (isError) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={{ color: 'red' }}>Failed to load logs.</Text>
      </SafeAreaView>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderLogItem = ({ item }: { item: DailyLog }) => (
    <View style={styles.daySection}>
      <View style={styles.dayHeader}>
        <Calendar size={16} color="#3b82f6" />
        <Text style={styles.dayTitle}>{formatDate(item.date)}</Text>
        <Text style={styles.logCount}>{item.logs.length} logs</Text>
      </View>

      {item.logs.map((log, index) => (
        <View key={index} style={styles.logCard}>
          <View
            style={[
              styles.sourceIcon,
              {
                backgroundColor:
                  log.source === 'voice'
                    ? 'rgba(59, 130, 246, 0.1)'
                    : 'rgba(168, 85, 247, 0.1)',
              },
            ]}
          >
            {log.source === 'voice' ? (
              <Mic size={18} color="#3b82f6" />
            ) : (
              <MessageSquare size={18} color="#a855f7" />
            )}
          </View>

          <TouchableOpacity onPress={()=>{navigation.navigate('LogDetails',{
            log,
            dayId: item._id
          })}} style={styles.logInfo}>
            <Text style={styles.logText}>
              {log.text || 'Voice log (No transcript)'}
            </Text>
            <View style={styles.timeRow}>
              <Clock size={12} color="#64748b" />
              <Text style={styles.timeText}>
                {new Date(log.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
          </TouchableOpacity>

          <ChevronRight size={18} color="#334155" />
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
     {/* Redesigned Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <ChevronLeft color="#FFF" size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Activity Log</Text>
        <TouchableOpacity style={styles.filterBtn}>
          <Filter size={20} color="#3b82f6" />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabContainer}>
        {['7', '30', '90'].map(val => (
          <TouchableOpacity
            key={val}
            style={[styles.tab, filter === val && styles.activeTab]}
            onPress={() => setFilter(val)}
          >
            <Text
              style={[styles.tabText, filter === val && styles.activeTabText]}
            >
              {val === '7' ? '1 Week' : val === '30' ? '1 Month' : '3 Months'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color="#3b82f6" size="large" />
        </View>
      ) : (
        <FlatList
          data={logs}
          renderItem={renderLogItem}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyText}>
                No logs found for this period.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  headerContainer: { flexDirection: 'column' },
  headerTitle: { color: '#FFF', fontSize: 24, fontWeight: '800' },
  filterBtn: { padding: 8, backgroundColor: '#1E293B', borderRadius: 10 },

  // Tabs
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 10,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
  },
  activeTab: { backgroundColor: '#3b82f6', borderColor: '#3b82f6' },
  tabText: { color: '#94A3B8', fontSize: 13, fontWeight: '600' },
  activeTabText: { color: '#FFF' },

  // List & Cards
  listContent: { paddingHorizontal: 20, paddingBottom: 40 },
  daySection: { marginBottom: 25 },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  dayTitle: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  logCount: { color: '#475569', fontSize: 12, marginLeft: 'auto' },

  logCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  sourceIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logInfo: { flex: 1, marginLeft: 15 },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
  },
  logText: {
    color: '#F1F5F9',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  timeText: { color: '#64748B', fontSize: 12 },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: { color: '#64748B', fontSize: 16 },
});
