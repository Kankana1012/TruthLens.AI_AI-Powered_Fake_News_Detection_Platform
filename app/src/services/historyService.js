const STORAGE_KEY = "tl-prediction-history";

function readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeAll(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    /* storage full or unavailable - ignore */
  }
}

export function getHistory() {
  return readAll().sort((a, b) => b.timestamp - a.timestamp);
}

export function addHistoryEntry(entry) {
  const list = readAll();
  const record = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: Date.now(),
    ...entry,
  };
  list.push(record);
  writeAll(list);
  return record;
}

export function deleteHistoryEntry(id) {
  const list = readAll().filter((e) => e.id !== id);
  writeAll(list);
}

export function clearHistory() {
  writeAll([]);
}

export function exportToCSV(entries) {
  const header = [
    "Date & Time",
    "Model",
    "News Article",
    "Prediction",
    "Confidence",
    "Time (sec)",
  ];
  const rows = entries.map((e) => [
    new Date(e.timestamp).toLocaleString(),
    e.modelName,
    `"${(e.article || "").replace(/"/g, '""').slice(0, 200)}"`,
    e.prediction,
    `${e.confidence}%`,
    e.time,
  ]);

  const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `truthlens-history-${Date.now()}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToPrintable(entries) {
  const win = window.open("", "_blank");
  if (!win) return;
  const rows = entries
    .map(
      (e) => `
      <tr>
        <td>${new Date(e.timestamp).toLocaleString()}</td>
        <td>${e.modelName}</td>
        <td>${(e.article || "").slice(0, 80)}...</td>
        <td>${e.prediction}</td>
        <td>${e.confidence}%</td>
        <td>${e.time}s</td>
      </tr>`
    )
    .join("");

  win.document.write(`
    <html>
      <head>
        <title>TruthLens AI - Prediction History</title>
        <style>
          body{font-family:sans-serif;padding:24px;color:#111;}
          h1{color:#7c3aed;}
          table{width:100%;border-collapse:collapse;margin-top:20px;}
          th,td{border:1px solid #ddd;padding:8px 10px;font-size:13px;text-align:left;}
          th{background:#f3f0ff;}
        </style>
      </head>
      <body>
        <h1>TruthLens AI — Prediction History</h1>
        <p>Exported on ${new Date().toLocaleString()} • ${entries.length} records</p>
        <table>
          <thead>
            <tr><th>Date & Time</th><th>Model</th><th>Article</th><th>Prediction</th><th>Confidence</th><th>Time</th></tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </body>
    </html>
  `);
  win.document.close();
  win.focus();
  win.print();
}
