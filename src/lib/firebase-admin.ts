/**
 * Firebase Admin SDK — Server-Only Module
 *
 * RULES:
 * - Never import this file in client components ("use client")
 * - Never expose adminAuth, adminDb, adminStorage to the browser
 * - All credentials come from environment variables ONLY
 * - Never commit service account JSON files
 *
 * Usage: import { adminAuth, adminDb, adminStorage } from "@/lib/firebase-admin"
 */

import admin from "firebase-admin";

// Prevent duplicate initialization in Next.js hot-reload / serverless environments
if (!admin.apps.length) {
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY
    ? process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n")
    : undefined;

  if (
    !process.env.FIREBASE_ADMIN_PROJECT_ID ||
    !process.env.FIREBASE_ADMIN_CLIENT_EMAIL ||
    !privateKey
  ) {
    // In development, warn clearly — never silently fail
    console.warn(
      "[Firebase Admin] Missing environment variables: FIREBASE_ADMIN_PROJECT_ID, " +
      "FIREBASE_ADMIN_CLIENT_EMAIL, or FIREBASE_ADMIN_PRIVATE_KEY. " +
      "Server-side Firebase features will not work."
    );
  } else {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey,
      }),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
  }
}

/**
 * Firebase Admin Auth — server-side token verification, user management
 */
export const adminAuth = admin.apps.length ? admin.auth() : null;

/**
 * Firebase Admin Firestore — server-side database operations
 * Use this in API routes, not the client SDK
 */
export const adminDb = admin.apps.length ? admin.firestore() : null;

/**
 * Firebase Admin Storage — server-side file operations
 */
export const adminStorage = admin.apps.length ? admin.storage() : null;

/**
 * Verify a Firebase ID token from a request cookie or Authorization header.
 * Returns decoded token or throws on failure.
 *
 * @param token - Raw Firebase ID token string
 * @throws Error if token is invalid or expired
 */
export async function verifyFirebaseToken(token: string): Promise<admin.auth.DecodedIdToken> {
  if (!adminAuth) {
    throw new Error("Firebase Admin not initialized. Check server environment variables.");
  }
  return adminAuth.verifyIdToken(token, true); // checkRevoked: true
}

/**
 * Convenience: extract and verify token from a Next.js API request cookie.
 * Returns { uid, decoded } on success or { uid: null, error } on failure.
 */
export async function verifyRequestToken(
  token: string | undefined
): Promise<
  | { uid: string; decoded: admin.auth.DecodedIdToken; error: null }
  | { uid: null; decoded: null; error: string }
> {
  if (!token) {
    return { uid: null, decoded: null, error: "No token provided" };
  }

  try {
    const decoded = await verifyFirebaseToken(token);
    return { uid: decoded.uid, decoded, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Token verification failed";
    return { uid: null, decoded: null, error: message };
  }
}

export default admin;
