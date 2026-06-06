@echo off
echo ===================================================
echo   Starting Hospital Administration System...
echo ===================================================
echo.

echo Starting Backend Server on port 5000...
start "Hospital Backend" cmd /c "cd backend && npm.cmd run dev"

echo Starting Frontend Server on port 3000...
start "Hospital Frontend" cmd /c "cd frontend && npm.cmd run dev"

echo.
echo Both servers are launching in separate windows!
echo - Frontend will be available at: http://localhost:3000
echo - Backend will be available at: http://localhost:5000
echo.
echo Close the popup windows to stop the servers.
echo.
pause
