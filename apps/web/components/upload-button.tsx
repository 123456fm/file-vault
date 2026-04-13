"use client";
import { useRef } from "react";
import { Button } from "@file-vault/ui";

type Props = { onUploaded: () => void };

export function UploadButton({ onUploaded }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const form = new FormData();
    form.append("file", file);
    await fetch("/api/files", { method: "POST", body: form });
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
