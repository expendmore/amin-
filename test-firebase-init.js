// test-firebase-init.js
// This script validates Firebase Admin and Client SDK initialization using environment variables.

const fs = require('fs');
const path = require('path');

// Robust manual .env.local parser supporting multiline double/single quoted values
const envLocalPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envLocalPath)) {
  const content = fs.readFileSync(envLocalPath, 'utf8');
  const regex = /^\s*([A-Za-z0-9_]+)\s*=\s*(?:"([\s\S]*?)"|'([\s\S]*?)'|([^\r\n]*))/gm;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const key = match[1];
    let val = match[2] !== undefined ? match[2] : (match[3] !== undefined ? match[3] : match[4]);
    process.env[key] = val;
  }
}

console.log("=== Firebase Environment Verification Script ===");

// 1. Verify environment variables loaded
const requiredAdminVars = ['FIREBASE_PROJECT_ID', 'FIREBASE_CLIENT_EMAIL', 'FIREBASE_PRIVATE_KEY'];
const requiredClientVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID'
];

let allVarsLoaded = true;

console.log("\nChecking Server-Side Admin SDK Environment Variables:");
requiredAdminVars.forEach(v => {
  if (process.env[v]) {
    console.log(`  [OK] ${v} = ${v === 'FIREBASE_PRIVATE_KEY' ? '[PRESENT (Redacted)]' : process.env[v]}`);
  } else {
    console.log(`  [FAIL] ${v} is missing!`);
    allVarsLoaded = false;
  }
});

console.log("\nChecking Client-Side Web SDK Environment Variables:");
requiredClientVars.forEach(v => {
  if (process.env[v]) {
    console.log(`  [OK] ${v} = ${process.env[v]}`);
  } else {
    console.log(`  [FAIL] ${v} is missing!`);
    allVarsLoaded = false;
  }
});

if (!allVarsLoaded) {
  console.error("\n❌ Error: Missing required environment variables. Please check .env.local.");
  process.exit(1);
}

// 2. Test Firebase Admin SDK Initialization using Env Variables
console.log("\nTesting Firebase Admin SDK Initialization...");
try {
  const admin = require('firebase-admin');
  
  // Format the private key from environment variables
  const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n').replace(/\r/g, '')
    : undefined;

  // Initialize Admin SDK directly with credentials object
  const adminApp = admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    })
  }, 'test-admin-app'); // Use a named app to avoid collisions

  console.log("  [OK] Firebase Admin SDK initialized successfully!");

  // Test Firestore connectivity
  console.log("  Testing Firestore connectivity...");
  const db = adminApp.firestore();
  
  // Retrieve collections list as a basic verification
  db.listCollections()
    .then(() => {
      console.log("  [OK] Firestore connection test successful!");
      
      // 3. Test Firebase Client SDK Initialization
      console.log("\nTesting Firebase Client SDK Initialization...");
      try {
        const { initializeApp: initClientApp } = require('firebase/app');
        const { getAuth } = require('firebase/auth');

        const clientConfig = {
          apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
          authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
          messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
          appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        };

        const clientApp = initClientApp(clientConfig, 'test-client-app');
        const clientAuth = getAuth(clientApp);
        console.log("  [OK] Firebase Client SDK initialized successfully!");
        console.log("\n🎉 ALL TESTS PASSED SUCCESSFULLY! 🎉");
        process.exit(0);
      } catch (clientErr) {
        console.error("  [FAIL] Firebase Client SDK initialization failed:", clientErr.message);
        process.exit(1);
      }
    })
    .catch(firestoreErr => {
      console.error("  [FAIL] Firestore connection test failed:", firestoreErr.message);
      console.log("\n⚠️ Note: If you are using the emulator or have network/credential restrictions, the connection check might fail even if initialization succeeded.");
      process.exit(1);
    });

} catch (adminErr) {
  console.error("  [FAIL] Firebase Admin SDK initialization failed:", adminErr.message);
  process.exit(1);
}
