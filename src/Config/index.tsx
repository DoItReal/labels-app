import React, { useEffect, useState } from 'react';
import {
    List,
    ListItem,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    IconButton,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { IallergensMap, InewAllergen } from '../DB/Interfaces/Allergens';
import { createNewAllergenDB, deleteAllergenDB, editAllergenDB } from '../DB/Remote/Allergens';
import { getLocalAllergens, setLocalAllergens } from '../DB/LocalStorage/Allergens';
import Editor from './AllergenEditor';
var allAllergensNames: Map<number, string> = new Map([
    [1, "Gluten"],
    [2, "Celery"],
    [3, "Peanuts"],
    [4, "Lupin"],
    [5, "Soya"],
    [6, "Eggs"],
    [7, "Molluscs"],
    [8, "Lactose"],
    [9, "Nuts"],
    [10, "Sulphur Dioxide"],
    [11, "Sesame"],
    [12, "Fish"],
    [13, "Crustaceans"],
    [14, "Mustard"],
    [15, "Mushrooms"]
]);
const useStyles = makeStyles((theme) => ({
    buttonStyle: {
        backgroundColor: 'lightgray',
        border: '5px double gray',
        borderRadius: '0',
        color: 'white',
        '&:hover': {
            backgroundColor: 'darkgray',
            border: '5px double black',
            borderRadius: '0',
            color: 'white',
        },
    },
}));

const ConfigView = () => {
    const [allergensMap, setAllergensMap] = useState<IallergensMap[]>([]);
    const [editingAllergensId, setEditingAllergensId] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const [newAllergensName, setNewAllergensName] = useState('New Allergen Config');
    const [renamingAllergensId, setRenamingAllergensId] = useState<string | null>(null);
    const [renamingAllergensName, setRenamingAllergensName] = useState('');
    const [menuCollapsed, setMenuCollapsed] = useState(false);
    const classes = useStyles();
    const setAllergenMap = (allergen: IallergensMap) => {
        const updatedAllergens = allergensMap.map((a) => {
            if (a._id === a._id) {
                return allergen;
            }
            return a;
        });
        setAllergensMap(updatedAllergens);
    }
    useEffect(() => {
        const storedAllergens = getLocalAllergens();
        setAllergensMap(storedAllergens || []);
    }, []);
    const handleEditAllergens = (allergen: IallergensMap) => {
        setEditingAllergensId(allergen._id);
        setMenuCollapsed(true); // Move blocks list to the left to make room for the editor UI
        // Logic to display the editor UI for the selected allergen
        // Move blocks list to the left to make room for the editor UI
    };
    const handleDeleteAllergens = (id: string) => {
        deleteAllergenDB(id);
        const updatedAllergens = allergensMap.filter((allergen) => allergen._id !== id);
        setAllergensMap(updatedAllergens);
    }
    const handleRenameAllergens = (allergenId: string, newName: string) => {
        editAllergenDB({ _id: allergenId, name: newName });
        const updatedAllergens = allergensMap.map((allergen: IallergensMap) =>
            allergen._id === allergenId ? { ...allergen, name: newName } : allergen
        );
        setAllergensMap(updatedAllergens);
        setLocalAllergens(updatedAllergens);
        setRenamingAllergensId(null);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const toggleMenu = () => {
        setMenuCollapsed(!menuCollapsed);
    };
    const handleDoubleClick = (allergenId: string, allergenName: string) => {
        setRenamingAllergensId(allergenId);
        setRenamingAllergensName(allergenName);
    };
    const handleAddAllergen = async () => {
        // Logic to add a new design to the list
        const newAllergen: InewAllergen = {
            name: newAllergensName,
            allergens: Array.from(allAllergensNames, ([id, name]) => ({
                name,
                imageDataURL: '',  // Placeholder for imageDataUrl
                description: '',  // Placeholder for description
            }))     
        };
        const newSavedAllergen = await createNewAllergenDB(newAllergen);
        const updatedAllergensMap = [...allergensMap, newSavedAllergen];

        setAllergensMap(updatedAllergensMap);
        setLocalAllergens(updatedAllergensMap);
        handleClose();
    };

    return (
        <>
            <Grid container>
                <Grid item xs={menuCollapsed ? 1 : 3}>
                    {/* Button to toggle menu */}
                    <IconButton size="small" onClick={toggleMenu} className={classes.buttonStyle} title={menuCollapsed ? 'Expand' : 'Minimize'} >
                        {menuCollapsed ? <ChevronRight fontSize='medium' /> : <ChevronLeft fontSize='medium' />}
                    </IconButton>
                    {/* AllergensMap List */}
                    <List>
                        {allergensMap.map((allergens: IallergensMap) => (
                            <ListItem key={'allergens ' + allergens._id}>
                                {renamingAllergensId === allergens._id ? (
                                    <TextField
                                        value={renamingAllergensName}
                                        onChange={(e) => setRenamingAllergensName(e.target.value)}
                                        onBlur={() => handleRenameAllergens(allergens._id, renamingAllergensName)}
                                        autoFocus
                                    />
                                ) : (
                                    <span onDoubleClick={() => handleDoubleClick(allergens._id, allergens.name)} style={{
                                        fontSize: menuCollapsed ? '0.6rem' : '1rem',
                                    }}>{allergens.name}</span>
                                )}

                                {!menuCollapsed && (
                                    <>
                                        <Button onClick={() => handleEditAllergens(allergens)}>Edit</Button>
                                        <Button onClick={() => handleDeleteAllergens(allergens._id)}>Delete</Button>
                                        <Button onClick={() => { setRenamingAllergensId(allergens._id); setRenamingAllergensName(allergens.name); }}>Rename</Button>
                                    </>
                                )}

                            </ListItem>
                        ))}
                    </List>

                    {/* Button to add new allergens */}
                    {!menuCollapsed && (
                        <>
                            <Button onClick={() => setOpen(true)}>Add New Allergen Map</Button>
                            {/* Dialog for adding a new allergens */}
                            <Dialog open={open} onClose={handleClose}>
                                <DialogTitle>Add New Allergen Map</DialogTitle>
                                <DialogContent>
                                    <TextField
                                        label="Allergen Name"
                                        value={newAllergensName}
                                        onChange={(e) => setNewAllergensName(e.target.value)}
                                    />
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleAddAllergen}>Add</Button>
                                    <Button onClick={handleClose}>Cancel</Button>
                                </DialogActions>
                            </Dialog>
                        </>
                    )}
                </Grid>
                <Grid item sm={menuCollapsed ? 11 : 9} xs={menuCollapsed ? 11 : 9} >
                    {editingAllergensId !== null ? (
                        <Editor
                            key={'editor' + editingAllergensId}
                            allergen={allergensMap.find((allergen) => allergen._id === editingAllergensId)}
                            setAllergen={setAllergenMap}
                        />
                    ) : null}
                </Grid>

            </Grid>
        </>
    );
};
export default ConfigView;