import { ChangeEvent, Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Category } from '../../UI/CategoryUI';
import { Allergens } from "../../UI/AllergensUI";
import './labelContent.css';
import { Label } from '../../../labels';
import { IsaveLabelInput } from './index';

export function LabelContent({ currentAllergens, setCurrentAllergens, filterCategory, setFilterCategory, translation, setTranslation }: IsaveLabelInput) {
    
        const [preview, setPreview] = useState<any>(null);
    
    const setBG = (e: ChangeEvent<HTMLInputElement>) => {
        let tmp = { ...translation };
        tmp.bg = e.target.value;
        inputChange(tmp);
    };
    const setEN = (e: ChangeEvent<HTMLInputElement>) => {
        let tmp = { ...translation };
        tmp.en = e.target.value;
        inputChange(tmp);
    };
    const setDE = (e: ChangeEvent<HTMLInputElement>) => {
        let tmp = { ...translation };
        tmp.de = e.target.value;
        inputChange(tmp);
    };
    const setRUS = (e: ChangeEvent<HTMLInputElement>) => {
        let tmp = { ...translation };
        tmp.rus = e.target.value;
        inputChange(tmp);
    };


    const inputChange = (newTranslation: { bg: string, en: string, de: string, rus: string }) => {
        setTranslation(newTranslation);
        
    };
    
    useEffect(() => { 
        let width = 720;
        let height = 920;
        let signsInPage = 8;
        let sign = new Label(width / 2 - 10, height / (signsInPage / 2) - 10);
        sign.setContent(currentAllergens, { bg: translation.bg, en: translation.en, de: translation.de, rus: translation.rus });
        let canvas = sign.generate();
        setPreview(<img src={canvas.toDataURL('image/jpeg')}></img>);
    }, [translation, currentAllergens]);

    return (
      
        <div className="labelsContent">
            <div className="preview">{preview && preview || 'no preview loaded'}</div>
            <div className="label">Category: <Category filterCategory={filterCategory} setFilterCategory={setFilterCategory} /> </div>
            <div className="label">Allergens: <Allergens currentAllergens={currentAllergens} setCurrentAllergens={setCurrentAllergens} /></div>
            <p>BG: <input type="text" spellCheck="true" lang="bg" className="bulgarian" value={translation.bg } onChange={(e)=>setBG(e) }/></p>
            <p>EN: <input type="text" spellCheck="true" lang="en" className="english" value={translation.en}  onChange={(e) => setEN(e)} /></p>
            <p>DE: <input type="text" spellCheck="true" lang="de" className="deutsch" value={translation.de}  onChange={(e) => setDE(e)} /></p>
            <p>RUS: <input type="text" spellCheck="true" lang="ru"  className="russian" value={translation.rus}  onChange={(e) => setRUS(e)} /></p>
            
        </div>
            
            
                
        );
}

/*
    <div id="allergensDiv">
      
         * Allergens:
        <select className="allergens-select" placeholder="allergens">
            <option value="1">1 Gluten</option>
            <option value="2">2 Celery</option>
            <option value="3">3 Peanuts</option>
            <option value="4">4 Lupin</option>
            <option value="5">5 Soya</option>
            <option value="6">6 Eggs</option>
            <option value="7">7 Molluscs</option>
            <option value="8">8 Lactose</option>
            <option value="9">9 Nuts</option>
            <option value="10">10 Sulphur dioxide</option>
            <option value="11">11 Sesame</option>
            <option value="12">12 Fish</option>
            <option value="13">13 Crustaceans</option>
            <option value="14">14 Mustard</option>
            <option value="15">15 Mushrooms</option>
        </select>
    </div>
    
    */