import React, { useEffect, useRef, useState } from "react";
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
    Box,
} from "@mui/material";
import PreviewIcon from "@mui/icons-material/Visibility";
import SaveIcon from "@mui/icons-material/Save";
import { labelDataType, MealTranslation } from '../DB/Interfaces/Labels';
import { Allergens } from './Components/AllergensUI';
import { Category } from './Components/CategoryUI';
import { Remove, Add } from "@mui/icons-material";
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

    //TODO - Fetch languages from API or localDB
    const languages = ["bg", "en", "de", "ru"]; // Available languages

    // Add new label/s with default structure
    
    const addNewLabel = (amount: number = 1) => {
        const newLabels: labelDataType[] = [];
        for (let i = 0; i < amount; i++){
            newLabels.push({
                _id: Date.now().toString(),
                allergens: [],
                category: [],
                translations: selectedLanguages.map((lang) => ({
                    lang,
                    name: "",
                    description: "",
                })),
                owner: "", // You can set the owner's id as needed
            });
        }
       
        setLabels([
            ...labels,
            ...newLabels,
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
            <LanguageSelection languages={languages} selectedLanguages={selectedLanguages} handleLanguageSelection={handleLanguageSelection} />

            {/* Add Label/s Button */}
            <NewLabels addNewLabel={addNewLabel} />


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

const LanguageSelection = ({ languages, selectedLanguages, handleLanguageSelection }: { languages: string[], selectedLanguages: string[], handleLanguageSelection: Function }) => {
    return (
        <Box sx={{ display: "flex", gap: 1 }}>
            {languages.map((lang) => (
                <FormControlLabel
                    key={lang + "index"}
                    control={
                        <Checkbox
                            checked={selectedLanguages.includes(lang)}
                            onChange={() => handleLanguageSelection(lang)}
                        />
                    }
                    label={lang.toUpperCase()}
                />
            ))}
        </Box>
    );
}
const NewLabels = ({ addNewLabel }: { addNewLabel: (amount?: number) => void }) => {
    const [amount, setAmount] = useState<number>(1);
    const [editing, setEditing] = useState(false);
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    const minimum = 1;
    const maximum = 25;
    
    const increase = () => setAmount((prev) => Math.min(prev + 1, maximum));
    const decrease = () => setAmount((prev) => Math.max(prev - 1, minimum));

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setEditing(false);
            }
        };
        if (editing) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [editing]);
    return (
        <Box ref={wrapperRef}
            sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                width: "fit-content",  // Keeps the width based on content
                position: "relative",  // Allow absolute positioning
                height: "2.5rem", // Keeps the height based on content
                overflow: "hidden",    // Hides the overflow
            }}>
            {editing ? (

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        border: '1px solid',
                        borderColor: 'grey.300',
                        borderRadius: 1,
                        px: 1.5,
                        py: 0.5,
                    }}
                >
                    <IconButton onClick={decrease} size="small" sx={{ p: 0.3 }}>
                        <Remove fontSize="small" />
                    </IconButton>
                    <Box sx={{ fontSize: '1rem', fontWeight: 'bold' }}>{amount}</Box>
                    <IconButton onClick={increase} size="small" sx={{ p: 0.3 }}>
                        <Add fontSize="small" />
                    </IconButton>
                </Box>
                   ) : (
                    // Default View (Just the Number)
                    <Button
                        variant="text"
                        onClick={() => setEditing(true)}
                        sx={{ minWidth: 50, fontSize: "1rem", fontWeight: "bold" }}
                    >
                        {amount}
                    </Button>
                )}
            <Button variant="contained" color="primary" size="small" onClick={() => addNewLabel(amount)}>
                Add {amount} Label{amount > 1 ? "s" : ""}
            </Button>
        </Box>
    );
};


const AllergensCell = ({ labelId, allergens, handleAllergensChange }: { labelId: string, allergens: number[], handleAllergensChange: (labelId:string,allergens: number[]) => void}) => {
    const [currentAllergens, setCurrentAllergens] = useState<number[]>(allergens);
    const setAllergens = (arr: number[]) => {
        arr.sort((a,b)=>a-b);
        handleAllergensChange(labelId, arr);
        setCurrentAllergens(arr);
    };
    return (
        <TableCell align='left'>
            <Allergens currentAllergens ={ currentAllergens.length ? currentAllergens : [] } setCurrentAllergens={setAllergens} />
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