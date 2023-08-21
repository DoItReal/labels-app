import { ReactComponent as FetchButtonSVG } from './fetchButtonSVG.svg';
import { ReactComponent as SearchButtonSVG } from './searchButtonSVG.svg';
import { db } from '../../../App';
import { MouseEvent, useEffect, useRef, useState} from 'react';
import React from 'react';
import './fetchButton.css';
import { labelDataType, labelDataArrType } from '../../../db';
interface Tprops { filterText: string, setFilterText: (arg: string) => void, setDbData: (arg: labelDataArrType) => void, filterCategory: Array<string>, setFilterCategory: (arg: Array<string>)=>void };
export default function SearchContainer({ filterText, setFilterText, setDbData, filterCategory, setFilterCategory  }: Tprops  ) {
    return (
        <form id="searchContainer">
            <FetchButton setDbData = { setDbData } />
            <input id="searchInput" type="text" value={filterText} onChange={(e) => setFilterText && setFilterText(e.target.value)} placeholder="Search..." />
            <SearchButton />
        </form>
    );

}

function FetchButton({setDbData}: { setDbData: (arg: labelDataArrType) => void }) {
    const [disabled, setDisabled] = useState(false);
    const [degrees, setDegrees] = useState(0);  
    const animID = useRef<number|null>(null);

    const  fetch = async (e: MouseEvent) => {
      e.preventDefault();
      try {
          animID.current = requestAnimationFrame(anim);
          await db.fetchSigns(setDbData);
          setDisabled(true);
          stopAnim();
      } catch (err) {
          console.log(err);
          stopAnim();
      }
    }
    const anim = () => {
        setDegrees(current => current + 10);
        if (degrees > 360) setDegrees(0);
        animID.current = requestAnimationFrame(anim);
    };
    const stopAnim = () => {
        if (animID.current !== null) cancelAnimationFrame(animID.current);
        animID.current = null;
    }
   
    const style = {
        transform: 'rotate(' + degrees + 'deg)'
    };

  return (
      <button className="fetchSignsButton" onClick={(e) => fetch(e)} disabled={disabled }>
          <FetchButtonSVG style={style }/>
        </button>
   );
}

function SearchButton() {

    return (
        <button id="searchButton" aria-label="Search" disabled>
            <SearchButtonSVG />
        </button>
    );
}