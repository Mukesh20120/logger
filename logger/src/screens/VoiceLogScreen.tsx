import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  Alert,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Sound, { RecordBackType, PlayBackType } from 'react-native-nitro-sound';
import { useAuth } from '../context/AuthContext';
// Note: Install lucide-react-native if you haven't already
import { ChevronLeft, Mic } from 'lucide-react-native';
import { toast } from '../utils/toast';
import Toast from 'react-native-toast-message';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadAudio } from '../api/log.api';

export default function VoiceLogScreen({ navigation }: any) {
  const { token } = useAuth();

  const [isRecording, setIsRecording] = useState(false);
  const [recordPath, setRecordPath] = useState<string | null>(null);

  const [recordSecs, setRecordSecs] = useState(0);

  const queryClient = useQueryClient();

  const uploadAudioMutation = useMutation({
    mutationFn: uploadAudio,
    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: 'Upload successful',
        text2: 'Voice log uploaded successfully',
      });

      setRecordPath(null);

      // Refresh logs list automatically
      queryClient.invalidateQueries({ queryKey: ['logs'] });
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Upload failed',
        text2: error.message || 'Failed to upload audio',
      });
    },
  });

  const requestPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const onStartRecord = async () => {
    const ok = await requestPermission();
    if (!ok) {
      toast.error('Please grant microphone permission.');
      return;
    }
    try {
      Sound.addRecordBackListener((e: RecordBackType) => {
        setRecordSecs(e.currentPosition);
      });
      await Sound.startRecorder();
      setIsRecording(true);
    } catch (err) {
      toast.error(`Recording Failed. ${err}`);
    }
  };

  const onStopRecord = async () => {
    try {
      const path = await Sound.stopRecorder();
      Sound.removeRecordBackListener();
      setIsRecording(false);
      setRecordSecs(0);

      if (path && token) {
        uploadAudioMutation.mutate({ recordPath: path, token });
      }
    } catch (err) {
      toast.error('Stop record error');
      console.error('Stop record error', err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Redesigned Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <ChevronLeft color="#FFF" size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Voice Log</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.mainContent}>
        {/* Modern Status Badge */}
        <View style={[styles.badge, isRecording && styles.badgeRecording]}>
          <View style={[styles.dot, isRecording && styles.dotRecording]} />
          <Text style={[styles.badgeText, isRecording && { color: '#0F172A' }]}>
            {isRecording ? 'RECORDING' : 'FINISHED'}
          </Text>
        </View>

        {/* Improved Timer Display */}
        <Text style={styles.timerLarge}>
          {isRecording ? Sound.mmssss(Math.floor(recordSecs)) : '00:00'}
        </Text>
        <Text style={styles.subText}>
          {isRecording ? 'Recording your thoughts...' : 'Hold to record.'}
        </Text>
      </View>

      {/* Primary Footer Action */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          disabled={uploadAudioMutation.isPending}
          style={[styles.mainCircle, isRecording && styles.recordingMode]}
          onPressIn={onStartRecord}
          onPressOut={onStopRecord}
          activeOpacity={0.8}
        >
          {uploadAudioMutation.isPending ? (
            <ActivityIndicator size="large" color="#FFF" />
          ) : (
            <Mic color="#FFF" size={36} strokeWidth={1.5} />
          )}
        </TouchableOpacity>

        <Text style={styles.subText}>
          {isRecording
            ? 'Recording... release to send'
            : uploadAudioMutation.isPending
            ? 'Uploading...'
            : 'Hold to record'}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  recordingMode: {
    backgroundColor: '#ef4444',
    shadowColor: '#ef4444',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: '600' },
  mainContent: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  // Badge
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 30,
  },
  badgeRecording: { backgroundColor: '#FFF' },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#94A3B8',
    marginRight: 8,
  },
  dotRecording: { backgroundColor: '#ef4444' },
  badgeText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    color: '#94A3B8',
  },

  // Timer
  timerLarge: {
    color: '#FFF',
    fontSize: 72,
    fontWeight: '200',
    fontVariant: ['tabular-nums'],
    letterSpacing: 2,
  },
  subText: { color: '#64748B', fontSize: 16, marginTop: 10 },

  // Controls
  actionContainer: { marginTop: 60, alignItems: 'center', width: '100%' },
  stopOuterCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stopInnerCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playbackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    gap: 30,
  },
  mainCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ef4444',
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 5,
  },
  micMode: { backgroundColor: '#22c55e', shadowColor: '#22c55e' },
  sideBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listenLabel: {
    color: '#64748B',
    marginTop: 15,
    fontSize: 14,
    fontWeight: '500',
  },

  // Footer
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    height: 100,
    justifyContent: 'center',
  },
  sendBtn: {
    backgroundColor: '#3b82f6',
    flexDirection: 'row',
    paddingVertical: 18,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 12,
  },
});
