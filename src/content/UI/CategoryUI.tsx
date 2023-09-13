import { useRef, useEffect, useState, SetStateAction } from 'react';
import { useOutsideAlerter } from '../../util';
import { ReactComponent as Arrow } from './arrow.svg';
import './categoryUI.css';

export function Category({ filterCategory, setFilterCategory }: { filterCategory: string[], setFilterCategory: (arg:string[])=>void}) {
    const [multiSelectExpanded, setMultiSelectExpanded] = useState(false);
    const wrapperRef = useRef(null);



    useOutsideAlerter(wrapperRef, () => setMultiSelectExpanded(false));
    return (
        <div ref={wrapperRef} className="categoryHolder">
            <CategorySpanHolder multiSelectExpanded={multiSelectExpanded} setMultiSelectExpanded={setMultiSelectExpanded} currentCategory={filterCategory} />
            <CategoryUL currentCategory={filterCategory} setCurrentCategory={setFilterCategory} multiSelectExpanded={multiSelectExpanded} />
        </div>
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

