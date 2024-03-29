import React, { useEffect, useRef, useState } from 'react';
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
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import { deleteCatalogDB, fetchCatalogs, getCatalogs, loadCatalogsLocally, updateCatalogDB, updateCatalogsLocally } from '../Catalogs/CatalogsDB';
import { newCatalog, deleteCatalogLocally, IcatalogToIcatalogs, loadCatalog, catalogToLoadedCatalog, getSelectedCatalog, loadedCatalogToCatalog } from '../Catalogs/CatalogDB';
import { Icatalog, IloadedCatalog, isCatalogArray, isLoadedCatalog } from '../Catalogs/Interfaces/CatalogDB';
import { Icatalogs } from '../Catalogs/Interfaces/CatalogsDB';
import CatalogEditor from './CatalogEditor';
import CatalogPreview from './CatalogPreview';
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
    const [previewingCatalogId, setPreviewingCatalogId] = useState<string | null>(null);
    const [loadedCatalog,setLoadedCatalog] = useState<IloadedCatalog | null>(null)
    const [open, setOpen] = useState(false);
    const [newCatalogName, setNewCatalogName] = useState('');
    const [renamingCatalogId, setRenamingCatalogId] = useState<string | null>(null);
    const [renamingCatalogName, setRenamingCatalogName] = useState('');
    const [menuCollapsed, setMenuCollapsed] = useState(false);
    const classes = useStyles();
    const setCatalog = async (catalog: Icatalog) => { // This function is passed to the CatalogEditor component to update the state with the edited catalog.
        // Logic to update the state with the edited catalog or add a new catalog to the list
        if (!catalogs) return;
        const updatedCatalogs: Icatalogs = {
            ...catalogs,
            [catalog._id]: catalog
        };
        // Update the state with the new list of catalogs
        setCatalogs(updatedCatalogs);
        // Save the updated catalogs locally in session storage
        await updateCatalogsLocally(updatedCatalogs);
        // Update the state with the new loaded CatalogEditor if it is the one being edited
        if (loadedCatalog && loadedCatalog._id === catalog._id) {
            const loadedCatalogTmp = await catalogToLoadedCatalog(catalog._id);
            setLoadedCatalog(loadedCatalogTmp);
        }
    };
    useEffect(() => {
        
        //check if there are catalogs in the session storage
        //even if there are catalogs in the session storage, fetch the catalogs from the database and update the session storage
        const fetchCatalogsFromDB = async () => {

            const selectedCatalog: IloadedCatalog | null = getSelectedCatalog();
            
            try {
                const fetchedCatalogs: Icatalog[] = await fetchCatalogs();
                // Save the fetched catalogs locally in session storage
                const catalogs: Icatalog[] = [];
                if (selectedCatalog && isLoadedCatalog(selectedCatalog)) {
                    
                    var found = false;
                    for (const fetchedCatalog of fetchedCatalogs) { // iterate fetchedCatalogs
                        if (selectedCatalog._id === fetchedCatalog._id) { // if the catalog is found in the fetchedCatalogs
                            found = true; // update the selectedCatalog
                            break;
                        }
                    }
                    if (!found) {
                        const catalog = loadedCatalogToCatalog(selectedCatalog);
                        catalogs.push(catalog);
                    }
                }
                const cats = await loadCatalogsLocally([...fetchedCatalogs, ...catalogs]);
                // Fetch the catalogs from session storage
                // Set the fetched catalogs to the state
                cats && setCatalogs(cats);
            } catch (error) {
                console.error('Error fetching catalogs:', error);
            }

        };

            fetchCatalogsFromDB();

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
    useEffect(() => {
        const fetchData = async (catalogId: string) => {
            try {
                const loadedCatalog = await catalogToLoadedCatalog(catalogId);
                // Set the loaded catalog to state
                setLoadedCatalog(loadedCatalog);
            } catch (error) {
                console.error('Error fetching catalog:', error);
            }
        };
        if (previewingCatalogId) {
            fetchData(previewingCatalogId);
        }

    },[previewingCatalogId]); // Run effect when previewingCatalogId changes
    const handlePreviewCatalog = (catalog: Icatalog) => {
        loadCatalog(catalog._id);
        setPreviewingCatalogId(catalog._id);
        setEditingCatalogId(null); // Move blocks list to the left to make room for the editor UI)
        setMenuCollapsed(true); // Move blocks list to the left to make room for the editor UI
    };
    const handleEditCatalog = (catalog: Icatalog) => {
        loadCatalog(catalog._id);
        setEditingCatalogId(catalog._id);
        setPreviewingCatalogId(null);
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
        setCatalogs({ ...catalogs });
        // delete the catalog from the database
        deleteCatalogDB(catalogId);
        //delete selectedCatalog if it is the one being deleted
        const selectedCatalog = getSelectedCatalog();
        if (selectedCatalog && selectedCatalog._id === catalogId && catalogId !== '1') {
            sessionStorage.removeItem('selectedCatalog');
        }
    };

    const handleRenameCatalog = (catalogId: string, newName: string) => {
        if (!catalogs) return;
        const updatedCatalogs: Icatalogs = { ...catalogs, [catalogId]: { ...catalogs[catalogId], name: newName } };
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
    
    
    return (
        <>
        <Grid container>
            <Grid item xs={menuCollapsed ? 1 : 3}>
                {/* Button to toggle menu */}
                <IconButton size="small" onClick={toggleMenu} className={classes.buttonStyle} title={menuCollapsed ? 'Expand' : 'Minimize' } >
                    {menuCollapsed ? <ChevronRight fontSize='medium'/> : <ChevronLeft fontSize='medium' />}
                </IconButton>
                {/* CatalogEditor List */}
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
                                    <Button onClick={()=>handlePreviewCatalog(catalog) }>Preview</Button>
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
                <Button onClick={() => setOpen(true)}>New Catalog</Button>
                {/* Dialog for adding a new newCatalog */}
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Add New Catalog</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="CatalogEditor Name"
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
                    <CatalogEditor
                        key={'catalog/' + editingCatalogId}
                        catalog={ loadedCatalog }
                        setCatalog={ setCatalog }
                    />
                    ) : null}
                    {previewingCatalogId !== null && loadedCatalog ? (
                        <CatalogPreview
                        key={'catalog/' + previewingCatalogId}
                            previewedCatalog={loadedCatalog}
                        />
                    ):null }
            </Grid>
    
            </Grid>
        </>
    );
};

export default Catalogs;
