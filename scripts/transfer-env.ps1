# 스토어 → 본진 Vercel 환경변수 이전 (2026-08-25 홈페이지 통합 P3 준비)
# 값은 화면에 출력하지 않는다. 대표가 직접 실행: powershell -File scripts\transfer-env.ps1
$store = "C:\Users\user\Desktop\시스템-외부보관\public-id-store-web"
$main  = "C:\Users\user\Desktop\시스템-외부보관\public-id-web"
$keys = @(
  "NEXT_PUBLIC_SUPABASE_URL","NEXT_PUBLIC_SUPABASE_ANON_KEY","SUPABASE_SERVICE_ROLE_KEY",
  "ADMIN_SESSION_TOKEN","ADMIN_PASSWORD","BOARD_HASH_SALT",
  "HERMES_WEBHOOK_URL","HERMES_WEBHOOK_SECRET","NAVER_BLOG_RSS_URL",
  "NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY","ANTHROPIC_API_KEY"
)
$tmp = Join-Path $env:TEMP "env-transfer.tmp"
Set-Location $store
npx vercel env pull $tmp --environment=production --yes
if (-not (Test-Path $tmp)) { Write-Host "env pull 실패 — 스토어 폴더가 vercel link 되어 있는지 확인"; exit 1 }
$existing = (npx vercel env ls production --cwd $main 2>$null) -join "`n"
foreach ($line in Get-Content $tmp) {
  if ($line -match '^([A-Z0-9_]+)="?(.*?)"?\s*$') {
    $k = $Matches[1]; $v = $Matches[2]
    if ($keys -contains $k) {
      if ($existing -match [regex]::Escape($k)) { Write-Host "skip(이미 있음): $k"; continue }
      $v | npx vercel env add $k production --cwd $main | Out-Null
      Write-Host "이전 완료: $k"
    }
  }
}
Remove-Item $tmp -Force
Write-Host "끝 — 값은 표시되지 않았습니다. 이제 배포하면 됩니다."
