import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@file-vault/supabase";

const BUCKET = "files";

export async function GET() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("files")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const supabase = getSupabaseClient();
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  const storagePath = `${Date.now()}-${file.name}`;
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, file);

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

  const { error: dbError } = await supabase.from("files").insert({
    name: file.name,
    size: file.size,
    mime_type: file.type,
    storage_path: storagePath,
  });

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
  return NextResponse.json({ success: true }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const supabase = getSupabaseClient();
  const { id, storage_path } = await req.json();

  const { error: storageError } = await supabase.storage
    .from(BUCKET)
    .remove([storage_path]);

  if (storageError) return NextResponse.json({ error: storageError.message }, { status: 500 });

  const { error: dbError } = await supabase.from("files").delete().eq("id", id);
  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
