import { TableRow, TableCell, Checkbox, IconButton, TextField } from "@mui/material";
import { labelDataType, MealTranslation } from "../../../DB/Interfaces/Labels";
import React from "react";
import PreviewIcon from "@mui/icons-material/Visibility";
import { Category } from "./CategoryUI";
import { Allergens } from "./AllergensUI";
import DeleteIcon from '@mui/icons-material/Delete';

const LabelRow = React.memo(({ label, selectedLanguages, handleTranslationChange, handleAllergensChange, handleCategoryChange, rowIndex, rowRefs, removeLabel }: {
    label: labelDataType,
    selectedLanguages: string[],
    handleTranslationChange: (labelId: string, lang: string, field: "name" | "description", value: string) => void,
    handleAllergensChange: (labelId: string, allergens: number[]) => void,
    handleCategoryChange: (labelId: string, categories: string[]) => void,
    rowIndex: number,
    rowRefs: React.MutableRefObject<{ [rowIndex: number]: { [colIndex: number]: HTMLInputElement | null } }>,
    removeLabel: (labelId: string) => void
}) => {

    if (!rowRefs.current[rowIndex]) {
        rowRefs.current[rowIndex] = []; // Initialize as an array
    } 
 
    const handleKeyDown = (event: React.KeyboardEvent, rowIndex: number, colIndex: number) => {
        const moveFocus = (nextRow: number, nextCol: number) => {
            if (rowRefs.current[nextRow] && rowRefs.current[nextRow][nextCol]) {
                rowRefs.current[nextRow][nextCol]?.focus();
            }
        };

        switch (event.key) {
            case "Enter":
            case "ArrowDown":
                moveFocus(rowIndex + 1, colIndex);
                break;
            case "ArrowUp":
                moveFocus(rowIndex - 1, colIndex);
                break;
            case "Tab":
                if (event.shiftKey) {
                    // Shift + Tab (move left)
                    moveFocus(rowIndex, colIndex);
                } else {
                    // Tab (move right)
                    moveFocus(rowIndex, colIndex);
                }
                break;
            case "ArrowRight":
                moveFocus(rowIndex, colIndex + 1);
                break;
            case "ArrowLeft":
                moveFocus(rowIndex, colIndex - 1);
                break;
            default:
                break;
        }
    };

    return (
        <TableRow key={`${label._id}-row`} >
            <TableCell align='left'>
                <Checkbox
                    checked={false} // Add selection logic if needed
                    onChange={() => { }}
                />
            </TableCell>
            <AllergensCell
                labelId={label._id}
                allergens={label.allergens}
                handleAllergensChange={handleAllergensChange}
                inputRef={(ref) => rowRefs.current[rowIndex][0] = ref} // Assign ref
                onKeyDown={(e) => handleKeyDown(e, rowIndex, 0)} // Handle navigation
            />
            <CategoryCell
                labelId={label._id}
                category={label.category}
                handleCategoryChange={handleCategoryChange}
                inputRef={(ref) => rowRefs.current[rowIndex][1] = ref} // Assign ref
                onKeyDown={(e) => handleKeyDown(e, rowIndex, 1)} // Handle navigation
            />

            {selectedLanguages.map((lang, colIndex) => {
                const translation = label.translations.find(
                    (t) => t.lang === lang
                );
                return (
                    <React.Fragment key={lang}>
                        <LabelNameCell
                            labelId={label._id}
                            lang={lang}
                            translation={translation}
                            handleTranslationChange={handleTranslationChange}
                            inputRef={(ref) => rowRefs.current[rowIndex][colIndex * 2] = ref} // Ensure correct indexing
                            onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex * 2)}
                        />
                        <LabelDescriptionCell
                            labelId={label._id}
                            lang={lang}
                            translation={translation}
                            handleTranslationChange={handleTranslationChange}
                            onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex * 2 + 1)} // Shift index correctly
                            inputRef={(ref) => rowRefs.current[rowIndex][colIndex * 2 + 1] = ref} // Store description input properly
                        />

                    </React.Fragment>
                );
            })}
            
            <TableCell align='right'>
                <IconButton>
                    <PreviewIcon />
                </IconButton>
            </TableCell>
            <TableCell align='right'>
                <IconButton onClick={()=>removeLabel(label._id) }>
                    <DeleteIcon />
                </IconButton>
            </TableCell>
        </TableRow>
    );
});

const ControlledCell = <T,>({
    value,
    onChange,
    renderComponent
}: {
    value: T;
    onChange: (newValue: T) => void;
    renderComponent: (value: T, onChange: (newValue: T) => void) => React.ReactNode;
    onKeyDown?: (e: React.KeyboardEvent) => void;
    inputRef?: React.RefCallback<HTMLInputElement>;
}) => {
    return (
        <TableCell align="left">
            {renderComponent(value, onChange)}
        </TableCell>
    );
};

const AllergensCell = ({ labelId, allergens, handleAllergensChange,onKeyDown, inputRef }: {
    labelId: string, allergens: number[], handleAllergensChange: (labelId: string, allergens: number[]) => void, onKeyDown: (e: React.KeyboardEvent) => void, inputRef: React.RefCallback<HTMLInputElement>
    }) => {
    const handleChange = (newAllergens: number[]) => {
        newAllergens.sort((a, b) => a - b);
        handleAllergensChange(labelId, newAllergens);
    };

    return (
                <ControlledCell
            value={allergens}
            onChange={handleChange}
            onKeyDown={onKeyDown}
            inputRef={inputRef}
            renderComponent={(value, onChange) => (
                <Allergens currentAllergens={value.length ? value : []} setCurrentAllergens={onChange} />
            )}
        />
    );
}
const CategoryCell = ({ labelId, category, handleCategoryChange, onKeyDown, inputRef }: { labelId: string, category: string[], handleCategoryChange: Function, onKeyDown: (e: React.KeyboardEvent) => void, inputRef: React.RefCallback<HTMLInputElement> }) => {

    return (
        <ControlledCell
            value={category}
            onChange={(newCategory) => handleCategoryChange(labelId, newCategory)}
            onKeyDown={onKeyDown}
            inputRef={inputRef}
            renderComponent={(value, onChange) => (
                <Category filterCategory={value} setFilterCategory={onChange} />
            )}
        />
    );
}

const EditableCell = ({
    value,
    onChange,
    onKeyDown,
    inputRef
}: {
    value: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void,
    inputRef?: (ref: HTMLInputElement | null) => void
    }) => {
    const [focused, setFocused] = React.useState(false);
    return (
        <TableCell align='left' sx={{ verticalAlign: "top" }}>
            <TextField
                value={value}
                onChange={onChange}
                variant="outlined"
                size="small"
                onKeyDown={onKeyDown}
                inputRef={inputRef}
                multiline
                minRows={focused ? 2 : 1}
                maxRows={8}
                fullWidth
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                sx={{
                    // When not focused, apply truncation styles
                    "& .MuiInputBase-input": {
                        whiteSpace: focused ? "normal" : "nowrap",
                        overflow: focused ? "visible" : "hidden",
                        textOverflow: focused ? "unset" : "ellipsis",
                    },
                    "& .MuiInputBase-root": {
                        transition: "all 0.2s",
                        fontSize: "0.875rem",
                        padding: "4px",
                    },
                }}
            />
        </TableCell>
    );
};
const LabelNameCell = ({ labelId, lang, translation, handleTranslationChange, onKeyDown, inputRef }:
    { labelId: string, lang: string, translation: MealTranslation | undefined, handleTranslationChange: Function, onKeyDown: (e: React.KeyboardEvent) => void, inputRef: React.RefCallback<HTMLInputElement> }) => {
    return (
        <EditableCell
            value={translation?.name || ""}
            onChange={(e) => handleTranslationChange(labelId, lang, "name", e.target.value)}
            onKeyDown={onKeyDown}
            inputRef={inputRef}
        />
    );
}

const LabelDescriptionCell = ({ labelId, lang, translation, handleTranslationChange, onKeyDown, inputRef }: {
    labelId: string, lang: string, translation: MealTranslation | undefined, handleTranslationChange: Function, onKeyDown?: (e: React.KeyboardEvent) => void, inputRef?: (ref: HTMLInputElement | null) => void
}) => {
    return (
        <>
            <EditableCell
                value={translation?.description || ""}
                onChange={(e) => handleTranslationChange(labelId, lang, "description", e.target.value)}
                onKeyDown={onKeyDown}
                inputRef={inputRef}
            />
        </>
    );
}


export default LabelRow;