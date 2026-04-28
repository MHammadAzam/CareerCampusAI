import * as pdfjs from 'pdfjs-dist';

// Initialize PDF.js worker using a stable CDN link that works across origins
// Using the .mjs version for compatibility with modern build tools and environments
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export async function extractTextFromFile(file: File): Promise<string> {
  console.log("Extracting text from:", file.name, "size:", file.size);
  const extension = file.name.split('.').pop()?.toLowerCase();

  if (extension === 'txt') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (e) => reject(new Error("Failed to read text file."));
      reader.readAsText(file);
    });
  }

  if (extension === 'pdf') {
    try {
      const arrayBuffer = await file.arrayBuffer();
      console.log("ArrayBuffer loaded, length:", arrayBuffer.byteLength);
      
      const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      
      console.log("PDF loaded, pages:", pdf.numPages);
      let text = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items.map((item: any) => item.str);
        text += strings.join(' ') + '\n';
      }
      return text;
    } catch (err: any) {
      console.error("PDF extraction error:", err);
      throw new Error(`Failed to extract text from PDF: ${err.message || 'Unknown error'}`);
    }
  }

  throw new Error(`Unsupported file type: ${extension}. Please upload a PDF or TXT file.`);
}
