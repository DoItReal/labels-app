import { useState } from "react";
import * as PDFLib from 'pdf-lib';

export const PDF = ({ imageURLs }: { imageURLs: string[] }) => {
    const [pdf, setPdf] = useState('');

    const generate = () => {
        if (pdf) return;
        if (imageURLs.length < 1) return;
        createPDF(imageURLs, setPdf);
    }
    generate();

    return (

        <iframe title='PDF Labels' src={pdf} style={{ width: '100%', height: '100%' }}></iframe>

    );

}

// Function to transform an array of ReactCanvas components to an array of DataURLs

async function createPDF(labels: Array<string>, setPdf: (arg: string) => void) {

    //creates new PDF Document
    const doc = await PDFLib.PDFDocument.create();
    //adds page to just created PDF Document

    /*          Method doc.addPage(pageSize(w,h))
     * 1 - (w,h) < <number>, <number> >  ... doc.addPage(700,800);
     * 2 - (PageSizes.*) ... doc.addPage(PageSizes.A4);
     * 3
     * 
     */
    //  const page = doc.addPage(PDFLib.PageSizes.A4);
    // console.log(catalog);
    // const labelsURLs = transformToDataUrl(catalog);
    const chunks = [];
    for (let i = 0; i < labels.length; i += 8) {
        chunks.push(labels.slice(i, i + 8));
    }

    // Generate pages for each chunk of entries
    for (const chunk of chunks) {
        const page = doc.addPage(PDFLib.PageSizes.A4);

        const tmpWidth = page.getSize().width;
        const tmpHeight = page.getSize().height;
        const width = tmpWidth - 10;
        const height = tmpHeight - 10;
        let y = height - 5;
        let x = 0;

        // Print each label on the page
        for (const label of chunk) {
            // label.width = width / 2;
            //  label.height = height / 4;
            //  console.log(label);
            //  const cnv = document.getElementById('canvas$' + label._id);
            //    if (cnv && cnv.getAttribute('data-url')) console.log(cnv.getAttribute('data-url'));
            var jpgImage = await doc.embedPng(label);
            //  const jpgImage = await doc.embedJpg(label);

            //used for debugging
            // console.log(jpgImage);
            //draws just created JPEG image to the page
            page.drawImage(jpgImage, {
                x: x + 5,
                y: y - height / 4,
                width: width / 2 - 5,
                height: height / 4 - 10
            });
            if (x > 0) {
                x = 0;
                y -= (height - 10) / 4;
            } else x = x + width / 2 + 5;
        }

    }


    //saving the PDF doc as dataUri
    try {
        const dataUri = await doc.saveAsBase64({ dataUri: true });
        setPdf(dataUri);
    } catch (e) {
        console.log(e);
        setPdf('');
    }
    /* 
 // Save the PDF document to a file
 const pdfBytes = await doc.save();
 
 // Use the pdfBytes to save the PDF document or perform further operations
 // Example: Save the PDF to a file
     var file = new Blob([pdfBytes], { type: 'application/pdf' });
     var fileURL = URL.createObjectURL(file);
     window.open(fileURL);
     */
}