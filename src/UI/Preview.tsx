import React from "react";
import { labelDataType } from "../DB/Interfaces/Labels";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import { Popover } from "@mui/material";
import { Label } from "../labels";
import { Theme } from '@emotion/react';
import { makeStyles } from '@mui/styles';
import LabelCanvas from '../DesignEditor/LabelCanvas';
import { getLocalDesigns } from "../DesignEditor/DesignDB";
export default function Preview({ label, open, handleClose }:
    { label: labelDataType | undefined, open: boolean, handleClose: () => void }) {
        
    const id = open ? 'labelPreview-popover' : undefined;
    const localDesigns = getLocalDesigns();
    //TO DO Get the selected design from the store
    const selectedDesign = localDesigns ? localDesigns[0] : null;
    const classes = useStyles();

    if (!label || !selectedDesign) return null;
    const eventHandler = (e: DraggableEvent, data: DraggableData) => { }
    return (
        <Draggable handle=".handle" onDrag={(e, data) => eventHandler(e, data)}>
            <Popover
                id={id}
                open={open}
                onClose={handleClose}
                anchorReference={"none"}
                classes={{
                    root: classes.popoverRoot,
                }}
                anchorOrigin={{
                    vertical: 'center',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'center',
                    horizontal: 'center',
            }}>

                <div className="handle" style={{ zIndex: 1 }} onDragStart={(e: React.DragEvent<HTMLImageElement>) => e.preventDefault()}>
                    {label && localDesigns &&
                        <LabelCanvas design={selectedDesign} blocks={selectedDesign.blocks} label={label} />
                    }
                   
                </div>
            </Popover>
        </Draggable>

    );
}
const useStyles = makeStyles((theme: Theme) => ({
    popoverRoot: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: 100,
        scale: 0.8
    },
}));