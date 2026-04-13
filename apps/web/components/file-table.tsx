"use client";
import { getSupabaseClient, type FileRecord } from "@file-vault/supabase";
import type { Toast, ToastType } from "./toast";

const BUCKET = "files";

const MAX_SIZE = 10 * 1024 * 1024;

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("zh-CN", {
    year: "numeric", month: "2-digit", day: "2-digit",
  });
}

function getExt(name: string): string {
  const parts = name.split(".");
  return parts.length > 1 ? parts[parts.length - 1] : "file";
}

type Props = {
  files: FileRecord[];
  onDeleted: () => void;
  onToast: (msg: string, type: ToastType) => void;
};

export function FileTable({ files, onDeleted, onToast }: Props) {
  async function handleDelete(file: FileRecord) {
    if (!confirm(`确定要删除文件「${file.name}」吗？`)) return;
    const supabase = getSupabaseClient();
    const { error: storageErr } = await supabase.storage.from(BUCKET).remove([file.storage_path]);
    if (storageErr) { onToast(`删除失败：${storageErr.message}`, "error"); return; }
    const { error: dbErr } = await supabase.from("files").delete().eq("id", file.id);
    if (dbErr) { onToast(`删除失败：${dbErr.message}`, "error"); return; }
    onToast("文件已删除", "success");
    onDeleted();
  }

  if (files.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
          </svg>
        </div>
        <div className="empty-title">暂无文件</div>
        <div className="empty-desc">点击右上角「上传文件」按钮添加文件</div>
      </div>
    );
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table className="file-table">
        <thead>
          <tr>
            <th style={{ width: "40%" }}>文件名</th>
            <th style={{ width: "12%" }}>类型</th>
            <th style={{ width: "12%" }}>大小</th>
            <th style={{ width: "18%" }}>上传时间</th>
            <th style={{ width: "18%" }}>操作</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr key={file.id}>
              <td>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{
                    width: "32px", height: "32px", borderRadius: "8px",
                    background: "#f1f5f9", border: "1px solid #e2e8f0",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                  </div>
                  <span className="file-name" title={file.name}>{file.name}</span>
                </div>
              </td>
              <td><span className="file-type-badge">{getExt(file.name)}</span></td>
              <td><span className="file-size">{formatSize(file.size)}</span></td>
              <td><span className="file-date">{formatDate(file.created_at)}</span></td>
              <td className="td-actions">
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(file)}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6l-1 14H6L5 6"/>
                    <path d="M10 11v6M14 11v6"/>
                    <path d="M9 6V4h6v2"/>
                  </svg>
                  删除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
