import React, { useState } from 'react';
import { Button } from '@mui/material';
import DesignUI from './EditorUI';
import Canvas  from './EditorCanvas';
import Label from './LabelCanvas';
import { labelDataType } from '../db';
export interface Position {
    x: number;
    y: number;
}

export interface Dimensions {
    width: number;
    height: number;
}

//TO DO get textParameters based on DB INPUT or from API
export const textParameters = ['bg', 'en', 'de', 'rus'] as const ;
export type TtextParameter = typeof textParameters[number] | '';
export type TimageParameter = 'image' | 'allergens' | '';
//TO DO Get textParametersMap from API
export const textParametersMap = new Map([
    ['bg', 'Bulgarian'],
    ['en', 'English'],
    ['de', 'Deutsch'],
    ['rus', 'Russian'],
]);
export type Design  = {
    id: number;
    position: Position;
    dimensions: Dimensions;
    font: string;
    color: string;
}
export interface textFieldDesign extends Design {
    textParameter: TtextParameter;
}
export interface imageFieldDesign extends Design {
    type: TimageParameter;
}
export type UnifiedDesign = textFieldDesign | imageFieldDesign;
export type HandleType = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top' | 'right' | 'bottom' | 'left' | null;

export const dummyDesign: textFieldDesign = {
    id: -10,
    position: { x: 0, y: 0 },
    dimensions: { width: 0, height: 0 } ,
    font: '20px Arial',
    color: 'black',
    textParameter: '',
}
export const dummyImageDesign: imageFieldDesign = {
    id: -10,
    position: { x: 0, y: 0 },
    dimensions: { width: 0, height: 0 },
    font: '20px Arial',
    color: 'black',
    type: 'allergens'
}
const DesignPlayground: React.FC = () => { 
    const [canvasDim, setCanvasDim] = useState<Dimensions>({ width: 300, height: 200 }); 
    const [designs, setDesigns] = useState<UnifiedDesign[]>([
        { id: 1, position: { x: 20, y: 50 }, dimensions: { width: 100, height: 20 }, font: '20px Arial', color: 'blue',textParameter:'bg' },
        { id: 2, position: { x: 150, y: 50 }, dimensions: { width: 100, height: 20 }, font: '20px Arial', color: 'green', textParameter:'en' },
        { id: 3, position: { x: 280, y: 50 }, dimensions: { width: 100, height: 20 }, font: '20px Arial', color: 'red', textParameter: 'de' },
        { id: 4, position: { x: 50, y: 150 }, dimensions: { width: 100, height: 20 }, font: '20px Arial', color: 'blue', type: 'allergens' },
        { id: 5, position: { x: 200, y: 150 }, dimensions: { width: 100, height: 20 }, font: '20px Arial', color: 'green', type: 'image' }
    ]);
    const [selectedDesign, setSelectedDesign] = useState<UnifiedDesign | null>(dummyDesign);

    const label: labelDataType = {
        _id: '-1',
        allergens: [1,2,3],
        category: ['Soup'],
        bg: 'Tarator',
        en: 'Tarator EN',
        de: 'Tarator DE',
        rus: 'Tarator RUS',
        owner: ''
    }
    
    return (
        <>
            <Canvas
                dimensions={canvasDim}
                designs={designs}
                setDesigns={setDesigns}
                selectedDesign={selectedDesign}
                setSelectedDesign={setSelectedDesign}

             
                
            />
            <Label dimensions={ canvasDim } designs={designs} label={label } />
            <DesignUI
                canvasDesign={canvasDim}
                setCanvasDesign={setCanvasDim }
                designs={designs}
                setDesigns={setDesigns}
                selectedDesign={selectedDesign}
                setSelectedDesign={setSelectedDesign}
            />
            {/* Add any additional UI components or elements here */}
            <Button onClick={() => console.log(designs)}>Log Text Designs</Button>
        </>
    );
};

export default DesignPlayground;
