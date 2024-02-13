import React, { useEffect, useRef, useState } from 'react';
import { loadImages,images, textParametersMap } from './Editor'; // Import the Design type
import { styled } from '@mui/system';
import { labelDataType } from '../db';
import { png } from '../labels';
import { Position, Dimensions, TtextParameter, TimageParameter, textParameters, textFieldBlock, imageFieldBlock, allergenFieldBlock, UnifiedBlock, isUnifiedBlock, isDesign, isDesignArray, Design, NewDesign, HandleType } from './Interfaces/CommonInterfaces';

const StyledCanvas = styled('canvas')`
  border: 1px solid #000;
  margin-bottom: 10px;
`;
interface CanvasProps {
    design: Design;
    designs: UnifiedBlock[];
    label: labelDataType;
}

/*
   Generates HTML Canvas 5
   Visualizes the Label using the selected design
     const canvasRef  - keeps refference to the Canvas this function returns and use it for further Manipulations
     const drawDesigns() -  1. Checks the canvas if is defined! (In case we try to manipulate the canvas before the first render)
                            2. Gets the context for Canvas and checks if everything is ok!
                            3. Creates queues for all the elements we are going to draw before drawing it!
                                *   It goes throught all elements from $designs because we want to draw only this elements!
                                * So we are going to display only the elements we received request for in $designs! Preventing bugs and performance issues
                                *   At the time of writing this I am using 3 Queues (textQueue, allergenQueue, imageQueue) as this implements the desired logic at the moment.
                                * In future probably there will be single Queue and many categories Queue and each one will have a callback function
                                * which will draw its content on request
                            4. Draws the Queues Using draw_functions(queue);
     const drawDesign(design, context) -  1. Checks each design for its type
                                          2. Generates queue element for the type of design (at the moment types:text | allergen | image) 
                                            each type have its own specific way of drawing and elements to draw!
                                          3. Return the queue element when generated!
    const generateTextQueue(design, context, txt) - Generates textQueue and returns it! 
                        design:         Selected design,
                        context:        The context where will be drawing, 
                        txt:            The text to draw

                                        1. Splits the string to words[] 
                                        2. Fits the text using fitText() - it can fit the text in multilines or on single lines!
                    return const fitText() - Its returned from the main function! Generates the queue and returns it!
                                            1. Measures the text using the selected design and reduces it if it doesnt fit!
                   ***  TO DO!!             2. centerText() - It centers the text and return ! To rework it later to can selected direction of the text in design
                                            3. returns $textQueue;
                   const generateAllergenQueue(design, context, imageURLs) - it generates allergen Queue and returns it!
                   *** TO DO!! arr:string[] 1. imgCalibrate(arr:number[]) - Calibrates the design font to fit all the content! {AllergenNumber, AllergenImage}[];
                   *** TO DO!!              2. imgCenter(arr.length, textSize) - Returns dimensions for drawing centering the content in the box 
                                            3. returns $allergenQueue;
    const generateImageQueue(design, context) - generates queue and returns it with the desired props from the selected design 
            return $imageQueue;
    const drawTextQueue(textQueue) - draws $textQueue

    const drawAllergenQueue(allergenQueue) - draws $textQueue

    const drawImageQueue(imageQueue) - draws the $imageQueue
*/

const Canvas: React.FC<CanvasProps> = ({ design,designs, label }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const dimensions = design.canvas.dim;
    const border = design.canvas.border;

    const drawDesigns = () => {
        //check if canvas exists
        const canvas = canvasRef.current;
        if (!canvas) return;

        //check context
        const context = canvas.getContext('2d');
        if (!context) return;

        context.save();
        context.clearRect(0, 0, canvas.width, canvas.height);
        const textQueue: ItextQueue[] = [];
        const allergenQueue: IallergenQueue[] = [];
        const imageQueue: IimageQueue[] = [];
        designs.forEach((design) => {
            const queue = drawDesign(design, context);
           // console.log(queue);
            if ('textQueue' in queue && queue.textQueue) {
                queue.textQueue.forEach(item => {
                    textQueue.push(item);
                });
                
            } else if ('allergenQueue' in queue && queue.allergenQueue) {
                queue.allergenQueue.forEach(item => {
                    allergenQueue.push(item);
                });
            } else if ('imageQueue' in queue && queue.imageQueue) {
                queue.imageQueue.forEach(item => {
                    imageQueue.push(item);
                })
            } else {

            }
        });
        drawBorder(context);
        drawImageQueue(imageQueue);
        drawAllergenQueue(allergenQueue);
        drawTextQueue(textQueue);
        context.restore();
    };
    //TO ADD design.multiline that can be true or false and to render the text on multiple lines or on single one!
    interface ItextQueue {
        context: CanvasRenderingContext2D;
        text: string;
        x: number;
        y: number;
        font: string;
        color: string;
        position: Position;
    }
    interface IallergenQueue {
        context: CanvasRenderingContext2D;
        image: number;
        x: number;
        y: number;
        fontSize: number;
        position: Position;
        color: string;
    }
    interface IimageQueue {
        context: CanvasRenderingContext2D;
        imageID: number;
        dimensions: Dimensions;
        transperancy: number;
        position: Position;
    }
    const drawBorder = (context:CanvasRenderingContext2D) => {
        context.save();
        context.strokeStyle = 'black';
        context.lineWidth = border;
        context.strokeRect(0, 0, dimensions.width, dimensions.height);
        context.restore();
    }
    const generateTextQueue = (design: UnifiedBlock, context: CanvasRenderingContext2D, txt: string) => {
        context.save();
        //get font size
        let textSize = parseInt(design.font);
        context.font = design.font;
        const margin = 1.1;
        const renderQueue: ItextQueue[] = [];
        const words = txt.split(' ');

        //converting to PX from %
        const width = design.dimensions.width * dimensions.width / 100;
        const height = design.dimensions.height * dimensions.height / 100;
        const fitText = (): ItextQueue[] => {
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
            
            if (totalTextHeight <= height && maximumTextWidth() <= width) { //calculated height <= maximum design height
                return centerText(lines); // everything is OK we can draw that!
            } else {
                if (textSize <= 1) {
                    return centerText(lines); // the minimum textSize achieved Drawing the text! it has to not be hit at all but in case of infinity loop!
                }
                textSize -= 1;
                context.font = textSize + "px " + design.font.split(' ')[1];  //we have to reduce the fontSize till the content fits!
                return fitText(); //reccursion till the text fit
            }
        }
        
        const centerText = (text: string | string[]) => {
            const font = textSize + "px " + design.font.split(' ')[1];
            if (text.length === 1) text = text[0];
            //not sure if this is neccesary but in ANY CASE
            if (typeof (text) === 'string') {  //single line case
                const x = (width - context.measureText(text).width) / 2;
                const y = (height - textSize) / 2;
                const realPosition = { x: design.position.x * dimensions.width / 100, y: design.position.y * dimensions.height / 100 };
                renderQueue.push({ context,text: text, x: x, y: y,font, position: realPosition, color:design.color });
            } else { //multiline case
                text.forEach((txt, index) => {
                    const totalTextHeight = text.length * textSize * margin;
                    const startY = (height - totalTextHeight) / 2;
                    const x = (width - context.measureText(txt).width) / 2;
                    const y = startY + index * textSize;
                    const realPosition = { x: design.position.x * dimensions.width / 100, y: design.position.y * dimensions.height / 100 };
                    renderQueue.push({ context, text: txt, x: x, y: y,font, position: realPosition, color:design.color });
                });
            }
            context.restore();
            return renderQueue;     
        }

        return fitText();
    }
    const drawTextQueue = (renderQueue: ItextQueue[]) => {
        const margin = 1.1;
        

        renderQueue.forEach(item => {
            item.context.save();
            item.context.fillStyle = item.color;
            item.context.font = item.font;
            item.context.textBaseline = 'top';
            item.context.translate(item.position.x, item.position.y);
            item.context.fillText(item.text, item.x, item.y * margin);
            item.context.restore();
            });
    }

    const generateAllergenQueue = (design: allergenFieldBlock, context: CanvasRenderingContext2D, imageURLs: string[] | number[]) => {
        const renderQueue: IallergenQueue[] = [];
        const border = 2; //to add it to design.border
        const generateAllergens = (arr: number[]) => {
    if (arr.length === 1 && arr[0] === 0) return; // ???
            //calibrate and set this.fontSize

        //convert to PX from %
        const width = design.dimensions.width * dimensions.width / 100;
        const height = design.dimensions.height * dimensions.height / 100;
    const imgCalibrate = (arr: Array<number>) => { // return the required fontSize to fit the image in the design
        //get font size
        let textSize = parseInt(design.font);
        //get full size of the content
        let wholeSize = arr.length * textSize * 4;
        while (wholeSize > width - (20) ) {
            textSize--;
            wholeSize = arr.length * textSize * 4;
        }
        while (textSize > height/2) {
            textSize--;
            
        }
        return textSize;
            }
    const imgCenter = (length: number, textSize: number) => {
        const realWidth = width - border * 2;
        const realHeight = height - border * 2;

        let wholeSize = length * textSize * 2;
        let dx = (realWidth - wholeSize) / 2;
        if (realWidth > wholeSize) dx = (realWidth - wholeSize) / 2;
        else dx = (wholeSize - realWidth) / 2;
        let dy = textSize * 1.5 + realHeight * 0.25;
        dy = (dy - border) / 2 - textSize;
        return { x: dx, y: dy };
            }

    let textSize = imgCalibrate(arr);
    textSize *= 2;
    let dim = imgCenter(arr.length, textSize);
    let { x: dx, y: dy } = dim;

    for (let i = 0; i < arr.length; i++) {
        context.font = textSize + "px " + design.font.split(' ')[1];
        context.fillStyle = "blue";
        const realPosition = { x: design.position.x * dimensions.width / 100, y: design.position.y * dimensions.height / 100 };
        renderQueue.push({ context, image: arr[i], x: dx + textSize / 2, y: dy, fontSize: textSize, position: realPosition, color: design.color });
        dx += textSize * 2;

             }
        textSize = parseInt(design.font);
}

        generateAllergens(imageURLs as number[]);
        return renderQueue;
    }
    const drawAllergenQueue = (renderQueue: IallergenQueue[]) => {
        renderQueue.forEach(item => {
            item.context.textBaseline = 'top';
            const textSize = item.fontSize;
            item.context.save();
            item.context.fillStyle = item.color;
            item.context.translate(item.position.x, item.position.y);
                item.context.fillText(String(item.image), item.x, item.y);
                typeof(item.image) === 'number' && png.images[Number(item.image-1)] &&  item.context.drawImage(png.images[Number(item.image - 1)], item.x + textSize / 2, item.y, textSize, textSize);
            
            item.context.restore();
        });

    }
    const generateImageQueue = (design: imageFieldBlock, context: CanvasRenderingContext2D) => {
        const renderQueue: IimageQueue[] = [];
        const imgDimensions = {
            width: design.dimensions.width * dimensions.width / 100,
            height: design.dimensions.height * dimensions.height / 100
        }
        const transperancy = 0.2;
        const realPosition = { x: design.position.x * dimensions.width / 100, y: design.position.y * dimensions.height / 100 };
        renderQueue.push({ context,imageID: design.imageID,transperancy,dimensions:imgDimensions, position: realPosition })
        return renderQueue;
    }
   
    const drawImageQueue = async(renderQueue: IimageQueue[]) => {
        if (!images) return;
        

        renderQueue.forEach(item => {
            typeof (item.imageID) === 'number' && images.forEach(image => {
                if (image.id === item.imageID) {
                    item.context.save();
                    //set transperancy for the image 
                    item.context.globalAlpha = item.transperancy;
                        item.context.drawImage(image.image, item.position.x, item.position.y, item.dimensions.width, item.dimensions.height);
                    item.context.restore();
                }
            });
                
        });
    }
    const drawDesign = (design: UnifiedBlock, context: CanvasRenderingContext2D) => {
        const { x, y } = design.position;        
     
        // Draw the text
        var text: string;
        var textQueue, allergenQueue, imageQueue;
        
        if ('textParameter' in design) {
            text = textParametersMap.get(design.textParameter) || '';
            if (design.textParameter !== '' && label.hasOwnProperty(design.textParameter)) {
                text = label[design.textParameter];
              
            } else {
                text = '';
            }
            textQueue = generateTextQueue(design, context, text);
            return { textQueue };
        } else if ('type' in design) { // TO DO NEXT!! 
            if (design.type === 'allergens') {
                allergenQueue = generateAllergenQueue(design, context, label.allergens);
                return { allergenQueue };
            } else if (design.type === 'image') {
                imageQueue = generateImageQueue(design, context);
                return { imageQueue };

            } else {
                text = 'undefined';
                textQueue = generateTextQueue(design, context, text);
                return { textQueue };
            }
        } else {
            text = 'Undefined';
             textQueue = generateTextQueue(design, context, text);
            return { textQueue };
        }
   
    };
    useEffect(() => {
        drawDesigns();
    }, [design, designs]);
    return (
        <canvas
            ref={canvasRef}
            width={dimensions.width}
            height={dimensions.height}
            style={{ border: '1px solid #000', marginBottom: '10px' }}
        ></canvas>
    );
};

export default Canvas;