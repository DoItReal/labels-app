import React, { useEffect, useRef, useState } from 'react';
import { UnifiedDesign, textFieldDesign, imageFieldDesign, HandleType, Position, TtextParameter, textParametersMap, Dimensions } from './Editor'; // Import the Design type
import { styled } from '@mui/system';
import { labelDataType } from '../db';
const StyledCanvas = styled('canvas')`
  border: 1px solid #000;
  margin-bottom: 10px;
`;
interface CanvasProps {
    dimensions: Dimensions;
    designs: UnifiedDesign[];
    label: labelDataType;
}


const Canvas: React.FC<CanvasProps> = ({ dimensions, designs, label }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const drawDesigns = () => {
        //check if canvas exists
        const canvas = canvasRef.current;
        if (!canvas) return;

        //check context
        const context = canvas.getContext('2d');
        if (!context) return;

        context.save();
        context.clearRect(0, 0, canvas.width, canvas.height);

        designs.forEach((design) => {
            drawDesign(design, context);
        });

        context.restore();
    };
    //TO ADD design.multiline that can be true or false and to render the text on multiple lines or on single one!
    const txtCalibrateCenter = (design: UnifiedDesign, context: CanvasRenderingContext2D, txt: string) => {
        let textSize = parseInt(design.font);
        context.font = design.font;
        const margin = 1.1;
        const renderQueue: { text: string; x: number; y: number, position: Position }[] = [];
        const words = txt.split(' ');

        const fitText = (): { text: string; x: number; y: number, position: Position }[] => {
            let lines: string[] = [];
            let line = '';
            for (let i = 0; i < words.length; i++) {
                const testLine = line + words[i] + ' ';
                const metrics = context.measureText(testLine);
                const testWidth = metrics.width;

                if (testWidth > design.dimensions.width - 10 && i > 0) {
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
            
            if (totalTextHeight <= design.dimensions.height && maximumTextWidth() <= design.dimensions.width) { //calculated height <= maximum design height
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
            if (text.length === 1) text = text[0];
            if (typeof (text) === 'string') {  //single line case
                const x = (design.dimensions.width - context.measureText(text).width) / 2;
                const y = (design.dimensions.height - textSize) / 2;
                renderQueue.push({ text: text, x: x, y: y, position: design.position });
            } else { //multiline case
                text.forEach((txt, index) => {
                    const totalTextHeight = text.length * textSize * margin;
                    const startY = (design.dimensions.height - totalTextHeight) / 2;
                    const x = (design.dimensions.width - context.measureText(txt).width) / 2;
                    const y = startY + index * textSize;
                    renderQueue.push({ text: txt, x: x, y: y, position: design.position });
                });
            }
            return renderQueue;     
        }

        return fitText();
    }
    const drawQueue = (context: CanvasRenderingContext2D, renderQueue: { text: string; x: number; y: number, position:Position }[]) => {
        const margin = 1.1;
        context.textBaseline = 'top';

        renderQueue.forEach(item => {
            context.save();
            context.translate(item.position.x, item.position.y);
            context.fillText(item.text, item.x, item.y * margin);
            context.restore();
            });
    }

    const drawDesign = (design: UnifiedDesign, context: CanvasRenderingContext2D) => {
        const { x, y } = design.position;
        context.save();
        
        context.strokeStyle = design.color;
        context.strokeRect(x, y, design.dimensions.width, design.dimensions.height);

        // Draw the text
        var text: string;
        if ('textParameter' in design) {
            text = textParametersMap.get(design.textParameter) || '';
            if (design.textParameter !== '' && label.hasOwnProperty(design.textParameter)) {
                text = label[design.textParameter];
              
            } else {
                text = '';
            }
            const queue = txtCalibrateCenter(design, context, text);
            queue && drawQueue(context, queue);
        } else if ('type' in design) { // TO DO NEXT!! 
            text = design.type; // there has to be way of getting the image and drawing it! 
        } else {
            text = 'Undefined';
            const queue = txtCalibrateCenter(design, context, text);
            queue && drawQueue(context, queue);
        }
       
        

        context.restore();
   
    };
    useEffect(() => {
        drawDesigns();
    }, [designs, dimensions]);
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