export interface PDFBlobOptions {
    margin?: number | [number, number, number, number];
    filename?: string;
    pagebreak?: any;
    windowWidth?: number;
    scale?: number;
}

export const generatePDFBlob = async (
    elementId: string,
    filename: string,
    options?: PDFBlobOptions
): Promise<Blob> => {
    const element = document.getElementById(elementId);
    if (!element) {
        throw new Error(`Element with id ${elementId} not found`);
    }

    const opt: any = {
        margin: options?.margin !== undefined ? options.margin : [6, 8, 6, 8],
        filename: filename,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: {
            scale: options?.scale || 2,
            useCORS: true,
            logging: false,
            windowWidth: options?.windowWidth || 1280,
            onclone: (clonedDoc: any) => {
                const el = clonedDoc.getElementById(elementId);
                if (el) {
                    el.style.opacity = '1';
                    el.style.visibility = 'visible';
                    el.style.transform = 'none';
                    el.style.width = '100%';
                    el.style.maxWidth = '100%';
                    el.style.minWidth = '0';
                    el.style.margin = '0';
                    el.style.boxSizing = 'border-box';
                    el.style.boxShadow = 'none';
                    el.classList.add('force-desktop');
                    
                    const parent = el.parentElement;
                    if (parent) {
                        parent.style.opacity = '1';
                        parent.style.visibility = 'visible';
                    }
                }
                const container = clonedDoc.querySelector('.html2pdf__container');
                if (container) {
                    container.style.boxSizing = 'border-box';
                    container.style.overflow = 'visible';
                }
            }
        },
        pagebreak: options?.pagebreak || { mode: ['avoid-all', 'css', 'legacy'] },
        jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
    };

    const html2pdfModule: any = await import('html2pdf.js');
    const html2pdf = html2pdfModule.default || html2pdfModule;
    const worker = html2pdf().from(element).set(opt);
    const blob: Blob = await worker.output('blob');
    return blob;
};
