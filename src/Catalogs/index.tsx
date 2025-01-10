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
    Container,
} from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { default as NewIcon } from '@mui/icons-material/FiberNew';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { default as RenameIcon } from '@mui/icons-material/DriveFileRenameOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { makeStyles } from '@mui/styles';
import { createCatalogDB, deleteCatalogDB } from '../DB/Remote/Catalogs';
import { newCatalog, deleteCatalogLocally, loadCatalog, catalogToLoadedCatalog, getSelectedCatalog, loadCatalogsLocally, updateCatalogsLocally, getCatalogs, loadedCatalogToCatalog } from '../DB/SessionStorage/Catalogs';
import { Icatalog, IloadedCatalog, Icatalogs } from '../DB/Interfaces/Catalogs';
import CatalogEditor from './CatalogEditor';
import CatalogPreview from './CatalogPreview';
import FeaturedPlayListIcon from '@mui/icons-material/FeaturedPlayList';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';

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
    const [firstRender, setFirstRender] = useState(true);
    const classes = useStyles();

    const setCatalog = async (catalog: Icatalog) => { // This function is passed to the CatalogEditor component to update the state with the edited catalog.
        // Logic to update the state with the edited catalog or add a new catalog to the list
        if (!catalogs) return;
        const updatedCatalogs: Icatalogs = {
            ...catalogs,
            [catalog._id]: catalog
        };
        // Update the state with the new list of catalogs
        setCatalogs(structuredClone(updatedCatalogs));
        // Save the updated catalogs locally in session storage
        await updateCatalogsLocally(updatedCatalogs);
        // Update the state with the new loaded CatalogEditor if it is the one being edited
        if (loadedCatalog && loadedCatalog._id === catalog._id) {
            const loadedCatalogTmp = await catalogToLoadedCatalog(catalog._id);
            setLoadedCatalog(loadedCatalogTmp);
        }
    };
    useEffect(() => {
        if (!firstRender) return;
                const cats = getCatalogs();
                // Fetch the catalogs from session storage
                // Set the fetched catalogs to the state
        cats && setCatalogs(cats);
                setFirstRender(false);
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
    const handlePreviewCatalog =async (catalog: Icatalog) => {
        
        setLoadedCatalog(await loadCatalog(catalog._id));
        setPreviewingCatalogId(catalog._id);
        setEditingCatalogId(null); // Move blocks list to the left to make room for the editor UI)
        setMenuCollapsed(true); // Move blocks list to the left to make room for the editor UI
    };
    const handleEditCatalog = async(catalog: Icatalog) => {
       setLoadedCatalog(await loadCatalog(catalog._id));
        setEditingCatalogId(catalog._id);
        setPreviewingCatalogId(null);
        setMenuCollapsed(true); // Move blocks list to the left to make room for the editor UI
        // Logic to display the editor UI for the selected newCatalog
        // Move Catalogs list to the left to make room for the editor UI
    };
    const toggleMenu = () => {
        setMenuCollapsed(!menuCollapsed);
    };
    const handleAddCatalog = async() => {
        // Logic to add a new newCatalog to the list
        const catalog: Icatalog = newCatalog([]);
        const updatedCatalog = { ...catalog, name: newCatalogName };
        const realCatalog = createCatalogDB(await catalogToLoadedCatalog(catalog));
        if (!realCatalog) return;
        await catalogToLoadedCatalog(updatedCatalog).then((loadedCatalog) => createCatalogDB(loadedCatalog)
        ).then((catalog) => {
            if(!catalog) return;
            setCatalogs({ ...catalogs, [catalog._id]: catalog });
            updateCatalogsLocally({ ...catalogs, [catalog._id]: catalog });
        });
      //  const updatedCatalogs: Icatalogs = { ...catalogs, [catalog._id]:realCatalog };
      //  setCatalogs({ ...updatedCatalogs });
      //  updateCatalogsLocally(updatedCatalogs);
       

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
        //delete labels if it is the one being deleted
        const selectedCatalog = getSelectedCatalog();
        if (selectedCatalog && selectedCatalog._id === catalogId && catalogId !== '1') {
            sessionStorage.removeItem('labels');
        }
    };
    const handleRenameCatalog = (catalogId: string, newName: string) => {
        if (!catalogs) return;
        const updatedCatalogs: Icatalogs = { ...catalogs, [catalogId]: { ...catalogs[catalogId], name: newName } };
        setCatalogs({ ...updatedCatalogs });
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
            {/* <Grid container style={{ maxHeight: '100%', overflow: 'auto' }} > */ }
            <Grid container>
                <Grid item xs={menuCollapsed ? 1 : 3} >
                    <Grid item sx={(theme)=>({ border: "1px solid darkslategray", backgroundColor: theme.palette.background.paper })} >
                {/* Button to toggle menu */}
                    <IconButton size="small" onClick={toggleMenu} className={classes.buttonStyle} title={menuCollapsed ? 'Expand' : 'Minimize'}  >
                            {menuCollapsed ? <ChevronRight fontSize='small' /> : <ChevronLeft fontSize='small' />}
                            
                    </IconButton>

                    {/* Button for New Catalog */}
                        <IconButton sx={{ color: "orange" }} size="large" title="New Catalog" onClick={() => setOpen(true)}><LibraryAddIcon fontSize="large" /></IconButton>
                        {!menuCollapsed ? <span style={{ fontSize: '2rem', alignSelf: 'center', textAlign: 'center', marginLeft: '10%' }}>Catalogs</span> : <></>}
                    </Grid>

                    {/* CatalogEditor List */}
                    <List>
                        {catalogs && Object.values(catalogs).map((catalog: Icatalog, index) => (
                            <ListItem disablePadding key={'newCatalog ' + catalog._id}
                                sx={(theme) => ({
                                    borderBottom: `1px solid ${theme.palette.divider}`,
                                    background: index % 2
                                        ? theme.palette.background.default
                                        : theme.palette.background.paper,
                                    borderRight: `1px solid ${theme.palette.divider}`,
                                    paddingLeft: '2px',
                                })}>
                                {renamingCatalogId && renamingCatalogId === catalog._id ? (
                                    <TextField
                                        value={renamingCatalogName}
                                        onChange={(e) => setRenamingCatalogName(e.target.value)}
                                        onBlur={() => handleRenameCatalog(catalog._id, renamingCatalogName)}
                                        autoFocus
                                    />
                                ) : (
                                        <span onDoubleClick={() => handleDoubleClick(catalog._id, catalog.name)} style={{
                                            fontSize: menuCollapsed ? '0.6rem' : '1rem',
                                        }}><FeaturedPlayListIcon fontSize="small" sx={{color:"orange", marginRight:"5px"}} />{catalog.name}</span>
                                )}
                            
                                {!menuCollapsed && (
                                    <Grid item xs={6} sx={{ marginRight: "0", marginLeft: "auto", backgroundColor: 'inherit' }}>
                                        <IconButton title="Preview" color={"info"} onClick={() => handlePreviewCatalog(catalog)}><VisibilityIcon/></IconButton>
                                        <IconButton title="Edit" color={"info"} onClick={() => handleEditCatalog(catalog)}><EditIcon /></IconButton>
                                        <IconButton title="Delete" color={"warning"} onClick={() => handleDeleteCatalog(catalog._id)}><DeleteForeverIcon /></IconButton>
                                        <IconButton title="Rename" color={"secondary"} onClick={() => { setRenamingCatalogId(catalog._id); setRenamingCatalogName(catalog.name); }}><RenameIcon /></IconButton> 
                                </Grid>
                                )}
                        
                            </ListItem>
                        ))}
                    </List>
                
                {/* Button to add new newCatalog */}
                {!menuCollapsed && (
                    <>
                
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
                <Grid item sm={menuCollapsed ? 11 : 9} xs={menuCollapsed ? 11 : 9} sx={{overflow: 'hidden',maxHeight:'80vh'}} >
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
