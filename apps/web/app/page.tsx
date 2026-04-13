"use client";
import { useEffect, useState, useCallback } from "react";
import { UploadButton } from "@/components/upload-button";
import { FileTable } from "@/components/file-table";
import { ToastContainer, type Toast } from "@/components/toast";
import { getSupabaseClient, type FileRecord } from "@file-vault/supabase";

let toastId = 0;

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function HomePage() {
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: Toast["type"]) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  async function loadFiles() {
    setLoading(true);
    const supabase = getSupabaseClient();
    const { data } = await supabase
      .from("files")
      .select("*")
      .order("created_at", { ascending: false });
    setFiles(data ?? []);
    setLoading(false);
  }

  useEffect(() => { loadFiles(); }, []);

  const totalSize = files.reduce((sum, f) => sum + f.size, 0);

  return (
    <>
      {/* Topbar */}
      <div className="topbar">
        <div className="topbar-breadcrumb">
          <span>首页</span>
          <span className="topbar-breadcrumb-sep">/</span>
          <span className="topbar-breadcrumb-current">文件管理</span>
        </div>
      </div>

      {/* Content */}
      <div className="content-area">
        {/* Stats */}
        <div className="stats-bar">
          <div className="stat-card">
            <div className="stat-value">{files.length}</div>
            <div className="stat-label">文件总数</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{loading ? "—" : formatSize(totalSize)}</div>
            <div className="stat-label">占用空间</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">10 MB</div>
            <div className="stat-label">单文件上限</div>
          </div>
        </div>

        {/* File table card */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">全部文件</div>
              <div className="card-meta">
                {loading ? "加载中..." : `共 ${files.length} 个文件`}
              </div>
            </div>
            <UploadButton files={files} onUploaded={loadFiles} onToast={addToast} />
          </div>

          {loading ? (
            <div className="empty-state">
              <div style={{ color: "#94a3b8", fontSize: "13px" }}>加载中...</div>
            </div>
          ) : (
            <FileTable files={files} onDeleted={loadFiles} onToast={addToast} />
          )}
        </div>
      </div>

      <ToastContainer toasts={toasts} />
    </>
  );
}
