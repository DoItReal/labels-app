import React, { SetStateAction } from "react";
import './filterNavContainer.css';
import { Category } from '../../UI/CategoryUI';

export default function FilterNavContainer({ filterCategory, setFilterCategory, setAddedLabels }: { filterCategory: Array<string>, setFilterCategory: React.Dispatch<SetStateAction<string[]>>,setAddedLabels:()=>void }) {
    return (
        <div id="filterContainer">
            <button id="addSelectedLabels" onClick={setAddedLabels }>&#62;&#62;</button>
            <Category filterCategory={filterCategory} setFilterCategory={setFilterCategory} />
            <button id="btnDeleteLabels">Delete</button>
        </div>
    );
}



