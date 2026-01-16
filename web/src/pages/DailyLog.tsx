import { useEffect, useState } from "react";
import type { DailyLog, DailyLogResponse } from "../type/dailyLog";
import { fetchWithAuth } from "../utils/fetchWithAuth";

export default function DailyLogs() {
  const [dailyLog, setDailyLog] = useState<DailyLog | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchLogs = async (): Promise<void> => {
      try {
        const res = await fetchWithAuth(
          "http://localhost:5000/api/v1/log/list"
        );

        const text = await res.text();
        const data: DailyLogResponse | null = text ? JSON.parse(text) : null;

        if (!res.ok) {
          throw new Error(
            data?.message || "Failed to fetch daily logs"
          );
        }

        // ✅ DEFAULT: null if no data
        setDailyLog(data?.list ?? null);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Unable to load logs");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 text-gray-500">
        Loading logs...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-500">
        {error}
      </div>
    );
  }

  // ✅ EMPTY STATE (no daily log)
  if (!dailyLog || dailyLog.logs.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        No logs found for today.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">
        Daily Logs — {new Date(dailyLog.date).toDateString()}
      </h1>

      <div className="border rounded-lg bg-white shadow-sm">
        <ul className="divide-y">
          {dailyLog.logs.map((log, index) => (
            <li key={index} className="px-4 py-3 flex gap-3">
              <span
                className={`text-xs px-2 py-1 rounded ${
                  log.source === "voice"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                {log.source}
              </span>

              <div>
                <p className="text-gray-800">{log.text}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(log.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
