import { AppBar, Toolbar, IconButton, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import LanguageSelection from "./LanguageSelection";
import NewLabels from "./NewLabelsButton";
import { labelDataType } from "../../../DB/Interfaces/Labels";
import SearchBar from './SearchBar';
import CatalogSelection from './CatalogSelection';


const TopNavBar = ({ languages, selectedLanguages, handleLanguageSelection, addNewLabels, edit, setEdit, editLabels, setEditLabels }: { languages: string[], selectedLanguages: string[], handleLanguageSelection: (lang: string) => void, addNewLabels: () => void, edit: Boolean, setEdit: () => void, editLabels: labelDataType[], setEditLabels: (labels:labelDataType[]) => void }) => {

   
   /* // Add labels to the editLabels array
    const addLabels = (labels: labelDataType | labelDataType[]) => {
        if (Array.isArray(labels)) {
            setEditLabels([...editLabels, ...labels]);
        } else {
            setEditLabels([...editLabels, ...[labels]]);
        }
    };
    */
    const addLabels = (labels: labelDataType | labelDataType[]) => {
        const newLabels = Array.isArray(labels) ? labels : [labels];

        // Create a Set of existing label IDs for quick lookup
        const existingIds = new Set(editLabels.map((label) => label._id));

        // Filter out labels that already exist
        const uniqueLabels = newLabels.filter((label) => !existingIds.has(label._id));

        // Only update if there are new labels to add
        if (uniqueLabels.length > 0) {
            setEditLabels([...editLabels, ...uniqueLabels]);
        }
    };
    return (
        <AppBar position="static" color="default" elevation={1}>
            <Toolbar sx={{ display: "flex", gap: 2 }}>
                <Button startIcon={<EditIcon />} variant="contained" color="secondary" onClick={setEdit}>
                    {!edit ? "Edit Labels" : "New Labels"}
                </Button>
                {/* Language Selection Dropdown */}
                <LanguageSelection languages={languages} selectedLanguages={selectedLanguages} handleLanguageSelection={handleLanguageSelection} />
                {/* Action Buttons */}
                {!edit ? <NewLabels addNewLabel={addNewLabels} /> : null}
                

                {/* Search Bar (Grows to take up space) */}
                {edit ? (<><SearchBar addLabels={addLabels} /> <CatalogSelection addLabels={addLabels } /></>): null}

                {/* More Options */}
                <IconButton>
                    <MoreVertIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
};

export default TopNavBar;
