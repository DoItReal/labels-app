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
} from "@mui/material";

import SaveIcon from "@mui/icons-material/Save";
import { labelDataType } from '../DB/Interfaces/Labels';
import TopNavBar from "./Components/TopNavBar";
import DataTable from "./Components/DataTable";

const LabelTable = () => {
    const [labels, setLabels] = useState<labelDataType[]>([]);
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([
        "bg",
        "en",
        "de",
        "ru",
    ]);

    //TODO - Fetch languages from API or localDB
    const languages = ["bg", "en", "de", "ru"]; // Available languages

    // Add new label/s with default structure
    
    const addNewLabel = (amount: number = 1) => {
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
        setLabels((prev) =>
            prev.map((label) =>
                label._id === labelId ? { ...label, allergens } : label
            )
        );
    };

    // Handle changes in categories (array of strings)
    const handleCategoryChange = (labelId: string, category: string[]) => {
        setLabels((prev) =>
            prev.map((label) =>
                label._id === labelId ? { ...label, category } : label
            )
        );
    };

    // Save all modified labels
    const saveAll = () => {
        const modifiedLabels = labels.filter(
            (label) => label.translations.some((translation) => translation.name || translation.description)
        );
        console.log("Saving labels:", modifiedLabels);
        // Add save logic here, e.g., make an API call to persist the modified labels
    };

    // Handle language selection
    const handleLanguageSelection = (lang: string) => {
        setSelectedLanguages((prev) =>
            prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
        );
    };

    return (
        <div>
            <TopNavBar languages={languages} selectedLanguages={selectedLanguages} handleLanguageSelection={handleLanguageSelection} addNewLabel={addNewLabel} />

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
                                    <TableCell key={`${lang}-name`}>{`Name (${lang.toUpperCase()})`}</TableCell>
                                    <TableCell key={`${lang}-desc`}>{`Description (${lang.toUpperCase()})`}</TableCell>
                                </React.Fragment>
                            ))}
                            <TableCell>Preview</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody >
                        <DataTable labels={labels} selectedLanguages={selectedLanguages} handleTranslationChange={handleTranslationChange} handleAllergensChange={handleAllergensChange} handleCategoryChange={handleCategoryChange} />
                    </TableBody >
                </Table>
            </TableContainer>

            {/* Save Button */}
            <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={saveAll}
                disabled={labels.every(
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