import { AppBar, Toolbar, IconButton, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import LanguageSelection from "./LanguageSelection";
import NewLabels from "./NewLabelsButton";
import { labelDataType } from "../../../DB/Interfaces/Labels";
import SearchBar from './SearchBar';
import CatalogSelection from './CatalogSelection';


const TopNavBar = ({ languages, selectedLanguages, handleLanguageSelection, addNewLabels, edit, setEdit, editLabels, setEditLabels }:
    {
        languages: string[],
        selectedLanguages: string[],
        handleLanguageSelection: (lang: string) => void,
        addNewLabels: () => void,
        edit: Boolean,
        setEdit: () => void,
        editLabels: labelDataType[],
        setEditLabels: (labels: labelDataType[]) => void
    }) => {

    //ensure no duplicate labels are added
    const addLabels = (labels: labelDataType | labelDataType[]) => {
        const newLabels = Array.isArray(labels) ? labels : [labels];
        const existingIds = new Set(editLabels.map((label) => label._id));
        const uniqueLabels = newLabels.filter((label) => !existingIds.has(label._id));

        if (uniqueLabels.length > 0) {
            setEditLabels([...editLabels, ...uniqueLabels]);
        }
    };
   
    return (
        <AppBar position="static" color="default" elevation={1}>
            <Toolbar sx={{ display: "flex", gap: 2 }}>
                <Button
                    startIcon={<EditIcon />}
                    variant="contained"
                    color="secondary"
                    onClick={setEdit}
                >
                    {!edit ? "Edit Labels" : "New Labels"}
                </Button>

                {/* Language Selection Dropdown */}
                <LanguageSelection
                    languages={languages}
                    selectedLanguages={selectedLanguages}
                    handleLanguageSelection={handleLanguageSelection}
                />

                {/* Action Buttons */}
                {!edit && <NewLabels addNewLabel={addNewLabels} /> }
                

                {/* Search Bar (Grows to take up space) */}
                {edit && (
                    <>
                        <SearchBar addLabels={addLabels} />
                        <CatalogSelection addLabels={addLabels} />
                    </>
                )}

                {/* More Options */}
                <IconButton>
                    <MoreVertIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
};

export default TopNavBar;
