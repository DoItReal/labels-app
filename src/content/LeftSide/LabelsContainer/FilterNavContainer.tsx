import React, { SetStateAction, useContext } from "react";
import './filterNavContainer.css';
import { Category } from '../../UI/CategoryUI';
import { enableStatesContext} from '../../../App'; 
import { labelDataType } from "../../../db";

interface IfilterNavContainer {
    filterCategory: Array<string>,
    setFilterCategory: React.Dispatch<SetStateAction<string[]>>,
    generateList: () => void,
    selectedLabels: labelDataType[],
    setSelectedLabels: (arg: labelDataType[]) => void,
    deleteLabels:(arg:labelDataType[])=>void
}

export default function FilterNavContainer({ filterCategory, setFilterCategory, generateList, selectedLabels, setSelectedLabels, deleteLabels }: IfilterNavContainer) {
    const [enableStates, updateStates] = useContext(enableStatesContext);
    const handleCreateNewLabel = (event: React.MouseEvent) => {
        event.stopPropagation();
        updateStates("createLabel", true);
    }
    const handleDeleteLabels = () => {
        deleteLabels(selectedLabels);
        setSelectedLabels([]);
    }
    return (
        <div id="filterContainer">
            <button id="addSelectedLabels" onClick={generateList }>&#62;&#62;</button>
            <Category filterCategory={filterCategory} setFilterCategory={setFilterCategory} />
            <button id="createNewLabel" onClick={handleCreateNewLabel }>New Label</button>
            <button id="btnDeleteLabels" onClick={handleDeleteLabels }>Delete</button>
        </div>
    );
}



