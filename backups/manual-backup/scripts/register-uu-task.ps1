$scriptPath = "C:\Users\Tanish!\OneDrive\Universal Understanding\scripts\auto-backup.ps1"
$action = New-ScheduledTaskAction -Execute "PowerShell.exe" -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$scriptPath`" -CreateBundle"
$trigger = New-ScheduledTaskTrigger -Daily -At "02:00"
Register-ScheduledTask -TaskName "UU-AutoBackup" -Action $action -Trigger $trigger -Force
Write-Output "Registered UU-AutoBackup task to run $scriptPath daily at 02:00"
