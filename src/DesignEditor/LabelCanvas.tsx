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

    useEffect(() => {
        drawDesigns();
    },[designs, dimensions]);

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
    const drawDesign = (design: UnifiedDesign, context: CanvasRenderingContext2D) => {
        const { x, y } = design.position;

        context.strokeStyle = design.color;
        context.strokeRect(x, y, design.dimensions.width, design.dimensions.height);

        // Draw the text
        var text: string;
        if ('textParameter' in design) {
            text = textParametersMap.get(design.textParameter) || '';
            if (design.textParameter !== '' && label.hasOwnProperty(design.textParameter))
                text = label[design.textParameter];
            else
                text = '';
        } else if ('type' in design) {
            text = design.type;
        } else {
            text = 'None';
        }
        context.fillStyle = 'black'; // Text color
        context.textBaseline = 'top';
        context.font = design.font;
        context.fillText(text, x, y);

   
    };
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