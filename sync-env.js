// sync-env.js
const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, 'private key firebase latest.json');
const envPath = path.join(__dirname, '.env.local');

console.log("=== Firebase Environment Synchronization ===");

if (!fs.existsSync(jsonPath)) {
  console.error("❌ Error: private key firebase latest.json not found!");
  process.exit(1);
}

const credentials = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const projectId = credentials.project_id;
const clientEmail = credentials.client_email;
const privateKey = credentials.private_key;

console.log(`Project ID: ${projectId}`);
console.log(`Client Email: ${clientEmail}`);

let envContent = '';
if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8');
}

// Split by newlines
const lines = envContent.split(/\r?\n/);
const filteredLines = [];
let insidePrivateKey = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const trimmed = line.trim();

  if (trimmed.startsWith('FIREBASE_PROJECT_ID=') || trimmed.startsWith('FIREBASE_CLIENT_EMAIL=')) {
    continue;
  }
  
  if (trimmed.startsWith('FIREBASE_PRIVATE_KEY=')) {
    if (trimmed.includes('="') && !trimmed.endsWith('"') && !trimmed.endsWith('""')) {
      insidePrivateKey = true;
    }
    continue;
  }

  if (insidePrivateKey) {
    if (trimmed.endsWith('"')) {
      insidePrivateKey = false;
    }
    continue;
  }

  filteredLines.push(line);
}

// Reconstruct env file and append new variables
let newContent = filteredLines.join('\n').trim();

// Append the new keys (stripping Windows-style carriage returns for clean PEM loading)
newContent += `\n\n# FIREBASE CONFIGURATION (SERVER-SIDE ADMIN SDK)
FIREBASE_PROJECT_ID=${projectId}
FIREBASE_CLIENT_EMAIL=${clientEmail}
FIREBASE_PRIVATE_KEY="${privateKey.replace(/\r/g, '').replace(/"/g, '\\"')}"`;

fs.writeFileSync(envPath, newContent + '\n', 'utf8');
console.log("✅ Successfully synchronized .env.local with credentials!");
process.exit(0);
