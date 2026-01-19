import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';

import Sound, {
  RecordBackType,
  PlayBackType,
} from 'react-native-nitro-sound';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://192.168.0.117:5000/api/v1/log/voice';

export default function VoiceLogScreen() {
  const { token } = useAuth();

  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const [recordPath, setRecordPath] = useState<string | null>(null);
  const [recordSecs, setRecordSecs] = useState(0);
  const [playSecs, setPlaySecs] = useState(0);
  const [duration, setDuration] = useState(0);

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
    if (!ok) return;
    try {
      Sound.addRecordBackListener((e: RecordBackType) => {
        setRecordSecs(e.currentPosition);
      });
      const path = await Sound.startRecorder();
      setRecordPath(path);
      setIsRecording(true);
    } catch (err) {
      console.error('Start record error', err);
    }
  };

  const onStopRecord = async () => {
    try {
      const path = await Sound.stopRecorder();
      Sound.removeRecordBackListener();
      setIsRecording(false);
      setRecordSecs(0);
      if (path) setRecordPath(path);
    } catch (err) {
      console.error('Stop record error', err);
    }
  };

  const onStartPlay = async () => {
    if (!recordPath) return;
    try {
      Sound.addPlayBackListener((e: PlayBackType) => {
        setPlaySecs(e.currentPosition);
        setDuration(e.duration);
        if (e.currentPosition >= e.duration) {
          onStopPlay();
        }
      });
      await Sound.startPlayer(recordPath);
      setIsPlaying(true);
    } catch (err) {
      console.error('Play error', err);
    }
  };

  const onStopPlay = async () => {
    try {
      await Sound.stopPlayer();
      Sound.removePlayBackListener();
      setIsPlaying(false);
      setPlaySecs(0);
    } catch (err) {
      console.error('Stop play error', err);
    }
  };

  const uploadAudio = async () => {
    if (!recordPath) return;
    try {
      const uri = Platform.OS === 'android' && !recordPath.startsWith('file://')
          ? `file://${recordPath}`
          : recordPath;

      const formData = new FormData();
      formData.append('audio', {
        uri,
        name: 'voice-log.m4a',
        type: 'audio/m4a',
      } as any);

      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');
      Alert.alert('Success', 'Voice log uploaded successfully');
      setRecordPath(null);
    } catch (err) {
      Alert.alert('Error', 'Failed to upload audio');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Voice Log</Text>
        <Text style={styles.subtitle}>Record your thoughts</Text>
      </View>

      <View style={styles.centerSection}>
        {/* Status Indicators */}
        <View style={styles.statusBadge}>
          <View style={[styles.dot, isRecording && styles.dotRecording]} />
          <Text style={styles.statusText}>
            {isRecording ? 'RECORDING' : isPlaying ? 'PLAYING' : 'READY'}
          </Text>
        </View>

        {/* Timer Display */}
        <Text style={styles.timerLarge}>
          {isRecording 
            ? Sound.mmssss(Math.floor(recordSecs)) 
            : recordPath 
              ? `${Sound.mmssss(Math.floor(playSecs))} / ${Sound.mmssss(Math.floor(duration))}`
              : "00:00"}
        </Text>

        {/* The Main Action Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.micCircle, isRecording && styles.micRecording]}
          onPress={isRecording ? onStopRecord : onStartRecord}
        >
          <View style={styles.micInner}>
            <View style={isRecording ? styles.stopSquare : styles.recordCircle} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Footer Actions */}
      <View style={styles.footer}>
        {recordPath && !isRecording && (
          <>
            <TouchableOpacity 
              style={styles.playbackBtn} 
              onPress={isPlaying ? onStopPlay : onStartPlay}
            >
              <Text style={styles.playbackBtnText}>
                {isPlaying ? 'Stop Preview' : 'Listen Back'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.uploadBtn} onPress={uploadAudio}>
              <Text style={styles.uploadText}>Send Voice Log</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
  },
  header: {
    marginTop: 40,
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  subtitle: {
    color: '#64748b',
    fontSize: 16,
    marginTop: 4,
  },
  centerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#94a3b8',
    marginRight: 8,
  },
  dotRecording: {
    backgroundColor: '#ef4444',
  },
  statusText: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  timerLarge: {
    color: '#fff',
    fontSize: 54,
    fontWeight: '300',
    fontVariant: ['tabular-nums'],
    marginBottom: 40,
  },
  micCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#22c55e',
  },
  micRecording: {
    borderColor: '#ef4444',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  micInner: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#22c55e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#fff',
  },
  stopSquare: {
    width: 25,
    height: 25,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  footer: {
    padding: 24,
    gap: 12,
  },
  playbackBtn: {
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
  },
  playbackBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  uploadBtn: {
    paddingVertical: 18,
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: '#3b82f6',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  uploadText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
