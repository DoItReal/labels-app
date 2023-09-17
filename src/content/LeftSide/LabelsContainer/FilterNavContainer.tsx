import React, { useContext, useRef, useState } from "react";
import SyncIcon from '@mui/icons-material/Sync';
import { Category } from '../../UI/CategoryUI';
import { enableStatesContext} from '../../../App'; 
import { labelDataType } from "../../../db";
import { filterCategoryContext } from './index';
import { db } from '../../../App';
import { Container, IconButton } from "@mui/material";
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import DeleteIcon from '@mui/icons-material/Delete';
import NoteAddIcon from '@mui/icons-material/NoteAdd';

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
        <Container disableGutters sx={{ marginTop: '5px', display: 'flex', padding: '0 2px 2px 2px' }}>

            <FetchButton setDbData={setDbData } />
                <Category filterCategory={filterCategory} setFilterCategory={setFilterCategory} />
                <IconButton key="createNewlabel" title="Create New Label" size="medium" aria-label="Create New Label" onClick={handleCreateNewLabel} sx={{ border: '1px solid gray', borderRadius: '4px' }}><NoteAddIcon fontSize="large" /></IconButton>
                <IconButton key="deleteAllLabels" title="Delete All Selected" size="medium" aria-label="Delete All Seelected" onClick={handleDeleteLabels} sx={{border:'1px solid gray', borderRadius:'4px'} }><DeleteIcon fontSize="large" /></IconButton>
                <IconButton key='addSelectedLabels' title="Add Selected Labels" size="medium" aria-label="Add Selected Labels" onClick={generateList} sx={{border:'1px solid gray', borderRadius:'4px'} }><DoubleArrowIcon fontSize="large" /></IconButton>

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
    
        <IconButton color="primary" title="Fetch DB" size="medium" aria-label="Fetch DB" onClick={(e: React.MouseEvent) => fetch(e)} disabled={disabled} sx={{border:'1px solid gray', borderRadius:'4px'} }>
            <SyncIcon fontSize="large" />
            </IconButton>
        
    );
}

