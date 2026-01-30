import { DailyLog } from "../utils/type";
import { Platform } from 'react-native';

export const fetchLogs = async ({
  days,
  token,
  baseUrl,
}: {
  days: string;
  token: string;
  baseUrl: string;
}): Promise<DailyLog[]> => {
  const res = await fetch(`${baseUrl}/log/list?days=${days}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error('Failed to fetch logs');
  }

  return data.list;
};



export const uploadAudio = async ({
  baseUrl,
  recordPath,
  token,
}: {
  baseUrl: string;
  recordPath: string;
  token: string;
}) => {
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

  const res = await fetch(`${baseUrl}/log/voice`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error('Upload failed');
  }

  return res.json();
};

