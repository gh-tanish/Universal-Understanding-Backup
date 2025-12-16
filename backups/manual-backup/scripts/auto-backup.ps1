param(
  [string]$Source = "C:\Users\Tanish!\OneDrive\Universal Understanding",
  [string]$BackupDir = "C:\Users\Tanish!\OneDrive\Universal Understanding\backups",
  [int]$Keep = 7,
  [switch]$CreateBundle,
  [string]$GitBundleName = "Universal-Understanding",
  [string]$CopyTo = ""
)

function Write-Log { param($m) Write-Output "[auto-backup] $m" }

Write-Log "Source: $Source"
Write-Log "Backup dir: $BackupDir"
Write-Log "Keep days: $Keep"

# Ensure backup directory exists
New-Item -ItemType Directory -Path $BackupDir -Force | Out-Null

$timestamp = (Get-Date).ToString("yyyy-MM-dd_HHmm")
$zipPath = Join-Path $BackupDir ("workspace-backup-$timestamp.zip")

Write-Log "Creating ZIP: $zipPath"
try {
  Compress-Archive -Path (Join-Path $Source "*") -DestinationPath $zipPath -Force -ErrorAction Stop
  Write-Log "ZIP created successfully"
} catch {
  Write-Log "Error creating ZIP: $_"
}

if ($CreateBundle) {
  $bundlePath = Join-Path $BackupDir ("$GitBundleName-$timestamp.bundle")
  Write-Log "Creating git bundle: $bundlePath"
  try {
    Push-Location $Source
    git bundle create $bundlePath --all
    Pop-Location
    Write-Log "Git bundle created successfully"
  } catch {
    Write-Log "Error creating git bundle: $_"
    Pop-Location -ErrorAction SilentlyContinue
  }
}

if ($CopyTo -ne "") {
  Write-Log "Copying backups to: $CopyTo"
  New-Item -ItemType Directory -Path $CopyTo -Force | Out-Null
  Copy-Item -Path $zipPath -Destination $CopyTo -Force
  if ($CreateBundle) { Copy-Item -Path $bundlePath -Destination $CopyTo -Force }
  Write-Log "Copy complete"
}

# Cleanup older files by CreationTime
Write-Log "Removing backups older than $Keep days in $BackupDir"
Get-ChildItem -Path $BackupDir -File | Where-Object { $_.CreationTime -lt (Get-Date).AddDays(-$Keep) } | ForEach-Object {
  try { Remove-Item -Path $_.FullName -Force; Write-Log "Removed: $($_.Name)" } catch { Write-Log "Failed to remove $($_.Name): $_" }
}

Write-Log "Auto-backup finished"
