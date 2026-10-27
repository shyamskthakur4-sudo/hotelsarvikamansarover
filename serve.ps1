param(
    [int]$Port = 3000,
    [string]$Root = $PSScriptRoot
)

$ip = [System.Net.IPAddress]::Loopback
$listener = $null

$portsToTry = @($Port, 8080, 8000, 5000, 5500)
foreach ($p in $portsToTry) {
    try {
        $listener = New-Object System.Net.Sockets.TcpListener($ip, $p)
        $listener.Start()
        $Port = $p
        break
    } catch {
        $listener = $null
    }
}

if ($null -eq $listener) {
    Write-Error "Could not bind to any available local port."
    exit 1
}

$url = "http://localhost:$Port/"

Write-Output "=========================================================="
Write-Output "  HOTEL SARVIKA MANSAROVER - LOCAL WEB SERVER"
Write-Output "  Serving Directory : $Root"
Write-Output "  Website URL       : $url"
Write-Output "=========================================================="
Write-Output "Server running on $url (Press Ctrl+C to stop)..."

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".svg"  = "image/svg+xml"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".webp" = "image/webp"
    ".ico"  = "image/x-icon"
}

while ($true) {
    try {
        $client = $listener.AcceptTcpClient()
        $stream = $client.GetStream()
        
        $reader = New-Object System.IO.StreamReader($stream)
        $requestLine = $reader.ReadLine()

        if (-not [string]::IsNullOrWhiteSpace($requestLine)) {
            $parts = $requestLine -split " "
            if ($parts.Length -ge 2) {
                $method = $parts[0]
                $rawUri = $parts[1]
                
                # Strip query parameters
                $pathOnly = $rawUri.Split("?")[0].TrimStart('/')
                if ([string]::IsNullOrWhiteSpace($pathOnly)) {
                    $pathOnly = "index.html"
                }

                $cleanPath = [System.Uri]::UnescapeDataString($pathOnly).Replace('/', [System.IO.Path]::DirectorySeparatorChar)
                $targetFile = Join-Path $Root $cleanPath

                if (Test-Path -Path $targetFile -PathType Leaf) {
                    $ext = [System.IO.Path]::GetExtension($targetFile).ToLower()
                    $mime = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
                    $fileBytes = [System.IO.File]::ReadAllBytes($targetFile)

                    $header = "HTTP/1.1 200 OK`r`n" +
                              "Content-Type: $mime`r`n" +
                              "Content-Length: $($fileBytes.Length)`r`n" +
                              "Connection: close`r`n" +
                              "Access-Control-Allow-Origin: *`r`n`r`n"
                    $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($header)
                    
                    $stream.Write($headerBytes, 0, $headerBytes.Length)
                    $stream.Write($fileBytes, 0, $fileBytes.Length)
                    $stream.Flush()
                } else {
                    $body = "<html><body><h1>404 Not Found</h1><p>$pathOnly</p></body></html>"
                    $bodyBytes = [System.Text.Encoding]::UTF8.GetBytes($body)
                    $header = "HTTP/1.1 404 Not Found`r`n" +
                              "Content-Type: text/html; charset=utf-8`r`n" +
                              "Content-Length: $($bodyBytes.Length)`r`n" +
                              "Connection: close`r`n`r`n"
                    $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($header)
                    $stream.Write($headerBytes, 0, $headerBytes.Length)
                    $stream.Write($bodyBytes, 0, $bodyBytes.Length)
                    $stream.Flush()
                }
            }
        }

        $stream.Close()
        $client.Close()
    } catch {
        # Continue loop on aborted client connections
    }
}
