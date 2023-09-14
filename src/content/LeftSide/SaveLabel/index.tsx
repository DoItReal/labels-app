import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { LabelContent } from './LabelContent';
import './index.css';
import './saveLabel.css';
import { labelDataType } from '../../../db';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { IcontentProps } from '../../Content';
import React from 'react';
import { Popover } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Theme } from '@emotion/react';
export interface IsaveLabelInput {
    currentAllergens: number[], setCurrentAllergens: Dispatch<SetStateAction<number[]>>,
    filterCategory: string[], setFilterCategory: Dispatch<SetStateAction<string[]>>,
    handleSubmit: (evt: React.FormEvent) => void,
    type:string,
    translation: { bg: string, en: string, de: string, rus: string }, setTranslation: Dispatch<SetStateAction<{ bg: string, en: string, de: string, rus: string }>>
}
export function CreateLabel({ handleCreateLabel, enableLabelForm, handleLabelFormClose }: IcontentProps) {
    const [currentAllergens, setCurrentAllergens] = useState<number[]>([]);
    const [filterCategory, setFilterCategory] = useState<string[]>([]);
    const [translation, setTranslation] = useState<{ bg: string, en: string, de: string, rus: string }>({ bg: '', en: '', de: '', rus: '' });
    const firstInit = useRef(false);
    const clear = () => {
        setCurrentAllergens([]);
        setFilterCategory([]);
        setTranslation({ bg: '', en: '', de: '', rus: '' });
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
            bg: translation.bg,
            en: translation.en,
            de: translation.de,
            rus: translation.rus
        };
        if (await handleCreateLabel(label))
            clear();
         else {
            console.log('Error creating new label');
        }
    };
   
    
    const handleCloseClick = (event: React.MouseEvent ) => {
        event.stopPropagation();
        close();
    }
    const handleKeyDown = (event:globalThis.KeyboardEvent):any => {
        if (event.keyCode === 27) {
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
        currentAllergens, setCurrentAllergens, filterCategory,
        setFilterCategory, translation, setTranslation, type: "Create Label", handleSubmit: createLabel
    };
   
    return (
        enableLabelForm ?
            <Draggable handle='.handle' onDrag={(e, data) => eventHandler(e, data)}>
              <Popover
                    id={id}
                    open={enableLabelForm}
                    onClose={handleLabelFormClose}
                    anchorReference={"none"}
                    classes={{
                        root: classes.popoverRoot,
                    }}
                    anchorOrigin={{
                        vertical: 'center',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'center',
                        horizontal: 'center',
                    }}>
                        <div  className="saveLabel draggedDiv">
                            <Header handleClick={handleCloseClick } />
                            <LabelContent {...props} />
                        </div> 
              </Popover>
            </Draggable>
            : null

    );
}
const useStyles = makeStyles((theme: Theme) => ({
    popoverRoot: {
        display: 'flex',
        justifyContent: 'center',
        flexGrow: 1,
        flexShrink: 1,
        scale: 0.7,
        width: "700px",
        height: "650px",
        left:"10%"
    },
}));


export function SaveLabel({ open, handleClose, label,handleSubmit }: { open: boolean, handleClose: () => void, label: labelDataType, handleSubmit:(arg:labelDataType)=>void }) {
    const [currentAllergens, setCurrentAllergens] = useState<number[]>(label.allergens);
    const [filterCategory, setFilterCategory] = useState<string[]>(label.category);
    const [translation, setTranslation] = useState<{ bg: string, en: string, de: string, rus: string }>({ bg: label.bg, en: label.en, de: label.de, rus: label.rus });
    const firstInit = useRef(false);
    useEffect(() => {
        setTranslation({ bg: label.bg, en: label.en, de: label.de, rus: label.rus });
    },[label]);
  
    const saveLabel = (event: React.FormEvent) => {
        event.preventDefault();
        var editedLabel: labelDataType = {
            _id: label._id,
            allergens: currentAllergens,
            category: filterCategory,
            bg: translation.bg,
            en: translation.en,
            de: translation.de,
            rus: translation.rus
        };
        handleSubmit(editedLabel);
        close();
    };

    const handleKeyDown = (event: globalThis.KeyboardEvent): any => {
        console.log(event.keyCode);
        if (event.keyCode === 27) {
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

    return (
       open? 
            <Draggable handle='.handle' onDrag={(e, data) => eventHandler(e, data)}>
                <div className="draggedDiv">
                <div className="saveLabel">
                    <Header handleClick={close} />
                        <LabelContent {...props} />
            </div></div></Draggable>
            : null  
    );
}
function Header({ handleClick }: { handleClick: (event:React.MouseEvent) => void}) {
    //const [currentStyle, setCurrentStyle] = useState({});
   // var currentStyle = {};
    var ref = useRef(null);
  //  var hold = false;

    return (
        <div ref={ref} className="saveLabelHeader handle">
            <button className="closeSignsBox" onClick={handleClick}>X</button>
        </div>
        );
}