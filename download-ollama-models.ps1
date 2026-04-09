# =========================
# Ollama Models Auto Downloader
# =========================

$models = @(
    "llama3.1:8b",
    "qwen2.5-coder:1.5b-base",
    "nomic-embed-text:latest"
)

function Download-Model {
    param (
        [string]$modelName
    )

    $attempt = 1

    while ($true) {
        Write-Host "===================================="
        Write-Host "Downloading model: $modelName"
        Write-Host "Attempt: $attempt"
        Write-Host "===================================="

        ollama pull $modelName

        if ($LASTEXITCODE -eq 0) {
            Write-Host "SUCCESS: $modelName downloaded.`n"
            break
        }

        $wait = [Math]::Min(60, 5 * $attempt)
        Write-Host "FAILED: retrying $modelName in $wait seconds...`n"

        Start-Sleep -Seconds $wait
        $attempt++
    }
}

# =========================
# Main
# =========================

Write-Host "Starting Ollama model downloads..."

foreach ($model in $models) {
    Download-Model -modelName $model
}

Write-Host "All models downloaded successfully!"