"use client";

import { useEffect, useState, useCallback } from "react";

interface LogEntry {
  id: string;
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR" | "SECURITY";
  ip: string;
  method: string;
  path: string;
  userAgent?: string;
  reason?: string;
  statusCode?: number;
}

interface Stats {
  total: number;
  security: number;
  errors: number;
  warns: number;
  topIps: { ip: string; count: number }[];
}

const LEVEL_STYLES: Record<LogEntry["level"], string> = {
  INFO: "bg-blue-100 text-blue-800",
  WARN: "bg-yellow-100 text-yellow-800",
  ERROR: "bg-red-100 text-red-800",
  SECURITY: "bg-purple-100 text-purple-900 font-bold",
};

export default function SecurityLogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [levelFilter, setLevelFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        limit: "50",
        page: String(page),
        ...(levelFilter ? { level: levelFilter } : {}),
      });

      const res = await fetch(`/api/security-logs?${params}`);

      if (res.status === 403) {
        setError("Доступ заборонено — потрібна роль ADMIN");
        return;
      }

      if (!res.ok) {
        setError(`Помилка ${res.status}`);
        return;
      }

      const data = await res.json();
      setLogs(data.logs ?? []);
      setStats(data.stats ?? null);
      setTotalPages(data.pagination?.pages ?? 1);
    } catch {
      setError("Не вдалося завантажити логи");
    } finally {
      setLoading(false);
    }
  }, [page, levelFilter]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchLogs]);

  const clearLogs = async () => {
    if (!confirm("Очистити всі логи?")) return;
    await fetch("/api/security-logs", { method: "DELETE" });
    fetchLogs();
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-gray-600 border-t-white rounded-full animate-spin" />
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <p className="text-red-400 mb-3">{error}</p>
        <button onClick={fetchLogs} className="px-4 py-2 bg-gray-700 rounded text-sm text-gray-300 hover:bg-gray-600">
          Спробувати знову
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6 font-mono">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">🛡️ Security Logs</h1>
            <p className="text-gray-400 text-sm mt-1">Моніторинг безпеки</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setAutoRefresh((v) => !v)}
              className={`px-4 py-2 rounded text-sm transition ${autoRefresh ? "bg-green-700 text-white" : "bg-gray-700 text-gray-300"}`}
            >
              {autoRefresh ? "● Авто-оновлення" : "○ Авто-оновлення"}
            </button>
            <button onClick={fetchLogs} className="px-4 py-2 bg-gray-700 rounded text-sm hover:bg-gray-600">
              ↻ Оновити
            </button>
            <button onClick={clearLogs} className="px-4 py-2 bg-red-800 rounded text-sm hover:bg-red-700">
              Очистити
            </button>
          </div>
        </div>

        {stats && (
          <div className="grid grid-cols-4 gap-4 mb-6">
            <StatCard label="Всього" value={stats.total} color="text-gray-300" />
            <StatCard label="🔐 Security" value={stats.security} color="text-purple-400" />
            <StatCard label="❌ Помилки" value={stats.errors} color="text-red-400" />
            <StatCard label="⚠️ Попередження" value={stats.warns} color="text-yellow-400" />
          </div>
        )}

        {stats && stats.topIps.length > 0 && (
          <div className="bg-gray-900 rounded-lg p-4 mb-6 border border-gray-800">
            <h2 className="text-sm font-semibold text-gray-400 mb-3">🌐 Топ IP адрес</h2>
            <div className="flex flex-wrap gap-2">
              {stats.topIps.map(({ ip, count }) => (
                <span key={ip} className="px-3 py-1 bg-gray-800 rounded text-xs text-gray-300">
                  {ip} <span className="text-blue-400">{count}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2 mb-4">
          {(["", "INFO", "WARN", "ERROR", "SECURITY"] as const).map((l) => (
            <button
              key={l}
              onClick={() => { setLevelFilter(l); setPage(1); }}
              className={`px-3 py-1.5 rounded text-xs transition ${levelFilter === l ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}
            >
              {l || "Всі"}
            </button>
          ))}
        </div>

        <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-800 text-gray-400">
                <th className="px-3 py-3 text-left">Час</th>
                <th className="px-3 py-3 text-left">Рівень</th>
                <th className="px-3 py-3 text-left">IP</th>
                <th className="px-3 py-3 text-left">Метод</th>
                <th className="px-3 py-3 text-left">Шлях</th>
                <th className="px-3 py-3 text-left">Причина</th>
                <th className="px-3 py-3 text-left">Код</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-t border-gray-800 hover:bg-gray-800/50 transition">
                  <td className="px-3 py-2 text-gray-500 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleTimeString("uk")}
                  </td>
                  <td className="px-3 py-2">
                    <span className={`px-2 py-0.5 rounded text-xs ${LEVEL_STYLES[log.level]}`}>
                      {log.level}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-gray-300">{log.ip}</td>
                  <td className="px-3 py-2">
                    <span className={`font-semibold ${
                      log.method === "GET" ? "text-green-400" :
                      log.method === "POST" ? "text-blue-400" :
                      log.method === "DELETE" ? "text-red-400" : "text-yellow-400"
                    }`}>{log.method}</span>
                  </td>
                  <td className="px-3 py-2 text-gray-300 max-w-xs truncate">{log.path}</td>
                  <td className="px-3 py-2 text-orange-400">{log.reason || "—"}</td>
                  <td className="px-3 py-2">
                    <span className={log.statusCode && log.statusCode >= 400 ? "text-red-400" : "text-gray-400"}>
                      {log.statusCode || "—"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {logs.length === 0 && (
            <div className="text-center py-12 text-gray-600">Логів немає</div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              className="px-3 py-1 bg-gray-800 rounded text-sm disabled:opacity-40">←</button>
            <span className="px-3 py-1 text-gray-400 text-sm">{page} / {totalPages}</span>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="px-3 py-1 bg-gray-800 rounded text-sm disabled:opacity-40">→</button>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-gray-500 text-xs mt-1">{label}</div>
    </div>
  );
}