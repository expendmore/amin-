@echo off
cd /d "%~dp0"
echo ===================================================
echo [1/5] Initializing Git repository...
echo ===================================================
git init

echo ===================================================
echo [2/5] Staging files...
echo ===================================================
git add .

echo ===================================================
echo [3/5] Committing files...
echo ===================================================
git commit -m "Initial commit of ExpendMore project"

echo ===================================================
echo [4/5] Configuring GitHub remote repository...
echo ===================================================
git remote remove origin >nul 2>&1
git remote add origin https://github.com/expendmore/amin-.git

echo ===================================================
echo [5/5] Pushing files to GitHub...
echo ===================================================
git branch -M develop
git push -u origin develop --force

echo ===================================================
echo Process complete!
echo ===================================================
pause
