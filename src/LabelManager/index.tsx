import React, { useState } from "react";
import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
} from "@mui/material";

import SaveIcon from "@mui/icons-material/Save";
import { isLabelDataType, isLabelDataTypeArray, labelDataType } from '../DB/Interfaces/Labels';
import { createNewLabelDB } from '../DB/Remote/Labels';
import TopNavBar from "./Components/TopNavBar";
import DataTable from "./Components/DataTable";
import { translate } from "../tools/translate";
import GTranslateIcon from '@mui/icons-material/GTranslate';
import { editLabelDB } from '../DB/Remote/Labels';
import { editLabel } from '../DB/LocalStorage/Labels';


//edit label remote on DB and update it locally asynchronicaly
const updateLabel = async (label: labelDataType) => {
    try {
        const updatedLabel = await editLabelDB(label);
        if (isLabelDataType(updatedLabel)) {
            editLabel(updatedLabel);
        //    console.log("Label updated!", updatedLabel);
        } else {
            console.error("Error in updating label! Label is not LabelDataType");
        }
    } catch (error) {
        console.error("Error in updating label!", error);
    }
}
const updateLabels = async (labels: labelDataType[]) => {
    for (const label of labels) {
        await updateLabel(label);
    }
    console.log("Labels updated!");
    return;
}

const LabelTable = () => {
    const [labels, setLabels] = useState<labelDataType[]>([]);
    const [editLabels, setEditLabels] = useState<labelDataType[]>([]);
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([
        "bg",
        "en",
        "de",
        "ru",
    ]);
    const [edit, setEdit] = useState(false);

    //TODO - Fetch languages from API or localDB
    const languages = ["bg", "en", "de", "ru"]; // Available languages

    const toogleEdit = () => {
        setEdit(!edit);
    } 

    const removeLabel = (labelId: string) => {
        if (edit) {
            setEditLabels((prev) => prev.filter((label) => label._id !== labelId));
        } else {
            setLabels((prev) => prev.filter((label) => label._id !== labelId));
        }
    }
    // Add new label/s with default structure

    const addNewLabels = (amount: number = 1) => {
        const newLabels: labelDataType[] = [];
        for (let i = 0; i < amount; i++) {
            newLabels.push({
                _id: Date.now().toString() + Math.random().toString(),  // Unique ID
                allergens: [],
                category: [],
                translations: selectedLanguages.map((lang) => ({
                    lang,
                    name: "",
                    description: "",
                })),
                owner: "",
            });
        }

        // Add the new labels in smaller batches
        const batchAdd = (labelsToAdd: labelDataType[]) => {
            setLabels((prevLabels) => [...prevLabels, ...labelsToAdd]);
        };

        const chunkSize = 5;  // Adjust the chunk size as needed
        let currentIndex = 0;

        // Break the newLabels array into chunks and add them incrementally
        const addInChunks = () => {
            if (currentIndex < newLabels.length) {
                const chunk = newLabels.slice(currentIndex, currentIndex + chunkSize);
                batchAdd(chunk);
                currentIndex += chunkSize;
                requestIdleCallback(addInChunks);  // Schedule the next batch on idle time
            }
        };
       
        requestIdleCallback(addInChunks);  // Call directly without checking
    }


    // Handle field change in translations (language-specific)
    const handleTranslationChange = (
        labelId: string,
        lang: string,
        field: "name" | "description",
        value: string
    ) => {
                
        if (edit)
        setEditLabels((prev) =>
            prev.map((label) =>
                label._id === labelId
                    ? {
                        ...label,
                        translations: label.translations.map((translation) =>
                            translation.lang === lang
                                ? { ...translation, [field]: value }
                                : translation
                        ),
                    }
                    : label
            )
        );
        else
        setLabels((prev) =>
            prev.map((label) =>
                label._id === labelId
                    ? {
                        ...label,
                        translations: label.translations.map((translation) =>
                            translation.lang === lang
                                ? { ...translation, [field]: value }
                                : translation
                        ),
                    }
                    : label
            )
        );
    };

    // Handle changes in allergens (array of numbers)
    const handleAllergensChange = (labelId: string, allergens: number[]) => {
        if (edit)
        setEditLabels((prev) =>
            prev.map((label) =>
                label._id === labelId ? { ...label, allergens } : label
            )
            );
        else
        setLabels((prev) =>
            prev.map((label) =>
                label._id === labelId ? { ...label, allergens } : label
            )
        );
    };

    // Handle changes in categories (array of strings)
    const handleCategoryChange = (labelId: string, category: string[]) => {
        if (edit)
            setEditLabels((prev) =>
                prev.map((label) =>
                    label._id === labelId ? { ...label, category } : label
                )
            );
        else
        setLabels((prev) =>
            prev.map((label) =>
                label._id === labelId ? { ...label, category } : label
            )
        );
    };

    // Save all modified labels
    const saveAll = async () => {
        // TODO - save in edit mode
        if (edit && editLabels.length) {
            await updateLabels(editLabels);
            return;
        }
        if (!labels.length) {
            console.log("No labels to save!");
            return
        }
       
        // Filter out labels with no translations and remove _id and clear owner fields   
        const modifiedLabels = labels.filter(
            (label) => label.translations.some((translation) => translation.name || translation.description)
        );
     
       // console.log("Saving labels:", modifiedLabels);
        if (!modifiedLabels.length) {
            console.log("No modified labels to save!");
            return;
        }
        if (isLabelDataTypeArray(modifiedLabels)) {
            const preparedLabels = modifiedLabels.map((label) => ({
                allergens: label.allergens,
                category: label.category,
                translations: label.translations.map(({ lang, name, description }) => ({
                    lang,
                    name: name.trim(),
                    description: description.trim(),
                })),
                owner: "",
            }));
            var i = 0;
            for (const label of preparedLabels) {
                console.log(`Saving labels: ${i}/${preparedLabels.length}`);
                try {
                    await createNewLabelDB(label);
                } catch (error) {
                    console.error("Error in saving label!", error);
                    console.error("Label:", label);
                    continue;
                }
                i +=1;
            }
            console.log("All labels saved!");
        } else {
            console.log("Error in saving labels! Label/s not LabelDataType");
            return;
        }
    };
    // TODO -  Handle edit mode
    const translateAll = async (sourceLang: string,attr:string, forced: boolean = false) => {
        const translatedLabels: labelDataType[] = structuredClone(edit ? editLabels : labels);
        for (let currLang of languages) {
            // Skip the source language
            if (currLang === sourceLang) continue;
            // Translate all labels in the current language
            for (let label of translatedLabels) {
                // Translate each translation in the label
                for (let translation of label.translations) {
                    // Translate the name if not already translated/available or overwrite if forced
                    switch (attr) {
                        case "name":
                            if (!translation.name || forced) {
                                if (attr !== "name" || !label.translations.find((t) => t.lang === sourceLang)?.name) continue;
                                const translatedName = await translate(label.translations.find((t) => t.lang === sourceLang)?.name || "", currLang);
                                translation.name = translatedName;
                            }
                            break;
                        // Translate the description if not already translated/available or overwrite if forced
                        case "description":
                            if (!translation.description || forced) {
                                if (attr !== "description" || !label.translations.find((t) => t.lang === sourceLang)?.description) continue;
                                const translatedDesc = await translate(label.translations.find((t) => t.lang === sourceLang)?.description || "", currLang);
                                translation.description = translatedDesc;
                            }
                            break;
                        default:
                            break;
                    }
                }
            }

        }
        return translatedLabels;
    };

    // Handle language selection
    const handleLanguageSelection = (lang: string) => {
        setSelectedLanguages((prev) =>
            prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
        );
    };

    return (
        <div>
            <TopNavBar languages={languages} selectedLanguages={selectedLanguages} handleLanguageSelection={handleLanguageSelection} addNewLabels={addNewLabels} edit={edit} setEdit={toogleEdit} editLabels={editLabels} setEditLabels={setEditLabels} />

            {/* Table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>   
                        <TableRow>
                            <TableCell>Select</TableCell>
                            <TableCell>Allergens</TableCell>
                            <TableCell>Categories</TableCell>
                            {selectedLanguages.map((lang, index) => (
                                <React.Fragment key={lang}>
                                    <TableCell key={`${lang}-name`}>{`Name (${lang.toUpperCase()})`}
                                        <IconButton 
                                            onClick={() => translateAll(lang.toLowerCase(), "name").then((translLabels) => edit ? setEditLabels(translLabels) : setLabels(translLabels) )}
                                            color="primary"
                                            title="Translate Name"
                                        >
                                        <GTranslateIcon fontSize="small"/>
                                    </IconButton>
                                    </TableCell>
                                    <TableCell key={`${lang}-desc`}>{`Description (${lang.toUpperCase()})`}
                                        <IconButton
                                            onClick={() => { translateAll(lang.toLowerCase(), "description").then(translLabels => edit ? setEditLabels(translLabels) : setLabels(translLabels)) }}
                                            color="primary"
                                            title="Translate Description"
                                        >
                                            <GTranslateIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </React.Fragment>
                            ))}
                            <TableCell>Preview</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody >
                        {edit ? <DataTable labels={editLabels} removeLabel={removeLabel} selectedLanguages={selectedLanguages} handleTranslationChange={handleTranslationChange} handleAllergensChange={handleAllergensChange} handleCategoryChange={handleCategoryChange} /> :
                            <DataTable labels={labels} removeLabel={removeLabel} selectedLanguages={selectedLanguages} handleTranslationChange={handleTranslationChange} handleAllergensChange={handleAllergensChange} handleCategoryChange={handleCategoryChange} />
                        }
                    </TableBody >
                </Table>
            </TableContainer>

            {/* Save Button */}
            <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={saveAll}
                disabled={!edit && labels.every(
                    (label) =>
                        label.translations.every(
                            (translation) => !translation.name && !translation.description
                        )
                )}
            >
                Save All
            </Button>
        </div>
    );
};


export default LabelTable;