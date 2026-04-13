"use client";
import { Button } from "@file-vault/ui";
import { getSupabaseClient, type FileRecord } from "@file-vault/supabase";

const BUCKET = "files";

type Props = { files: FileRecord[]; onDeleted: () => void };

export function FileList({ files, onDeleted }: Props) {
  async function handleDelete(file: FileRecord) {
    const supabase = getSupabaseClient();
    await supabase.storage.from(BUCKET).remove([file.storage_path]);
    await supabase.from("files").delete().eq("id", file.id);
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
