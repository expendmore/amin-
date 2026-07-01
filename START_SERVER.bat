@echo off
cd /d "d:\Downloads\ExpendMore"
echo.
echo ================================
echo   Starting LetsGrow Dev Server
echo ================================
echo.
echo Server will open at: http://localhost:3000
echo Login page: http://localhost:3000/auth/sign-in
echo.
echo Press Ctrl+C to stop the server.
echo.
call npm run dev
pause
