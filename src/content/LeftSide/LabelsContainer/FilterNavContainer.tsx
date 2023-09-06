import React, { SetStateAction } from "react";
import './filterNavContainer.css';
import { Category } from '../../UI/CategoryUI';
import { IenableStates } from '../../../App'; 

interface IfilterNavContainer extends IenableStates {
    filterCategory: Array<string>,
    setFilterCategory: React.Dispatch<SetStateAction<string[]>>,
    generateList: () => void
}

export default function FilterNavContainer({ filterCategory, setFilterCategory, generateList, enableStates, updateStates }: IfilterNavContainer) {
    const handleCreateNewLabel = (event: React.MouseEvent) => {
        event.stopPropagation();
        updateStates("createLabel", true);
    }
    return (
        <div id="filterContainer">
            <button id="addSelectedLabels" onClick={generateList }>&#62;&#62;</button>
            <Category filterCategory={filterCategory} setFilterCategory={setFilterCategory} />
            <button id="createNewLabel" onClick={handleCreateNewLabel }>New Label</button>
            <button id="btnDeleteLabels">Delete</button>
        </div>
    );
}



