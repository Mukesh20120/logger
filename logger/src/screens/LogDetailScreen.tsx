import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Trash2, Save, Clock, Calendar, Mic, MessageSquare } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateLogApi, deleteLogApi } from '../api/log.api'; // Assume these exist in your API file
import Toast from 'react-native-toast-message';

export default function LogDetailScreen({ route, navigation }: any) {
  const { log, dayId } = route.params; // Passing the log object and the parent day ID
  const { token, baseUrl } = useAuth();
  const queryClient = useQueryClient();
  
  const [editedText, setEditedText] = useState(log.text);

  // Mutation for Updating
  const updateMutation = useMutation({
    mutationFn: () => updateLogApi({ 
        logId: log._id, 
        dayId, 
        text: editedText, 
        token, 
        baseUrl 
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logs'] });
      Toast.show({type: 'success', text1: 'Update Successfully', text2: 'Log updated'})
      navigation.goBack();
    },
    onError: (err)=>{
      Toast.show({type: 'error', text1: 'Failed to Update.', text2: err.message || 'not able to update'})
    }
  });

  // Mutation for Deleting
  const deleteMutation = useMutation({
    mutationFn: () => deleteLogApi({ logId: log._id, dayId, token, baseUrl }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logs'] });
      Toast.show({type: 'success', text1: 'Delete Successfully', text2: 'Log has been deleted.'})
      navigation.goBack();
    },
    onError: (err)=>{
      Toast.show({type: 'error', text1: 'Failed to Delete', text2: err.message || 'not able to delete'})
    }
  });

  const confirmDelete = () => {
    Alert.alert(
      "Delete Log",
      "Are you sure you want to delete this log? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => deleteMutation.mutate() }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft color="#FFF" size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Log</Text>
        <TouchableOpacity onPress={confirmDelete} disabled={deleteMutation.isPending}>
          <Trash2 color="#EF4444" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Meta Info Card */}
        <View style={styles.metaCard}>
          <View style={styles.metaRow}>
            <Calendar size={16} color="#3b82f6" />
            <Text style={styles.metaText}>
                {new Date(log.createdAt).toLocaleDateString()}
            </Text>
            <View style={styles.divider} />
            <Clock size={16} color="#3b82f6" />
            <Text style={styles.metaText}>
                {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
          <View style={styles.sourceBadge}>
            {log.source === 'voice' ? <Mic size={14} color="#FFF" /> : <MessageSquare size={14} color="#FFF" />}
            <Text style={styles.sourceText}>{log.source.toUpperCase()}</Text>
          </View>
        </View>

        {/* Edit Area */}
        <Text style={styles.label}>Log Content</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            multiline
            value={editedText}
            onChangeText={setEditedText}
            placeholder="No text available..."
            placeholderTextColor="#64748B"
            textAlignVertical="top"
          />
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.saveBtn} 
          onPress={() => updateMutation.mutate()}
          disabled={updateMutation.isPending}
        >
          {updateMutation.isPending ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <Save color="#FFF" size={20} />
              <Text style={styles.saveBtnText}>Save Changes</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { 
    flexDirection: 'row', justifyContent: 'space-between', 
    alignItems: 'center', padding: 20 
  },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  content: { padding: 20 },
  
  metaCard: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#334155',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  metaText: { color: '#94A3B8', fontSize: 14, fontWeight: '600' },
  divider: { width: 1, height: 15, backgroundColor: '#334155' },
  sourceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#3b82f6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8
  },
  sourceText: { color: '#FFF', fontSize: 10, fontWeight: '800' },

  label: { color: '#64748B', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', marginBottom: 10, marginLeft: 5 },
  inputContainer: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
    minHeight: 200,
    padding: 20
  },
  input: { color: '#F1F5F9', fontSize: 16, lineHeight: 24 },

  footer: { padding: 24, paddingBottom: 40 },
  saveBtn: {
    backgroundColor: '#3b82f6',
    flexDirection: 'row',
    paddingVertical: 18,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#3b82f6',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5
  },
  saveBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' }
});