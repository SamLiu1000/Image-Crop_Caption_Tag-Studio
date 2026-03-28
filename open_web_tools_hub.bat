@echo off
setlocal
cd /d %~dp0
start "" python -m http.server 8012
start "" http://localhost:8012/web_tools_hub/
