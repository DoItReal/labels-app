/** @file Editor.tsx
 * @description This file contains the implementation of the Design Editor component.
 * The Design Editor component is responsible for rendering the UI and handling user interactions
 * for designing labels.
 */
import React, { useState } from 'react';
import { Container, Grid } from '@mui/material';
import DesignUI from './EditorUI';
import Canvas from './EditorCanvas';
import Label from './LabelCanvas';
import { labelDataType } from '../DB/Interfaces/Labels';
import {
  textFieldBlock,
  imagePointerBlock,
  allergenFieldBlock,
  UnifiedBlock,
  Design,
} from '../DB/Interfaces/Designs';
import { getLocalDesigns, setLocalDesigns } from '../DB/LocalStorage/Designs';

/* dummyImageURLs is a list of dummy image URLs that are used to populate the image gallery if the image database is empty */


/* images is an array of Iimage objects. Used mainly for performance reasons. */
//export var images: Iimage[];


//TO DO Get textParametersMap from API
export const textParametersMap = new Map([
    ['bg', 'Bulgarian'],
    ['en', 'English'],
    ['de', 'Deutsch'],
    ['ru', 'Russian'],
]);

//!* TO DO Get allergensMap from API

// initDesign is a Design object used for filling the design with dummy data if no design is found in the session storage.
const initDesign = {
    _id: 'new Design',
    name: 'New Design',
    owner: 'LocalUser',
    canvas: {
        dim: { width: 300, height: 200 }
    },
    blocks:
        [
            //{ id: 1, position: { x: 10, y: 5 }, dimensions: { width: 80, height: 15 }, font: '20px Arial', color: 'blue', type: 'allergens' },
            { id: 2, position: { x: 10, y: 23 }, dimensions: { width: 80, height: 15 }, font: '20px Arial', color: 'blue', textParameter: 'bg' },
            { id: 3, position: { x: 10, y: 41 }, dimensions: { width: 80, height: 15 }, font: '20px Arial', color: 'green', textParameter: 'en' },
            { id: 4, position: { x: 10, y: 59 }, dimensions: { width: 80, height: 15 }, font: '20px Arial', color: 'red', textParameter: 'de' },
            { id: 5, position: { x: 10, y: 77 }, dimensions: { width: 80, height: 15 }, font: '20px Arial', color: 'red', textParameter: 'ru' }
        ]
} as Design;
// dummyTextBlock is a dummy textFieldBlock object used for filling the design.block with dummy data if no design is found in the session storage.
export const dummyTextBlock: textFieldBlock = {
    id: -10,
    position: { x: 0, y: 0 },
    dimensions: { width: 0, height: 0 } ,
    font: '20px Arial',
    color: 'black',
    textParameter: '',
}
// dummyAllergenBlock is a dummy allergenFieldBlock object used for filling the design.block with dummy data if no design is found in the session storage.
export const dummyAllergenBlock: allergenFieldBlock = {
    id: -10,
    position: { x: 0, y: 0 },
    dimensions: { width: 0, height: 0 },
    font: '20px Arial',
    color: 'black',
    type: 'allergens'
}
// dummyImageBlock is a dummy imagePointerBlock object used for filling the design.block with dummy data if no design is found in the session storage.
export const dummyImageBlock: imagePointerBlock = {
    id: -10,
    position: { x: 0, y: 0 },
    dimensions: { width: 0, height: 0 },
    font: '20px Arial',
    color: 'black',
    type: 'image',
    image: { _id: '66465d026360dca42dd877ae', name: 'dummyImage', size: 1, transperancy:10 }
}
//DesignPlayground is a component that contains the main UI components of the Design Editor.
//It contains the DesignUI, Canvas and Label components.
//It also contains the state and logic for managing the design and its blocks.
//It receives the design and setDesign props from the App component.
//It also receives the design and setDesign props from the App component.

const DesignPlayground = ({ design = initDesign, setDesign }: { design: Design | undefined, setDesign:(design:Design)=>void }) => { 
    //if design is undefined, use initDesign
    if (design === undefined) design = initDesign;

 
    const [blocks, setBlocks] = useState<UnifiedBlock[]>(design.blocks);
    const [selectedBlock, setSelectedBlock] = useState<UnifiedBlock | null>(dummyTextBlock);
    const deleteSelectedBlock = async () => {
        if (selectedBlock && selectedBlock.id > 0) {
            setBlocks(prevDesigns => prevDesigns.filter(design => design.id !== selectedBlock.id));
            setSelectedBlock(null); // Clear the selected block after deletion
            const storedDesigns: Design[] | null = getLocalDesigns();
         
            if (storedDesigns) {
                for (let i = 0; i < storedDesigns.length; i++) {
                    if (storedDesigns[i]._id === design._id) {
                        //update DB
                        storedDesigns[i].blocks = storedDesigns[i].blocks.filter(design => design.id !== selectedBlock.id);
                        //update sessionStorage
                        console.log('del');
                        setLocalDesigns(storedDesigns);
                        //await updateDesign then return;
                        return;
                    }
                }
            }
          //  sessionStorage.setItem('blocks', JSON.stringify(blocks)); // Update the session storage)
        }
    };
    const label: labelDataType = {
        _id: '-1',
        allergens: [1,2,3],
        category: ['Soup'],
        translations: [
            { lang: 'bg', name: 'Таратор', description: 'Таратор е българска студена супа, приготвена от кисело мляко, краставици, чесън, орехи и вода.' },
            { lang: 'en', name: 'Tarator', description: 'Tarator is a Bulgarian cold soup made from yoghurt, cucumbers, garlic, walnuts and water.' },
            { lang: 'de', name: 'Tarator', description: 'Tarator ist eine bulgarische kalte Suppe aus Joghurt, Gurken, Knoblauch, Walnüssen und Wasser.' },
            { lang: 'ru', name: 'Таратор', description: 'Таратор - это болгарский холодный суп из йогурта, огурцов, чеснока, грецких орехов и воды.' }
        ],
        owner: ''
    }
    return (
        <Container component="main" maxWidth='xl' style={{
            height: '100%', // Ensure full viewport height
            display: 'flex',
            alignItems: 'center', // Vertically center items
            justifyContent: 'center', // Horizontally center items
            border: '1px solid black', // Add a border for visual clarity
            overflow:'auto'
        } } >

            <Grid container spacing={0} justifyContent="center" alignItems="center" >
                {/* <DesignUI> */  }
                <Grid item xs={12} sm={12} md={8} lg={4} xl={4 }>
                    <Grid container justifyContent="center" alignItems="center" >
                        <Container>
                        <DesignUI
                                design={design}
                                setDesign={setDesign}
                                selectedBlock={selectedBlock}
                                setSelectedBlock={setSelectedBlock}
                                deleteSelectedBlock={ deleteSelectedBlock }
                            />
                    </Container>
                    </Grid>
                    {/* </DesignUI>  */ }
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4} xl={4} justifyContent="center">
                    <Grid container justifyContent="center" alignItems="center">
                    <Canvas
                            dimensions={design.canvas.dim}
                            border={design.canvas.border}
                            design={design}
                            setDesign={setDesign}
                            selectedBlock={selectedBlock}
                            setSelectedBlock={setSelectedBlock}
                            deleteSelectedBlock={deleteSelectedBlock }
                        />
                            </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4} xl={4 } >
                    <Grid container justifyContent="center" alignItems="center">
                        <Label
                            design={design}
                            blocks={blocks}
                            label={label} />
            </Grid>
                </Grid>
               
            {/* Add any additional UI components or elements here */}
            </Grid>
        </Container>
    );
};

export default DesignPlayground;
