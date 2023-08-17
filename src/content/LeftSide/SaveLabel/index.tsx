import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { LabelContent } from './LabelContent';
import './index.css';
import './saveLabel.css';
import { db } from '../../../App';
import { labelDataType } from '../../../db';
import { Label } from '../../../labels';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
export interface IsaveLabelInput {
    currentAllergens: number[], setCurrentAllergens: Dispatch<SetStateAction<number[]>>,
    filterCategory: string[], setFilterCategory: Dispatch<SetStateAction<string[]>>,
    translation: { bg: string, en: string, de: string, rus: string }, setTranslation: Dispatch<SetStateAction<{ bg: string, en: string, de: string, rus: string }>>
}
export function CreateLabel({ enable, setEnable }:{ enable: Map<string,boolean>, setEnable: (key:string,value:boolean) => void }) {
    const [currentAllergens, setCurrentAllergens] = useState<number[]>([]);
    const [filterCategory, setFilterCategory] = useState<string[]>(["all"]);
    const [translation, setTranslation] = useState<{ bg: string, en: string, de: string, rus: string }>({ bg: '', en: '', de: '', rus: '' });
    if (!enable.get('createLabel')) return null;
    const createLabel = () => {
        var label = {
            allergens: currentAllergens,
            category: filterCategory,
            bg: translation.bg,
            en: translation.en,
            de: translation.de,
            rus: translation.rus
        };

        db.createNewLabel(label);
    };
    const eventHandler = (e: DraggableEvent, data: DraggableData) => { };//console.log(e);
    return (
        enable.get("createLabel") ?
        <Draggable handle='.handle' onDrag={(e, data) => eventHandler(e, data)}><div className="draggedDiv">
        <div className="saveLabel">
                    <Header handleClick={() => setEnable("createLabel", false) } />
            <LabelContent currentAllergens={currentAllergens} setCurrentAllergens={setCurrentAllergens} filterCategory={filterCategory} setFilterCategory={setFilterCategory} translation={translation} setTranslation={setTranslation} />
            
            <button className="saveButton" onClick={createLabel }>Create Label</button>
                
            </div>
        </div>
           
            </Draggable> 
            : <></>

    );
}

export function SaveLabel({ enable, setEnable, label, clearLabel }: { enable: boolean, setEnable: (arg: boolean) => void, label: labelDataType, clearLabel:()=>void }) {
    const [currentAllergens, setCurrentAllergens] = useState<number[]>(label.allergens);
    const [filterCategory, setFilterCategory] = useState<string[]>(label.category);
    const [translation, setTranslation] = useState<{ bg: string, en: string, de: string, rus: string }>({ bg: label.bg, en: label.en, de: label.de, rus: label.rus });
    useEffect(() => {
        setTranslation({ bg: label.bg, en: label.en, de: label.de, rus: label.rus });
    },[label]);
  
    const saveLabel = () => {
        var editedLabel: labelDataType = { 
            _id: label._id,
            allergens: currentAllergens,
            category: filterCategory,
            bg: translation.bg,
            en: translation.en,
            de: translation.de,
            rus: translation.rus
        };

        db.saveLabel(editedLabel);
        setEnable(false);
        clearLabel();
    };
    const eventHandler = (e: DraggableEvent, data: DraggableData) => { };// console.log(e);
        
    return (
       enable? 
            <Draggable handle='.handle' onDrag={(e, data) => eventHandler(e, data)}><div className="draggedDiv">
                <div className="saveLabel">
                
                    <Header handleClick={() => { setEnable(false); clearLabel(); }} />
            <LabelContent currentAllergens={currentAllergens} setCurrentAllergens={setCurrentAllergens} filterCategory={filterCategory} setFilterCategory={setFilterCategory} translation={translation} setTranslation={setTranslation} />
                <button className="saveButton" onClick={saveLabel}>Save Label</button>
            </div></div></Draggable>
            : null
        
    );
}
function Header({ handleClick }: { handleClick: () => void}) {
    //const [currentStyle, setCurrentStyle] = useState({});
    var currentStyle = {};
    var ref = useRef(null);
    var hold = false;

    return (
        <div ref={ref} className="saveLabelHeader handle">
            <button className="closeSignsBox" onClick={handleClick}>X</button>
        </div>
        );
}