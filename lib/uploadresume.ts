import { supabase } from "./supabase";
import { v4 as uuidv4 } from "uuid";

export async function uploadResume(file: File) {
  const fileName = `${uuidv4()}-${file.name}`;

  const { data, error } = await supabase.storage
    .from("resumes")
    .upload(fileName, file);

  if (error) {
    throw error;
  }

  return data.path;
}