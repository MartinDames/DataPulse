const MAX_BYTES = 220_000;
const MAX_WIDTH = 960;
const DEFAULT_QUALITY = 0.72;

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("No se pudo leer la imagen."));
    };
    img.src = url;
  });
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  quality: number,
): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/jpeg", quality);
  });
}

export async function compressImageFile(
  file: File,
): Promise<{ dataUrl: string; name: string }> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Solo se permiten imágenes (PNG, JPG, WebP).");
  }

  if (file.size > 8 * 1024 * 1024) {
    throw new Error("La imagen es muy pesada. Máximo 8 MB antes de comprimir.");
  }

  const img = await loadImage(file);
  const scale = Math.min(1, MAX_WIDTH / Math.max(img.width, img.height));
  const w = Math.round(img.width * scale);
  const h = Math.round(img.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No se pudo procesar la imagen.");

  ctx.drawImage(img, 0, 0, w, h);

  let quality = DEFAULT_QUALITY;
  let blob = await canvasToBlob(canvas, quality);

  while (blob && blob.size > MAX_BYTES && quality > 0.35) {
    quality -= 0.08;
    blob = await canvasToBlob(canvas, quality);
  }

  if (!blob || blob.size > MAX_BYTES) {
    throw new Error(
      "La imagen sigue siendo muy pesada. Probá una captura más chica.",
    );
  }

  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Error al codificar la imagen."));
    reader.readAsDataURL(blob!);
  });

  const baseName = file.name.replace(/\.[^.]+$/, "") || "captura";
  return { dataUrl, name: `${baseName}.jpg` };
}
