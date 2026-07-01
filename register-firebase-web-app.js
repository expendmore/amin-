// register-firebase-web-app.js
// This script automates registering a Web App in the user's Firebase project (930080808970) and configures .env.local

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const projectIdOrNumber = "930080808970";
const envPath = path.join(__dirname, '.env.local');

console.log("=== Registering Web App in Firebase Project: " + projectIdOrNumber + " ===");

try {
  // 1. Verify firebase CLI is available
  try {
    execSync('firebase --version', { stdio: 'ignore' });
  } catch (err) {
    console.error("❌ Error: Firebase CLI is not installed or not in PATH.");
    console.log("Please run: npm install -g firebase-tools");
    process.exit(1);
  }

  // 2. Check if logged in. If not, prompt to login.
  console.log("Checking Firebase authentication status...");
  try {
    execSync('firebase login:list', { stdio: 'ignore' });
  } catch (err) {
    console.log("🔐 You are not logged into Firebase CLI. Starting login...");
    execSync('firebase login', { stdio: 'inherit' });
  }

  // 3. Register the web app
  console.log("\nRegistering a new Web App 'ExpendMore Web App' in Firebase project...");
  let registerOutput = "";
  try {
    registerOutput = execSync(`firebase apps:create web "ExpendMore Web App" --project ${projectIdOrNumber}`, { encoding: 'utf8' });
    console.log("✅ Web App registered successfully!");
    console.log(registerOutput);
  } catch (err) {
    // If it already exists or fails, try to fetch the existing configuration
    console.log("⚠️ Web App creation returned an alert (it may already exist). Attempting to fetch existing config...");
  }

  // 4. Fetch SDK config details
  console.log("\nFetching Firebase SDK Configuration...");
  let appId = "";
  const appIdMatch = registerOutput.match(/App ID:\s*([^\s\r\n]+)/);
  if (appIdMatch) {
    appId = appIdMatch[1];
  } else {
    console.log("Listing registered apps in project to find ExpendMore Web App ID...");
    const listOutput = execSync(`firebase apps:list --project ${projectIdOrNumber}`, { encoding: 'utf8' });
    const lineMatch = listOutput.split(/\r?\n/).find(line => line.includes("ExpendMore Web App"));
    if (lineMatch) {
      const parts = lineMatch.split(/[│|]/).map(p => p.trim());
      const foundId = parts.find(p => p.startsWith("1:" + projectIdOrNumber));
      if (foundId) appId = foundId;
    }
  }

  if (!appId) {
    console.error("❌ Could not identify the Web App ID for ExpendMore Web App. Please ensure it is registered.");
    process.exit(1);
  }

  console.log(`Using App ID: ${appId}`);
  const configOutput = execSync(`firebase apps:sdkconfig WEB ${appId} --project ${projectIdOrNumber}`, { encoding: 'utf8' });
  
  // Extract configuration fields
  let apiKey, authDomain, pId, storageBucket, messagingSenderId;

  try {
    const startIdx = configOutput.indexOf('{');
    const endIdx = configOutput.lastIndexOf('}');
    if (startIdx !== -1 && endIdx !== -1) {
      const jsonStr = configOutput.substring(startIdx, endIdx + 1);
      const config = JSON.parse(jsonStr);
      apiKey = config.apiKey;
      authDomain = config.authDomain;
      pId = config.projectId;
      storageBucket = config.storageBucket;
      messagingSenderId = config.messagingSenderId;
      appId = config.appId;
    }
  } catch (err) {
    // JSON parsing failed, use regex fallback
  }

  if (!apiKey) {
    const apiKeyMatch = configOutput.match(/apiKey:\s*["']([^"']+)["']/);
    const authDomainMatch = configOutput.match(/authDomain:\s*["']([^"']+)["']/);
    const projectIdMatch = configOutput.match(/projectId:\s*["']([^"']+)["']/);
    const storageBucketMatch = configOutput.match(/storageBucket:\s*["']([^"']+)["']/);
    const messagingSenderIdMatch = configOutput.match(/messagingSenderId:\s*["']([^"']+)["']/);
    const appIdMatch = configOutput.match(/appId:\s*["']([^"']+)["']/);

    if (apiKeyMatch && appIdMatch) {
      apiKey = apiKeyMatch[1];
      authDomain = authDomainMatch ? authDomainMatch[1] : `${projectIdMatch[1]}.firebaseapp.com`;
      pId = projectIdMatch ? projectIdMatch[1] : projectIdOrNumber;
      storageBucket = storageBucketMatch ? storageBucketMatch[1] : `${projectIdMatch[1]}.appspot.com`;
      messagingSenderId = messagingSenderIdMatch ? messagingSenderIdMatch[1] : "";
      appId = appIdMatch[1];
    }
  }

  if (!apiKey || !appId) {
    console.error("❌ Failed to parse Firebase configuration from SDK Config output:");
    console.log(configOutput);
    process.exit(1);
  }

  console.log("\n=== Extracted Web Configuration ===");
  console.log(`API Key: ${apiKey}`);
  console.log(`Auth Domain: ${authDomain}`);
  console.log(`Project ID: ${pId}`);
  console.log(`Storage Bucket: ${storageBucket}`);
  console.log(`Messaging Sender ID: ${messagingSenderId}`);
  console.log(`App ID: ${appId}`);

  // 5. Update .env.local
  if (fs.existsSync(envPath)) {
    let envContent = fs.readFileSync(envPath, 'utf8');

    // Helper to replace or add a variable
    const updateEnv = (key, val) => {
      const regex = new RegExp(`^${key}=.*$`, 'm');
      if (regex.test(envContent)) {
        envContent = envContent.replace(regex, `${key}=${val}`);
      } else {
        envContent += `\n${key}=${val}`;
      }
    };

    updateEnv("NEXT_PUBLIC_FIREBASE_API_KEY", apiKey);
    updateEnv("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN", authDomain);
    updateEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID", pId);
    updateEnv("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET", storageBucket);
    updateEnv("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID", messagingSenderId);
    updateEnv("NEXT_PUBLIC_FIREBASE_APP_ID", appId);

    fs.writeFileSync(envPath, envContent, 'utf8');
    console.log("\n✅ Successfully updated .env.local with new Web SDK credentials!");
  } else {
    const defaultEnv = `# FIREBASE CONFIGURATION (CLIENT-SIDE WEB SDK)
NEXT_PUBLIC_FIREBASE_API_KEY=${apiKey}
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${authDomain}
NEXT_PUBLIC_FIREBASE_PROJECT_ID=${pId}
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=${storageBucket}
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=${messagingSenderId}
NEXT_PUBLIC_FIREBASE_APP_ID=${appId}
`;
    fs.writeFileSync(envPath, defaultEnv, 'utf8');
    console.log("\n✅ Created .env.local and populated with Web SDK credentials!");
  }

} catch (globalErr) {
  console.error("\n❌ Script failed with error:", globalErr.message);
  process.exit(1);
}
