"use client";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  UserCredential,
} from "firebase/auth";
import { auth, googleProvider } from "./firebase-client";

/**
 * Signs up a user using their email and a password.
 * @param email - The user's corporate/business email address.
 * @param password - The secure password.
 * @returns A promise resolving to the user credential.
 */
export async function signUpWithEmail(email: string, password: string): Promise<UserCredential> {
  return createUserWithEmailAndPassword(auth, email, password);
}

/**
 * Signs in a user using their email and a password.
 * @param email - The user's email address.
 * @param password - The password.
 * @returns A promise resolving to the user credential.
 */
export async function signInWithEmail(email: string, password: string): Promise<UserCredential> {
  return signInWithEmailAndPassword(auth, email, password);
}

/**
 * Signs in a user using Google Authentication via a popup.
 * @returns A promise resolving to the user credential.
 */
export async function signInWithGoogle(): Promise<UserCredential> {
  return signInWithPopup(auth, googleProvider);
}

/**
 * Sends a verification email to the currently logged in user.
 * @returns A promise that resolves when the email has been sent.
 */
export async function sendVerificationEmail(): Promise<void> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("No user is currently signed in to receive verification email.");
  }
  // Use production URL so email link redirects back to the app (not firebaseapp.com)
  const actionCodeSettings = {
    url: `${process.env.NEXT_PUBLIC_APP_URL || "https://whatsapp-automation-eta-six.vercel.app"}/login`,
    handleCodeInApp: false,
  };
  return sendEmailVerification(user, actionCodeSettings);
}

/**
 * Sends a password reset email to a specified email address.
 * @param email - The user's registered email address.
 * @returns A promise that resolves when the reset email has been sent.
 */
export async function sendPasswordReset(email: string): Promise<void> {
  const actionCodeSettings = {
    url: `${process.env.NEXT_PUBLIC_APP_URL || "https://whatsapp-automation-eta-six.vercel.app"}/login`,
    handleCodeInApp: false,
  };
  return sendPasswordResetEmail(auth, email, actionCodeSettings);
}

/**
 * Logs out the currently authenticated user.
 * @returns A promise that resolves when the sign-out is complete.
 */
export async function logout(): Promise<void> {
  return signOut(auth);
}
