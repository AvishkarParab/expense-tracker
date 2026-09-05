@echo off
setlocal EnableDelayedExpansion

echo =======================================================
echo    EXPENSE TRACKER - PRODUCTION PRE-FLIGHT VERIFIER
echo =======================================================
echo.

if exist "backend\.venv\Scripts\activate.bat" (
    call "backend\.venv\Scripts\activate.bat"
) else if exist ".venv\Scripts\activate.bat" (
    call ".venv\Scripts\activate.bat"
)

cd backend || (
    echo [ERROR] Failed to navigate to backend directory.
    exit /b 1
)

echo [1/6] Compiling application source code...
python -m compileall app
if errorlevel 1 (
    echo [ERROR] Bytecode compilation failed. Check for syntax or circular import errors.
    cd ..
    exit /b 1
)
echo [PASS] Application syntax verified.
echo.

echo [2/6] Running automated test suite...
python -m pytest -v
if errorlevel 1 (
    echo [ERROR] Pytest suite failed. Fix breaking tests before building.
    cd ..
    exit /b 1
)
echo [PASS] All automated tests passed.
echo.

echo [3/6] Testing production settings validation...
set "ENVIRONMENT=production"
set "SECRET_KEY=dev-insecure-secret-key-change-in-production"
python -c "from app.core.config import settings" 2>nul
if not errorlevel 1 (
    echo [ERROR] Insecure SECRET_KEY was allowed in production mode!
    set "ENVIRONMENT="
    set "SECRET_KEY="
    cd ..
    exit /b 1
)
echo [PASS] Settings validator caught insecure secret key as expected.

set "SECRET_KEY=a_very_long_secure_random_key_that_exceeds_thirty_two_chars"
set "POSTGRES_PASSWORD=change_me_in_prod"
python -c "from app.core.config import settings" 2>nul
if not errorlevel 1 (
    echo [ERROR] Insecure POSTGRES_PASSWORD was allowed in production mode!
    set "ENVIRONMENT="
    set "SECRET_KEY="
    set "POSTGRES_PASSWORD="
    cd ..
    exit /b 1
)
echo [PASS] Settings validator caught insecure database password as expected.

set "POSTGRES_PASSWORD=postgres"
python -c "from app.core.config import settings; print('Validated config for:', settings.ENVIRONMENT)"
if errorlevel 1 (
    echo [ERROR] Valid configuration failed to load.
    set "ENVIRONMENT="
    set "SECRET_KEY="
    set "POSTGRES_PASSWORD="
    cd ..
    exit /b 1
)
set "ENVIRONMENT="
set "SECRET_KEY="
set "POSTGRES_PASSWORD="
echo [PASS] Production settings guardrails verified.
echo.

echo [4/6] Building production Docker image...
docker build --no-cache -t expense-tracker-backend:prod-test .
if errorlevel 1 (
    echo [ERROR] Docker build failed. Inspect requirements or Dockerfile.
    cd ..
    exit /b 1
)
echo [PASS] Docker image built successfully.
echo.

echo [5/6] Starting temporary container for smoke tests...
docker rm -f prod_test_container >nul 2>&1

docker run -d --name prod_test_container ^
  -p 8000:8000 ^
  -e ENVIRONMENT=production ^
  -e SECRET_KEY="a_very_long_secure_random_key_that_exceeds_thirty_two_chars" ^
  -e POSTGRES_SERVER=host.docker.internal ^
  -e POSTGRES_PORT=5433 ^
  -e POSTGRES_USER=postgres ^
  -e POSTGRES_PASSWORD=postgres ^
  -e POSTGRES_DB=expense_tracker ^
  -e ALLOWED_ORIGINS="[\"http://localhost:3000\",\"http://localhost:5173\"]" ^
  expense-tracker-backend:prod-test

echo Container launched. Waiting for startup...
set RETRIES=0

:health_retry
timeout /t 2 /nobreak >nul
set /a RETRIES+=1

curl -s http://localhost:8000/api/v1/health | findstr /i "healthy" >nul
if not errorlevel 1 (
    echo [PASS] Health check endpoint returned healthy.
    goto check_docs
)

if %RETRIES% LSS 8 (
    echo Retrying health check - attempt %RETRIES% of 8
    goto health_retry
)

echo [ERROR] Health check failed on container after multiple attempts.
echo --- Container Logs ---
docker logs prod_test_container
echo --- Raw Health Response ---
curl -i http://localhost:8000/api/v1/health
goto cleanup_fail

:check_docs
echo [6/6] Verifying docs lockdown in production...
curl -s -o nul -w "%%{http_code}" http://localhost:8000/docs | findstr "404" >nul
if errorlevel 1 (
    echo [ERROR] Swagger /docs is accessible in production mode!
    goto cleanup_fail
)
echo [PASS] Swagger docs hidden as expected.

echo.
echo =======================================================
echo    SUCCESS: BUILD IS VERIFIED AND READY FOR PRODUCTION
echo =======================================================
docker rm -f prod_test_container >nul 2>&1
cd ..
exit /b 0

:cleanup_fail
docker rm -f prod_test_container >nul 2>&1
cd ..
exit /b 1