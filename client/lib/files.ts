import { apiFetch } from "./api";

export interface UploadedFile {
  name: string;
  url: string;
  mimeType: string;
  size: number;
}

export async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const response = await apiFetch<{ file: UploadedFile }>("/api/uploads", {
    method: "POST",
    body: formData,
    auth: true,
  });
  return response.file;
}
