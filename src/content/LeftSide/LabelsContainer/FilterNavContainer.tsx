import React, { SetStateAction, useContext, useRef, useState } from "react";
import './filterNavContainer.css';
import './fetchButton.css';
import { Category } from '../../UI/CategoryUI';
import { enableStatesContext} from '../../../App'; 
import { labelDataType } from "../../../db";
import { filterCategoryContext } from './index';
import { ReactComponent as FetchButtonSVG } from './fetchButtonSVG.svg';
import { db } from '../../../App';
import { Box, Container } from "@mui/material";
interface IfilterNavContainer {
    setDbData:(arg:labelDataType[])=>void,
    generateList: () => void,
    selectedLabels: labelDataType[],
    setSelectedLabels: (arg: labelDataType[]) => void,
    deleteLabels:(arg:labelDataType[])=>void
}

export default function FilterNavContainer({  setDbData, generateList, selectedLabels, setSelectedLabels, deleteLabels }: IfilterNavContainer) {
    const [enableStates, updateStates] = useContext(enableStatesContext);
    const [filterCategory, setFilterCategory] = useContext(filterCategoryContext);
    const handleCreateNewLabel = (event: React.MouseEvent) => {
        event.stopPropagation();
        updateStates("labelForm", true);
    }
    const handleDeleteLabels = () => {
        deleteLabels(selectedLabels);
        setSelectedLabels([]);
    }
    return (
        <Container disableGutters>
        <div id="filterContainer">
            <FetchButton setDbData={setDbData } />
            <button id="addSelectedLabels" onClick={generateList }>&#62;&#62;</button>
            <Category filterCategory={filterCategory} setFilterCategory={setFilterCategory} />
            <button id="createNewLabel" onClick={handleCreateNewLabel }>New Label</button>
            <button id="btnDeleteLabels" onClick={handleDeleteLabels }>Delete</button>
            </div>
        </Container>
    );
}

function FetchButton({ setDbData }: { setDbData: (arg: labelDataType[]) => void }) {
    const [disabled, setDisabled] = useState(false);
    const [degrees, setDegrees] = useState(0);
    const animID = useRef<number | null>(null);

    const fetch = async (e: React.MouseEvent) => {
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
        <button className="fetchSignsButton" onClick={(e:React.MouseEvent) => fetch(e)} disabled={disabled}>
            <FetchButtonSVG style={style} />
        </button>
    );
}

