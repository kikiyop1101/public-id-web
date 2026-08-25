# 환경변수 복구 v2 (2026-08-25) — 스토어 로컬 .env.local → 본진 Vercel 프로젝트
# 배경: 스토어 Vercel env가 Sensitive 타입이라 v1 스크립트의 `vercel env pull`이 실제 값 대신
#        "[SENSITIVE]" 문자열을 내려받아 그대로 등록됨 → 본진 /blog·/board·/safety-report 500.
# 동작: ①깡통 값 삭제 ②스토어 .env.local의 실제 값으로 재등록(production+preview, encrypted).
# 값은 화면에 출력하지 않는다.
$ErrorActionPreference = "Stop"
$tok = (Get-Content "$env:APPDATA\xdg.data\com.vercel.cli\auth.json" | ConvertFrom-Json).token
$TEAM = "team_kKhpmjBlmfjwMQg3U78hImRz"
$PRJ  = "prj_voByRyUUOstt6AsgUFnf3FLHkfaa"   # public-id-web
$H = @{ Authorization = "Bearer $tok" }
$keys = @(
  "NEXT_PUBLIC_SUPABASE_URL","NEXT_PUBLIC_SUPABASE_ANON_KEY","SUPABASE_SERVICE_ROLE_KEY",
  "ADMIN_SESSION_TOKEN","ADMIN_PASSWORD","BOARD_HASH_SALT","NAVER_BLOG_RSS_URL",
  "HERMES_WEBHOOK_URL"
)

# ① 깡통([SENSITIVE]) 등록분 삭제 — 오늘(08-25) 이후 만들어진 해당 키만
$envs = (Invoke-RestMethod -Headers $H "https://api.vercel.com/v9/projects/$PRJ/env?teamId=$TEAM").envs
foreach ($e in $envs) {
  if ($keys -contains $e.key -and $e.createdAt -gt ([DateTimeOffset]"2026-08-25").ToUnixTimeMilliseconds()) {
    Invoke-RestMethod -Method Delete -Headers $H "https://api.vercel.com/v9/projects/$PRJ/env/$($e.id)?teamId=$TEAM" | Out-Null
    Write-Host "깡통 삭제: $($e.key)"
  }
}

# ② 스토어 .env.local에서 실제 값 재등록
$envFile = "C:\Users\user\Desktop\시스템-외부보관\public-id-store-web\.env.local"
if (-not (Test-Path $envFile)) { Write-Host "스토어 .env.local 없음 — 값을 아는 곳이 없어 중단"; exit 1 }
$done = @()
foreach ($line in Get-Content $envFile) {
  if ($line -match '^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$') {
    $k = $Matches[1]; $v = $Matches[2].Trim()
    if ($v.Length -ge 2 -and (($v[0] -eq '"' -and $v[-1] -eq '"') -or ($v[0] -eq "'" -and $v[-1] -eq "'"))) { $v = $v.Substring(1, $v.Length-2) }
    if ($keys -contains $k -and $v -and $v -ne "[SENSITIVE]") {
      $body = @{ key=$k; value=$v; type="encrypted"; target=@("production","preview") } | ConvertTo-Json
      Invoke-RestMethod -Method Post -Headers ($H + @{ "Content-Type"="application/json" }) `
        -Body $body "https://api.vercel.com/v10/projects/$PRJ/env?teamId=$TEAM&upsert=true" | Out-Null
      Write-Host "등록: $k"
      $done += $k
    }
  }
}
$missing = $keys | Where-Object { $done -notcontains $_ }
if ($missing) { Write-Host "주의 - .env.local에 없던 키: $($missing -join ', ')" }
Write-Host "끝 — 값은 표시되지 않았습니다."
