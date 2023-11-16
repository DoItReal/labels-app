import React from 'react';
import { Design, Dimensions, Position, TtextParameter } from './Playground'; // Make sure to import your Design type
import { Button, Slider, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { styled } from '@mui/system';
interface DesignUIProps {
    designs: Design[];
    selectedDesign: Design | null;
    selectedTextParameter: TtextParameter;
    setSelectedTextParameter: (textParameter: TtextParameter) => void;
    setDesigns: React.Dispatch<React.SetStateAction<Design[]>>;
    setSelectedDesign: React.Dispatch<React.SetStateAction<Design | null>>;
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
    designs,
    selectedDesign,
    selectedTextParameter,
    setSelectedTextParameter,
    setDesigns,
    setSelectedDesign
}) => {
    const handleDesignSelection = (designId: number) => {
        const selected = designs.find((design) => design.id === designId) || null;
        setSelectedDesign(selected);
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

    const addDesign = () => {
        setDesigns((prevDesigns) => [
            ...prevDesigns,
            {
                id: prevDesigns.length + 1,
                position: { x: 350, y: 50 },
                dimensions: { width: 100, height: 20 },
                font: '20px Arial',
                color: 'red',
                textParameter: ''
            },
        ]);
    };

    const saveDesignsToDatabase = () => {
        // Save the designs to the database (you can replace this with your actual database saving logic)
        console.log('Designs saved to the database:', designs);
    };

    return (
        <StyledDiv>
            <h2>Playground UI</h2>

            <div>
                <FormControl>
                    <InputLabel>Selected Design:</InputLabel>
                    <Select
                        value={selectedDesign ? selectedDesign.id : ''}
                        onChange={(e) => handleDesignSelection(Number(e.target.value))}
                    >
                        <MenuItem value={undefined}>None</MenuItem>
                        {designs.map((design) => (
                            <MenuItem key={design.id} value={design.id}>
                                Design {design.id}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl style={{ marginLeft: '20px' }}>
                    <InputLabel>Selected Text Parameter:</InputLabel>
                    <Select
                        value={selectedDesign ? selectedDesign.textParameter : ''}
                        onChange={(e) => setSelectedTextParameter(e.target.value as TtextParameter)}
                    >
                        <MenuItem value="bg">Bulgarian</MenuItem>
                        <MenuItem value="en">English</MenuItem>
                        <MenuItem value="de">Deutsch</MenuItem>
                        <MenuItem value="rus">Russian</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <div>
                {selectedDesign && (
                    <div key={selectedDesign.id} style={{ marginBottom: '20px' }}>
                        <h3>Design {selectedDesign.id}</h3>
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
                        <Button onClick={addDesign} variant="contained" color="primary">
                            Add Design
                        </Button>
                    </div>
                )}
            </div>
        </StyledDiv>
    );
};

export default DesignUI;