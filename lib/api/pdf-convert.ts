export async function convertPdfToWord(file: File): Promise<Blob> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/convert/pdf-to-word", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Conversion failed");
  }

  return res.blob();
}

export async function convertWordToPdf(file: File): Promise<Blob> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/convert/word-to-pdf", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Conversion failed");
  }

  return res.blob();
}
