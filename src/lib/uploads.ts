import "server-only";

import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export const MAX_PHOTOS = 5;
export const MAX_PHOTO_BYTES = 8 * 1024 * 1024; // 8MB

const ALLOWED: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/pjpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/heic": "heic",
  "image/heif": "heif",
};

export type SavedPhoto = { url: string; filename: string };

/**
 * Damage photos are stored on the local disk under /public/uploads.
 * Note for deployment: this needs a server with a writable, persistent disk
 * (VPS, Docker volume, Render disk). Serverless platforms with a read-only
 * filesystem would need object storage instead - swap this one function out.
 */
export async function savePhotos(files: File[]): Promise<{ saved: SavedPhoto[]; error?: string }> {
  const usable = files.filter((f) => f && f.size > 0);
  if (usable.length === 0) return { saved: [] };
  if (usable.length > MAX_PHOTOS) {
    return { saved: [], error: `Please upload no more than ${MAX_PHOTOS} photos.` };
  }

  const now = new Date();
  const folder = path.join(
    process.cwd(),
    "public",
    "uploads",
    String(now.getFullYear()),
    String(now.getMonth() + 1).padStart(2, "0"),
  );
  await mkdir(folder, { recursive: true });

  const saved: SavedPhoto[] = [];
  for (const file of usable) {
    const ext = ALLOWED[file.type];
    if (!ext) {
      return { saved, error: "Photos must be JPG, PNG, WEBP or HEIC files." };
    }
    if (file.size > MAX_PHOTO_BYTES) {
      return { saved, error: "Each photo needs to be under 8MB." };
    }

    const name = `${Date.now().toString(36)}-${randomBytes(6).toString("hex")}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(folder, name), buffer);

    saved.push({
      url: `/uploads/${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}/${name}`,
      filename: file.name.slice(0, 120),
    });
  }

  return { saved };
}
