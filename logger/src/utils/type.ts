// Types based on your API response
export interface LogEntry {
  text: string;
  source: string;
  createdAt: string;
}

export interface DailyLog {
  _id: string;
  date: string;
  logs: LogEntry[];
}

