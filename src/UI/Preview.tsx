import React from "react";
import { labelDataType } from "../db";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import { Popover } from "@mui/material";
import { Label } from "../labels";
import { Theme } from '@emotion/react';
import { makeStyles } from '@mui/styles';
export default function Preview({ label, open, handleClose }:
    { label: labelDataType | undefined, open: boolean, handleClose: () => void }) {
    const previewURL = React.useRef<string>('');

    const id = open ? 'simple-popover' : undefined;

    if (label !== undefined) {
        //to do Get width and height of A4 page, signsInPage from PDF class
        let width = 720;
        let height = 920;
        let signsInPage = 8;
        var sign = new Label(width / 2 - 10, height / (signsInPage / 2) - 10);
        sign.setContent(label.allergens, { bg: decodeURI(label.bg), en: label.en, de: label.de, rus: label.rus });
        sign.setId(label._id);
        previewURL.current = sign.generate().toDataURL('image/jpeg');
    }
    const classes = useStyles();
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

                <div className="handle" style={{ zIndex: 1 }}>
                    <img src={previewURL.current} width='100%' height='100%' alt="Label Preview"
                        onDragStart={(e: React.DragEvent<HTMLImageElement>) => e.preventDefault()}>
                    </img>
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