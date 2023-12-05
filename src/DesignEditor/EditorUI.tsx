import React from 'react';
import { UnifiedDesign,textFieldDesign,imageFieldDesign, Dimensions, Position, TtextParameter,TimageParameter, textParameters, textParametersMap, dummyDesign} from './Editor'; // Make sure to import your Design type
import { Button, Slider, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { styled } from '@mui/system';
interface DesignUIProps {
    canvasDesign: Dimensions,
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
                        return {
                            ...prevSelectedDesign,
                            type: imageParameter,
                        }
                    }
                    return prevSelectedDesign;
                });
                setDesigns(prevDesigns =>
                    prevDesigns.map(prevDesign => {
                        if (prevDesign.id === design.id) {
                            return {
                                ...prevDesign,
                                type: imageParameter,
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
                position: { x: 350, y: 50 },
                dimensions: { width: 100, height: 20 },
                font: '20px Arial',
                color: 'red',
                textParameter: textParameters[0]
            },
        ]);
    };

    const saveDesignsToDatabase = () => {
        // Save the designs to the database (you can replace this with your actual database saving logic)
        console.log('Designs saved to the database:', designs);
    };
     //TO DO
    const addImageDesign = () => {
        setDesigns((prevDesigns) => [
            ...prevDesigns,
            {
                id: prevDesigns.length + 1,
                position: { x: 250, y: 250 },
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
    return (
        <StyledDiv>
            <h2>Playground UI</h2>
            <StyledSliderContainer>
                <StyledInputLabel>Canvas Height:</StyledInputLabel>
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
                <InputLabel>Canvas Height: {canvasDesign.height}</InputLabel>
            </StyledSliderContainer>
            <StyledSliderContainer>
                <StyledInputLabel>Canvas Width:</StyledInputLabel>
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
                <InputLabel>Canvas Width: {canvasDesign.width}</InputLabel>
            </StyledSliderContainer>
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
                    >  <MenuItem key={'Not selected imageType'} value={'None'}>None</MenuItem>
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

                {selectedDesign && (
                  <>
                        <StyledSliderContainer>
                            <StyledInputLabel>Position X:</StyledInputLabel>
                            <Slider
                                value={selectedDesign ? selectedDesign.position.x : 0}
                                min={0}
                                max={400}
                                onChange={(e, value) => updateSliderValue('position.x', value as number)}
                                style={{ width: '40%' }}
                            />
                            <InputLabel>X: {selectedDesign.position.x}</InputLabel>
                        </StyledSliderContainer>
                        <StyledSliderContainer>
                            <StyledInputLabel>Position Y:</StyledInputLabel>
                            <Slider
                                value={selectedDesign.position.y}
                                min={0}
                                max={400}
                                onChange={(e, value) => updateSliderValue('position.y', value as number)}
                                style={{width:'40%'} }
                            />
                            <InputLabel>Y: {selectedDesign.position.y}</InputLabel>
                        </StyledSliderContainer>
                        <StyledSliderContainer>
                            <StyledInputLabel>Height:</StyledInputLabel>
                            <Slider
                                value={selectedDesign.dimensions.height}
                                min={0}
                                max={400}
                                onChange={(e, value) => updateSliderValue('dimensions.height', value as number)}
                                style={{ width: '40%' }}
                            />
                            <InputLabel>Y: {selectedDesign.dimensions.height}</InputLabel>
                        </StyledSliderContainer>
                        <StyledSliderContainer>
                            <StyledInputLabel>Width:</StyledInputLabel>
                            <Slider
                                value={selectedDesign.dimensions.width}
                                min={0}
                                max={400}
                                onChange={(e, value) => updateSliderValue('dimensions.width', value as number)}
                                style={{ width: '40%' }}
                            />
                            <InputLabel>Y: {selectedDesign.dimensions.width}</InputLabel>
                        </StyledSliderContainer>
                        {/* Add other sliders similarly */}
                        <Button onClick={saveDesignsToDatabase } variant="contained" color="primary">
                            Save Design
                        </Button>
                        </>)}
                  
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