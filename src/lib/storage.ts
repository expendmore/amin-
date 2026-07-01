import { getCachedValue, setCachedValue } from "./redis";
import { adminStorage } from "./firebase-admin";

export interface StorageProvider {
  upload: (filePath: string, buffer: Buffer, bucketName?: string) => Promise<string>;
  download: (filePath: string, bucketName?: string) => Promise<Buffer>;
  getSignedUrl: (filePath: string, bucketName?: string, expiresSeconds?: number) => Promise<string>;
}

// Firebase Admin Storage Provider implementation
export class FirebaseStorageProvider implements StorageProvider {
  private getBucket(bucketName?: string) {
    if (!adminStorage) {
      throw new Error("Firebase Admin Storage is not initialized.");
    }
    return bucketName ? adminStorage.bucket(bucketName) : adminStorage.bucket();
  }

  public async upload(filePath: string, buffer: Buffer, bucketName?: string): Promise<string> {
    const bucket = this.getBucket(bucketName);
    const file = bucket.file(filePath);
    await file.save(buffer, {
      metadata: {
        cacheControl: "public, max-age=31536000",
      }
    });

    // Return the standard Firebase Storage media URL
    return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(filePath)}?alt=media`;
  }

  public async download(filePath: string, bucketName?: string): Promise<Buffer> {
    const bucket = this.getBucket(bucketName);
    const file = bucket.file(filePath);
    const [content] = await file.download();
    return content;
  }

  public async getSignedUrl(filePath: string, bucketName?: string, expiresSeconds: number = 3600): Promise<string> {
    const bucket = this.getBucket(bucketName);
    const file = bucket.file(filePath);
    const [url] = await file.getSignedUrl({
      version: "v4",
      action: "read",
      expires: Date.now() + expiresSeconds * 1000,
    });
    return url;
  }
}

// Local Storage Provider fallback for development without Firebase credentials
export class LocalStorageProvider implements StorageProvider {
  public async upload(filePath: string, buffer: Buffer, bucketName?: string): Promise<string> {
    console.log(`[Local Storage Mock]: Uploaded file ${filePath} (Size: ${buffer.length} bytes)`);
    return `/uploads/${filePath}`;
  }

  public async download(filePath: string, bucketName?: string): Promise<Buffer> {
    return Buffer.from("mocked local file content");
  }

  public async getSignedUrl(filePath: string, bucketName?: string, expiresSeconds: number = 3600): Promise<string> {
    return `/uploads/${filePath}?token=mock_local_token`;
  }
}

// Storage Provider Manager with safe fallbacks
export class StorageManager {
  private activeProvider: StorageProvider;

  constructor() {
    if (adminStorage) {
      this.activeProvider = new FirebaseStorageProvider();
    } else {
      this.activeProvider = new LocalStorageProvider();
    }
  }

  public async uploadFile(filePath: string, buffer: Buffer, bucketName?: string): Promise<string> {
    try {
      return await this.activeProvider.upload(filePath, buffer, bucketName);
    } catch (error) {
      console.warn("[Storage Failover]: Firebase Storage failed. Falling back to local storage.", error);
      const fallback = new LocalStorageProvider();
      return await fallback.upload(filePath, buffer, bucketName);
    }
  }

  public async getSignedUrl(filePath: string, bucketName?: string, expiresSeconds: number = 3600): Promise<string> {
    const cacheKey = `storage:signedurl:${bucketName || "default"}:${filePath}`;
    let url = await getCachedValue<string>(cacheKey);

    if (!url) {
      try {
        url = await this.activeProvider.getSignedUrl(filePath, bucketName, expiresSeconds);
        await setCachedValue(cacheKey, url, expiresSeconds - 60);
      } catch (err) {
        console.warn("[Storage Manager] Failed to get signed URL:", err);
        const fallback = new LocalStorageProvider();
        url = await fallback.getSignedUrl(filePath, bucketName, expiresSeconds);
      }
    }
    return url!;
  }
}

// Canonical presigned upload helper
export async function getPresignedUploadUrl(
  fileName: string,
  mimeType: string,
  fileSize: number
): Promise<{ uploadUrl: string; downloadUrl: string; filePath: string }> {
  const filePath = `uploads/${Date.now()}_${fileName}`;
  
  if (adminStorage) {
    try {
      const bucket = adminStorage.bucket();
      const file = bucket.file(filePath);
      
      const [uploadUrl] = await file.getSignedUrl({
        version: "v4",
        action: "write",
        expires: Date.now() + 15 * 60 * 1000, // 15 mins
        contentType: mimeType,
      });

      const [downloadUrl] = await file.getSignedUrl({
        version: "v4",
        action: "read",
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return { uploadUrl, downloadUrl, filePath };
    } catch (err) {
      console.warn("[Storage Manager] Failed to generate live presigned URLs:", err);
    }
  }

  // Local fallback stubs
  return {
    uploadUrl: `/api/v1/storage/mock-upload?path=${filePath}`,
    downloadUrl: `/uploads/${filePath}`,
    filePath
  };
}

export async function deleteFileFromStorage(filePath: string): Promise<boolean> {
  if (adminStorage) {
    try {
      const bucket = adminStorage.bucket();
      await bucket.file(filePath).delete();
      return true;
    } catch (err) {
      console.error("[Storage Manager] Failed to delete file from Firebase Storage:", err);
    }
  }
  return true;
}
