# Deploy flyreisen24-proxy Cloudflare Worker
# Run in PowerShell from repo root: .\scripts\deploy-worker.ps1

$ErrorActionPreference = "Stop"
$Root = Split-Path $PSScriptRoot -Parent
Set-Location $Root

function Write-Step($n, $msg) { Write-Host "`n[$n] $msg" -ForegroundColor Cyan }

Write-Host "FlyReisen24 — Cloudflare Worker deploy" -ForegroundColor Green

$wrangler = $null
if (Test-Path "$Root\node_modules\.bin\wrangler.cmd") {
  $wrangler = "$Root\node_modules\.bin\wrangler.cmd"
} elseif (Get-Command wrangler -ErrorAction SilentlyContinue) {
  $wrangler = "wrangler"
}

if (-not $wrangler) {
  Write-Step 1 "Wrangler not found — use Cloudflare Dashboard (recommended if npm is broken)"
  Write-Host @"

  1. Open https://dash.cloudflare.com → Workers & Pages → Create → Create Worker
  2. Name: flyreisen24-proxy
  3. Replace default code with contents of: cloudflare-worker.js
  4. Deploy once, then open Worker → Settings → Variables and Secrets
  5. Add secret: Name = ANTHROPIC_API_KEY , Value = your Anthropic API key
  6. Copy worker URL (e.g. https://flyreisen24-proxy.<account>.workers.dev)
  7. Edit public-config.js:
       window.FLYREISEN_PROXY_URL = 'https://flyreisen24-proxy.<account>.workers.dev';
  8. Commit + push public-config.js to GitHub (Pages redeploys automatically)

  Fix npm then run: npm install && npm run deploy

"@
  exit 0
}

Write-Step 1 "Checking Cloudflare login"
& $wrangler whoami
if ($LASTEXITCODE -ne 0) {
  Write-Host "Run: wrangler login" -ForegroundColor Yellow
  exit 1
}

Write-Step 2 "Set secret (skip if already set)"
Write-Host "Run manually if needed: npm run secret"
Write-Host "Then paste your Anthropic API key when prompted."

Write-Step 3 "Deploying worker"
& $wrangler deploy
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Step 4 "Next steps"
Write-Host @"

  1. Copy the workers.dev URL from deploy output above
  2. Set it in public-config.js → window.FLYREISEN_PROXY_URL
  3. git add public-config.js && git commit && git push

"@
