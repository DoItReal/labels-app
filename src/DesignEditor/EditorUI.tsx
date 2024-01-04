/*
    It is called in Editor.tsx then it is called in App.tsx
    -EditorUI.tsx
       - Editor.tsx
            - App.tsx - renders $Editor on https://address/editor
                 
      ***To be developed *** To make parent Design which will host all designs and feature to manipulate them
      * It will have UI
      * Editor will become feauture for the parent Design
      * This way we can have multiple designs on the same page
      * We can have multiple pages with multiple designs
      * We can add features as we go along as:
      * $$$ Paid features (the most important ones) - more advanced functionality - as customaizable as possible
      *     Free features (the least important ones) - just basic functionality 
It is the UI of the editor

*/

import React from 'react';
import { UnifiedDesign,textFieldDesign,imageFieldDesign, Dimensions, Position, TtextParameter,TimageParameter, textParameters, textParametersMap, dummyDesign, Design} from './Editor'; // Make sure to import your Design type
import { Button, Slider, FormControl, InputLabel, MenuItem, Select, Dialog, DialogTitle, DialogContent, useTheme, useMediaQuery } from '@mui/material';
import { styled } from '@mui/system';
import { Unstable_NumberInput as NumberInput } from '@mui/base/Unstable_NumberInput';
import {createNewDesign } from './DesignDB';

interface DesignUIProps {
    canvasDesign: Dimensions;
    design: Design;
    setCanvasDesign: React.Dispatch<React.SetStateAction<Dimensions>>;
    designs: UnifiedDesign[];
    selectedDesign: UnifiedDesign | null;
    setDesigns: React.Dispatch<React.SetStateAction<UnifiedDesign[]>>;
    setSelectedDesign: React.Dispatch<React.SetStateAction<UnifiedDesign | null>>;
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
    canvasDesign,
    design,
    setCanvasDesign,
    designs,
    selectedDesign,
    setDesigns,
    setSelectedDesign
}) => {
    
    const handleDesignSelection = (designId: number) => {
        const selected = designs.find((design) => design.id === designId) || null;
        if (selected !== null) {
            setSelectedDesign(selected);
        }
        else setSelectedDesign(dummyDesign);
    };
    const handleSelectedImageParameter = (imageParameter: TimageParameter) => {
            if (selectedDesign && 'type' in selectedDesign && 'id' in selectedDesign) {
                const design = selectedDesign as imageFieldDesign;

                setSelectedDesign(prevSelectedDesign => {
                    if (prevSelectedDesign && prevSelectedDesign.id === design.id) {
                        if (imageParameter === 'image') {
                            return {
                                ...prevSelectedDesign,
                                type: imageParameter,
                                imageID: 1,
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
                setDesigns(prevDesigns =>
                    prevDesigns.map(prevDesign => {
                        if (prevDesign.id === design.id) {
                            if (imageParameter === 'image') {
                                return {
                                    ...prevDesign,
                                    type: imageParameter,
                                    imageID: 1
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
    const handleSelectedTextParameter = (textParameter: TtextParameter) => {
        if (selectedDesign && 'textParameter' in selectedDesign && 'id' in selectedDesign) {
            const design = selectedDesign as textFieldDesign;

            setSelectedDesign(prevSelectedDesign => {
                if (prevSelectedDesign && prevSelectedDesign.id === design.id) {
                    return {
                        ...prevSelectedDesign,
                        textParameter: textParameter,
                    }
                }
                return prevSelectedDesign;
            });
            setDesigns(prevDesigns =>
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
        if (selectedDesign) {
            const [field, attribute] = property.split('.');
            
            setSelectedDesign(prevSelectedDesign => {
                if (prevSelectedDesign && prevSelectedDesign.id === selectedDesign.id) {
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

            setDesigns(prevDesigns =>
                prevDesigns.map(prevDesign => {
                    if (prevDesign.id === selectedDesign.id) {
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
        setDesigns((prevDesigns) => [
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
        
    const saveDesignsToDatabase = async() => {
        // Save the designs to the database (you can replace this with your actual database saving logic)
        console.log('Design saved to the database:', design);
        try {
            design.designs = designs;
            //to create logic for saving instead of creating new design
createNewDesign(design);
}catch (error) {
console.log(error)
}
    };
     //TO DO
    const addImageDesign = () => {
        setDesigns((prevDesigns) => [
            ...prevDesigns,
            {
                id: prevDesigns.length + 1,
                position: { x: 50, y: 250 },
                dimensions: { width: 120, height: 120 },
                font: '20px Helvetica',
                color: 'red',
                type: 'allergens', // Initialize with an empty string or default value
              //  allergenParameter: 'allergen_image.jpg', // Set the image parameter here
            },
        ]);
    };
    const deleteDesign = () => {
        if (selectedDesign && selectedDesign.id > 0) {
            setDesigns(prevDesigns => prevDesigns.filter(design => design.id !== selectedDesign.id));
            setSelectedDesign(null); // Clear the selected design after deletion
        }
    };
    const theme = useTheme();

    return (
        <StyledDiv>
            <h2>Playground UI</h2>
            <StyledInputLabel>Canvas Height: {canvasDesign.height}  <Button onClick={() => handleOpenDialog('canvasHeight')}>Edit</Button></StyledInputLabel>
           
            <Dialog fullWidth maxWidth={ 'sm'} open={openDialog.get('canvasHeight') || false} onClose={handleCloseDialog}>
                <DialogTitle>Edit Canvas Height</DialogTitle>
                <DialogContent>
            <StyledSliderContainer>
                <Slider
                    value={canvasDesign ? canvasDesign.height : 0}
                    min={0}
                    max={1000}
                    onChange={(e, value) => {
                        if(typeof value === 'number')
                        setCanvasDesign(prevDesign => ({
                            ...prevDesign,
                            height: value
                        }))
                    }}
                    style={{ width: '40%' }}
                />
                <NumberInput
                    aria-label="Canvas Height number input"
                    placeholder="Type a number "
                    value={canvasDesign ? canvasDesign.height : 0}
                    onChange={(e, value) => {
                        if (typeof value === 'number')
                            setCanvasDesign(prevDesign => ({
                                ...prevDesign,
                                height: value
                            }))
                    }}
                />
                    </StyledSliderContainer>
                </DialogContent>
            </Dialog>
            <StyledInputLabel>Canvas Width: {canvasDesign.width}  <Button onClick={() => handleOpenDialog('canvasWidth')}>Edit</Button></StyledInputLabel>

            <Dialog fullWidth maxWidth={'sm'} open={openDialog.get('canvasWidth') || false} onClose={handleCloseDialog}>
                <DialogTitle>Edit Canvas Width</DialogTitle>
                <DialogContent>
            <StyledSliderContainer>
                <Slider
                    value={canvasDesign ? canvasDesign.width : 0}
                    min={0}
                    max={1000}
                    onChange={(e, value) => {
                        if (typeof value === 'number')
                            setCanvasDesign(prevDesign => ({
                                ...prevDesign,
                                width: value
                            }))
                    }}
                    style={{ width: '40%' }}
                />
                <NumberInput
                    aria-label="Canvas Width number input"
                    placeholder="Type a number "
                    value={canvasDesign ? canvasDesign.width : 0}
                    onChange={(e, value) => {
                        if (typeof value === 'number')
                            setCanvasDesign(prevDesign => ({
                                ...prevDesign,
                                width: value
                            }))
                    }}
                    
                />
                    </StyledSliderContainer>
                </DialogContent>
            </Dialog>
            <div>
                <FormControl>
                    <InputLabel>Selected Design:</InputLabel>
                    <Select
                        value={selectedDesign && selectedDesign.id>0 ? selectedDesign.id : 'None'}
                        onChange={(e) => handleDesignSelection(Number(e.target.value))}
                    >
                        <MenuItem key='Not selected Text Design' value='None'>None</MenuItem>
                        {designs.map((design) => (
                            <MenuItem key={design.id} value={design.id}>
                                { 'type' in design ? 'ImageField ' + design.id : 'TextField ' + design.id }
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl style={{ marginLeft: '20px' }}>
                    {selectedDesign && selectedDesign.id > 0 ? (
                        <>
                            {selectedDesign && 'type' in selectedDesign ? (
                                <>
                                    {selectedDesign.type === 'allergens' || selectedDesign.type === 'image' ? (
                                      <>  <InputLabel>Selected Image Type:</InputLabel>
                                         <Select
                        value={selectedDesign && selectedDesign.id > 0 && 'type' in selectedDesign ? selectedDesign.type : 'None'}
                        onChange={(e) => handleSelectedImageParameter(e.target.value as TimageParameter)}
                    > 
                        <MenuItem key={'allergens'} value={'allergens'}> Allergens </MenuItem>
                        <MenuItem key={'image'} value={'image'}> Image </MenuItem>
                    </Select> </>
                                    ) : null}
                                </>
                            ) : (
                                    <>

                                    <InputLabel>Selected Text Parameter:</InputLabel>
                                    <Select
                                        value={
                                            selectedDesign && selectedDesign.id > 0 && 'textParameter' in selectedDesign
                                                ? selectedDesign.textParameter
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
                 
            </div>
            <div>
                <div key={selectedDesign ? selectedDesign.id : -10} style={{ marginBottom: '20px' }}>
                    {selectedDesign && selectedDesign.id > 0 ? <h3>Design {selectedDesign.id}</h3> :
                        <h3>Select Block to edit or add a new Block</h3>}

                    {selectedDesign && selectedDesign !== dummyDesign &&(
                        <>
                            <StyledInputLabel>Position X: {selectedDesign.position.x}  <Button onClick={() => handleOpenDialog('positionX')}>Edit</Button></StyledInputLabel>

                            <Dialog fullWidth maxWidth={'sm'} open={openDialog.get('positionX') || false} onClose={handleCloseDialog}>
                                <DialogTitle>Edit Position X</DialogTitle>
                                <DialogContent>
                        <StyledSliderContainer>
                            <Slider
                                value={selectedDesign ? selectedDesign.position.x : 0}
                                min={0}
                                max={100}
                                onChange={(e, value) => updateSliderValue('position.x', value as number)}
                                style={{ width: '40%' }}
                                        />
                                        <NumberInput
                                            aria-label="Position X number input"
                                            placeholder="Type a number "
                                            value={selectedDesign ? selectedDesign.position.x : 0}
                                            onChange={(e, value) => updateSliderValue('position.x', value as number)}
                                        />
                                    </StyledSliderContainer>
                                </DialogContent>
                            </Dialog>   
                            <StyledInputLabel>Position Y: {selectedDesign.position.y}  <Button onClick={() => handleOpenDialog('positionY')}>Edit</Button></StyledInputLabel>

                            <Dialog fullWidth maxWidth={'sm'} open={openDialog.get('positionY') || false} onClose={handleCloseDialog}>
                                <DialogTitle>Edit Position Y</DialogTitle>
                                <DialogContent>
                        <StyledSliderContainer>
                            <Slider
                                value={selectedDesign.position.y}
                                min={0}
                                max={100}
                                onChange={(e, value) => updateSliderValue('position.y', value as number)}
                                style={{width:'40%'} }
                                />
                                <NumberInput
                                    aria-label="Position Y number input"
                                    placeholder="Type a number "
                                    value={selectedDesign ? selectedDesign.position.y : 0}
                                    onChange={(e, value) => updateSliderValue('position.y', value as number)}
                                />
                                    </StyledSliderContainer>
                                </DialogContent>
                            </Dialog>
                            <StyledInputLabel>Design Height: {selectedDesign.dimensions.height}  <Button onClick={() => handleOpenDialog('height')}>Edit</Button></StyledInputLabel>
                            <Dialog fullWidth maxWidth={'sm'} open={openDialog.get('height') || false} onClose={handleCloseDialog}>
                                <DialogTitle>Edit Design Height</DialogTitle>
                                <DialogContent>
                        <StyledSliderContainer>
                            <Slider
                                value={selectedDesign.dimensions.height}
                                min={1}
                                max={100}
                                onChange={(e, value) => updateSliderValue('dimensions.height', value as number)}
                                style={{ width: '40%' }}
                                />
                                <NumberInput
                                    aria-label="Design Height number input"
                                    placeholder="Type a number "
                                    value={selectedDesign ? selectedDesign.dimensions.height : 0}
                                    onChange={(e, value) => updateSliderValue('dimensions.height', value as number)}
                                />
                                    </StyledSliderContainer>
                                </DialogContent>
                            </Dialog>
                            <StyledInputLabel>Design Width: {selectedDesign.dimensions.width}  <Button onClick={() => handleOpenDialog('width')}>Edit</Button></StyledInputLabel>
                            <Dialog fullWidth maxWidth={'sm'} open={openDialog.get('width') || false} onClose={handleCloseDialog}>
                                <DialogTitle>Edit Design Width</DialogTitle>
                                <DialogContent>
                        <StyledSliderContainer>
                            <Slider
                                value={selectedDesign.dimensions.width}
                                min={1}
                                max={100}
                                onChange={(e, value) => updateSliderValue('dimensions.width', value as number)}
                                style={{ width: '40%' }}
                                />
                                <NumberInput
                                    aria-label="Design Width number input"
                                    placeholder="Type a number "
                                    value={selectedDesign ? selectedDesign.dimensions.width : 0}
                                    onChange={(e, value) => updateSliderValue('dimensions.width', value as number)}
                                />
                                    </StyledSliderContainer>
                                </DialogContent>
                            </Dialog>
                        {/* Add other sliders similarly */}
                       
                        </>)}
                    <Button onClick={saveDesignsToDatabase} variant="contained" color="primary">
                        Save Design
                    </Button>
                        <Button onClick={addTextDesign} variant="contained" color="primary">
                            Add Text Design
                        </Button>
                    <Button onClick={addImageDesign} variant="contained" color="primary"> Add Image Design</Button>
                    {selectedDesign && (
                        <>
                        <Button onClick={deleteDesign} variant="contained" color="secondary">
                            Delete Selected Design
                        </Button>
                    
                    </>
                )}
            </div>
            </div>
        </StyledDiv>
    );
};

export default DesignUI;