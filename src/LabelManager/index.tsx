import React, { useState } from "react";
import {
    Button,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Checkbox,
    Paper,
    FormControlLabel,
} from "@mui/material";
import PreviewIcon from "@mui/icons-material/Visibility";
import SaveIcon from "@mui/icons-material/Save";
import { labelDataType, MealTranslation } from '../DB/Interfaces/Labels';
import { Allergens } from './Components/AllergensUI';
import { Category } from './Components/CategoryUI';
interface Label extends labelDataType {
    modified: boolean;
}

const LabelTable = () => {
    const [labels, setLabels] = useState<labelDataType[]>([]);
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([
        "bg",
        "en",
        "de",
        "ru",
    ]);

    const languages = ["bg", "en", "de", "ru"]; // Available languages

    // Add new label with default structure
    const addNewLabel = () => {
        setLabels([
            ...labels,
            {
                _id: Date.now().toString(),
                allergens: [],
                category: [],
                translations: selectedLanguages.map((lang) => ({
                    lang,
                    name: "",
                    description: "",
                })),
                owner: "", // You can set the owner's id as needed
            },
        ]);
    };

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
            {/* Language Selection */}
            <div>
                {languages.map((lang, index) => (
                    <FormControlLabel
                        key={lang+"index"}
                        control={
                            <Checkbox
                                checked={selectedLanguages.includes(lang)}
                                onChange={() => handleLanguageSelection(lang)}
                            />
                        }
                        label={lang.toUpperCase()}
                    />
                ))}
            </div>

            {/* Add Label Button */}
            <Button variant="outlined" onClick={addNewLabel}>
                Add New Label
            </Button>

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
                        {labels.map((label) => (
                            <TableRow key={`${label._id}-row`} >
                                <TableCell align='left'>
                                    <Checkbox
                                        checked={false} // Add selection logic if needed
                                        onChange={() => { }}
                                    />
                                </TableCell>
                                <AllergensCell labelId={label._id} allergens={label.allergens} handleAllergensChange={handleAllergensChange} />
                                <CategoryCell labelId={label._id} category={label.category} handleCategoryChange={handleCategoryChange} />
                                
                                {selectedLanguages.map((lang) => {
                                    const translation = label.translations.find(
                                        (t) => t.lang === lang
                                    );
                                    return (
                                        <React.Fragment key={lang}>
                                        <LabelNameCell labelId={label._id} lang={lang} translation={translation} handleTranslationChange={handleTranslationChange} />
                                        <LabelDescriptionCell labelId={label._id} lang={lang} translation={translation} handleTranslationChange={handleTranslationChange} />
                                            
                                        </React.Fragment>
                                    );
                                })}
                                <TableCell align='right'>
                                    <IconButton>
                                        <PreviewIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
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

const AllergensCell = ({ labelId, allergens, handleAllergensChange }: { labelId: string, allergens: number[], handleAllergensChange: (labelId:string,allergens: number[]) => void}) => {
    const [currentAllergens, setCurrentAllergens] = useState<number[]>(allergens);
    const setAllergens = (arr: number[]) => {
        arr.sort((a,b)=>a-b);
        handleAllergensChange(labelId, arr);
    };
    return (
        <TableCell align='left'>
            <Allergens currentAllergens ={ currentAllergens.length ? currentAllergens : [0,1] } setCurrentAllergens={setAllergens} />
        </TableCell> 
    );
}
const CategoryCell = ({ labelId, category, handleCategoryChange }: { labelId: string, category: string[], handleCategoryChange: Function }) => {
    const [currentCategory, setCurrentCategory] = useState<string[]>(category);
    const setCategory = (arr: string[]) => {
        handleCategoryChange(labelId, arr);
        setCurrentCategory(arr);
    }


    return (
        <TableCell align='left'>
            <Category filterCategory={currentCategory} setFilterCategory={ setCategory } />
        </TableCell>
    );
}

const LabelNameCell = ({ labelId, lang, translation, handleTranslationChange }: { labelId: string, lang: string, translation: MealTranslation | undefined, handleTranslationChange: Function }) => {
    return (
        <TableCell align='left'>
            <TextField
                value={translation?.name || ""}
                onChange={(e) =>
                    handleTranslationChange(
                        labelId,
                        lang,
                        "name",
                        e.target.value
                    )
                }
                variant="outlined"
                size="small"
            />
        </TableCell>
    );
}

const LabelDescriptionCell = ({ labelId, lang, translation, handleTranslationChange }: { labelId: string, lang: string, translation: MealTranslation | undefined, handleTranslationChange: Function }) => {
    return (
        <TableCell align='left'>
            <TextField
                value={translation?.description || ""}
                onChange={(e) =>
                    handleTranslationChange(
                        labelId,
                        lang,
                        "description",
                        e.target.value
                    )
                }
                variant="outlined"
                size="small"
            />
        </TableCell>
    );
}

export default LabelTable;