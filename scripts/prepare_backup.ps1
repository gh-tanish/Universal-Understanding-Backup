param(
    [string]$Source = "Website",
    [string]$Dest = "backups",
    [switch]$Timestamp
)

if (-not (Test-Path -Path $Source)) {
    Write-Error "Source folder '$Source' not found."
    exit 1
}

if (-not (Test-Path -Path $Dest)) {
    New-Item -ItemType Directory -Path $Dest | Out-Null
}

$ts = if ($Timestamp) { Get-Date -Format "yyyy-MM-ddTHHmmssZ" } else { "" }
$zipName = if ($ts -ne "") { "$($Source)-$ts.zip" } else { "$($Source).zip" }
$destPath = Join-Path $Dest $zipName

if (Test-Path -Path $destPath) { Remove-Item -Path $destPath -Force }

Compress-Archive -Path (Join-Path $PWD $Source) -DestinationPath $destPath -Force
Write-Output "Created backup: $destPath"
