@echo off
cd /d "%~dp0"
echo ===================================================
echo   VERCEL DEPLOYMENT AUTOMATION SCRIPT
echo ===================================================
echo.
echo [1/4] Logging into Vercel...
echo A browser window will open. Select your login method and authenticate.
echo.
call npx vercel login
if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERROR] Vercel login failed. Please try again.
    goto end
)

echo.
echo ===================================================
echo [2/4] Linking project to Vercel...
echo.
call npx vercel link
if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERROR] Linking project failed.
    goto end
)

echo.
echo ===================================================
echo [3/4] Importing environment variables from .env.local...
echo.
if exist .env.local (
    call npx vercel env import .env.local
    echo.
    echo Env variables imported. Ensure keys like database URLs, Stripe, and Clerk API keys are correct for production in Vercel settings!
) else (
    echo [WARNING] .env.local file not found. Skipping env import. You must set them up manually in Vercel dashboard.
)

echo.
echo ===================================================
echo [4/4] Deploying project to Production...
echo.
call npx vercel deploy --prod
if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERROR] Deployment failed.
    goto end
)

echo.
echo ===================================================
echo Vercel deployment successfully completed!
echo ===================================================

:end
echo.
pause
