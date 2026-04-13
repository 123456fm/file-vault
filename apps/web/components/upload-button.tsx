"use client";
import { useRef, useState } from "react";
import { getSupabaseClient } from "@file-vault/supabase";
import type { FileRecord } from "@file-vault/supabase";
import type { ToastType } from "./toast";

const BUCKET = "files";
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

type Props = {
  files: FileRecord[];
  onUploaded: () => void;
  onToast: (msg: string, type: ToastType) => void;
};

export function UploadButton({ files, onUploaded, onToast }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // 10MB 校验
    if (file.size > MAX_SIZE) {
      onToast(`文件「${file.name}」超过 10MB 限制（当前 ${(file.size / (1024 * 1024)).toFixed(2)} MB）`, "error");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    // 名称重复校验
    const duplicate = files.some((f) => f.name === file.name);
    if (duplicate) {
      onToast(`文件「${file.name}」已存在，请重命名后再上传`, "warning");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    setLoading(true);
    const supabase = getSupabaseClient();
    // 用时间戳+随机ID作为存储路径，避免中文/特殊字符导致 Invalid key 错误
    const ext = file.name.includes(".") ? file.name.split(".").pop() : "";
    const safeId = Math.random().toString(36).slice(2, 8);
    const storagePath = ext ? `${Date.now()}-${safeId}.${ext}` : `${Date.now()}-${safeId}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, file);
    if (uploadError) {
      onToast(`上传失败：${uploadError.message}`, "error");
      setLoading(false);
      return;
    }

    const { error: dbError } = await supabase.from("files").insert({
      name: file.name,
      size: file.size,
      mime_type: file.type || "application/octet-stream",
      storage_path: storagePath,
    });
    if (dbError) {
      onToast(`记录保存失败：${dbError.message}`, "error");
      setLoading(false);
      return;
    }

    onToast(`「${file.name}」上传成功`, "success");
    onUploaded();
    setLoading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <>
      <input ref={inputRef} type="file" className="hidden" onChange={handleChange} />
      <button
        className="btn btn-primary"
        onClick={() => inputRef.current?.click()}
        disabled={loading}
      >
        {loading ? (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 1s linear infinite" }}>
              <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
            上传中...
          </>
        ) : (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            上传文件
          </>
        )}
      </button>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
