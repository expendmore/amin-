import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";

export async function GET() {
  const diagnostics = {
    firebase_initialized: false,
    firestore_connection: "checking",
    test_query_success: false,
    error_message: null,
  };

  try {
    // Attempt a basic check: check collections list or query a dummy doc in users
    diagnostics.firebase_initialized = !!db;

    if (db) {
      // Test read/write operation
      const testRef = db.collection("users").doc("diagnostic_test_connection");
      await testRef.set({
        last_tested: new Date(),
        type: "diagnostic_connection_ping",
      });

      // Verify read back
      const doc = await testRef.get();
      if (doc.exists) {
        diagnostics.test_query_success = true;
        diagnostics.firestore_connection = "connected and writable";
      }

      // Cleanup
      await testRef.delete();
    }
  } catch (error) {
    diagnostics.firestore_connection = "failed";
    diagnostics.error_message = error.message;
    diagnostics.stack = error.stack;
  }

  return NextResponse.json(diagnostics, {
    status: diagnostics.test_query_success ? 200 : 500,
  });
}
