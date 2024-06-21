import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { LabelContent } from './LabelContent';
import './saveLabel.css';
import { MealTranslation, labelDataType } from '../DB/Interfaces/Labels';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { IcontentProps } from '../content/InterfacesContent';
import React from 'react';
import { Box, IconButton, Paper } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Theme } from '@emotion/react';
import CloseIcon from '@mui/icons-material/Close';
export interface IsaveLabelInput {
    currentAllergens: number[],
    setCurrentAllergens: (arg:number[])=>void,
    filterCategory: string[], setFilterCategory: Dispatch<SetStateAction<string[]>>,
    handleSubmit: (evt: React.FormEvent) => void,
    type:string,
    translation: MealTranslation[],
    setTranslation: Dispatch<SetStateAction<MealTranslation[]>>
}
export function CreateLabel({ handleCreateLabel, enableLabelForm, handleLabelFormClose }: IcontentProps) {
    const [currentAllergens, setCurrentAllergens] = useState<number[]>([]);
    const [filterCategory, setFilterCategory] = useState<string[]>([]);
    const [translation, setTranslation] = useState<MealTranslation[]>([{lang: 'bg', name: '', description: ''}, { lang: 'en', name: '', description: '' }, { lang: 'de', name: '', description: '' }, { lang: 'ru', name: '', description: '' }
    ]);
    const firstInit = useRef(false);
    const clear = () => {
        setCurrentAllergens([]);
        setFilterCategory([]);
        setTranslation([{ lang: 'bg', name: '', description: '' }, { lang: 'en', name: '', description: '' }, { lang: 'de', name: '', description: '' }, { lang: 'ru', name: '', description: '' }]);
    };
    const classes = useStyles();
    const id = enableLabelForm ? 'createLabelPopover' : undefined;
    if (!enableLabelForm) {
        return null;
    }
    const createLabel = async (event: React.FormEvent) => {
        event.preventDefault();
        event.stopPropagation();
        var label = {
            allergens: currentAllergens,
            category: filterCategory,
            translations:translation,
	    owner:''
        };
        if (await handleCreateLabel(label))
            clear();
         else {
            console.log('Error creating new label');
        }
    };
   
    const setAllergens = (arr: number[]) => {
        arr.sort((a,b)=>a-b);
        
        setCurrentAllergens(arr);
    };
    const handleCloseClick = (event: React.MouseEvent|React.TouchEvent ) => {
        event.stopPropagation();
        close();
    }
    const handleKeyDown = (event:globalThis.KeyboardEvent):any => {
        if (event.keyCode === 27) { //esc
            event.preventDefault();
            close();
        }
    }
    const close = () => {
        clear();
        handleLabelFormClose();
        firstInit.current = false;
        window.removeEventListener('keydown', handleKeyDown, true);
    }
    if (enableLabelForm && !firstInit.current) {
        window.addEventListener('keydown',handleKeyDown, true);
        firstInit.current = true;
    } 
    const eventHandler = (e: DraggableEvent, data: DraggableData) => { };//console.log(e);

    const props = {
        currentAllergens, setCurrentAllergens:setAllergens, filterCategory,
        setFilterCategory, translation, setTranslation, type: "Create Label", handleSubmit: createLabel
    };
   
    return (
        enableLabelForm ?
            <Draggable handle='.handle' onDrag={(e, data) => eventHandler(e, data)} defaultPosition={{ x: window.innerWidth *0.5, y: window.innerHeight*0.1 } } >
                <Paper
                    elevation={5 }
                    id={id}
                    classes={{
                        root: classes.popoverRoot,
                    }}
                    sx={{ translate: 0 } }
                   >
                    <Box>
                        <div  className="saveLabel draggedDiv">
                       
                        <Header handleClose={handleCloseClick} />
                            <LabelContent {...props} />
                        </div> 
                        </Box>
              </Paper>
            </Draggable>
            : null

    );
}



export function SaveLabel({ open, handleClose, label,handleSubmit }: { open: boolean, handleClose: () => void, label: labelDataType, handleSubmit:(arg:labelDataType)=>void }) {
    const [currentAllergens, setCurrentAllergens] = useState<number[]>(label.allergens);
    const [filterCategory, setFilterCategory] = useState<string[]>(label.category);
    const [translation, setTranslation] = useState<MealTranslation[]>(label.translations);
    const firstInit = useRef(false);
    useEffect(() => {
        setTranslation(label.translations);
    },[label]);
  
    const saveLabel = (event: React.FormEvent) => {
        event.preventDefault();
        var editedLabel: labelDataType = {
            _id: label._id,
            allergens: currentAllergens,
            category: filterCategory,
            translations: translation,
	    owner: label.owner
        };
        handleSubmit(editedLabel);
        close();
    };

    const handleKeyDown = (event: globalThis.KeyboardEvent): any => {
        if (event.keyCode === 27) { //esc
            event.preventDefault();
            close();
        }
    }
    const close = () => {;
        handleClose();
        firstInit.current = false;
        window.removeEventListener('keydown', handleKeyDown, true);
    }
    if (open && !firstInit.current) {
        window.addEventListener('keydown', handleKeyDown, true);
        firstInit.current = true;
    } 

    const eventHandler = (e: DraggableEvent, data: DraggableData) => { };// console.log(e);

    const props = { currentAllergens, setCurrentAllergens, filterCategory, setFilterCategory, translation, setTranslation, handleSubmit: saveLabel, type: "Save Label" };
    const classes = useStyles();
    const id = open ? 'saveLabelPopover' : undefined;
    return (
        open ? 
            <Draggable handle='.handle' onDrag={(e, data) => eventHandler(e, data)} defaultPosition={{ x: window.innerWidth / 2, y: window.innerHeight / 8 }}>
                <Paper
                    elevation={5}
                    id={id}
                    classes={{
                        root: classes.popoverRoot,
                    }}
                    sx={{ translate:0, left:0, top:0} }
>
                <Box>
                    <div className="saveLabel draggedDiv">
            
                    <Header handleClose={close} />
                                    <LabelContent {...props} />
                                </div>
                            </Box>
                                </Paper>
            </Draggable>
            : null  
    );
}
function Header({ handleClose }: { handleClose: (event:React.MouseEvent | React.TouchEvent) => void}) {
    return (
        <Box className="handle" width={1} height={5 / 100}  sx={{
            position: 'absolute',
            top: '-5px',
            left: '-5px',
            borderLeft: '10px solid deepskyblue',
            borderBottom: '2px solid white',
            backgroundColor: 'deepskyblue',
            borderRadius: 0,
            zIndex: 999
           
        }}>
            <IconButton size="small" title="Close" onClick={handleClose} onTouchEndCapture={handleClose} sx={{
                float: 'right',
                padding: '2px',
                margin: '2px',
                borderRadius: '4px',
                border: '1px solid black',
                backgroundColor: 'error.main',
                "&:hover": {
                    backgroundColor: "error.main",
                    border: '1px solid white'
                }
            }} ><CloseIcon />
            </IconButton> 
            </Box>
        );
}
const useStyles = makeStyles((theme: Theme) => ({
    popoverRoot: {
        display: 'flex',
        position: 'absolute',
        justifyContent: 'center',
        alignContent: 'center',
        width:'50%',
        top: '0',
        left: '0',
        scale:0.7,
        zIndex:1
    },
}));