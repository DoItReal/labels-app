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

import React, { useState, useEffect } from 'react';
import { Button, Slider, FormControl, InputLabel, MenuItem, Select, Dialog, DialogTitle, DialogContent, useTheme, useMediaQuery, IconButton, Container, Paper, Typography, Input, Grid2 as Grid, TextField } from '@mui/material';
import { styled } from '@mui/system';
//import { Unstable_NumberInput as NumberInput } from '@mui/base/Unstable_NumberInput';
import SaveIcon from '@mui/icons-material/Save';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import { createNewDesign, updateDesign } from '../DB/Remote/Designs';
import { getLocalDesigns, setLocalDesigns, updateLocalDesign } from '../DB/LocalStorage/Designs';
import { textParametersMap, dummyImageBlock} from './Editor';
import { getDummyImage, getImagesLocally, isImageURL, loadImages } from '../DB/LocalStorage/Images';
import { Position, Dimensions, TtextParameter, TimageParameter, textParameters, textFieldBlock, imagePointerBlock, UnifiedBlock, isDesignArray, Design, TypeBlock, isUnifiedBlock, isUnifiedBlockArray, isImageFieldBlock, isAllergenFieldBlock, ImagePointer, isImagePointerBlock, isTextFieldBlock, isDesign, isImagePointer } from '../DB/Interfaces/Designs';
import { Iimage, isIimage, isIimageArray, isImage } from '../DB/Interfaces/Images';
import ImageUpload from './ImageUpload';
import { Tabs, Tab, Box } from '@mui/material';
import { TabContext, TabPanel } from '@mui/lab';


interface DesignUIProps {
    design: Design;
    setDesign: (design: Design) => void;
    selectedBlock: UnifiedBlock | null;
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
    selectedBlock,
    setSelectedBlock,
    deleteSelectedBlock
}) => {
    const handleBlockSelection = (blockId: number) => {
        const selected = design.blocks.find((block) => block.id === blockId) || null;
        if (selected !== null) {
            setSelectedBlock(selected);
        }
        else setSelectedBlock(null);
    };
    const handleSelectedImageParameter = (imageParameter: TimageParameter) => {
        if (selectedBlock && 'type' in selectedBlock && 'id' in selectedBlock && !isTextFieldBlock(selectedBlock) && (isImageFieldBlock(selectedBlock) || isAllergenFieldBlock(selectedBlock))) {
                setSelectedBlock(prevSelectedBlock => {
                    if (prevSelectedBlock && prevSelectedBlock.id === selectedBlock.id) {
                        if (imageParameter === 'image') {
                            return {
                                ...prevSelectedBlock,
                                type: imageParameter,
                                image: dummyImageBlock.image,
                            }
                        } else {
                            return {
                                ...prevSelectedBlock,
                                type:imageParameter
                            }
                        }
                    }
                    return prevSelectedBlock;
                });
            const updatedBlocks = design.blocks.map(block => {
                if (block.id === selectedBlock.id) {
                    if (imageParameter === 'image') {
                        return {
                            ...block,
                            type: imageParameter,
                            image: dummyImageBlock.image,
                        }
                    }else
                        return {
                            ...block,
                            type: imageParameter,
                        }
                } else
                    return { ...block };
            });
            const updatedDesign = { ...design, blocks: updatedBlocks };
            console.log(design)
            console.log(updatedDesign)
            if (isDesign(updatedDesign))
            setDesign(updatedDesign);
        }
    };
    const handleTransperancyChange = (transperancy: number) => {
        if (!isImagePointerBlock(selectedBlock)) {
            console.log("Err: Selected Block is not ImagePointerBlock! Can't change transperancy!");
            return;
        }
        if (selectedBlock && 'type' in selectedBlock && selectedBlock.type === 'image' && 'id' in selectedBlock) {
        //    const block = selectedBlock as imagePointerBlock;

            setSelectedBlock(prevSelectedBlock => {
                if (prevSelectedBlock && prevSelectedBlock.id === selectedBlock.id && 'image' in prevSelectedBlock) {
                    return {
                        ...(prevSelectedBlock as imagePointerBlock), // Type assertion for prevSelectedBlock
                        image: {
                            ...prevSelectedBlock.image,
                            // Type assertion for prevSelectedBlock.image
                            transperancy,
                        }
                    };
                }
                return prevSelectedBlock;
            });
          
            const updatedBlocks = design.blocks.map(block => {
                if (block.id === selectedBlock.id && isImagePointerBlock(block)) {
                    return {
                        ...block, image: { ...block.image, transperancy }
};
                } else
                    return block;
            });
            const updatedDesign = { ...design, blocks: updatedBlocks };
            console.log(updatedDesign)
            if (isDesign(updatedDesign))
                setDesign(updatedDesign);
            else console.log("Err: updatedDesign is not Design type");
        }
        //gets the stored designs in the Local Storage
        /* const storedDesigns: Design[] | null = getLocalDesigns();
         if (!storedDesigns) {
             console.log('The fetched Design is null! Failed to update Local Designs!');
             return;
         }
         //iterates through storedDesigns and saves the changes to the design in the localStorage 
         for (let i = 0; i < storedDesigns.length; i++) {
             if (storedDesigns[i]._id === design._id) {
                 storedDesigns[i].blocks = design.blocks;
                 setLocalDesigns(storedDesigns);
                 return;
             }
         }*/
    };


    const handleSelectedImage = async (selectedImage: Iimage) => {
        if (selectedBlock && 'type' in selectedBlock && selectedBlock.type === 'image' && 'id' in selectedBlock) {
            const block = selectedBlock as imagePointerBlock;
            setSelectedBlock(prevSelectedBlock => {
                if (prevSelectedBlock && prevSelectedBlock.id === block.id && 'image' in prevSelectedBlock) {
                    return {
                        ...(prevSelectedBlock as imagePointerBlock), // Type assertion for prevSelectedBlock
                        image: {
                            ...prevSelectedBlock.image,
                            // Type assertion for prevSelectedBlock.image
                            _id: selectedImage._id,
                            name: selectedImage.name,
                            transperancy: prevSelectedBlock.image.transperancy,
                            size: selectedImage.size || 1, // Default size if not provided
                        }
                    };
                }
                return prevSelectedBlock;
            });
            const updatedBlocks = [
                ...design.blocks.map(prevBlock => {
                    if (prevBlock.id === block.id && isImagePointerBlock(prevBlock)) {
                        const updatedImage = {
                            ...(prevBlock.image || {}),
                            _id: selectedImage._id,
                            transperancy: prevBlock.image.transperancy,
                            name: selectedImage.name,
                            size: selectedImage.size || 1, // Default size if not provided
                        };
                        return {
                            ...prevBlock,
                            image: updatedImage
                        };
                    } else
                        return prevBlock;
                })
            ];
            const updatedDesign = { ...design, blocks: updatedBlocks };
            if (isDesign(updatedDesign)) {
                setDesign(updatedDesign);
            }
            else {
                console.log('Err: updatedDesign is not Design type!');
            }
        }
        /*
        //gets the stored Designs from Local Storage
        const storedDesigns: Design[] | null = getLocalDesigns();
        if (!storedDesigns) {
            console.log('The fetched Design is null! Failed to update Local Designs!');
            return;
        }
        //update stored designs in Local Storage with the updated design
        for (let i = 0; i < storedDesigns.length;i++) {
            if (storedDesigns[i]._id === design._id) {
                storedDesigns[i].blocks = design.blocks;
                setLocalDesigns(storedDesigns);
                return;
            }
        }
        */
    };

    const handleSelectedTextParameter = (textParameter: TtextParameter) => {
        if (isTextFieldBlock(selectedBlock)) {
            const block = selectedBlock as textFieldBlock;

            setSelectedBlock(prevSelectedDesign => {
                if (prevSelectedDesign && prevSelectedDesign.id === block.id) {
                    return {
                        ...prevSelectedDesign,
                        textParameter: textParameter,
                    }
                }
                return prevSelectedDesign;
            });
            const updatedBlocks = {
                ...design.blocks, blocks: {
                    ...design.blocks.map(prevBlock => {
                        if (prevBlock.id === block.id) {
                            return {
                                ...prevBlock,
                                textParameter: textParameter,
                            }
                        }
                        return prevBlock;
                    })
                }
            }
            if (isUnifiedBlockArray(updatedBlocks)) {
                const updatedDesign = { ...design, blocks: updatedBlocks };
                setDesign(updatedDesign);
            }
        } else {
            console.log('Err: Selected Block is not TextFieldBlock!')
        }
    };
    const updateSliderValue = (property: string, value: number) => {
        if (selectedBlock) {
            const [field, attribute] = property.split('.');

            // Update the selected block first
            setSelectedBlock(prevSelectedBlock => {
                if (prevSelectedBlock && prevSelectedBlock.id === selectedBlock.id) {
                    let updatedBlock = { ...prevSelectedBlock };

                    if (field === 'position') {
                        updatedBlock = {
                            ...updatedBlock,
                            position: {
                                ...(updatedBlock.position as Position),
                                [attribute]: value,
                            },
                        };
                    } else if (field === 'dimensions') {
                        updatedBlock = {
                            ...updatedBlock,
                            dimensions: {
                                ...(updatedBlock.dimensions as Dimensions),
                                [attribute]: value,
                            },
                        };
                    }

                    return updatedBlock;
                }
                return prevSelectedBlock;
            });

            // Now update the design blocks
            const updatedBlocks = design.blocks.map(prevBlock => {
                if (prevBlock.id === selectedBlock.id) {
                    let updatedBlock = { ...prevBlock };

                    if (field === 'position') {
                        updatedBlock = {
                            ...updatedBlock,
                            position: {
                                ...(updatedBlock.position as Position),
                                [attribute]: value,
                            },
                        };
                    } else if (field === 'dimensions') {
                        updatedBlock = {
                            ...updatedBlock,
                            dimensions: {
                                ...(updatedBlock.dimensions as Dimensions),
                                [attribute]: value,
                            },
                        };
                    }

                    return updatedBlock;
                }
                return prevBlock;
            });

            // Finally, update the design
            setDesign({
                ...design,
                blocks: updatedBlocks,
            });
        }
    };

    const handleBackgroundChange = (newBackground: string | ImagePointer) => {
        if (design && isDesign(design)) {
            const updatedDesign = { ...design, canvas: { ...design.canvas, background: newBackground } };
           setDesign(updatedDesign);
            // Update the design in the session storage
            const storedDesigns: Design[] | null = getLocalDesigns();
            if (!storedDesigns) {
                console.log('The fetched Design is null! Failed to update Local Designs!');
                return;
            }
            for (let i = 0; i < storedDesigns.length; i++) {
                if (storedDesigns[i]._id === design._id) {
                    storedDesigns[i].canvas = design.canvas;
                    setLocalDesigns(storedDesigns);
                    return;
                }
            }
        }
    }
    const addTextDesign = () => {
        console.log(design.blocks.length)
        const updatedDesign = {
            ...design,
                blocks: [
                   ...[...design.blocks, 
                        ...[{
                        id: design.blocks.length + 1,
                        position: { x: 50, y: 50 },
                        dimensions: { width: 100, height: 20 },
                        font: '20px Arial',
                        color: 'red',
                        textParameter: textParameters[0]
                        }]],
                ]
        }
        if (isDesign(updatedDesign))
            setDesign(updatedDesign);
        else {
            console.log('Err: updatedDesign is not Design type!');
        }
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
                    console.log(storedDesigns);
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
            
            const newDesign = await createNewDesign(design);
            if(isDesign(newDesign))updateLocalDesign(newDesign);
                //update session storage
            storedDesigns.push(design);
            setLocalDesigns(storedDesigns);    
        } catch (error) {
            console.log(error)
        }
    };

    const addImageDesign = () => {
        console.log(isDesign(design));
        console.log(design);
        const updatedDesign = {
            ...design,
            blocks: [
                ...design.blocks,
                ...[{
                    id: design.blocks.length + 1,
                    position: { x: 50, y: 50 },
                    dimensions: { width: 30, height: 30 },
                    font: '20px Helvetica',
                    color: 'red',
                    type: 'allergens', // Initialize with an empty string or default value
                    //  allergenParameter: 'allergen_image.jpg', // Set the image parameter here
                }],
            ]
        };
        console.log(updatedDesign)
        if (isDesign(updatedDesign))
            setDesign(updatedDesign);
        else
            console.log('EditorUI.tsx/const EditorUI=> addImageDesign ==> The updated design is not Design type! Cant setDesign!')
    };
    
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
        <Container>
            <Grid container size={"grow"}>
        <Paper style={{ height: '80vh', overflow: 'auto' }}>
                    <Grid size={12}>
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
                        {design ? <h2>{design.name}</h2> :
                            <h2>Playground UI</h2>
                        }
                        <DesignTabs
                            tabs={[
                                {
                                    label: 'Dimensions',
                                    content: (
                                        <Grid container spacing={2}>
                                            <Grid size={{ xs: 12 }}>
                                                <DimensionsMenu
                                                    type="Height"
                                                    value={design.canvas.dim.height}
                                                    openDialog={openDialog}
                                                    handleOpenDialog={handleOpenDialog}
                                                    handleCloseDialog={handleCloseDialog}
                                                    setDesign={setDesign}
                                                    design={design}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12 }}>
                                                <DimensionsMenu
                                                    type="Width"
                                                    value={design.canvas.dim.width}
                                                    openDialog={openDialog}
                                                    handleOpenDialog={handleOpenDialog}
                                                    handleCloseDialog={handleCloseDialog}
                                                    setDesign={setDesign}
                                                    design={design}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12 }}>
                                                <DimensionsMenu
                                                    type="Border"
                                                    value={design.canvas.border}
                                                    openDialog={openDialog}
                                                    handleOpenDialog={handleOpenDialog}
                                                    handleCloseDialog={handleCloseDialog}
                                                    setDesign={setDesign}
                                                    design={design}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12 }}>
                                                <BackgroundMenu
                                                    design={design}
                                                    handleBackgroundChange={handleBackgroundChange}
                                                    openDialog={openDialog}
                                                    handleOpenDialog={handleOpenDialog}
                                                    handleCloseDialog={handleCloseDialog}
                                                />
                                            </Grid>
                                        </Grid>
                                    ),
                                },
                                {
                                    label: 'Blocks',
                                    content: (
                                        <div key={selectedBlock ? selectedBlock.id : -10} style={{ marginBottom: '20px' }}>
                                            <Grid container size={"grow"} spacing={1}>
                                                <Grid size={"grow"}>
                                            <BlockSelector
                                                blocks={design.blocks}
                                                selectedBlock={selectedBlock}
                                                handleBlockSelection={handleBlockSelection}
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 12 }} >
                                                    <Grid container direction="row">
                                                        <ButtonsContainer
                                                            addTextDesign={addTextDesign}
                                                            addImageDesign={addImageDesign}
                                                            deleteDesign={deleteSelectedBlock}
                                                            selectedBlock={selectedBlock}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <DesignTabs
                                                tabs={[{
                                                    label: "General",
                                                    content: (
                                            <Grid container spacing = { 1} >

                                                            <Grid size={{ xs: 6 }}>
                                                    <BlockParameterSelector
                                                        selectedBlock={selectedBlock}
                                                        handleSelectedImage={handleSelectedImage}
                                                        handleSelectedImageParameter={handleSelectedImageParameter}
                                                        handleSelectedTextParameter={handleSelectedTextParameter}
                                                    />
                                                </Grid>
                                                            <Grid size={{ xs: 12 }}>
                                                    <ImageParameterSelector
                                                        selectedBlock={selectedBlock}
                                                        handleSelectedImage={handleSelectedImage}
                                                        handleTransperancyChange={handleTransperancyChange}
                                                    />
                                                </Grid>
                                                            <Grid size={{xs:12}}>
                                                    <FontSelector
                                                        selectedBlock={selectedBlock}
                                                        design={design}
                                                        setDesign={setDesign}
                                                        setSelectedBlock={setSelectedBlock}
                                                    />
                                                </Grid>
                                                            <Grid size={{xs:12}}>
                                                    <ColorSelector
                                                        selectedBlock={selectedBlock}
                                                        design={design}
                                                        setDesign={setDesign}
                                                        setSelectedBlock={setSelectedBlock}
                                                    />
                                                </Grid>
                                            </Grid>
                                                    )
                                                },
                                                    {
                                                        label: "Allignment",
                                                        content: (<Grid container spacing={0}>
                                                            <Grid size={{ xs: 12 }}>
                                                                <AlignContainer
                                                                    selectedBlock={selectedBlock}
                                                                    alignLeft={alignLeft}
                                                                    alignCenter={alignCenter}
                                                                    alignRight={alignRight}
                                                                />
                                                            </Grid>
                                                            <Grid size={{ xs: 12 }}>
                                                                <BlockManipulator
                                                                    selectedBlock={selectedBlock}
                                                                    updateSliderValue={updateSliderValue}
                                                                    openDialog={openDialog}
                                                                    handleOpenDialog={handleOpenDialog}
                                                                    handleCloseDialog={handleCloseDialog}
                                                                />
                                                            </Grid>
                                                        </Grid>)
                                                    }
                                                ]} />
                                        </div>
                                    ),
                                },
                            ]}
                        /> 
            </StyledDiv>
            </Paper>
        </Grid></Container>
    );
};

interface DesignTabsProps {
    tabs: { label: string; content: React.ReactNode }[];
}

const DesignTabs: React.FC<DesignTabsProps> = ({ tabs }) => {
    const [tabIndex, setTabIndex] = useState('0');

    const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
        setTabIndex(newValue);
    };

    return (
        <TabContext value={tabIndex}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs variant="scrollable" value={tabIndex} onChange={handleTabChange} aria-label="design tabs">
                    {tabs.map((tab, index) => (
                        <Tab key={index} label={tab.label} value={index.toString()} />
                    ))}
                </Tabs>
            </Box>

            {tabs.map((tab, index) => (
                <TabPanel key={index} value={index.toString()}>
                    {tab.content}
                </TabPanel>
            ))}
        </TabContext>
    );
};



const BackgroundMenu: React.FC<{ design: Design, handleBackgroundChange: (newBackground: string | ImagePointer) => void, openDialog: Map<string, boolean>, handleOpenDialog: (dialogName: string) => void, handleCloseDialog: () => void }> = ({ design, handleBackgroundChange, openDialog, handleOpenDialog, handleCloseDialog }) => {
    const fullScreen = useMediaQuery(useTheme().breakpoints.down('sm'));
    const [dummyImage,setDummyImage] = useState<Iimage| null>(null);
    const [images, setImages] = useState<Iimage[]>();
    useEffect(() => {
        const populateImages = async () => {
            const loadedImages = await loadImages(getImagesLocally() || []);
            if (isIimageArray(loadedImages))
                setImages(loadedImages);
            else if (isIimage(loadedImages))
                setImages([loadedImages]);
        }
        
        const fetchDummyImage = async () => {
            await getDummyImage().then(image => setDummyImage(image));
        };
        populateImages();
        fetchDummyImage();
    }, []);
    return (
        <div>
            <Button key={'buttonBackground'} onClick={() => handleOpenDialog('canvasBackground')}>Change Background</Button>
            {design.canvas.background && typeof design.canvas.background === 'string' ? <input type='color' value={design.canvas.background} style={{ width: '4em', height: '2em'}} disabled /> : null}
            <Dialog fullWidth maxWidth={'sm'} open={openDialog.get('canvasBackground') || false} onClose={handleCloseDialog} fullScreen={fullScreen}>
                <DialogTitle>Edit Design Background</DialogTitle>
                <DialogContent>
                    {design.canvas.background ?
                        <ColorPicker id="newBackground-picker" value={typeof design.canvas.background === 'string' ? design.canvas.background : '#000000'} onChange={(color: string) => handleBackgroundChange(color)} />
                        : null}
                    {images && (<Grid size={4}>
<FormControl fullWidth>
                        <InputLabel>Image:</InputLabel>

                        <Select
                            value={design && design.canvas.background && typeof design.canvas.background !== 'string' ? design.canvas.background._id : dummyImage? dummyImage._id : '0'}
                            onChange={(e) => {
                                const img = images.find(image => image._id === e.target.value) || dummyImage;
                                if (isIimage(img))
                                    handleBackgroundChange({ _id: img._id, name: img.name, size: img.size, transperancy:1 } as ImagePointer);
                            }
                            }
                        >
                           
                            <MenuItem key={dummyImage? dummyImage._id: 'errorDummyImage'} value={dummyImage? dummyImage._id:''}>{dummyImage?dummyImage.name:'null'}</MenuItem>
                            {images.map(image => (
                                <MenuItem key={image._id} value={image._id}> {image.name} </MenuItem>
                            ))
                            }
                        </Select>
                       <FormControl fullWidth>
<TransperancySlider design={design} handleBackgroundChange={handleBackgroundChange} />
            </FormControl>
                            {typeof design.canvas.background !== 'string' && <Typography>Transperancy: {design.canvas.background.transperancy} </Typography>}
                        
                    </FormControl></Grid>)}

                    
                </DialogContent>
            </Dialog>
        </div>
    );
};
const TransperancySlider: React.FC<{ design: Design, handleBackgroundChange: (newBackground: string | ImagePointer) => void }> = ({ design, handleBackgroundChange }) => {
    const [transparency, setTransparency] = useState(
        typeof design.canvas.background !== 'string'
            ? design.canvas.background.transperancy
            : 10
    );

    const handleTransparencyChange = (e:any,value: number | number[]) => {
        if(typeof value !== 'number') return;
        typeof design.canvas.background !== 'string' &&
            handleBackgroundChange({
                ...design.canvas.background,
                transperancy: value,
            });
        typeof design.canvas.background !== 'string' && console.log({
            ...design.canvas.background,
            transperancy: value,
        })
        setTransparency(value); // Update the transparency state
    };

    return (
        <Slider
            valueLabelDisplay="auto"
            aria-label="transparency"
            value={transparency}
            min={0}
            max={100}
            step={0.5}
            onChange={handleTransparencyChange}
        />
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
    design: Design;
    setDesign: (newDesign:Design)=>void;
    setSelectedBlock: React.Dispatch<React.SetStateAction<UnifiedBlock | null>>;
}

const ColorSelector: React.FC<ColorSelectorProps> = ({ selectedBlock, design, setDesign, setSelectedBlock }) => {
    if (!selectedBlock || !(selectedBlock.id > 0) || selectedBlock === null || isImageFieldBlock(selectedBlock)) return null;
    const handleColorChange = (color: string) => {
        if (!selectedBlock || selectedBlock.id <= 0) return;
        const blocks = design.blocks;
        const updatedBlocks = blocks.map((block) => {
            if (block.id === selectedBlock.id) {
                return { ...block, color };
            }
            return block;
        });
        if (isUnifiedBlockArray(updatedBlocks)) {
            const updatedDesign = { ...design, blocks: updatedBlocks };
            setDesign(updatedDesign);
        } else {
            console.log("Err: updatedBlocks are not UnifiedBlockArray!");
        }
        if (isUnifiedBlock(selectedBlock)) {
            selectedBlock.color = color;
            setSelectedBlock(selectedBlock);
        } else {
            console.log('ErrselectedBlock is not UnifiedBlock!');
        }
    };

    return (
        <div>
            <label htmlFor="newBackground-picker">Choose a color:</label>
            <ColorPicker
                id="newBackground-picker"
                value={selectedBlock ? selectedBlock.color : ''}
                onChange={(color: string) => handleColorChange(color)}
            />
        </div>
    );
};
interface FontSelectorProps {
    selectedBlock: UnifiedBlock | null;
    setSelectedBlock: React.Dispatch<React.SetStateAction<UnifiedBlock | null>>;
    design: Design;
    setDesign: (newDesign:Design)=>void; 
}
const FontSelector: React.FC<FontSelectorProps> = ({ selectedBlock, design, setDesign, setSelectedBlock }) => {
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

        const updatedBlocks = design.blocks.map(updateBlockStyle);
        if (isUnifiedBlockArray(updatedBlocks)) {
            const updatedDesign = { ...design, blocks: updatedBlocks };
            setDesign(updatedDesign);
        }

        const updatedSelectedBlock = { ...selectedBlock, ...style } as UnifiedBlock;
        setSelectedBlock(structuredClone(updatedSelectedBlock));
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
        <Grid container size={"grow"}>
            <Grid size={"auto"} alignContent="center" alignItems="center" alignSelf="left">
            <Typography variant="body2" fontSize="0.8rem" gutterBottom>
                Font Family:
                </Typography>
            <FormControl>
                <Select
                        value={parseFontString(selectedBlock.font).fontFamily}
                        onChange={e => handleFontFamilyChange(e.target.value as string)}
                        size="small"
                        sx={{fontSize:"0.6rem"} }
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
                </Grid>
            <Grid size={6} alignContent="center" alignItems="center" alignSelf="right" >
            <Typography variant="body2" fontSize="0.8rem" gutterBottom>
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
                            sx={{fontSize:"0.6rem", padding:0, margin:0} }
                   />
                </FormControl >
            ) : (
                <FormControl>
                <Select
                                value={`${parseFontString(selectedBlock.font).size}px`} // Update the value to include 'px'
                                onChange={e => handleFontChange(e.target.value as string)}
                                size="small"
                                onDoubleClick={() => setIsInputMode(true)}
                                sx={{ fontSize: "0.6rem", padding:0,margin:0 } }
                >
            {sortedFontSizes.map(fontSize => ( // Remove 'px' suffix
                <MenuItem key={fontSize} value={`${fontSize}px`}> {/* Add 'px' suffix */}
                    {`${fontSize}px`}
                </MenuItem>
            ))}
        </Select>
            </FormControl >)}
            </Grid>
            </Grid>
    );
};


const DimensionsMenu: React.FC<{ type: string, value: number, openDialog: Map<string, boolean>, handleOpenDialog: (dialogName: string) => void, handleCloseDialog: () => void, setDesign: (design: Design) => void, design: Design }>
= ({ type, value, openDialog, handleOpenDialog, handleCloseDialog, setDesign, design }) => {
const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    if (type === 'Border') {
        return (
            <>
            <StyledInputLabel>Canvas {type}: {value}px
                <Button key={'button' + type} onClick={() => handleOpenDialog('canvas' + type)}>Edit</Button>
            </StyledInputLabel> 
                <Dialog fullWidth maxWidth={'sm'} open={openDialog.get('canvas' + type) || false} onClose={handleCloseDialog} fullScreen={fullScreen}>
                    <DialogTitle>Edit Canvas {type}</DialogTitle>
                <DialogContent>
                        <StyledSliderContainer>
                            <TextField
                            type="number"
                            aria-label="Canvas Border number input"
                            placeholder="Type a number "
                            value={value}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const value = parseFloat(e.target.value);
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
            <StyledInputLabel>Canvas {type}: {value}
                <Button key={'button' + type} onClick={() => handleOpenDialog('canvas' + type)}>Edit</Button>
            </StyledInputLabel> 
                <Dialog fullWidth maxWidth={'sm'} open={openDialog.get('canvas'+type) || false} onClose={handleCloseDialog} fullScreen={fullScreen}>
                <DialogTitle>Edit Canvas {type}</DialogTitle>
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
                            <TextField
                        type= "number"
                        aria-label="Canvas Height number input"
                        placeholder="Type a number "
                        value={value}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const value = parseFloat(e.target.value);
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
                                <TextField
                                    type="number"
                                    aria-label="Canvas Width number input"
                                    placeholder="Type a number "
                                    value={value}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        const value = parseFloat(e.target.value);
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
   // if (!selectedBlock || selectedBlock === null) return null;
    return (
         <FormControl>
                    <InputLabel>Selected Block:</InputLabel>
                    <Select
                        value={selectedBlock && selectedBlock.id>0 ? selectedBlock.id : 'None'}
                        onChange={(e) => handleBlockSelection(Number(e.target.value))}
                    >
                        <MenuItem key='Not selected Block' value='None'>Please select a block!</MenuItem>
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
    const images = getImagesLocally();
    if (!Array.isArray(images)) return null;
    if (!images || images.length === 0) {
        console.log('no images');
        return null;
    }     
 
    return (
        <Grid container spacing={0} size={"grow"} height={'100%'} width={'100%'} alignItems={'center'} alignContent={'center' }>
                <Grid size={6}>
          
                <ImageUpload />
                  
                </Grid>
                <Grid size={6 }>
                    <InputLabel>Image:</InputLabel>
            
            <Select
                        value={selectedBlock.id > 0 && selectedBlock.image ? selectedBlock.image._id : images[0]._id}
                        onChange={async(e) => {
                            const img = images.find(image => image._id === e.target.value);
                            if (img && isImageURL(img))
                                var loadedImage = await loadImages(img);
                            else return;
                            if (isIimage(loadedImage)) {
                                handleSelectedImage(loadedImage);
                                }
                        }
                        }
                    >
                
                    { images.map(image => (
                        <MenuItem key={image._id} value={image._id}> {image.name} </MenuItem>
                        ))                   
                    }
                    </Select>
            </Grid>
            <Grid size={12}>
                <InputLabel>Transperancy: {selectedBlock.image.transperancy }% </InputLabel>
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
                            <TextField
                            type="number"
                            aria-label="Position X number input"
                            placeholder="Type a number "
                            value={selectedBlock ? selectedBlock.position.x : 0}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => { const value = parseFloat(e.target.value); updateSliderValue('position.x', value as number) }}
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
                            <TextField
                            type="number"
                            aria-label="Position Y number input"
                            placeholder="Type a number "
                            value={selectedBlock ? selectedBlock.position.y : 0}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => { const value = parseFloat(e.target.value); updateSliderValue('position.y', value as number) }}
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
                            <TextField
                            type="number"
                            aria-label="Design Height number input"
                            placeholder="Type a number "
                            value={selectedBlock ? selectedBlock.dimensions.height : 0}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => { const value = parseFloat(e.target.value); updateSliderValue('dimensions.height', value as number) }}
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
                            <TextField
                            type="number"
                            aria-label="Design Width number input"
                            placeholder="Type a number "
                            value={selectedBlock ? selectedBlock.dimensions.width : 0}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => { const value = parseFloat(e.target.value); updateSliderValue('dimensions.width', value as number) }}
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
        <Grid size={4 }>
            <Button onClick={addTextDesign} variant="contained" color="primary" size="small" >Add Text Design</Button>
        </Grid>
        <Grid size={4}>
        <Button onClick={addImageDesign} variant="contained" color="primary" size="small">Add Image Design</Button>
        </Grid >
        <Grid size={4}>
            <Button onClick={deleteDesign} variant="contained" color="secondary" size="small" disabled={!selectedBlock || selectedBlock.id < 1}>Delete Design</Button>
        </Grid>
        </>
    );
};
const AlignContainer: React.FC<{ selectedBlock: UnifiedBlock | null, alignLeft:()=>void, alignCenter:()=>void,alignRight:()=>void }> = ({ selectedBlock, alignLeft, alignCenter,alignRight }) => {
    if (!selectedBlock || selectedBlock === null) return null;
    return (
        <Grid container spacing={0} size={"grow"} direction="row" columns={18 }>
            <Grid size={5} minWidth="auto">
                <Button variant="contained" title="Align Left" color="primary" sx={{ fontSize: "0.6rem" }} size="small" onClick={alignLeft} startIcon={<FormatAlignLeftIcon fontSize="small" />}>Left</Button>
            </Grid>
            <Grid size={8} minWidth="auto">
                <Button variant="contained" title="Align Center" color="primary" sx={{fontSize:"0.6rem"}} size="small" onClick={alignCenter} startIcon={<FormatAlignCenterIcon fontSize="small" />}>Center</Button>
            </Grid>
            <Grid size={5} minWidth="auto">
                <Button variant="contained" title="Align Right" color="primary" sx={{ fontSize: "0.6rem" }} size="small" onClick={alignRight} startIcon={<FormatAlignRightIcon fontSize="small" />}>Right</Button>
            </Grid>
        </Grid>
    );
};

export default DesignUI;

