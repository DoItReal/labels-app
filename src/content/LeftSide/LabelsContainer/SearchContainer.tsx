import { ReactComponent as FetchButtonSVG } from './fetchButtonSVG.svg';
import { ReactComponent as SearchButtonSVG } from './searchButtonSVG.svg';
import { db } from '../../../App';
import { MouseEvent} from 'react';
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
  
  const  fetch=  (e: MouseEvent) => {
      e.preventDefault();
      
      db.fetchSigns( setDbData  );
        document.querySelector("#fetchSignsButton")?.setAttribute('disabled', 'true');         
    }

  return (
        <button id="fetchSignsButton" onClick={(e) => fetch(e)}>
            <FetchButtonSVG />
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