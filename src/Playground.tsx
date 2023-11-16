import React, { useState } from 'react';
import { Button } from '@mui/material';
import DesignUI from './PlaygroundUI';
import Canvas  from './Canvas';

export interface Position {
    x: number;
    y: number;
}

export interface Dimensions {
    width: number;
    height: number;
}
export type TtextParameter = 'bg' | 'en' | 'de' | 'rus' | '';
export interface Design {
    id: number;
    position: Position;
    dimensions: Dimensions;
    font: string;
    color: string;
    textParameter: TtextParameter;
}

export type HandleType = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top' | 'right' | 'bottom' | 'left' | null;


const DesignPlayground: React.FC = () => {    
    const [selectedTextParameter, setSelectTextParameter] = useState<TtextParameter>('');
    const [designs, setDesigns] = useState<Design[]>([
        { id: 1, position: { x: 50, y: 50 }, dimensions: { width: 100, height: 20 }, font: '20px Arial', color: 'blue',textParameter:'bg' },
        { id: 2, position: { x: 200, y: 50 }, dimensions: { width: 100, height: 20 }, font: '20px Arial', color: 'green', textParameter:'en' },
        { id: 3, position: { x: 350, y: 50 }, dimensions: { width: 100, height: 20 }, font: '20px Arial', color: 'red', textParameter:'de' },
    ]);
    const [selectedDesign, setSelectedDesign] = useState<Design | null>(null);

  
    const setSelectedTextParameter = (textParameter: TtextParameter) => {
        setSelectTextParameter(textParameter);
        if(selectedDesign) selectedDesign.textParameter = textParameter;
    };
    
    return (
        <>
            <Canvas
                designs={designs}
                selectedDesign={selectedDesign}
                selectedTextParameter={selectedTextParameter}
                setSelectedDesign={setSelectedDesign}
                setDesigns={setDesigns}
            />
            <DesignUI
                designs={designs}
                selectedDesign={selectedDesign}
                selectedTextParameter={selectedTextParameter}
                setSelectedTextParameter={setSelectedTextParameter}
                setDesigns={setDesigns}
                setSelectedDesign={setSelectedDesign }
            />
            {/* Add any additional UI components or elements here */}
            <Button onClick={() => console.log(designs)}>Log Designs</Button>
        </>
    );
};

export default DesignPlayground;
