// cleanup-legacy-js.js
// This script deletes legacy JavaScript login and signup route page files to prevent duplicate route compiler issues.

const fs = require('fs');
const path = require('path');

const filesToDelete = [
  path.join(__dirname, 'src/app/login/page.js'),
  path.join(__dirname, 'src/app/signup/page.js'),
  path.join(__dirname, 'src/app/verify-email/page.tsx'),
  path.join(__dirname, 'src/app/forgot-password/page.tsx')
];

// Helper to remove empty directories
const cleanDirectories = [
  path.join(__dirname, 'src/app/verify-email'),
  path.join(__dirname, 'src/app/forgot-password')
];

console.log("=== Cleaning Up Legacy JavaScript Pages ===");

filesToDelete.forEach(file => {
  if (fs.existsSync(file)) {
    try {
      fs.unlinkSync(file);
      console.log(`  [OK] Deleted legacy file: ${file}`);
    } catch (err) {
      console.error(`  [FAIL] Failed to delete file: ${file}. Error:`, err.message);
    }
  } else {
    console.log(`  [INFO] File does not exist (already cleaned up): ${file}`);
  }
});

// Clean up now empty directories
cleanDirectories.forEach(dir => {
  if (fs.existsSync(dir)) {
    try {
      fs.rmdirSync(dir);
      console.log(`  [OK] Removed redundant directory: ${dir}`);
    } catch (err) {
      console.error(`  [FAIL] Failed to remove directory: ${dir}. Error:`, err.message);
    }
  }
});

console.log("\nCleanup phase completed successfully!");
process.exit(0);
