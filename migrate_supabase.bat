@echo off
cd /d "%~dp0"
echo ===================================================
echo   SUPABASE DATABASE MIGRATION SCRIPT
echo ===================================================
echo.
echo [1/3] Logging into Supabase...
echo A browser window will open. Copy-paste your access token when prompted.
echo.
call npx supabase login
if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERROR] Supabase login failed. Please try again.
    goto end
)

echo.
echo ===================================================
echo [2/3] Linking local migrations to Supabase project...
echo Project Ref: ojracvgpsmppxtszrjrw
echo.
echo [IMPORTANT] This will prompt you for your Supabase Database Password.
echo If you forgot your password, reset it here:
echo https://supabase.com/dashboard/project/ojracvgpsmppxtszrjrw/settings/database
echo.
call npx supabase link --project-ref ojracvgpsmppxtszrjrw
if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERROR] Linking project failed. Make sure your database password is correct.
    goto end
)

echo.
echo ===================================================
echo [3/3] Pushing database migrations to Supabase...
echo.
call npx supabase db push
if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERROR] Pushing migrations failed.
    goto end
)

echo.
echo ===================================================
echo Database schema migration successfully completed!
echo ===================================================

:end
echo.
pause
