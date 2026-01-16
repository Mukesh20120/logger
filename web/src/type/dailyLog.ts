// types/dailyLog.ts
export type LogSource = "voice" | "manual";

export interface LogItem {
  text: string;
  source: LogSource;
  createdAt: string;
}

export interface DailyLog {
  _id: string;
  userId: string;
  date: string;
  logs: LogItem[];
  createdAt: string;
  updatedAt: string;
}

export interface DailyLogResponse {
  success: boolean;
  message: string;
  list: DailyLog | null;
}
