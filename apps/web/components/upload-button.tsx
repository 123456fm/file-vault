"use client";
import { useRef } from "react";
import { Button } from "@file-vault/ui";
import { getSupabaseClient } from "@file-vault/supabase";

const BUCKET = "files";

type Props = { onUploaded: () => void };

export function UploadButton({ onUploaded }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const supabase = getSupabaseClient();
    const storagePath = `${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, file);
    if (uploadError) { alert(uploadError.message); return; }

    const { error: dbError } = await supabase.from("files").insert({
      name: file.name,
      size: file.size,
      mime_type: file.type,
      storage_path: storagePath,
    });
    if (dbError) { alert(dbError.message); return; }

    onUploaded();
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <>
      <input ref={inputRef} type="file" className="hidden" onChange={handleChange} />
      <Button onClick={() => inputRef.current?.click()}>Upload File</Button>
    </>
  );
}
