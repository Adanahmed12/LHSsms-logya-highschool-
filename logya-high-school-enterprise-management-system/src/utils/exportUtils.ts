import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

/**
 * Export data to CSV file
 */
export function exportToCSV(filename: string, headers: string[], rows: (string | number)[][]) {
  const csvContent =
    'data:text/csv;charset=utf-8,' +
    [headers.join(','), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(','))].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Export data to Excel (.xlsx) file
 */
export function exportToExcel(filename: string, sheetName: string, headers: string[], rows: (string | number)[][]) {
  const worksheetData = [headers, ...rows];
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

/**
 * Export tabular data to PDF document
 */
export function exportToPDF(
  title: string,
  subtitle: string,
  filename: string,
  headers: string[],
  rows: (string | number)[][]
) {
  const doc = new jsPDF();

  // Header Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, 210, 32, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('LOGYA HIGH SCHOOL - SMS', 14, 15);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Logya, Afar Regional State, Ethiopia | Tel: +251 33 551 0142', 14, 23);

  // Document Title
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 14, 42);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`${subtitle} | Generated on: ${new Date().toLocaleDateString()}`, 14, 48);

  // AutoTable
  (doc as any).autoTable({
    startY: 54,
    head: [headers],
    body: rows,
    theme: 'grid',
    headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontStyle: 'bold' },
    styles: { fontSize: 8, cellPadding: 3 },
    alternateRowStyles: { fillColor: [248, 250, 252] },
  });

  doc.save(`${filename}.pdf`);
}

/**
 * Export data as formatted Word document (.doc HTML wrapper)
 */
export function exportToWord(title: string, subtitle: string, filename: string, headers: string[], rows: (string | number)[][]) {
  const headerHtml = headers.map((h) => `<th style="background:#1e293b; color:#ffffff; padding:8px; border:1px solid #cbd5e1;">${h}</th>`).join('');
  const rowsHtml = rows
    .map(
      (r) =>
        `<tr>${r.map((c) => `<td style="padding:6px; border:1px solid #cbd5e1;">${c}</td>`).join('')}</tr>`
    )
    .join('');

  const wordHtml = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><title>${title}</title><style>body{font-family:Arial,sans-serif;} table{width:100%;border-collapse:collapse;}</style></head>
    <body>
      <h2 style="color:#0f172a;margin-bottom:2px;">LOGYA HIGH SCHOOL - EMIS REPORT</h2>
      <p style="color:#64748b;margin-top:0;">Logya, Afar Regional State, Ethiopia</p>
      <h3>${title}</h3>
      <p><i>${subtitle}</i></p>
      <table>
        <thead><tr>${headerHtml}</tr></thead>
        <tbody>${rowsHtml}</tbody>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff', wordHtml], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/**
 * Trigger clean browser print preview for printable element or page
 */
export function triggerPrint() {
  window.print();
}
