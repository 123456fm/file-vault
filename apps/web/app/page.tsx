"use client";
import { useEffect, useState } from "react";
import { UploadButton } from "@/components/upload-button";
import { FileList } from "@/components/file-list";
import type { FileRecord } from "@file-vault/supabase";

export default function HomePage() {
  const [files, setFiles] = useState<FileRecord[]>([]);

  async function loadFiles() {
    const res = await fetch("/api/files");
    const data = await res.json();
    setFiles(data);
  }

  useEffect(() => { loadFiles(); }, []);

  return (
    <main className="max-w-2xl mx-auto py-12 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">File Vault</h1>
        <UploadButton onUploaded={loadFiles} />
      </div>
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <FileList files={files} onDeleted={loadFiles} />
      </div>
    </main>
  );
}
