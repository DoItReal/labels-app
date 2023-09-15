import { useRef, useEffect, useState, SetStateAction } from 'react';
import { useOutsideAlerter } from '../../util';
import { ReactComponent as Arrow } from './arrow.svg';
import './allergensUI.css';
import { png } from '../../labels';
import { Box, Chip, FormControl, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent } from '@mui/material';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};
export function Allergens({ currentAllergens, setCurrentAllergens }: { currentAllergens: number[], setCurrentAllergens: React.Dispatch<SetStateAction<number[]>> }) {
    const [multiSelectExpanded, setMultiSelectExpanded] = useState(false);
    const wrapperRef = useRef(null);
    var allAllergensNames: Array<string> = ["Gluten", "Celery", "Peanuts", "Lupin", "Soya", "Eggs", "Molluscs", "Lactose", "Nuts", "Sulphur Dioxide", "Sesame", "Fish", "Crustaceans", "Mustard", "Mushrooms"];

    const handleChange = (event: SelectChangeEvent<typeof allAllergensNames>) => {
        const {
            target: { value },
        } = event;
        setCurrentAllergens(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    useOutsideAlerter(wrapperRef, () => setMultiSelectExpanded(false));
    return (
        <FormControl size="small" sx={{ m: 1, width: '100%' }}>
            <InputLabel id="demo-multiple-chip-label">Allergens</InputLabel>
            <Select
                labelId="demo-multiple-chip-label"
                id="demo-multiple-chip"
                multiple
                value={currentAllergens}
                onChange={handleChange}
                input={<OutlinedInput id="select-multiple-chip" label="Allergens" />}
                renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                            <Chip key={value} label={value} />
                        ))}
                    </Box>
                )}
                MenuProps={MenuProps}
            >
                {allAllergensNames.map((allergens) => (
                    <MenuItem
                        key={allergens}
                        value={allergens}
                    >
                        {allergens}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
        /*
        <div ref={wrapperRef} className="allergensHolder">
            <AllergensSpanHolder multiSelectExpanded={multiSelectExpanded} setMultiSelectExpanded={setMultiSelectExpanded} currentAllergens={currentAllergens} />
            <AllergensUL currentAllergens={currentAllergens} setCurrentAllergens={setCurrentAllergens} multiSelectExpanded={multiSelectExpanded} />
        </div>
        */
    );
}
function AllergensUL({ currentAllergens, setCurrentAllergens, multiSelectExpanded }: { currentAllergens: Array<number>, setCurrentAllergens: React.Dispatch<SetStateAction<number[]>>, multiSelectExpanded: boolean }) {

    //---- TO DO ----*** GET DATA FOR ALLERGENS FROM DB AND POSSIBILITY TO UPDATE IT FROM UI ***----- //
    var allAllergens: Array<number> = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
    var allAllergensNames: Array<string> = ["Gluten", "Celery", "Peanuts", "Lupin", "Soya", "Eggs", "Molluscs", "Lactose", "Nuts", "Sulphur Dioxide", "Sesame", "Fish", "Crustaceans", "Mustard", "Mushrooms"];
    const ULref = useRef<any>(null);
    const AllergensMap = new Map();
    for (let i = 0; i < allAllergens.length; i++) {
        AllergensMap.set(allAllergens[i], allAllergensNames[i]);
    }
    //used to prevent triggering useEffect on first render
    const didMount = useRef(false);

    //return index of allergen<number> from filterAllergens[number]
    const getAllergenInd = (allergen: number) => {
        for (let i = 0; i < currentAllergens.length; i++) {
            if (currentAllergens[i] == allergen) return i;
        }
        return -1;
    };

    //handles click on allergen <li> adding or removing from currentAllergens[number]
    const itemRowClickHandle = (allergen: number) => {
        let index = getAllergenInd(allergen);
        let tmp = [...currentAllergens];
        if (index == -1) {           
            tmp = tmp.concat([allergen]);
        } else {
            tmp.splice(index, 1);
        }
        tmp.sort();
        setCurrentAllergens(tmp);
    };

    //return bool if the category is already in filterCategory
    const check = (e: number) => {
        let bool = false;
        currentAllergens && currentAllergens.map(element => { if (element == e) bool = true; });
        return bool;
    };

    //generates rows
    const itemRows = allAllergens.map(e => <li key={e}>

        <label key={AllergensMap.get(e)}>
            <input checked={check(e)} type="checkbox" key={e} onChange={() => itemRowClickHandle(e)} /> {AllergensMap.get(e)} </label>
    </li>);

    //Show/Hide the option list on change of multiSelectExpanded
    useEffect(() => {
        //does not trigger on first render
        if (didMount.current) {
            if (ULref.current !== null) {
                if (!multiSelectExpanded) {
                    setTimeout(() => { if (ULref.current) ULref.current.style.display = "none" }, 500 );
                    ULref.current.style.height = "0";

                } else {
                    ULref.current.style.display = "flex";
                    setTimeout(() => ULref.current.style.height = '200px', 1);

                }
            }
        } else {
            didMount.current = true;
        }
    }, [multiSelectExpanded]);

    return (
        <ul ref={ULref} key="1" className="allergensUL">
            {itemRows}
        </ ul>
    );
}
function AllergensSpanHolder({ multiSelectExpanded, setMultiSelectExpanded, currentAllergens }: { multiSelectExpanded: boolean, setMultiSelectExpanded: (arg: boolean) => void, currentAllergens: Array<number> }) {
    const getPNG = (index: number) => {
        return (
            <img src={png.URLs[index]} width='10rem' />
            );
    };
    return (
        <>
            <span key="spanHolderKey" className="placeHolder"
                onClick={() => setMultiSelectExpanded(!multiSelectExpanded)}>{currentAllergens.length < 1 || currentAllergens[0]=== 0? <span className="placeholderSpan">Select allergens</span> : currentAllergens.map(e => <span key={e} className="allergensSpan"> {getPNG(e-1)} </span>)}
            </span>
            <Arrow className="placeHolder"
                onClick={() => setMultiSelectExpanded(!multiSelectExpanded)}
                style={{ transform: 'rotateX(' + (multiSelectExpanded ? 180 + "deg" : 0 + "deg") + ')' }}
            />
        </>
    );
}

