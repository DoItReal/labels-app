import { useEffect, useState } from "react";
import * as PDFLib from 'pdf-lib';
import { Design } from "../DB/Interfaces/Designs";
import { truncate } from "fs/promises";

export const PDF = ({ imageURLs, design }: { imageURLs: Map<string, number>, design: Design }) => {
    const [pdf, setPdf] = useState('');

    const generate = () => {
        if (pdf) return;
        if (imageURLs.size < 1) return;
        createPDF(imageURLs, setPdf, design);
    }
    useEffect(() => {
        generate();

    }, [imageURLs]);
   
    return (

        <iframe title='PDF Labels' src={pdf} style={{ width: '100%', height: '100%' }}></iframe>

    );

}

// Function to transform an array of ReactCanvas components to an array of DataURLs

async function createPDF(labels: Map<string, number>, setPdf: (arg: string) => void, design:Design) {
    const [A4width, A4height] = PDFLib.PageSizes.A4;
    const labelsPerPage = Math.floor(A4height / design.canvas.dim.height)*2;
   // console.log('A4Height:', A4height, '  DesignHeight:', design.canvas.dim.height, '  LabelsPerPage:', labelsPerPage);
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

    const getAllLabels = (labelsMap: Map<string, number>) => {
        const chunks: string[] = [];
        const labels = Array.from(labelsMap.entries());
        labels.map(([dataURL, count], index) => {
            for (let i = 0; i < count; i++) {
                chunks.push(dataURL);
            }
        });
        return chunks;
    }

    const labelsData = getAllLabels(labels);
    for (let i = 0; i < labelsData.length; i += labelsPerPage) {
        chunks.push(labelsData.slice(i, i + labelsPerPage));
    }

    /* Generate pages for each chunk of entries */
    for (const chunk of chunks) {
        const page = doc.addPage(PDFLib.PageSizes.A4);

        const tmpWidth = page.getSize().width;
        const tmpHeight = page.getSize().height;
        const width = tmpWidth -10;
        const height = tmpHeight - 10;
        const offsetX = (tmpWidth - 2 * (design.canvas.dim.width + 5)) / 2;
        let y = height - 10;
        let x = offsetX;

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
            console.log(offsetX);
            page.drawImage(jpgImage, {
                x: x, //2px padding for easier cutting of the labels
                y: y - design.canvas.dim.height,
                width: design.canvas.dim.width, // the original width of the label 
                height: design.canvas.dim.height // the original height of the label
            });
            if (x > offsetX) {
                x = offsetX;
                y -= design.canvas.dim.height + 2 ;
            } else x = x + design.canvas.dim.width+2;
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