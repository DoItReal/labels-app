import { Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from 'react';
import { LabelContent } from './LabelContent';
import './index.css';
import './saveLabel.css';
import { db, enableStatesContext } from '../../../App';
import { labelDataType } from '../../../db';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { IcontentProps } from '../../Content';
import React from 'react';


export interface IsaveLabelInput {
    currentAllergens: number[], setCurrentAllergens: Dispatch<SetStateAction<number[]>>,
    filterCategory: string[], setFilterCategory: Dispatch<SetStateAction<string[]>>,
    handleSubmit: (evt: React.FormEvent) => void,
    type:string,
    translation: { bg: string, en: string, de: string, rus: string }, setTranslation: Dispatch<SetStateAction<{ bg: string, en: string, de: string, rus: string }>>
}
export function CreateLabel({ handleCreateLabel }: IcontentProps) {
    const [enableStates, updateStates] = useContext(enableStatesContext);
    const [currentAllergens, setCurrentAllergens] = useState<number[]>([]);
    const [filterCategory, setFilterCategory] = useState<string[]>([]);
    const [translation, setTranslation] = useState<{ bg: string, en: string, de: string, rus: string }>({ bg: '', en: '', de: '', rus: '' });
    const firstInit = useRef(false);
    const clear = () => {
        setCurrentAllergens([]);
        setFilterCategory([]);
        setTranslation({ bg: '', en: '', de: '', rus: '' });
    };
    if (!enableStates.get('createLabel')) {
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
        updateStates("createLabel", false);
        firstInit.current = false;
        window.removeEventListener('keydown', handleKeyDown, true);
    }
    if (enableStates.get("createLabel") && !firstInit.current) {
        window.addEventListener('keydown',handleKeyDown, true);
        firstInit.current = true;
    } 
    const eventHandler = (e: DraggableEvent, data: DraggableData) => { };//console.log(e);

    const props = { currentAllergens, setCurrentAllergens, filterCategory, setFilterCategory, translation, setTranslation, type: "Create Label", handleSubmit: createLabel };

    return (
        enableStates.get("createLabel") ?
            <Draggable handle='.handle' onDrag={(e, data) => eventHandler(e, data)}><div  className="draggedDiv">
                <div  className="saveLabel">
                    <Header handleClick={handleCloseClick } />
                    <LabelContent {...props} />
            </div>
        </div>
           
            </Draggable>
            : null

    );
}

export function SaveLabel({ enable, setEnable, label, clearLabel,handleSubmit }: { enable: boolean, setEnable: (arg: boolean) => void, label: labelDataType, clearLabel:()=>void, handleSubmit:(arg:labelDataType)=>void }) {
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
        setEnable(false);
        clearLabel();
        firstInit.current = false;
        window.removeEventListener('keydown', handleKeyDown, true);
    }
    if (enable && !firstInit.current) {
        window.addEventListener('keydown', handleKeyDown, true);
        firstInit.current = true;
    } 

    const eventHandler = (e: DraggableEvent, data: DraggableData) => { };// console.log(e);

    const props = { currentAllergens, setCurrentAllergens, filterCategory, setFilterCategory, translation, setTranslation, handleSubmit: saveLabel, type: "Save Label" };

    return (
       enable? 
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