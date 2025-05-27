import React, { useState } from "react";
import {
    Button,
    Table,
    TableBody,
    TableContainer,
    Paper,
} from "@mui/material";

import SaveIcon from "@mui/icons-material/Save";
import { isLabelDataType, isLabelDataTypeArray, labelDataType } from '../DB/Interfaces/Labels';
import TopNavBar from "./Components/TopNavBar";
import DataTable from "./Components/DataTable";
import TableHead from "./Components/TableHead";
import { useLabelTable } from "./hooks/useLabelTable";

/*//edit label remote on DB and update it locally asynchronicaly
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
*/
const LabelTable = () => {
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([
        "bg",
        "en",
        "de",
        "ru",
    ]);
    const {
        labels,
        editLabels,
        setLabels,
        setEditLabels,
        editMode,
        toggleEdit,
        activeLabels,
        setActiveLabels,
        saveAll
    } = useLabelTable();

    //TODO - Fetch languages from API or localDB
    const languages = ["bg", "en", "de", "ru"]; // Available languages

    const removeLabel = (labelId: string) => {
            setActiveLabels((prev) => prev.filter((label) => label._id !== labelId));  
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
        setActiveLabels((prev) =>
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
        setActiveLabels((prev) =>
            prev.map((label) =>
                label._id === labelId ? { ...label, allergens } : label
            )
            );
    };
    // Handle changes in categories (array of strings)
    const handleCategoryChange = (labelId: string, category: string[]) => {

            setActiveLabels((prev) =>
                prev.map((label) =>
                    label._id === labelId ? { ...label, category } : label
                )
            );
    };
    // Handle language selection
    const handleLanguageSelection = (lang: string) => {
        setSelectedLanguages((prev) =>
            prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
        );
    };
    return (
        <div>
            <TopNavBar languages={languages}
                selectedLanguages={selectedLanguages}
                handleLanguageSelection={handleLanguageSelection}
                addNewLabels={addNewLabels}
                edit={editMode}
                setEdit={toggleEdit}
                editLabels={editLabels}
                setEditLabels={setEditLabels}
            />

            {/* Table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead labels={activeLabels}
                        selectedLanguages={selectedLanguages}
                        setLabels={setActiveLabels}
                    />
                    <TableBody>
                        <DataTable
                            labels={activeLabels}
                            removeLabel={removeLabel}
                            selectedLanguages={selectedLanguages}
                            handleTranslationChange={handleTranslationChange}
                            handleAllergensChange={handleAllergensChange}
                            handleCategoryChange={handleCategoryChange}
                        />
                    </TableBody >
                </Table>
            </TableContainer>

            {/* Save Button */}
            <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={saveAll}
                disabled={activeLabels.every(
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