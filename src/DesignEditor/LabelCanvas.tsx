/*
   Generates HTML Canvas 5
   Visualizes the Label using the selected block
     const canvasRef  - keeps refference to the Canvas this function returns and use it for further Manipulations
     const drawBlocks() -  1. Checks the canvas if is defined! (In case we try to manipulate the canvas before the first render)
                            2. Gets the context for Canvas and checks if everything is ok!
                            3. Creates queues for all the elements we are going to draw before drawing it!
                                *   It goes throught all elements from $designs because we want to draw only this elements!
                                * So we are going to display only the elements we received request for in $designs! Preventing bugs and performance issues
                                *   At the time of writing this I am using 3 Queues (textQueue, allergenQueue, imageQueue) as this implements the desired logic at the moment.
                                * In future probably there will be single Queue and many categories Queue and each one will have a callback function
                                * which will draw its content on request
                            4. Draws the Queues Using draw_functions(queue);
     const generateQueueElement(block, context) -  1. Checks each block for its type
                                          2. Generates queue element for the type of block (at the moment types:text | allergen | image) 
                                            each type have its own specific way of drawing and elements to draw!
                                          3. Return the queue element when generated!
    const generateTextQueue(block, context, txt) - Generates textQueue and returns it! 
                        block:         Selected block,
                        context:        The context where will be drawing, 
                        txt:            The text to draw

                                        1. Splits the string to words[] 
                                        2. Fits the text using fitText() - it can fit the text in multilines or on single lines!
                    return const fitText() - Its returned from the main function! Generates the queue and returns it!
                                            1. Measures the text using the selected block and reduces it if it doesnt fit!
                   ***  TO DO!!             2. centerText() - It centers the text and return ! To rework it later to can selected direction of the text in block
                                            3. returns $textQueue;
                   const generateAllergenQueue(block, context, imageURLs) - it generates allergen Queue and returns it!
                   *** TO DO!! arr:string[] 1. imgCalibrate(arr:number[]) - Calibrates the block font to fit all the content! {AllergenNumber, AllergenImage}[];
                   *** TO DO!!              2. imgCenter(arr.length, textSize) - Returns dimensions for drawing centering the content in the box 
                                            3. returns $allergenQueue;
    const generateImageQueue(block, context) - generates queue and returns it with the desired props from the selected block 
            return $imageQueue;
    const drawTextQueue(textQueue) - draws $textQueue

    const drawAllergenQueue(allergenQueue) - draws $textQueue

    const drawImageQueue(imageQueue) - draws the $imageQueue
*/

import React, { useEffect, useRef, useState } from 'react';
import { getImageById } from '../DB/LocalStorage/Images'; // Import the Design type
import { textParametersMap } from './Editor';
import { PNGs } from '../pngs';
import { imagePointerBlock, allergenFieldBlock, UnifiedBlock, isImagePointer } from '../DB/Interfaces/Designs';
import { IallergenQueue, IimageQueue, ItextQueue, CanvasProps, TqueueArray, isTextQueue, isImageQueue, isAllergenQueue } from './Interfaces/LabelCanvasInterfaces';
import { generateQRCodeCanvas as QRcode } from '../UI/QRcode';
import { isLabelDataType } from '../DB/Interfaces/Labels';

const png = new PNGs();
const Canvas: React.FC<CanvasProps> = ({ design, label, qrCode=false }) => {
    const [queue, setQueue] = useState<TqueueArray>([]); // [textQueue, allergenQueue, imageQueue]
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const dimensions = design.canvas.dim;
    const border = design.canvas.border;
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const drawed = useRef(false);
    const blocks = structuredClone(design.blocks);
    // eslint-disable-next-line
    const drawBlocks = async () => {
        //check if canvas and context exists
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext('2d');
        if (!context) return;

        context.save();
        //clear the canvas
        context.clearRect(0, 0, canvas.width, canvas.height);
        //for each block in the design we are going to generate the queue element and push it to the queue
       
        drawBorder(context);
       
        drawBackground(context);
       
        drawQueue(queue);
        context.restore();
        try {
            if (qrCode) await drawQRCode(context);
        } catch (error) {
            console.error('Failed to generate QR Code:', error);
        }
        
       
    };
    const generateQueue = () => {
        const queueTmp: TqueueArray = [];
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext('2d');
        if (!context) return;
        if (!blocks || !Array.isArray(blocks))
            console.log('Err: blocks is not Array!');
        else
            blocks.forEach((block) => {
                const queueElement = generateQueueElement(block, context);
                if (queueElement) queueTmp.push(queueElement);
            });
        setQueue([...queueTmp]);
    }
    //TO ADD block.multiline that can be true or false and to render the text on multiple lines or on single one!
    
    const drawBorder = (context:CanvasRenderingContext2D) => {
        context.save();
        context.strokeStyle = 'black';
        context.lineWidth = border;
        context.strokeRect(0, 0, dimensions.width, dimensions.height);
        context.restore();
    }
    //TO DO:// Add the possibility to set the background color of the block or to set the background image

    const drawBackground =async (context: CanvasRenderingContext2D) => {
        if (design.canvas.background && isImagePointer(design.canvas.background)) {
            //const img = getImageById(design.canvas.background._id);
            const img =await getImageById(design.canvas.background._id);
            img && drawBackgroundImage(context, img);
        }
        else if (design.canvas.background && typeof (design.canvas.background) === 'string' && design.canvas.background !== '') {
            drawBackgroundColor(context, design.canvas.background);
        }
    }
    const drawQRCode = async (context: CanvasRenderingContext2D) => {
        const allergenBlock = blocks.find((block:UnifiedBlock) => 'type' in block && block.type === 'allergens');
        if(!allergenBlock) return;
        try {
            const qrCodeCanvas = await QRcode(label._id);
            if (!qrCodeCanvas) {
                return;
            }
            const qrCodeSize = (25/100)*dimensions.width-10; // Adjust the size as needed
           
            const qrCodePosition = {
                x:  (dimensions.width - qrCodeSize - border),
                y: border }; // Adjust the position as needed
                    context.save()
                    context.translate(qrCodePosition.x, qrCodePosition.y);
                    context.drawImage(qrCodeCanvas, 0, 0, qrCodeSize, qrCodeSize);
                    context.restore();
              
        } catch (error) {
            console.error('Failed to generate QR Code:', error);
        }
    };
    const drawBackgroundImage = (context: CanvasRenderingContext2D, image: HTMLImageElement) => {
        if(!design.canvas.background || !isImagePointer(design.canvas.background)) return;
        context.save();
        //set transperancy for the image
        context.globalAlpha = design.canvas.background.transperancy/100;
        context.drawImage(image, 0, 0, dimensions.width, dimensions.height);
        context.restore();
    }
    const drawBackgroundColor = (context: CanvasRenderingContext2D, color: string) => {
        context.save();
        context.fillStyle = color;
        context.fillRect(border/2, border/2, dimensions.width - border , dimensions.height - border);
        context.restore();
    }
    const drawQueue = (queue: TqueueArray) => {
     
        if (queue.length === 0) return;
        queue.forEach((item) => {
            if (isTextQueue(item)) {
                drawTextQueue(item);
            } else if (isImageQueue(item)) {
                drawImageQueue(item);
            } else if (isAllergenQueue(item)) {
                drawAllergenQueue(item);
            }
        });
    }

    const generateTextQueue = (block: UnifiedBlock, context: CanvasRenderingContext2D, txt: string) => {
        context.save();
        //get font size
        let textSize = parseInt(block.font);
        context.font = block.font;
        const margin = 1;
        var queueHead: ItextQueue | null = null;
        const words = txt.split(' ');

        //converting to PX from %
        const width = block.dimensions.width * dimensions.width / 100;
        const height = block.dimensions.height * dimensions.height / 100;
        const fitText = (): ItextQueue | null => {
            let lines: string[] = [];
            let line = '';
           
            for (let i = 0; i < words.length; i++) {
                const testLine = line + words[i] + ' ';
                const metrics = context.measureText(testLine);
                const testWidth = metrics.width;

                if (testWidth > width - 10 && i > 0) {
                    lines.push(line);
                    line = words[i] + ' ';
                } else {
                    line = testLine;
                }
            }
            lines.push(line);

            const totalTextHeight = lines.length * textSize * margin;
            const maximumTextWidth = () => {
                let maxWidth = 0;
                lines.forEach((line) => {
                    if (context.measureText(line).width > maxWidth) maxWidth = context.measureText(line).width;
                });
                return maxWidth;
            };
            
            if (totalTextHeight <= height && maximumTextWidth() <= width) { //calculated height <= maximum block height
                return centerText(lines); // everything is OK we can draw that!
            } else {
                if (textSize <= 1) {
                    return centerText(lines); // the minimum textSize achieved Drawing the text! it has to not be hit at all but in case of infinity loop!
                }
                textSize -= 1;
                context.font = textSize + "px " + block.font.split(' ')[1];  //we have to reduce the fontSize till the content fits!
                return fitText(); //reccursion till the text fit
            }
        }
        
        const centerText = (text: string | string[]) => {
            let tmpHead = queueHead;
            const font = textSize + "px " + block.font.split(' ')[1];
            if (text.length === 1) text = text[0];
            //not sure if this is neccesary but in ANY CASE
            if (typeof (text) === 'string') {  //single line case
                const x = (width - context.measureText(text).width) / 2;
                const y = (height - textSize) / 2;
                const realPosition = { x: block.position.x * dimensions.width / 100, y: block.position.y * dimensions.height / 100 };
                queueHead = { context,text: text, x: x, y: y,font, position: realPosition, color:block.color };
            } else { //multiline case
                text.forEach((txt, index) => {
                    const totalTextHeight = text.length * textSize * margin;
                    const startY = (height - totalTextHeight) / 2;
                    const x = (width - context.measureText(txt).width) / 2;
                    const y = startY + index * textSize;
                    const realPosition = { x: block.position.x * dimensions.width / 100, y: block.position.y * dimensions.height / 100 };
                    const newNode: ItextQueue = { context, text: txt, x: x, y: y, font, position: realPosition, color: block.color };
                    if (queueHead === null) {
                        queueHead = newNode;
                        tmpHead = queueHead;
                    } else {
                        tmpHead!.next = newNode;
                        tmpHead = newNode;
                    }
                });
            }
            context.restore();
            return queueHead;     
        }

        return fitText();
    }
    const drawTextQueue = (renderQueue: ItextQueue) => {
        const margin = 1.1;
        //if it is single queue
       /*
       if (!Array.isArray(queueHead) && isTextQueue(queueHead)) {
            const item = queueHead;
            item.context.save();
            item.context.fillStyle = item.color;
            item.context.font = item.font;
            item.context.textBaseline = 'top';
            item.context.translate(item.position.x, item.position.y);
            item.context.fillText(item.text, item.x, item.y * margin);
            item.context.restore();
        }//if it is array of queues
        */
       do  {
            let item = renderQueue;
                item.context.save();
                item.context.fillStyle = item.color;
                item.context.font = item.font;
                item.context.textBaseline = 'top';
                item.context.translate(item.position.x, item.position.y);
                item.context.fillText(item.text, item.x, item.y * margin);
                item.context.restore();
        } while (renderQueue.next !== undefined && (renderQueue = renderQueue.next) !== undefined);
    }

    const generateAllergenQueue = (block: allergenFieldBlock, context: CanvasRenderingContext2D, imageURLs: number[]) => {
        var queueHead: IallergenQueue | null = null;
        const generateQueue = (arr: number[]) => {
            const padding = 5; // padding from the border
            if (arr.length === 1 && arr[0] === 0) return; // ??? 
            //calibrate and set this.fontSize
            const measureTotalLength = (arr: number[], imageWidth: number, whitespaceWidth: number, fontSize: number) => {
                let totalWidth = 0;

                // Calculate the total width of numbers
                arr.forEach((num, index) => {
                    const text = num.toString(); // Convert number to string
                    const textMetrics = context.measureText(text);
                    totalWidth += textMetrics.width + fontSize;

                    // Add whitespace width for all elements except the last one
                    if (index < arr.length - 1) {
                        // Assuming whitespace width is 0.5 times the font size
                        totalWidth += 0.5 * fontSize; // Adjust this value as needed
                    }
                });

                return totalWidth;
            };
            const imgCalibrate = (arr: number[]) => {
                const { width, height } = getHeightWidth();
                let textSize = parseInt(block.font);

                while (textSize > 0) {
                    context.font = textSize + "px " + block.font.split(' ')[1];
                    //const textWidth1 = context.measureText(arr.join(' ')).width + arr.length * textSize;
                    const textWidth = measureTotalLength(arr, textSize, textSize / 2, textSize);
                    if (textWidth <= width - border*2 && textSize <= (height - (padding + border * 2))) {
                        break;
                    }
                    textSize--;
                }

                return textSize;
            };
            const getHeightWidth = () => {
                const width = block.dimensions.width * dimensions.width / 100;
                const height = block.dimensions.height * dimensions.height / 100;
                return { width, height };
                /*
                if (qrCode) {
                    if (block.dimensions.width > 80) {
                        const width = (block.dimensions.width * 0.79) * dimensions.width / 100;
                        const height = block.dimensions.height * dimensions.width / 100;
                        return { width, height };
                    } else {
                        const width = block.dimensions.width * dimensions.width / 100;
                        const height = block.dimensions.height * dimensions.height / 100;
                        return { width, height };
                    }
                } else {
                    const width = block.dimensions.width * dimensions.width / 100;
                    const height = block.dimensions.height * dimensions.height / 100;
                    return { width, height };
                }*/
            }
            const imgCenter = (length: number, textSize: number) => {
                const {width, height } = getHeightWidth();
                const realWidth = width + padding;
                const realHeight = height + padding;
                
             //const totalTextWidth = context.measureText(arr.join('')).width + arr.length * textSize ;
                const totalTextWidth = measureTotalLength(arr, textSize, textSize / 2, textSize);
                const dx = (realWidth - totalTextWidth) / 2;
                const dy = (realHeight - textSize) / 2; // Adjust dy to vertically center the text
                return { x: dx, y: dy };
            };
            let tmpHead = queueHead;
            let textSize = imgCalibrate(imageURLs);
           // console.log(textSize);
           // textSize *= 1;
            let pos = imgCenter(imageURLs.length, textSize);
            let { x: dx, y: dy } = pos;

            for (let i = 0; i < imageURLs.length; i++) {
                context.font = textSize + "px " + block.font.split(' ')[1];
                context.fillStyle = "blue";

                const realPosition = { x: block.position.x * dimensions.width / 100, y: block.position.y * dimensions.height / 100 };
                const newNode = { context, image: imageURLs[i], x: dx, y: dy, fontSize: textSize, position: realPosition, color: block.color };
                if (queueHead === null) {
                    queueHead = newNode;
                    tmpHead = queueHead;
                } else if (tmpHead) {
                    tmpHead.next = newNode;
                    tmpHead = newNode;
                }

                dx += textSize * 2;
            }
            return queueHead;
        }
        return generateQueue(imageURLs);
    };
    const drawAllergenQueue = (renderQueue: IallergenQueue ) => {
       /* if (!Array.isArray(queueHead) && isAllergenQueueArray(queueHead)) {
            const item = queueHead;
            item.context.textBaseline = 'top';
            const textSize = item.fontSize;
            item.context.save();
            item.context.fillStyle = item.color;
            item.context.translate(item.position.x, item.position.y);
            item.context.fillText(String(item.image), item.x, item.y);
            //Calculate size of the Number string and draw the image with offset
            const metrics = item.context.measureText(String(item.image));
            typeof (item.image) === 'number' && png.images[Number(item.image - 1)] && item.context.drawImage(png.images[Number(item.image - 1)], item.x + metrics.width, item.y, textSize, textSize);

            item.context.restore();
        }
        else */ do {
            let item = renderQueue;
            item.context.textBaseline = 'top';
            const textSize = item.fontSize;
            item.context.save();
            item.context.fillStyle = item.color;
            item.context.translate(item.position.x, item.position.y);
            item.context.fillText(String(item.image), item.x, item.y);
            //Calculate size of the Number string and draw the image with offset
            const metrics = item.context.measureText(String(item.image));
            typeof (item.image) === 'number' && png.images[Number(item.image - 1)] && item.context.drawImage(png.images[Number(item.image - 1)], item.x + metrics.width, item.y, textSize, textSize);

            item.context.restore();
        } while (renderQueue.next !== undefined && (renderQueue = renderQueue.next) !== undefined);
        

    }

    const generateImageQueue = (block: imagePointerBlock, context: CanvasRenderingContext2D) => {
        var queueHead: IimageQueue | null = null;
        const imgDimensions = {
            width: block.dimensions.width * dimensions.width / 100,
            height: block.dimensions.height * dimensions.height / 100
        }
        // @ts-ignore
        const transparency = block.image.transperancy;
        const realPosition = { x: block.position.x * dimensions.width / 100, y: block.position.y * dimensions.height / 100 };
        queueHead = { context, imageId: block.image._id, transparency, dimensions: imgDimensions, position: realPosition };
        return queueHead;
    }  
    const drawImageQueue = (renderQueue: IimageQueue | IimageQueue) => {
        var queueHead: IimageQueue | undefined = renderQueue;
        // Helper function to draw a single image
        const drawImage = (item: IimageQueue) => {
            return getImageById(item.imageId)
                .then((img: HTMLImageElement | undefined) => {
                    if (img === undefined) {
                        console.log('Image is undefined');
                        return;
                    }
                    item.context.save();
                    // Set transparency for the image 
                    item.context.globalAlpha = item.transparency / 100;
                    item.context.drawImage(img, item.position.x, item.position.y, item.dimensions.width, item.dimensions.height);
                    item.context.restore();
                })
                .catch(error => {
                    console.error('Error drawing image:', error);
                });
        };
        // Check if queueHead is a single queue
        while (isImageQueue(queueHead)) {
          
            const promise = drawImage(queueHead);
            promise
                .then(() => {
                //    console.log('Image drawn');
                })
                .catch(error => {
                //    console.error('Error drawing image:', error);
                });
            queueHead = queueHead.next;
        } 

    };

   
    const getImages = async () => {
        const images: HTMLImageElement[] = [];
        if (!blocks || !Array.isArray(blocks))
            console.log("Err: blocks is notArray");
        else {
            blocks.forEach(async (block) => {
                if ('type' in block && block.type === 'image') {
                    const imageBlock = block as imagePointerBlock;
                    const img = await getImageById(imageBlock.image._id);
                    if (img) {
                        images.push(img);
                    }
                }
            });
            setImages(images);
        }
        return images;
    }
    const generateQueueElement = (block: UnifiedBlock, context: CanvasRenderingContext2D) => {
        var text: string;
        
        if ('textParameter' in block) {
            text = textParametersMap.get(block.textParameter) || '';
            if (block.textParameter !== '' && isLabelDataType(label) ) {
                const translation = label.translations.find(entry => entry.lang === block.textParameter); 
                text = translation ? translation.name : '';
              
            } else {
                text = '';
            }
            return generateTextQueue(block, context, text) ;
        } else if ('type' in block) { // TO DO NEXT!! 
            if (block.type === 'allergens') {
                return generateAllergenQueue(block, context, label.allergens);
            } else if (block.type === 'image') {
                return generateImageQueue(block, context);
            } else {
                text = 'undefined';
                return generateTextQueue(block, context, text);
            }
        } else {
            text = 'Undefined';
             return generateTextQueue(block, context, text);
        }
   
    };
  
    useEffect(() => {
        const fetchQueue = async () => {
            await generateQueue();
        }
        const fetchImages = async () => {

            await getImages();

        };
        if (drawed.current) { fetchQueue(); }
        else {
            fetchQueue().then(() => fetchImages());
        }
    }, [design, qrCode]);
    useEffect(() => {
       
        
        const draw = async () => {
            if (queue.length === 0 && images.length === 0) return;
            await drawBlocks();
            drawed.current = true;
        }
        draw();
    }, [queue]);
    return (
        <canvas
            id={"canvas$"+label._id}
            ref={canvasRef}
            width={dimensions.width}
            height={dimensions.height}
            style={{ border: '1px solid #000', marginBottom: '10px' }}
        ></canvas>
    );
};

export default Canvas;