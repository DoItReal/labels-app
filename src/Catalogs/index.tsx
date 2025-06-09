
import React from 'react';
import {
    List,
    IconButton,
    Box,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import CatalogEditor from './components/CatalogEditor';
import CatalogPreview from './components/CatalogPreview';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import { useCatalogs } from './hooks/useCatalogs';
import CatalogListItem from './components/CatalogListItem';
import NewCatalogDialog from './components/NewCatalogDialog';

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
    const {
        catalogs,
        editingCatalogId,
        previewingCatalogId,
        loadedCatalog,
        renamingCatalogId,
        renamingCatalogName,
        newCatalogName,
        menuCollapsed,
        open,
        setNewCatalogName,
        toggleMenu,
        handleAddCatalog,
        handleDeleteCatalog,
        handleRenameCatalog,
        handleClose,
        handleDoubleClick,
        handlePreviewCatalog,
        handleEditCatalog,
        setRenamingCatalogId,
        setRenamingCatalogName,
        setCatalog,
         setOpen
    } = useCatalogs();

  
    const classes = useStyles();
    const handleOpenDialog = () => {
        setNewCatalogName('');
        setOpen(true);
    };
    return (
        <>
            {/* <Grid container style={{ maxHeight: '100%', overflow: 'auto' }} > */ }
            <Grid container>
                <Grid size={{ xs:  menuCollapsed? 1: 3  }} >
                    <Grid sx={(theme)=>({ border: "1px solid darkslategray", backgroundColor: theme.palette.background.paper })} >
                {/* Button to toggle menu */}
                    <IconButton size="small" onClick={toggleMenu} className={classes.buttonStyle} title={menuCollapsed ? 'Expand' : 'Minimize'}  >
                            {menuCollapsed ? <ChevronRight fontSize='small' /> : <ChevronLeft fontSize='small' />}
                            
                    </IconButton>

                    {/* Button for New Catalog */}
                        <IconButton sx={{ color: "orange" }} size="large" title="New Catalog" onClick={handleOpenDialog}><LibraryAddIcon fontSize="large" /></IconButton>
                        {!menuCollapsed ? <span style={{ fontSize: '2rem', alignSelf: 'center', textAlign: 'center', marginLeft: '10%' }}>Catalogs</span> : <></>}
                    </Grid>

                    {/* CatalogEditor List */}
                    <Box sx={{ height: '75vh', overflow: 'auto' }} >
                    <List >
                        {catalogs && Object.values(catalogs).map((catalog, i) => (
                            <CatalogListItem
                                key={catalog._id}
                                catalog={catalog}
                                index={i}
                                menuCollapsed={menuCollapsed}
                                renamingCatalogId={renamingCatalogId}
                                renamingCatalogName={renamingCatalogName}
                                setRenamingCatalogName={setRenamingCatalogName}
                                handleRenameCatalog={handleRenameCatalog}
                                handleDoubleClick={handleDoubleClick}
                                handlePreviewCatalog={handlePreviewCatalog}
                                handleEditCatalog={handleEditCatalog}
                                handleDeleteCatalog={handleDeleteCatalog}
                                setRenamingCatalogId={setRenamingCatalogId}
                            />
                        ))}
                    </List>
                    </Box>
                    {!menuCollapsed && (
                        <NewCatalogDialog
                            open={open}
                            newCatalogName={newCatalogName}
                            setNewCatalogName={setNewCatalogName}
                            handleAddCatalog={handleAddCatalog}
                            handleClose={handleClose}
                        />

)}
            </Grid>
                <Grid size={{ sm: menuCollapsed ? 11 : 9, xs: menuCollapsed ? 11 : 9 }} sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%', // give it full viewport height
                    overflow: 'hidden',
}} >
                {editingCatalogId && loadedCatalog && (
                            <CatalogEditor
                        key={'catalog/' + editingCatalogId}
                        catalog={ loadedCatalog }
                        setCatalog={ setCatalog }
                    /> 
                    )}
                    {previewingCatalogId && loadedCatalog && (
                        <CatalogPreview
                        key={'catalog/' + previewingCatalogId}
                            previewedCatalog={loadedCatalog}
                        />
                    )}
                </Grid>
            </Grid>
        </>
    );
};

export default Catalogs;
