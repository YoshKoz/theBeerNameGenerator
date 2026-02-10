# Backup and remove PowerShell profiles and clear terminal environment variables
# Usage: Run in PowerShell (no elevation required). To allow script execution for this run:
# PowerShell -NoProfile -ExecutionPolicy Bypass -File .\scripts\reset_powershell_terminal.ps1

$backupDir = Join-Path $env:USERPROFILE ("powershell_profile_backup_{0}" -f (Get-Date -Format "yyyyMMdd_HHmmss"))
New-Item -ItemType Directory -Path $backupDir -Force | Out-Null

$profiles = @(
    $PROFILE.AllUsersAllHosts,
    $PROFILE.AllUsersCurrentHost,
    $PROFILE.CurrentUserAllHosts,
    $PROFILE.CurrentUserCurrentHost
) | Where-Object { $_ -ne $null }

foreach ($p in $profiles) {
    if (Test-Path $p) {
        Copy-Item -Path $p -Destination $backupDir -Force
        Remove-Item -Path $p -Force
        Write-Host "Backed up and removed profile: $p"
    } else {
        Write-Host "No profile at: $p"
    }
}

# Remove environment variables added by extensions
$envVars = @(
    "PYTHONSTARTUP",
    "PYTHON_BASIC_REPL",
    "CLAUDE_CODE_SSE_PORT",
    "GIT_ASKPASS",
    "VSCODE_GIT_ASKPASS_NODE",
    "VSCODE_GIT_ASKPASS_EXTRA_ARGS",
    "VSCODE_GIT_ASKPASS_MAIN",
    "VSCODE_GIT_IPC_HANDLE"
)

foreach ($v in $envVars) {
    if (Test-Path "Env:$v") {
        Remove-Item "Env:$v" -ErrorAction SilentlyContinue
        Write-Host "Removed Env:$v"
    } else {
        Write-Host "Env:$v not set"
    }
}

# Clean PATH entries that were prepended by GitHub Copilot Chat or similar extensions
if ($env:PATH) {
    $pathParts = $env:PATH -split ';' | Where-Object { $_ -ne "" }
    $filtered = $pathParts | Where-Object { $_ -notmatch 'globalStorage\\github.copilot-chat' -and $_ -notmatch 'github.copilot-chat' -and $_ -notmatch 'askpass' }
    $env:PATH = ($filtered -join ';')
    Write-Host "Filtered PATH entries containing 'github.copilot-chat' or 'askpass'."
} else {
    Write-Host "No PATH to filter."
}

Write-Host "\nDone. Backups (if any) are in: $backupDir"
Write-Host "Please restart VS Code and open a new PowerShell terminal to observe the restored defaults."
