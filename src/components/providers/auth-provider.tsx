"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onIdTokenChanged, UserCredential } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp, collection } from "firebase/firestore";
import { auth, db } from "@/lib/firebase-client";
import { Role } from "@/lib/authorization";
import {
  signUpWithEmail,
  signInWithEmail,
  signInWithGoogle,
  sendVerificationEmail as firebaseSendVerificationEmail,
  sendPasswordReset as firebaseSendPasswordReset,
  logout as firebaseLogout,
} from "@/lib/auth";

interface AuthContextType {
  user: User | null;
  userRole: Role | null;
  loading: boolean;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  login: (email: string, password: string) => Promise<UserCredential>;
  signup: (email: string, password: string) => Promise<UserCredential>;
  googleLogin: () => Promise<UserCredential>;
  logout: () => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Sync the Firebase ID token to the server as an HttpOnly cookie.
 * The server verifies the token and sets a secure cookie — JS cannot read it.
 */
async function syncSessionCookie(token: string): Promise<void> {
  try {
    await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken: token }),
      credentials: "same-origin",
    });
  } catch (err) {
    console.error("[AuthProvider] Failed to sync session cookie:", err);
  }
}

/**
 * Clear the server-side HttpOnly session cookie on logout.
 */
async function clearSessionCookie(): Promise<void> {
  try {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "same-origin",
    });
  } catch (err) {
    console.error("[AuthProvider] Failed to clear session cookie:", err);
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to Firebase ID token lifecycle updates (handles login, logout, and token auto-refresh)
    const unsubscribe = onIdTokenChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        try {
          // Sync secure HttpOnly cookie via server — JS cannot read HttpOnly cookies
          const token = await currentUser.getIdToken();
          await syncSessionCookie(token);

          const userRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userRef);

          if (!userSnap.exists()) {
            // First time login - provision a default workspace
            const wsRef = doc(collection(db, "workspaces"));
            const wsId = wsRef.id;

            await setDoc(wsRef, {
              id: wsId,
              name: "Personal Workspace",
              ownerId: currentUser.uid,
              plan: "free",
              credits: 1000,
              usedCredits: 0,
              purchasedCredits: 1000,
              status: "active",
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            });

            // Set member record under workspaces/{workspaceId}/members/{uid}
            const memberRef = doc(db, "workspaces", wsId, "members", currentUser.uid);
            await setDoc(memberRef, {
              uid: currentUser.uid,
              email: currentUser.email || "",
              role: "owner",
              joinedAt: serverTimestamp()
            });

            // Create user profile document with activeWorkspaceId
            const defaultRole = Role.CUSTOMER;
            setUserRole(defaultRole);
            await setDoc(userRef, {
              uid: currentUser.uid,
              email: currentUser.email,
              displayName: currentUser.displayName || "",
              photoURL: currentUser.photoURL || "",
              emailVerified: currentUser.emailVerified,
              provider: currentUser.providerData[0]?.providerId || "password",
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
              lastLoginAt: serverTimestamp(),
              role: defaultRole,
              status: "active",
              activeWorkspaceId: wsId,
              workspaceIds: [wsId]
            });
          } else {
            // Existing user login - load role and update status
            const data = userSnap.data();
            setUserRole((data?.role as Role) || Role.CUSTOMER);
            await setDoc(
              userRef,
              {
                emailVerified: currentUser.emailVerified,
                lastLoginAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
              },
              { merge: true }
            );
          }
        } catch (dbErr) {
          console.error("Firestore B2B profile synchronizer failed:", dbErr);
          setUserRole(Role.CUSTOMER);
        }
      } else {
        // Clear server-side HttpOnly cookie on logout
        await clearSessionCookie();
        setUserRole(null);
      }
      
      setLoading(false);
    });

    // Cleanup subscription to avoid memory leaks
    return () => unsubscribe();
  }, []);

  const login = signInWithEmail;
  const signup = signUpWithEmail;
  const googleLogin = signInWithGoogle;
  const logout = firebaseLogout;
  const sendVerificationEmail = firebaseSendVerificationEmail;
  const sendPasswordReset = firebaseSendPasswordReset;

  const isAuthenticated = !!user;
  const isEmailVerified = user ? user.emailVerified : false;

  return (
    <AuthContext.Provider
      value={{
        user,
        userRole,
        loading,
        isAuthenticated,
        isEmailVerified,
        login,
        signup,
        googleLogin,
        logout,
        sendVerificationEmail,
        sendPasswordReset,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to access authentication context.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
