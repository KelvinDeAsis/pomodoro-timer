Add-Type -AssemblyName System.Drawing
foreach ($iconSize in @(192, 512)) {
  $bitmap = New-Object System.Drawing.Bitmap($iconSize, $iconSize)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.ScaleTransform($iconSize / 64.0, $iconSize / 64.0)
  $graphics.Clear([System.Drawing.ColorTranslator]::FromHtml('#f8d6dc'))
  $brown = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml('#a47353'))
  $cream = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml('#fff4dc'))
  $ink = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml('#493029'))
  $pink = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml('#cf7285'))
  $graphics.FillEllipse($brown, 10, 11, 18, 18)
  $graphics.FillEllipse($brown, 36, 11, 18, 18)
  $graphics.FillEllipse($cream, 9, 15, 46, 42)
  $graphics.FillEllipse($ink, 21, 29, 6, 6)
  $graphics.FillEllipse($ink, 37, 29, 6, 6)
  $graphics.FillEllipse($pink, 28, 37, 8, 6)
  $iconPath = Join-Path $PSScriptRoot "../public/icons/icon-$iconSize.png"
  $bitmap.Save($iconPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $graphics.Dispose()
  $bitmap.Dispose()
  $brown.Dispose()
  $cream.Dispose()
  $ink.Dispose()
  $pink.Dispose()
}
