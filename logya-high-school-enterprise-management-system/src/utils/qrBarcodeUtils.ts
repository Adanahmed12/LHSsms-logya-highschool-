/**
 * SVG QR Code & Barcode Generator Helpers for Logya High School Student/Teacher Cards and Library Books
 */

// Simple SVG 1D Barcode Renderer (Code 128 / Interleaved 2 of 5 style visual)
export function generateBarcodeSVG(code: string, width = 180, height = 40): string {
  let barsHtml = '';
  const hash = code.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const totalBars = 35;
  const barWidth = width / totalBars;

  for (let i = 0; i < totalBars; i++) {
    const isBlack = (i * 7 + hash * 3) % 11 > 3;
    const x = i * barWidth;
    if (isBlack) {
      barsHtml += `<rect x="${x.toFixed(1)}" y="0" width="${barWidth.toFixed(1)}" height="${height - 12}" fill="#0f172a"/>`;
    }
  }

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; padding:2px; border-radius:4px;">
      ${barsHtml}
      <text x="${width / 2}" y="${height - 2}" font-family="monospace" font-size="9" fill="#334155" text-anchor="middle" font-weight="bold">${code}</text>
    </svg>
  `;
}

// Simple Matrix SVG QR Code Renderer
export function generateQRCodeSVG(data: string, size = 80): string {
  const gridSize = 13;
  const cellSize = size / gridSize;
  let cellsHtml = '';

  // Seed pseudo pattern from data string
  const strSeed = data.split('').reduce((a, b) => a + b.charCodeAt(0), 0);

  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      // Draw standard QR finder patterns in top-left, top-right, bottom-left
      const isTopLeftFinder = r < 4 && c < 4;
      const isTopRightFinder = r < 4 && c >= gridSize - 4;
      const isBottomLeftFinder = r >= gridSize - 4 && c < 4;

      let isFilled = false;

      if (isTopLeftFinder || isTopRightFinder || isBottomLeftFinder) {
        const localR = isTopLeftFinder ? r : isTopRightFinder ? r : r - (gridSize - 4);
        const localC = isTopLeftFinder ? c : isTopRightFinder ? c - (gridSize - 4) : c;
        if (localR === 0 || localR === 3 || localC === 0 || localC === 3 || (localR === 1.5 && localC === 1.5)) {
          isFilled = true;
        }
      } else {
        isFilled = (r * 13 + c * 7 + strSeed) % 5 < 3;
      }

      if (isFilled) {
        cellsHtml += `<rect x="${(c * cellSize).toFixed(1)}" y="${(r * cellSize).toFixed(1)}" width="${cellSize.toFixed(1)}" height="${cellSize.toFixed(1)}" fill="#0f172a"/>`;
      }
    }
  }

  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; padding:3px; border:1px solid #e2e8f0; border-radius:4px;">
      ${cellsHtml}
    </svg>
  `;
}
