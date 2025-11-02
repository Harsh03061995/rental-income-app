@echo off
cd "C:\Users\ASSET-MANAGEMENT\Desktop\rental-income-app"

:: Pull latest changes from GitHub
git pull

:: Stage and commit any local changes
git add .
git commit -m "Auto-sync commit" 2>nul

:: Push changes to GitHub
git push
