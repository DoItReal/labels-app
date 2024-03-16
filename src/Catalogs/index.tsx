

import React, { useEffect, useRef, useState } from 'react';
import {
    List,
    ListItem,
    ListItemText,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    IconButton,
} from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import { fetchCatalogs, getCatalogs, loadCatalogsLocally, updateCatalogsLocally } from '../Catalogs/CatalogsDB';
import { newCatalog, deleteCatalogLocally, IcatalogToIcatalogs, loadCatalog, catalogToLoadedCatalog } from '../Catalogs/CatalogDB';
import { Icatalog, IloadedCatalog } from '../Catalogs/Interfaces/CatalogDB';
import { Icatalogs } from '../Catalogs/Interfaces/CatalogsDB';
import Catalog from './CatalogEditor';
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
            color:'white',
        },
    },
}));

const Catalogs: React.FC = () => {
    const [catalogs, setCatalogs] = useState<Icatalogs>();
    const [editingCatalogId, setEditingCatalogId] = useState<string | null>(null);
    const [loadedCatalog,setLoadedCatalog] = useState<IloadedCatalog | null>(null)
    const [open, setOpen] = useState(false);
    const [newCatalogName, setNewCatalogName] = useState('');
    const [renamingCatalogId, setRenamingCatalogId] = useState<string | null>(null);
    const [renamingCatalogName, setRenamingCatalogName] = useState('');
    const [menuCollapsed, setMenuCollapsed] = useState(false);
    const classes = useStyles();

    const setCatalog = (catalog: Icatalog) => { // This function is passed to the Catalog component to update the state with the edited catalog.
        // Logic to update the state with the edited catalog or add a new catalog to the list
        if (!catalogs) return;
        const updatedCatalogs: Icatalogs = {
            ...catalogs,
            [catalog._id]: catalog
        };
        setCatalogs(updatedCatalogs);
    };
    useEffect(() => {
        const storedCatalogs = getCatalogs();
        if (storedCatalogs) {
            setCatalogs(storedCatalogs);
            
        } else {
            const fetchCatalogsFromDB = async () => {
                try {
                    const fetchedCatalogs: Icatalog[] = await fetchCatalogs();
                    // Save the fetched catalogs locally in session storage
                    loadCatalogsLocally(fetchedCatalogs);
                    // Fetch the catalogs from session storage
                    const cats = getCatalogs();
                    // Set the fetched catalogs to the state
                    cats && setCatalogs(cats);
                } catch (error) {
                    console.error('Error fetching catalogs:', error);
                }
            };

            fetchCatalogsFromDB();
        }
    }, []);
    useEffect(() => {
        
        const fetchData = async (catalogId:string) => {
            try {
                const loadedCatalog = await catalogToLoadedCatalog(catalogId);
                // Set the loaded catalog to state
                setLoadedCatalog(loadedCatalog);
            } catch (error) {
                console.error('Error fetching catalog:', error);
            }
        };
        // Call fetchData when editingCatalogId changes
        if (editingCatalogId) {
            fetchData(editingCatalogId);
        }
    }, [editingCatalogId]); // Run effect when editingCatalogId changes
 
    const handleEditCatalog = (catalog: Icatalog) => {
        loadCatalog(catalog._id);
        setEditingCatalogId(catalog._id);
        setMenuCollapsed(true); // Move blocks list to the left to make room for the editor UI
        // Logic to display the editor UI for the selected newCatalog
        // Move Catalogs list to the left to make room for the editor UI
    };
    const toggleMenu = () => {
        setMenuCollapsed(!menuCollapsed);
    };
    const handleAddCatalog = () => {
        // Logic to add a new newCatalog to the list
        const catalog: Icatalog = newCatalog([]);

        const updatedCatalogs: Icatalogs = { ...catalogs, [catalog._id]: catalog };

        setCatalogs(updatedCatalogs);
        updateCatalogsLocally(updatedCatalogs);
        handleClose();
    };

    const handleDeleteCatalog = (catalogId: string) => {
        // Logic to delete a newCatalog from the list
        // Delete the newCatalog from the session storage
        deleteCatalogLocally(catalogId);
        if (catalogs && catalogs[catalogId]) delete catalogs[catalogId];
            else console.log('catalog not found in catalogs');
        // Update the state with the new list of catalogs
        setCatalogs(catalogs);
        // delete the catalog from the database
        
    };

    const handleRenameCatalog = (catalogId: string, newName: string) => {
        if (!catalogs) return;
        //not tested
        const updatedCatalogs: Icatalogs = { ...catalogs, [catalogId]: { ...catalogs[catalogId], name: newName } };
        console.log(catalogs); console.log(updatedCatalogs)
        setCatalogs(updatedCatalogs);
        updateCatalogsLocally(updatedCatalogs);
        setRenamingCatalogId(null);
    };

    const handleClose = () => {
        setOpen(false);
    };
    
    const handleDoubleClick = (designId: string, designName: string) => {
        setRenamingCatalogId(designId);
        setRenamingCatalogName(designName);
    };
    
    if (catalogs) {
                    Object.values(catalogs).forEach((catalog: Icatalog) => {
                    });
                }
    return (
        <>
        <Grid container>
            <Grid item xs={menuCollapsed ? 1 : 3}>
                {/* Button to toggle menu */}
                <IconButton size="small" onClick={toggleMenu} className={classes.buttonStyle} title={menuCollapsed ? 'Expand' : 'Minimize' } >
                    {menuCollapsed ? <ChevronRight fontSize='medium'/> : <ChevronLeft fontSize='medium' />}
                </IconButton>
                {/* Catalog List */}
                <List>
                    {catalogs && Object.values(catalogs).map((catalog: Icatalog) => (
                        <ListItem key={'newCatalog ' + catalog._id}>
                            {renamingCatalogId === catalog._id ? (
                                <TextField
                                    value={renamingCatalogName}
                                    onChange={(e) => setRenamingCatalogName(e.target.value)}
                                    onBlur={() => handleRenameCatalog(catalog._id, renamingCatalogName)}
                                    autoFocus
                                />
                            ) : (
                                    <span onDoubleClick={() => handleDoubleClick(catalog._id, catalog.name)} style={{
                                        fontSize: menuCollapsed ? '0.6rem' : '1rem',
                                    } }>{catalog.name}</span>
                            )}
                            
                            {!menuCollapsed && (
                                <>
                            <Button onClick={() => handleEditCatalog(catalog)}>Edit</Button>
                            <Button onClick={() => handleDeleteCatalog(catalog._id)}>Delete</Button>
                            <Button onClick={() => { setRenamingCatalogId(catalog._id); setRenamingCatalogName(catalog.name); } }>Rename</Button>
                            </>
                            )}
                        
                        </ListItem>
                    ))}
                </List>
                
                {/* Button to add new newCatalog */}
                {!menuCollapsed && (
                    <>
                <Button onClick={() => setOpen(true)}>Add Design</Button>
                {/* Dialog for adding a new newCatalog */}
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Add New Catalog</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Catalog Name"
                            value={newCatalogName}
                            onChange={(e) => setNewCatalogName(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleAddCatalog}>Add</Button>
                        <Button onClick={handleClose}>Cancel</Button>
                    </DialogActions>
                        </Dialog>
                </>
)}
            </Grid>
                <Grid item sm={menuCollapsed ? 11 : 9} xs={menuCollapsed ? 11 : 9} >
                {editingCatalogId !== null && loadedCatalog ? (
                    <Catalog
                        key={'catalog/' + editingCatalogId}
                        catalog={ loadedCatalog }
                        setCatalog={ setCatalog }
                    />
                ) : null}
            </Grid>
    
            </Grid>
        </>
    );
};

export default Catalogs;