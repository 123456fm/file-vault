"use client";
import { Button } from "@file-vault/ui";
import type { FileRecord } from "@file-vault/supabase";

type Props = { files: FileRecord[]; onDeleted: () => void };

export function FileList({ files, onDeleted }: Props) {
  async function handleDelete(file: FileRecord) {
    await fetch("/api/files", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: file.id, storage_path: file.storage_path }),
    });
    onDeleted();
  }

  if (files.length === 0) {
    return <p className="text-gray-500 text-center py-12">No files yet. Upload one!</p>;
  }

  return (
    <ul className="divide-y divide-gray-200">
      {files.map((file) => (
        <li key={file.id} className="flex items-center justify-between py-3 px-4">
          <div>
            <p className="font-medium text-gray-900">{file.name}</p>
            <p className="text-sm text-gray-500">
              {(file.size / 1024).toFixed(1)} KB · {new Date(file.created_at).toLocaleDateString()}
            </p>
          </div>
          <Button variant="destructive" onClick={() => handleDelete(file)}>
            Delete
          </Button>
        </li>
      ))}
    </ul>
  );
}
