@echo off
cd /d "c:\Users\imagi\Downloads\jersey-hub KIRO\jersey-hub"
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del /f package-lock.json
set NODE_TLS_REJECT_UNAUTHORIZED=0
npm install --no-fund --no-audit > install-out.log 2>&1
echo EXIT_CODE:%errorlevel% >> install-out.log
set NODE_TLS_REJECT_UNAUTHORIZED=
