@echo off
cd /d "%~dp0"
echo ===================================================
echo   EXPENDMORE GLOBAL BRAND RENAMER
echo ===================================================
echo.
echo Running brand renamer script...
node "C:\Users\aditya tiwari\.gemini\antigravity-ide\brain\52483ecf-e9e9-4d33-94a8-74d8af13e915\scratch\rename-brand.js"
echo.
echo Running duplicate routes cleanup...
call node cleanup-legacy-js.js
echo.
echo Rebuilding Next.js application to check for compilation errors...
call npx prisma generate
call npm run build
echo.
pause
