import { Label } from '../../labels';
import './index.css';
import * as PDFLib from 'pdf-lib';
import { useRef, useState } from 'react';
import { IaddedLabel, IcontentProps } from '../Content';
import { ReactComponent as FetchButtonSVG } from '../LeftSide/LabelsContainer/fetchButtonSVG.svg';

export default function RightSide({ enableStates, updateStates, addedLabels }: IcontentProps ) {
    const PDFrow = useRef<JSX.Element| null>(null);
    if (!enableStates.get('createPDF')) return null;
    const handleClose = (event: React.MouseEvent) => {
        event.stopPropagation();
        updateStates('createPDF', false);
    }
    const update = () => {
        updateStates('updatePDF', true);
    }
    if (enableStates.get('updatePDF')) {
        PDFrow.current = <CreatePDF labels={addedLabels} />;
        updateStates('updatePDF', false);
    }
    
    return (
        <div id="rightSide">
            <div className="headBar">
                <button className="refreshPDF" onClick={update} ><FetchButtonSVG /></button><button className="closeButton" onClick={handleClose}>X</button>
            </div>
            <div className="previewList" />
            {PDFrow.current}
        </div>
    );
}

function CreatePDF({ labels }: { labels: IaddedLabel[] }) {
    const [pdf, setPdf] = useState('');
    const canvasArr: Array<HTMLCanvasElement> = [];
    for (const entry of labels) {
        // const labelsImg = [];
        const width = PDFLib.PageSizes.A4[0];
        const height = PDFLib.PageSizes.A4[1];
        let signsInPage = 8;

        let sign = new Label(width / 2 - 10, height / (signsInPage / 2) - 10);
        sign.setContent(entry.allergens, { bg: decodeURI(entry.bg), en: entry.en, de: entry.de, rus: entry.rus });
        sign.setId(entry._id);

        if (entry.count && entry.count > 1) {
            for (let i = 1; i <= entry.count; i++) {
               canvasArr.push(sign.generate());
            }
           } else {
           canvasArr.push(sign.generate());
          }
    }

   PDF(canvasArr, setPdf);
    return (<div>

        <iframe className="pdf" src={pdf}></iframe>
    </div>
    );
}

async function PDF(signs: Array<HTMLCanvasElement>, setPdf:(arg: string) => void) {

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

    const chunks = [];
    for (let i = 0; i < signs.length; i += 8) {
        chunks.push(signs.slice(i, i + 8));
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

        // Print each entry on the page
        for (const sign of chunk) {
            var jpgImage = await doc.embedJpg(sign.toDataURL('image/jpeg'));

            //used for debugging

            //draws just created JPEG image to the page
            page.drawImage(jpgImage, {
                x: x + 10,
                y: y - sign.height,
                width: sign.width,
                height: sign.height
            });
            if (x > 0) {
                x = 0;
                y -= sign.height + 5;
            } else x = x + sign.width + 5;
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