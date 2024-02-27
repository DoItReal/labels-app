/*
    It is called in Editor.tsx then it is called in App.tsx
    -EditorUI.tsx
       - Editor.tsx
            - App.tsx - renders $Editor on https://address/editor
                 
      ***To be developed *** To make parent Design which will host all blocks and feature to manipulate them
      * It will have UI
      * Editor will become feauture for the parent Design
      * This way we can have multiple blocks on the same page
      * We can have multiple pages with multiple blocks
      * We can add features as we go along as:
      * $$$ Paid features (the most important ones) - more advanced functionality - as customaizable as possible
      *     Free features (the least important ones) - just basic functionality 
It is the UI of the editor

*/

import React, { useState } from 'react';
import { Button, Slider, FormControl, InputLabel, MenuItem, Select, Dialog, DialogTitle, DialogContent, useTheme, useMediaQuery, IconButton, Container, Paper, Typography, Input, PopoverPaper, Grid } from '@mui/material';
import { styled } from '@mui/system';
import { Unstable_NumberInput as NumberInput } from '@mui/base/Unstable_NumberInput';
import SaveIcon from '@mui/icons-material/Save';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import { createNewDesign, getLocalDesigns, setLocalDesigns, updateDesign } from './DesignDB';
import { textParametersMap, dummyTextBlock, images, dummyImageBlock } from './Editor';
import { Position, Dimensions, TtextParameter, TimageParameter, textParameters, textFieldBlock, imageFieldBlock, UnifiedBlock, isDesignArray, Design, allergenFieldBlock, TypeBlock, isUnifiedBlock, isUnifiedBlockArray, Iimage, isIimage, isImageFieldBlock, isImagePointer, isAllergenFieldBlock, ImagePointer, isImagePointerBlock, istextFieldBlock, imagePointerBlock } from './Interfaces/CommonInterfaces';
import ImageUpload from './ImageUpload';
interface DesignUIProps {
    design: Design;
    setDesign: (design: Design) => void;
    blocks: UnifiedBlock[];
    selectedBlock: UnifiedBlock | null;
    setBlocks: React.Dispatch<React.SetStateAction<UnifiedBlock[]>>;
    setSelectedBlock: React.Dispatch<React.SetStateAction<UnifiedBlock | null>>;
    deleteSelectedBlock: () => void;
}

const StyledDiv = styled('div')`
  text-align: center;
  margin: 20px;
`;



const StyledSliderContainer = styled('div')`
  display: flex;
  align-items: center;
  margin-top: 10px;
`;

const StyledInputLabel = styled(InputLabel)`
  margin-right: 10px;
`;

const DesignUI: React.FC<DesignUIProps> = ({
    design,
    setDesign,
    blocks,
    selectedBlock,
    setBlocks,
    setSelectedBlock,
    deleteSelectedBlock
}) => {
    const handleBlockSelection = (blockId: number) => {
        const selected = blocks.find((block) => block.id === blockId) || null;
        if (selected !== null) {
            setSelectedBlock(selected);
        }
        else setSelectedBlock(null);
    };
    const handleSelectedImageParameter = (imageParameter: TimageParameter) => {
        if (selectedBlock && 'type' in selectedBlock && 'id' in selectedBlock && !istextFieldBlock(selectedBlock) && (isImageFieldBlock(selectedBlock) || isAllergenFieldBlock(selectedBlock))) {
                const block = selectedBlock;
                setSelectedBlock(prevSelectedDesign => {
                    if (prevSelectedDesign && prevSelectedDesign.id === block.id) {
                        if (imageParameter === 'image') {
                            return {
                                ...prevSelectedDesign,
                                type: imageParameter,
                                image: dummyImageBlock.image,
                            }
                        } else {
                            return {
                                ...prevSelectedDesign,
                                type:imageParameter
                            }
                        }
                    }
                    return prevSelectedDesign;
                });
                setBlocks(prevDesigns =>
                    prevDesigns.map(prevDesign => {
                        if (prevDesign.id === block.id) {
                            if (imageParameter === 'image') {
                                return {
                                    ...prevDesign,
                                    type: imageParameter,
                                    image: dummyImageBlock.image
                                }
                            } else {
                                return {
                                    ...prevDesign,
                                    type:imageParameter
                                }
                            }                           
                        }
                        return prevDesign;
                    })
                );
        }
    };
    const handleTransperancyChange = (transperancy: number) => {
        if (selectedBlock && 'type' in selectedBlock && selectedBlock.type === 'image' && 'id' in selectedBlock) {
            const block = selectedBlock as imageFieldBlock;

            setSelectedBlock(prevSelectedBlock => {
                if (prevSelectedBlock && prevSelectedBlock.id === block.id && 'image' in prevSelectedBlock) {
                    return {
                        ...(prevSelectedBlock as imageFieldBlock), // Type assertion for prevSelectedBlock
                        image: {
                            ...prevSelectedBlock.image,
                            // Type assertion for prevSelectedBlock.image
                            transperancy,
                        }
                    };
                }
                return prevSelectedBlock;
            });
            setBlocks(prevBlocks =>
                prevBlocks.map(prevBlock => {
                    if (prevBlock.id === block.id && prevBlock.type === 'image' && 'image' in prevBlock) {
                        const imageBlock = prevBlock as imageFieldBlock; // Type assertion for prevBlock
                        const updatedImage = {
                            ...(imageBlock.image || {}), // Type assertion for imageBlock.image
                            transperancy,
                        };
                        return {
                            ...imageBlock,
                            image: updatedImage
                        };
                    }
                    return prevBlock;
                })
            );
        }
        const storedDesigns: Design[] | null = getLocalDesigns();
        if (!storedDesigns) {
            console.log('The fetched Design is null! Failed to update Local Designs!');
            return;
        }
        for (let i = 0; i < storedDesigns.length; i++) {
            if (storedDesigns[i]._id === design._id) {
                storedDesigns[i].blocks = blocks;
                setLocalDesigns(storedDesigns);
                return;
            }
        }

    };


    const handleSelectedImage = async (selectedImage: Iimage) => {
        if (selectedBlock && 'type' in selectedBlock && selectedBlock.type === 'image' && 'id' in selectedBlock) {
            const block = selectedBlock as imageFieldBlock;

            setSelectedBlock(prevSelectedBlock => {
                if (prevSelectedBlock && prevSelectedBlock.id === block.id && 'image' in prevSelectedBlock) {
                    return {
                        ...(prevSelectedBlock as imageFieldBlock), // Type assertion for prevSelectedBlock
                        image: {
                            ...prevSelectedBlock.image,
                             // Type assertion for prevSelectedBlock.image
                            _id: selectedImage._id,
                            transperancy: 1,
                        }
                    };
                }
                return prevSelectedBlock;
            });
            setBlocks(prevBlocks =>
                prevBlocks.map(prevBlock => {
                    if (prevBlock.id === block.id && prevBlock.type === 'image' && 'image' in prevBlock) {
                        const imageBlock = prevBlock as imageFieldBlock; // Type assertion for prevBlock
                        const updatedImage = {
                            ...(imageBlock.image || {}), // Type assertion for imageBlock.image
                            _id: selectedImage._id,
                            transperancy: 1,
                        };
                        return {
                            ...imageBlock,
                            image: updatedImage
                        };
                    }
                    return prevBlock;
                })
            );
        }
        const storedDesigns: Design[] | null = getLocalDesigns();
        if (!storedDesigns) {
            console.log('The fetched Design is null! Failed to update Local Designs!');
            return;
        }
        for (let i = 0; i < storedDesigns.length;i++) {
            if (storedDesigns[i]._id === design._id) {
                storedDesigns[i].blocks = blocks;
                setLocalDesigns(storedDesigns);
                return;
            }
        }

    };

    const handleSelectedTextParameter = (textParameter: TtextParameter) => {
        if (selectedBlock && 'textParameter' in selectedBlock && 'id' in selectedBlock) {
            const design = selectedBlock as textFieldBlock;

            setSelectedBlock(prevSelectedDesign => {
                if (prevSelectedDesign && prevSelectedDesign.id === design.id) {
                    return {
                        ...prevSelectedDesign,
                        textParameter: textParameter,
                    }
                }
                return prevSelectedDesign;
            });
            setBlocks(prevDesigns =>
                prevDesigns.map(prevDesign => {
                    if (prevDesign.id === design.id) {
                        return {
                            ...prevDesign,
                            textParameter: textParameter,
                        }
                    }
                    return prevDesign;
                })
            );
        }
    };
    const updateSliderValue = (property: string, value: number) => {
        if (selectedBlock) {
            const [field, attribute] = property.split('.');
            
            setSelectedBlock(prevSelectedDesign => {
                if (prevSelectedDesign && prevSelectedDesign.id === selectedBlock.id) {
                    if (field === 'position') {
                        return {
                            ...prevSelectedDesign,
                            position: {
                                ...(prevSelectedDesign.position as Position),
                                [attribute]: value,
                            },
                        };
                    } else if (field === 'dimensions') {
                        return {
                            ...prevSelectedDesign,
                            dimensions: {
                                ...(prevSelectedDesign.dimensions as Dimensions),
                                [attribute]: value,
                            },
                        };
                    }
                }
                return prevSelectedDesign;
            });

            setBlocks(prevDesigns =>
                prevDesigns.map(prevDesign => {
                    if (prevDesign.id === selectedBlock.id) {
                        if (field === 'position') {
                            return {
                                ...prevDesign,
                                position: {
                                    ...(prevDesign.position as Position),
                                    [attribute]: value,
                                },
                            };
                        } else if (field === 'dimensions') {
                            return {
                                ...prevDesign,
                                dimensions: {
                                    ...(prevDesign.dimensions as Dimensions),
                                    [attribute]: value,
                                },
                            };
                        }
                    }
                    return prevDesign;
                })
            );
        }
    };

    const addTextDesign = () => {
        setBlocks((prevDesigns) => [
            ...prevDesigns,
            {
                id: prevDesigns.length + 1,
                position: { x: 50, y: 50 },
                dimensions: { width: 100, height: 20 },
                font: '20px Arial',
                color: 'red',
                textParameter: textParameters[0]
            },
        ]);
    };
    const dialogMap = new Map<string, boolean>([
        ['canvasHeight', false],
        ['canvasWidth', false],
        ['positionX', false],
        ['positionY', false],
        ['height', false],
        ['width', false],
    ]);
    const [openDialog, setOpenDialog] = React.useState(dialogMap);
    const handleCloseDialog = () => {
        setOpenDialog(dialogMap);
    }
    const handleOpenDialog = (dialogName: string) => {
        handleCloseDialog();
setOpenDialog(prevOpenDialog => {
            return new Map(prevOpenDialog.set(dialogName, true));
        });
    }
        
    const saveDesign = async () => {

        //it gets storedDesigns from session storage
        //it checks if the block is already in the storedDesigns
        //if it is, it updates the block
        //if it is not, it creates new block

        try {
            //not sure if this line is needed
            design.blocks = blocks;
            const storedDesigns: Design[] | null = getLocalDesigns();
            //check against null value in case the session storage is empty. In this case we have no blocks stored
            if (!storedDesigns) {
                console.log('The fetched Design is null! Creating new Design!');
                await createNewDesign(design);
                return;
            }
            if (!isDesignArray(storedDesigns)) {
                console.log('The fetched Design is not from Design[] type! Cant proceed further, please reload the window!');
                return;
            }
            //check if the block is already in the storedDesigns
            //if it is then update it
            //if it is not then create new block
            for (let i = 0; i < storedDesigns.length; i++) {
                if (storedDesigns[i]._id === design._id) {
                    //update DB
                    storedDesigns[i] = await updateDesign(design);
                    //update sessionStorage
                    setLocalDesigns(storedDesigns);
                    //await updateDesign then return;
                    return;
                }
            }
            //if we are here this means that the block is not in the storedDesigns
                //create new block in DB
            await createNewDesign(design);
                //update session storage
            storedDesigns.push(design);
            setLocalDesigns(storedDesigns);    
        } catch (error) {
            console.log(error)
        }
    };

    const addImageDesign = () => {
        setBlocks((prevDesigns) => [
            ...prevDesigns,
            {
                id: prevDesigns[prevDesigns.length-1].id + 1,
                position: { x: 50, y: 50 },
                dimensions: { width: 30, height: 30 },
                font: '20px Helvetica',
                color: 'red',
                type: 'allergens', // Initialize with an empty string or default value
              //  allergenParameter: 'allergen_image.jpg', // Set the image parameter here
            },
        ]);
    };
    
    const theme = useTheme();
    const alignLeft = () => {
        if (selectedBlock && selectedBlock.id > 0) {
            const canvasBorder = design.canvas.border || 0; // Assuming canvas.border is in pixels
            const canvasWidth = design.canvas.dim.width; // Adjust for both left and right borders
            const newX = 0 + canvasBorder; // Set the new x value for left alignment

            // Calculate the percentage of newX based on canvas width
            const percentageX = (newX / canvasWidth) * 100;

            // Update the position.x property using the updateSliderValue function
            updateSliderValue('position.x', percentageX);
        }
    };
    const alignCenter = () => {
        if (selectedBlock && selectedBlock.id > 0) {
            const canvasWidth = design.canvas.dim.width; // Adjust for both left and right borders
            const designWidthPercentage = selectedBlock.dimensions.width; // Assuming block width is a percentage

            // Calculate the new x value for center alignment in pixels
            const newX = (canvasWidth - (canvasWidth * designWidthPercentage) / 100) / 2 ;

            // Calculate the percentage of newX based on canvas width
            const percentageX = (newX / canvasWidth) * 100;

            // Update the position.x property using the updateSliderValue function
            updateSliderValue('position.x', percentageX);
        }
    };
    const alignRight = () => {
        if (selectedBlock && selectedBlock.id > 0) {
            const canvasBorder = design.canvas.border || 0; // Assuming canvas.border is in pixels
            const canvasWidth = design.canvas.dim.width; // Adjust for both left and right borders
            const designWidthPercentage = selectedBlock.dimensions.width; // Assuming block width is a percentage

            // Calculate the new x value for right alignment in pixels
            const newX = canvasWidth - (canvasWidth * designWidthPercentage) / 100 - canvasBorder;

            // Calculate the percentage of newX based on canvas width
            const percentageX = (newX / canvasWidth) * 100;

            // Update the position.x property using the updateSliderValue function
            updateSliderValue('position.x', percentageX);
        }
    };
    return (
        <Container> <Grid container>
        <Paper style={{ height: '80vh', overflow: 'auto' }}>
                <Grid item width={'100%' }>
            <IconButton
                size="large"
                color="primary"
                aria-label="Save"
                title="Save"
                onClick={saveDesign}
                style={{
                    float: 'left',
                    background: 'primary',
                }}
            >
                <SaveIcon />
                </IconButton>
            </Grid>
           
            <StyledDiv> 
            <h2>Playground UI</h2>
                    <br />
                    <Grid item width={'100%' }>
                 <DimensionsMenu type="Height" value={design.canvas.dim.height} openDialog={openDialog} handleOpenDialog={handleOpenDialog} handleCloseDialog={handleCloseDialog} setDesign={setDesign} design={design} />
                 <DimensionsMenu type="Width" value={design.canvas.dim.width} openDialog={openDialog} handleOpenDialog={handleOpenDialog} handleCloseDialog={handleCloseDialog} setDesign={setDesign} design={design} />
                 <DimensionsMenu type="Border" value={design.canvas.border} openDialog={openDialog} handleOpenDialog={handleOpenDialog} handleCloseDialog={handleCloseDialog} setDesign={setDesign} design={design} />
                    </Grid>
                    <Grid item width={'100%' }>   <div key={selectedBlock ? selectedBlock.id : -10} style={{ marginBottom: '20px' }}>
                    {selectedBlock && selectedBlock.id > 0 ? <h3>Block {selectedBlock.id}</h3> :
                        <h3>Select Block to edit or add a new Block</h3>}
                        
                        <Grid container width={'100%'}>
                        <ButtonsContainer addTextDesign={addTextDesign} addImageDesign={addImageDesign} deleteDesign={deleteSelectedBlock} selectedBlock={selectedBlock} />

                    </Grid>
                </div>
                    </Grid>
                    <Grid item width={'100%'}>
                        <Grid container>
                        <Grid item width={1/2 }>
                            <BlockSelector blocks={blocks} selectedBlock={selectedBlock} handleBlockSelection={handleBlockSelection} />
                        </Grid>
                        <Grid item width={1/2 }>
                            <BlockParameterSelector selectedBlock={selectedBlock} handleSelectedImage={handleSelectedImage} handleSelectedImageParameter={handleSelectedImageParameter} handleSelectedTextParameter={handleSelectedTextParameter} /> 
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item width={'100%'}>
                        <ImageParameterSelector selectedBlock={selectedBlock} handleSelectedImage={handleSelectedImage} handleTransperancyChange={handleTransperancyChange } />
                    </Grid>
                    <Grid container>
                        <Grid item width={1}>
                            <FontSelector selectedBlock={selectedBlock} blocks={blocks} setBlocks={setBlocks} setSelectedBlock={setSelectedBlock} />
                        </Grid>
                        <Grid item width={1} alignItems='right' alignContent='right'>
                            <ColorSelector selectedBlock={selectedBlock} blocks={blocks} setBlocks={setBlocks} setSelectedBlock={setSelectedBlock} />
                        </Grid>
                    </Grid>
                    <Grid item width={1 }>
                        <AlignContainer selectedBlock={selectedBlock} alignLeft={alignLeft} alignCenter={alignCenter} alignRight={alignRight } />
                    </Grid>
                    <Grid item width={1 }>
                        <BlockManipulator selectedBlock={selectedBlock} updateSliderValue={updateSliderValue} openDialog={openDialog} handleOpenDialog={handleOpenDialog} handleCloseDialog={handleCloseDialog} />
                    </Grid>
            </StyledDiv>
            </Paper>
        </Grid></Container>
    );
};
interface ColorPickerProps {
    id: string;
    value: string;
    onChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ id, value, onChange }) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.value);
    };

    return (
        <input type="color" id={id} value={value} onChange={handleChange} />
    );
};
interface ColorSelectorProps {
    selectedBlock: UnifiedBlock | null;
    blocks: UnifiedBlock[];
    setBlocks: React.Dispatch<React.SetStateAction<UnifiedBlock[]>>;
    setSelectedBlock: React.Dispatch<React.SetStateAction<UnifiedBlock | null>>;
}

const ColorSelector: React.FC<ColorSelectorProps> = ({ selectedBlock, blocks, setBlocks, setSelectedBlock }) => {
    if (!selectedBlock || !(selectedBlock.id > 0) || selectedBlock === null || isImageFieldBlock(selectedBlock)) return null;
    const handleColorChange = (color: string) => {
        if (!selectedBlock || selectedBlock.id <= 0) return;

        const updatedBlocks = blocks.map((block) => {
            if (block.id === selectedBlock.id) {
                return { ...block, color };
            }
            return block;
        });
        if (isUnifiedBlockArray(updatedBlocks)) {
            setBlocks(updatedBlocks);
        }
        if (isUnifiedBlock(selectedBlock)) {
            selectedBlock.color = color;
            setSelectedBlock(selectedBlock);
        }
    };

    return (
        <div>
            <label htmlFor="color-picker">Choose a color:</label>
            <ColorPicker
                id="color-picker"
                value={selectedBlock ? selectedBlock.color : ''}
                onChange={(color: string) => handleColorChange(color)}
            />
        </div>
    );
};
interface FontSelectorProps {
    selectedBlock: UnifiedBlock | null;
    blocks: UnifiedBlock[];
    setBlocks: React.Dispatch<React.SetStateAction<UnifiedBlock[]>>;
    setSelectedBlock: React.Dispatch<React.SetStateAction<UnifiedBlock | null>>;
}
const FontSelector: React.FC<FontSelectorProps> = ({ selectedBlock, blocks, setBlocks, setSelectedBlock }) => {
    const [isInputMode, setIsInputMode] = useState(false);
    // Ensure selectedBlock and its font property exist
    if (!selectedBlock || !(selectedBlock.id > 0 || selectedBlock === null) || !selectedBlock.font || isImageFieldBlock(selectedBlock)) return null;

    // Handle font style change
    const handleFontStyleChange = (style: Partial<TypeBlock>) => {
        if (!selectedBlock || selectedBlock.id <= 0) {
            return;
        }

        const updateBlockStyle = (block: TypeBlock): UnifiedBlock | TypeBlock => {
            if (block.id === selectedBlock.id) {
                const updatedBlock = { ...block, ...style };
                if (isUnifiedBlock(updatedBlock))
                    return updatedBlock;
            }
            if (isUnifiedBlock(block))
                return block;
            else return block;
        };

        const updatedDesigns = blocks.map(updateBlockStyle);
        if (isUnifiedBlockArray(updatedDesigns)) {
            setBlocks(updatedDesigns);
        }

        const updatedSelectedDesign = { ...selectedBlock, ...style } as UnifiedBlock;
        //
        setSelectedBlock(structuredClone(updatedSelectedDesign));
    };

    // Parse font string to get size and family
    const parseFontString = (fontString: string) => {
        const match = fontString.match(/(\d+)px\s*(.*)/);
        if (match) {
            const size = parseInt(match[1]);
            const fontFamily = match[2];
            return { size, fontFamily };
        } else {
            // Default values if parsing fails
            return { size: 16, fontFamily: 'Arial' };
        }
    };

    // Handle font family change
    const handleFontFamilyChange = (fontFamily: string) => {
        const { size } = parseFontString(selectedBlock?.font);
        handleFontStyleChange({ font: `${size}px ${fontFamily}` });
    };

    // Handle font size change
    const handleFontSizeChange = (fontSize: number) => {
        handleFontStyleChange({ font: `${fontSize}px ${parseFontString(selectedBlock?.font).fontFamily}` });
    };

    // Handle font change
    const handleFontChange = (fontSize: string) => {
        handleFontStyleChange({ font: `${fontSize} ${parseFontString(selectedBlock?.font).fontFamily}` });
    };
    const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement|HTMLTextAreaElement>) => {
if (event.key === 'Enter') {
    setIsInputMode(false);

} else if (event.key === 'Delete') {
    // Prevent deleting the component if backspace is pressed at the beginning of the input
    event.stopPropagation();
    return false;
        } console.log(event.key);
    }

    // Assuming parseFontString returns an object with 'size' property

    const fontSizes = ['10', '20', '30', '40', '50']; // List of available font sizes
    const currentFontSize = parseFontString(selectedBlock.font).size; // Get current font size

    // Sort font sizes based on current font size
    const sortedFontSizes = [...fontSizes, currentFontSize].sort((a, b) => {
        if (typeof a === 'string') {
            a = parseInt(a);
        }
        if (typeof b === 'string') {
            b = parseInt(b);
        }
        return a - b;
    });
    return (
        <Container style={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" gutterBottom>
                Font Family:
            </Typography>
            <FormControl>
                <Select
                    value={parseFontString(selectedBlock.font).fontFamily}
                    onChange={e => handleFontFamilyChange(e.target.value as string)}
                    size="small"
                >
                    {["Arial",
                        "Helvetica",
                        "Times New Roman",
                        "Georgia",
                        "Courier New",
                        "Verdana",
                        "Tahoma",
                        "Trebuchet MS",
                        "Calibri",
                        "Cambria"].map(
                        fontFamily => (
                            <MenuItem key={fontFamily} value={fontFamily}>
                                {fontFamily}
                            </MenuItem>
                        )
                    )}
                </Select>
            </FormControl>
            <Typography variant="body2" gutterBottom>
                Font Size: {parseFontString(selectedBlock.font).size}px
            </Typography>
            {isInputMode ? (
                <FormControl>
                    <Input
                        value={parseFontString(selectedBlock.font).size} // Update the value to include 'px'
                        onChange={e => { handleFontChange(e.target.value + 'px' as string) }}
                        onBlur={(e) => setIsInputMode(false)}
                        onKeyDown={(event) => handleInputKeyDown(event)}
                        autoFocus
                   />
                </FormControl >
            ) : (
                <FormControl>
                <Select
                    value = {`${parseFontString(selectedBlock.font).size}px`} // Update the value to include 'px'
            onChange={e => handleFontChange(e.target.value as string)}
                            size="small"
                            onDoubleClick={() => setIsInputMode(true)}
            
                >
            {sortedFontSizes.map(fontSize => ( // Remove 'px' suffix
                <MenuItem key={fontSize} value={`${fontSize}px`}> {/* Add 'px' suffix */}
                    {`${fontSize}px`}
                </MenuItem>
            ))}
        </Select>
            </FormControl >)}
            
            </Container>
    );
};


const DimensionsMenu: React.FC<{ type: string, value: number, openDialog: Map<string, boolean>, handleOpenDialog: (dialogName: string) => void, handleCloseDialog: () => void, setDesign: (design: Design) => void, design: Design }>
= ({ type, value, openDialog, handleOpenDialog, handleCloseDialog, setDesign, design }) => {
const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    if (type === 'Border') {
        return (
            <>
            <StyledInputLabel>Design {type}: {value}px
                <Button key={'button' + type} onClick={() => handleOpenDialog('canvas' + type)}>Edit</Button>
            </StyledInputLabel> 
                <Dialog fullWidth maxWidth={'sm'} open={openDialog.get('canvas' + type) || false} onClose={handleCloseDialog} fullScreen={fullScreen}>
                    <DialogTitle>Edit Design {type}</DialogTitle>
                <DialogContent>
                    <StyledSliderContainer> 
                        <NumberInput
                            aria-label="Canvas Border number input"
                            placeholder="Type a number "
                            value={value}
                            onChange={(e, value) => {
                                if (typeof value === 'number') {
                                    design.canvas.border = value;
                                    setDesign(design);
                                }
                            }
                            }
                        />
                    </StyledSliderContainer>
                </DialogContent>
            </Dialog>
            </>
        );
    }
    return (
        <>
            <StyledInputLabel>Design {type}: {value}
                <Button key={'button' + type} onClick={() => handleOpenDialog('canvas' + type)}>Edit</Button>
            </StyledInputLabel> 
                <Dialog fullWidth maxWidth={'sm'} open={openDialog.get('canvas'+type) || false} onClose={handleCloseDialog} fullScreen={fullScreen}>
                <DialogTitle>Edit Design {type}</DialogTitle>
                    <DialogContent>
                    {type === 'Height' ? (
                    <StyledSliderContainer>
                    <Slider
                        value={value}
                        min={0}
                        max={1000}
                        onChange={(e, value) => {
                            if (typeof value === 'number') {
                                design.canvas.dim.height = value;
                                setDesign(design);
                            }
                        }
                        }
                        style={{ width: '40%' }}
                    />
                    <NumberInput
                        aria-label="Canvas Height number input"
                        placeholder="Type a number "
                        value={value}
                        onChange={(e, value) => {
                            if (typeof value === 'number') {
                                design.canvas.dim.height = value;
                                setDesign(design);
                            }
                        }
                        }
                    />
                        </StyledSliderContainer>) : type === "Width" ? (
<StyledSliderContainer>
                                <Slider
                                    value={value}
                                    min={0}
                                    max={1000}
                                    onChange={(e, value) => {
                                        if (typeof value === 'number') {
                                            design.canvas.dim.width = value;
                                            setDesign(design);
                                        }
                                    }
                                    }
                                    style={{ width: '40%' }}
                                />
                                <NumberInput
                                    aria-label="Canvas Width number input"
                                    placeholder="Type a number "
                                    value={value}
                                    onChange={(e, value) => {
                                        if (typeof value === 'number') {
                                            design.canvas.dim.width = value;
                                            setDesign(design);
                                        }
                                    }
                                    }
                                />
                            </StyledSliderContainer>
                        ) : null}
                    </DialogContent>
                </Dialog>
            </>
        );
};

const BlockSelector: React.FC<{ blocks: UnifiedBlock[], selectedBlock: UnifiedBlock | null, handleBlockSelection: (blockId: number) => void }> = ({ blocks, selectedBlock, handleBlockSelection }) => {
    if (!selectedBlock || selectedBlock === null) return null;
    return (
         <FormControl>
                    <InputLabel>Selected Block:</InputLabel>
                    <Select
                        value={selectedBlock && selectedBlock.id>0 ? selectedBlock.id : 'None'}
                        onChange={(e) => handleBlockSelection(Number(e.target.value))}
                    >
                        <MenuItem key='Not selected Text Design' value='None'>None</MenuItem>
                        {blocks.map((design) => (
                            <MenuItem key={design.id} value={design.id}>
                                { 'type' in design ? 'ImageField ' + design.id : 'TextField ' + design.id }
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

    );
};

const BlockParameterSelector: React.FC<{ selectedBlock: UnifiedBlock | null,handleSelectedImage:(image:Iimage)=>void, handleSelectedImageParameter: (imageParameter: TimageParameter) => void, handleSelectedTextParameter: (textParameter: TtextParameter) => void }> = ({ selectedBlock,handleSelectedImage, handleSelectedImageParameter, handleSelectedTextParameter }) => {
    if(!selectedBlock || selectedBlock === null) return null;
    return (
        <FormControl style={{ marginLeft: '20px' }}>
            {selectedBlock && selectedBlock.id > 0 ? (
                <>
                    {selectedBlock && 'type' in selectedBlock ? (
                        <>
                            {isAllergenFieldBlock(selectedBlock) || isImageFieldBlock(selectedBlock) || isImagePointerBlock(selectedBlock) ? (
                                <>  <InputLabel>Selected Image Type:</InputLabel>
                                    <Select
                                        value={selectedBlock && selectedBlock.id > 0 && 'type' in selectedBlock ? selectedBlock.type : 'None'}
                                        onChange={(e) => handleSelectedImageParameter(e.target.value as TimageParameter)}
                                    >
                                        <MenuItem key={'allergens'} value={'allergens'}> Allergens </MenuItem>
                                        <MenuItem key={'image'} value={'image'}> Image </MenuItem>
                                    </Select>
                                    
                                </>
                               
                            ) : null}
                        </>
                    ) : (
                        <>

                            <InputLabel>Selected Text Parameter:</InputLabel>
                            <Select
                                value={
                                    selectedBlock && selectedBlock.id > 0 && 'textParameter' in selectedBlock
                                        ? selectedBlock.textParameter
                                        : 'None'
                                }
                                onChange={(e) => handleSelectedTextParameter(e.target.value as TtextParameter)}
                            >
                                <MenuItem key={'Not selected textParameter'} value={'None'}>None</MenuItem>
                                {textParameters.map(textParameter => (
                                    <MenuItem key={textParameter} value={textParameter}> {textParametersMap.get(textParameter)} </MenuItem>
                                ))
                                }
                            </Select>
                        </>
                    )}
                </>
            ) : null}
        </FormControl>
    );
};
const ImageParameterSelector: React.FC<{ selectedBlock: UnifiedBlock | null, handleSelectedImage: (image: Iimage) => void, handleTransperancyChange: (transperancy: number) => void }> = ({ selectedBlock, handleSelectedImage, handleTransperancyChange }) => {
    //Critical to check if selectedBlock is null or undefined
    if (!selectedBlock) {
        return null;
    }
    //Critical to check if selectedBlock is imagePointerBlock
    if (!isImagePointerBlock(selectedBlock)) return null;
    if (!images || images.length === 0) {
        console.log('no images');
        return null;
    }     
 
    return (
        <Grid container spacing={0} width={'100%'} alignItems={'center'} alignContent={'center' }>
                <Grid item width={2 / 3} height={'100%' }>
          
                <ImageUpload />
                  
                </Grid>
                <Grid item width={1/3 }>
                    <InputLabel>Image:</InputLabel>
            
            <Select
                        value={selectedBlock.id > 0 && selectedBlock.image ? selectedBlock.image._id : images[0]._id}
                        onChange={(e) => {
                            const img = images.find(image => image._id === e.target.value);
                            if (isIimage(img))
                                handleSelectedImage(img);
                        }
                        }
                    >
                
                    { images.map(image => (
                        <MenuItem key={image._id} value={image._id}> {image.name} </MenuItem>
                        ))                   
                    }
                    </Select>
            </Grid>
            <Grid item width={3 / 3}>
                <InputLabel>Transperancy: { selectedBlock.image.transperancy }% </InputLabel>
                <Slider
                    value={selectedBlock && selectedBlock.id > 0 && 'transperancy' in selectedBlock.image ? selectedBlock.image.transperancy : 0}
                    min={0}
                    max={100}
                    onChange={(e, value) => handleTransperancyChange(value as number)}
                    style={{ width: '80%' }}
                />
              
                </Grid>
            </Grid>
    );
}
const BlockManipulator: React.FC<{ selectedBlock: UnifiedBlock | null, updateSliderValue: (property: string, value: number) => void, openDialog: Map<string, boolean>, handleOpenDialog: (dialogName: string) => void, handleCloseDialog: () => void }> = ({ selectedBlock, updateSliderValue, openDialog, handleOpenDialog, handleCloseDialog }) => {
    if (!selectedBlock || selectedBlock === null) return null;
    return (
            <>
                <StyledInputLabel>Position X: {selectedBlock.position.x}  <Button onClick={() => handleOpenDialog('positionX')}>Edit</Button></StyledInputLabel>

                <Dialog fullWidth maxWidth={'sm'} open={openDialog.get('positionX') || false} onClose={handleCloseDialog}>
                    <DialogTitle>Edit Position X</DialogTitle>
                    <DialogContent>
                        <StyledSliderContainer>
                            <Slider
                                value={selectedBlock ? selectedBlock.position.x : 0}
                                min={0}
                                max={100}
                                onChange={(e, value) => updateSliderValue('position.x', value as number)}
                                style={{ width: '40%' }}
                            />
                            <NumberInput
                                aria-label="Position X number input"
                                placeholder="Type a number "
                                value={selectedBlock ? selectedBlock.position.x : 0}
                                onChange={(e, value) => updateSliderValue('position.x', value as number)}
                            />
                        </StyledSliderContainer>
                    </DialogContent>
                </Dialog>
                <StyledInputLabel>Position Y: {selectedBlock.position.y}  <Button onClick={() => handleOpenDialog('positionY')}>Edit</Button></StyledInputLabel>

                <Dialog fullWidth maxWidth={'sm'} open={openDialog.get('positionY') || false} onClose={handleCloseDialog}>
                    <DialogTitle>Edit Position Y</DialogTitle>
                    <DialogContent>
                        <StyledSliderContainer>
                            <Slider
                                value={selectedBlock.position.y}
                                min={0}
                                max={100}
                                onChange={(e, value) => updateSliderValue('position.y', value as number)}
                                style={{ width: '40%' }}
                            />
                            <NumberInput
                                aria-label="Position Y number input"
                                placeholder="Type a number "
                                value={selectedBlock ? selectedBlock.position.y : 0}
                                onChange={(e, value) => updateSliderValue('position.y', value as number)}
                            />
                        </StyledSliderContainer>
                    </DialogContent>
                </Dialog>
                <StyledInputLabel>Design Height: {selectedBlock.dimensions.height}  <Button onClick={() => handleOpenDialog('height')}>Edit</Button></StyledInputLabel>
                <Dialog fullWidth maxWidth={'sm'} open={openDialog.get('height') || false} onClose={handleCloseDialog}>
                    <DialogTitle>Edit Design Height</DialogTitle>
                    <DialogContent>
                        <StyledSliderContainer>
                            <Slider
                                value={selectedBlock.dimensions.height}
                                min={1}
                                max={100}
                                onChange={(e, value) => updateSliderValue('dimensions.height', value as number)}
                                style={{ width: '40%' }}
                            />
                            <NumberInput
                                aria-label="Design Height number input"
                                placeholder="Type a number "
                                value={selectedBlock ? selectedBlock.dimensions.height : 0}
                                onChange={(e, value) => updateSliderValue('dimensions.height', value as number)}
                            />
                        </StyledSliderContainer>
                    </DialogContent>
                </Dialog>
                <StyledInputLabel>Design Width: {selectedBlock.dimensions.width}  <Button onClick={() => handleOpenDialog('width')}>Edit</Button></StyledInputLabel>
                <Dialog fullWidth maxWidth={'sm'} open={openDialog.get('width') || false} onClose={handleCloseDialog}>
                    <DialogTitle>Edit Design Width</DialogTitle>
                    <DialogContent>
                        <StyledSliderContainer>
                            <Slider
                                value={selectedBlock.dimensions.width}
                                min={1}
                                max={100}
                                onChange={(e, value) => updateSliderValue('dimensions.width', value as number)}
                                style={{ width: '40%' }}
                            />
                            <NumberInput
                                aria-label="Design Width number input"
                                placeholder="Type a number "
                                value={selectedBlock ? selectedBlock.dimensions.width : 0}
                                onChange={(e, value) => updateSliderValue('dimensions.width', value as number)}
                            />
                        </StyledSliderContainer>
                    </DialogContent>
                </Dialog>
                {/* Add other sliders similarly */}

            </>
    );
};
const ButtonsContainer: React.FC<{ addTextDesign: () => void, addImageDesign: () => void, deleteDesign: () => void, selectedBlock: UnifiedBlock | null }> = ({ addTextDesign, addImageDesign, deleteDesign, selectedBlock}) => {
return (
    <>
        <Grid item width={1/3 }>
            <Button onClick={addTextDesign} variant="contained" color="primary" size="small" >Add Text Design</Button>
        </Grid>
        <Grid item width={1/3 }>
        <Button onClick={addImageDesign} variant="contained" color="primary" size="small">Add Image Design</Button>
        </Grid >
        <Grid item width={1/3 }>
            <Button onClick={deleteDesign} variant="contained" color="secondary" size="small" disabled={!selectedBlock || selectedBlock.id < 1}>Delete Design</Button>
        </Grid>
        </>
    );
};
const AlignContainer: React.FC<{ selectedBlock: UnifiedBlock | null, alignLeft:()=>void, alignCenter:()=>void,alignRight:()=>void }> = ({ selectedBlock, alignLeft, alignCenter,alignRight }) => {
    if (!selectedBlock || selectedBlock === null) return null;
    return (
        <Container>
            <Button variant="contained" title="Align Left" color="primary" size="small" onClick={alignLeft} startIcon={<FormatAlignLeftIcon />}>Left</Button>
            <Button variant="contained" title="Align Center" color="primary" size="small" onClick={alignCenter} startIcon={<FormatAlignCenterIcon />}>Center</Button>
            <Button variant="contained" title="Align Right" color="primary" size="small" onClick={alignRight} startIcon={<FormatAlignRightIcon />}>Right</Button>
            </Container>
    );
};

export default DesignUI;

