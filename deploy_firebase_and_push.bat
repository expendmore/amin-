@echo off
cd /d "%~dp0"
echo.
echo ================================================================
echo    LetsGrow - Firebase Deploy + GitHub Push
echo    Automated by Antigravity Agent
echo ================================================================
echo.

REM ===================================================================
REM STEP 1: Check Firebase CLI via npx (no global install needed)
REM ===================================================================
echo [1/7] Checking Firebase CLI...
call npx firebase-tools --version
if %ERRORLEVEL% NEQ 0 (
    echo [!] Installing firebase-tools...
    call npm install -g firebase-tools
)
echo [OK] Firebase CLI ready.
echo.

REM ===================================================================
REM STEP 2: Check Firebase Authentication
REM ===================================================================
echo [2/7] Checking Firebase authentication...
call npx firebase-tools projects:list >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [!] Not logged in. Opening Firebase login...
    call npx firebase-tools login
)
echo [OK] Firebase authenticated.
echo.

REM ===================================================================
REM STEP 3: Set Active Firebase Project
REM ===================================================================
echo [3/7] Setting active Firebase project...
call npx firebase-tools use whatsapp-automation-cab6c
echo [OK] Project set.
echo.

REM ===================================================================
REM STEP 4: Deploy Firestore Rules
REM ===================================================================
echo [4/7] Deploying Firestore Security Rules...
call npx firebase-tools deploy --only firestore:rules
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] Firestore rules deploy failed. Enable Firestore in Firebase Console first.
) else (
    echo [OK] Firestore rules deployed!
)
echo.

REM ===================================================================
REM STEP 5: Deploy Firestore Indexes
REM ===================================================================
echo [5/7] Deploying Firestore Indexes...
call npx firebase-tools deploy --only firestore:indexes
echo [OK] Firestore indexes done.
echo.

REM ===================================================================
REM STEP 6: Git Stage + Commit
REM ===================================================================
echo [6/7] Staging and committing to Git...
git add -A
git status
git commit -m "Deploy update via Antigravity Agent - Firebase rules, auth config, email/WhatsApp OTP, SSE stream, campaign APIs"
echo [OK] Git commit done.
echo.

REM ===================================================================
REM STEP 7: Push to GitHub
REM ===================================================================
echo [7/7] Pushing to GitHub...
git remote remove origin >nul 2>&1
git remote add origin https://github.com/expendmore/amin-.git
git branch -M develop
git push -u origin develop --force
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] GitHub push failed. Please verify git auth.
) else (
    echo [OK] Code pushed to GitHub!
)
echo.

echo ================================================================
echo   ALL DONE!
echo   Firebase: https://console.firebase.google.com/project/whatsapp-automation-cab6c
echo   GitHub:   https://github.com/aiyaditya0/whatsapp-automation
echo ================================================================
echo.
pause
