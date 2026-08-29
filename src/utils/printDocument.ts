/**
 * High-reliability Direct Printing Utility for UPT Puskesmas Boganatar
 * Opens native browser printer selection dialog and allows selecting local printer / PDF.
 */

export interface PrintOptions {
  title?: string;
  landscape?: boolean;
}

export function printDocumentElement(elementId: string, options?: PrintOptions): void {
  const element = document.getElementById(elementId);
  if (!element) {
    // Fallback if element not found: print current window
    window.focus();
    window.print();
    return;
  }

  const title = options?.title || 'Dokumen Resmi - UPT Puskesmas Boganatar';
  const landscape = options?.landscape || false;

  // Clone HTML content
  const contentHtml = element.innerHTML;

  // Attempt to open a dedicated clean print window
  try {
    const printWindow = window.open('', '_blank', 'width=1024,height=800,menubar=no,toolbar=no,location=no,status=no');
    
    if (printWindow && printWindow.document) {
      printWindow.document.open();
      printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="id">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>${title}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @page {
              size: A4 ${landscape ? 'landscape' : 'portrait'};
              margin: 12mm 15mm 15mm 15mm;
            }
            body {
              background-color: #ffffff !important;
              color: #000000 !important;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              margin: 0;
              padding: 10px;
            }
            table {
              border-collapse: collapse;
              width: 100%;
              page-break-inside: auto;
            }
            tr {
              page-break-inside: avoid;
              page-break-after: auto;
            }
            thead {
              display: table-header-group;
            }
            tfoot {
              display: table-footer-group;
            }
            .print\\:hidden {
              display: none !important;
            }
            @media print {
              body {
                padding: 0;
              }
              .no-print {
                display: none !important;
              }
            }
          </style>
        </head>
        <body class="bg-white text-slate-900">
          <div class="print-container max-w-[210mm] mx-auto">
            ${contentHtml}
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.focus();
                window.print();
              }, 400);
            };
          </script>
        </body>
        </html>
      `);
      printWindow.document.close();
      return;
    }
  } catch (e) {
    console.warn('Popup print window blocked or failed, falling back to direct window.print()', e);
  }

  // Fallback if popup blocked or running in sandboxed iframe:
  const originalTitle = document.title;
  if (title) document.title = title;
  
  window.focus();
  window.print();

  setTimeout(() => {
    document.title = originalTitle;
  }, 1500);
}
