# Test script for the chat API
# Make sure your Next.js dev server is running first

$body = @{
    message = "What kind of engineer are you?"
    mode = "interview"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/chat" -Method POST -Body $body -ContentType "application/json"
    Write-Host "Success!" -ForegroundColor Green
    Write-Host "Answer: $($response.answer)" -ForegroundColor Yellow
    Write-Host "Sources: $($response.sources -join ', ')" -ForegroundColor Cyan
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response: $responseBody" -ForegroundColor Red
    }
}
