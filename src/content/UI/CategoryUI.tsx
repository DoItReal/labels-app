import { useRef, useEffect, useState, SetStateAction } from 'react';
import { useOutsideAlerter } from '../../util';
import { ReactComponent as Arrow } from './arrow.svg';
import { Box, Chip, FormControl, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent } from '@mui/material';
//import './categoryUI.css';
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
export function Category({ filterCategory, setFilterCategory }: { filterCategory: string[], setFilterCategory: (arg:string[])=>void}) {
    const [multiSelectExpanded, setMultiSelectExpanded] = useState(false);
    const wrapperRef = useRef(null);
    var allCategories: Array<string> = ["all", "Salads", "Soups", "Breakfast", "Vegan", "Fish", "Pork", "Chicken", "Pasta", "Rice", "Oriental Night", "BG Night"];

    const handleChange = (event: SelectChangeEvent<typeof filterCategory>) => {
        const {
            target: { value },
        } = event;
        setFilterCategory(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    useOutsideAlerter(wrapperRef, () => setMultiSelectExpanded(false));
    return (
        <FormControl size="small" sx={{ m: 1, width: '100%' }}>
            <InputLabel id="demo-multiple-chip-label">Category</InputLabel>
            <Select
                labelId="demo-multiple-chip-label"
                id="demo-multiple-chip"
                multiple
                value={filterCategory}
                onChange={handleChange}
                input={<OutlinedInput id="select-multiple-chip" label="Category" />}
                renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                            <Chip key={value} label={value} />
                        ))}
                    </Box>
                )}
                MenuProps={MenuProps}
            >
                {allCategories.map((category) => (
                    <MenuItem
                        key={category}
                        value={category}
                    >
                        {category}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
        /*
        <div ref={wrapperRef} className="categoryHolder">
            <CategorySpanHolder multiSelectExpanded={multiSelectExpanded} setMultiSelectExpanded={setMultiSelectExpanded} currentCategory={filterCategory} />
            <CategoryUL currentCategory={filterCategory} setCurrentCategory={setFilterCategory} multiSelectExpanded={multiSelectExpanded} />
        </div>
        */
    );
}
function CategoryUL({ currentCategory, setCurrentCategory, multiSelectExpanded }: { currentCategory: Array<string>, setCurrentCategory: (arg:string[])=>void, multiSelectExpanded: boolean }) {

    //---- TO DO ----*** GET DATA FOR CATEGORIES FROM DB AND POSSIBILITY TO UPDATE IT FROM UI ***----- //
    var allCategories: Array<string> = ["all", "Salads", "Soups", "Breakfast", "Vegan", "Fish", "Pork", "Chicken", "Pasta", "Rice", "Oriental Night", "BG Night"];

    const ULref = useRef<any>(null);

    //used to prevent triggering useEffect on first render
    const didMount = useRef(false);

    //return index of category<string> from filterCategory[string]
    const checkCategory = (category: string) => {
        for (let i = 0; i < currentCategory.length; i++) {
            if (currentCategory[i] == category) return i;
        }
        return -1;
    };

    //handles click on category <li> adding or removing from filterCategory[string]
    const itemRowClickHandle = (category: string) => {
        let index = checkCategory(category);
        if (index == -1) {
            setCurrentCategory([...currentCategory.concat([category])]);
        } else {
            let tmp = [...currentCategory];
            tmp.splice(index, 1);
            setCurrentCategory(tmp);
        }
    };

    //return bool if the category is already in filterCategory
    const check = (e: string) => {
        let bool = false;
        currentCategory && currentCategory.map(element => { if (element == e) bool = true; });
        return bool;
    };

    //generates rows
    const itemRows = allCategories.map(e => <li key={e}>

        <label key={e}>
            <input checked={check(e)} type="checkbox" key={e} onChange={() => itemRowClickHandle(e)} /> {e} </label>
    </li>);

    //Show/Hide the option list on change of multiSelectExpanded
    useEffect(() => {
        //does not trigger on first render
        if (didMount.current) {
            if (ULref.current !== null) {
                if (!multiSelectExpanded) {
                    setTimeout(() => {if(ULref.current) ULref.current.style.display = "none" }, 500);
                    ULref.current.style.height = "0";

                } else {
                    ULref.current.style.display = "block";
                    setTimeout(() => ULref.current.style.height = '200px', 1);

                }
            }
        } else {
            didMount.current = true;
        }
    }, [multiSelectExpanded]);

    return (
        <ul ref={ULref} key="1" className="categoryUL">
            {itemRows}
        </ ul>
    );
}
function CategorySpanHolder({ multiSelectExpanded, setMultiSelectExpanded, currentCategory }: { multiSelectExpanded: boolean, setMultiSelectExpanded: (arg: boolean) => void, currentCategory: Array<string> }) {

    return (
        <>
            <span key="spanHolderKey" className="placeHolder"
                onClick={() => setMultiSelectExpanded(!multiSelectExpanded)}>{currentCategory.length < 1 ? <span className="placeholderSpan">Select category</span> : currentCategory.map(e => <span key={e} className="categoriesSpan">{e} </span>)}
            </span>
            <Arrow className="placeHolder"
                onClick={() => setMultiSelectExpanded(!multiSelectExpanded)}
                style={{ transform: 'rotateX(' + (multiSelectExpanded ? 180 + "deg" : 0 + "deg") + ')' }}
            />
        </>
    );
}

