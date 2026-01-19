import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  Alert,
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

  // ---------------- RECORD ----------------

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

  // ---------------- PLAYBACK ----------------

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

  // ---------------- UPLOAD ----------------

  const uploadAudio = async () => {
    if (!recordPath) return;

    try {
      const uri =
        Platform.OS === 'android' && !recordPath.startsWith('file://')
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');

      Alert.alert('Success', 'Voice log uploaded');
      setRecordPath(null);
    } catch (err) {
      console.error('Upload error', err);
      Alert.alert('Error', 'Failed to upload audio');
    }
  };

  // ---------------- UI ----------------

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Voice Logger</Text>

      {isRecording && (
        <Text style={styles.timer}>
          Recording: {Sound.mmssss(Math.floor(recordSecs))}
        </Text>
      )}

      {recordPath && !isRecording && (
        <Text style={styles.timer}>
          Playback: {Sound.mmssss(Math.floor(playSecs))} /{' '}
          {Sound.mmssss(Math.floor(duration))}
        </Text>
      )}

      {/* RECORD BUTTON */}
      <TouchableOpacity
        style={[styles.mic, isRecording && styles.active]}
        onPress={isRecording ? onStopRecord : onStartRecord}
      >
        <Text style={styles.text}>{isRecording ? 'STOP' : 'REC'}</Text>
      </TouchableOpacity>

      {/* PLAY / PAUSE */}
      {recordPath && !isRecording && (
        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={isPlaying ? onStopPlay : onStartPlay}
        >
          <Text style={styles.secondaryText}>
            {isPlaying ? 'STOP PLAY' : 'PLAY'}
          </Text>
        </TouchableOpacity>
      )}

      {/* UPLOAD */}
      {recordPath && !isRecording && (
        <TouchableOpacity style={styles.uploadBtn} onPress={uploadAudio}>
          <Text style={styles.uploadText}>UPLOAD</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#020617',
  },
  title: {
    color: '#fff',
    fontSize: 22,
    marginBottom: 12,
  },
  timer: {
    color: '#94a3b8',
    marginBottom: 20,
    fontSize: 14,
  },
  mic: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#22c55e',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  active: {
    backgroundColor: '#ef4444',
  },
  text: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryBtn: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: '#334155',
    borderRadius: 8,
    marginBottom: 10,
  },
  secondaryText: {
    color: '#fff',
  },
  uploadBtn: {
    paddingVertical: 12,
    paddingHorizontal: 40,
    backgroundColor: '#3b82f6',
    borderRadius: 8,
  },
  uploadText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
