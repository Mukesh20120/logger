// Types based on your API response
export interface LogEntry {
  _id?: string
  text: string;
  source: string;
  createdAt: string;
}

export interface DailyLog {
  _id: string;
  date: string;
  logs: LogEntry[];
}


export type AuthContextType = {
  token: string | null;
  baseUrl: string | undefined;
  login: (authState: AuthState) => void;
  logout: () => void;
  storeBaseUrl: (url: string | undefined)=>void;
  auth: AuthState
};

export type AuthState = {
  user: null | { id: string; email: string, userName: string };
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
};
