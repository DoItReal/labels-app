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
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { default as RenameIcon } from '@mui/icons-material/DriveFileRenameOutline';
import { default as CopyIcon } from '@mui/icons-material/ContentCopy';
import { default as NewIcon } from '@mui/icons-material/FiberNew';
import Editor from '../DesignEditor/Editor';
import { Design, NewDesign } from '../DB/Interfaces/Designs';
import { createNewDesign, deleteDesign } from '../DB/Remote/Designs';
import { getLocalDesigns, setLocalDesigns } from '../DB/LocalStorage/Designs';
import { ChevronLeft, ChevronRight, Label } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import CollectionsIcon from '@mui/icons-material/Collections';
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

const Designs: React.FC = () => {
    const [designs, setDesigns] = useState<Design[]>([]);
    const [editingDesignId, setEditingDesignId] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const [newDesignName, setNewDesignName] = useState('New Design');
    const [renamingDesignId, setRenamingDesignId] = useState<string | null>(null);
    const [renamingDesignName, setRenamingDesignName] = useState('');
    const [menuCollapsed, setMenuCollapsed] = useState(false);
    const classes = useStyles();

    const setDesign = (design: Design) => {
        const updatedDesigns = designs.map((d) => {
            if (d._id === design._id) {
                return design;
            }
            return d;
        });
        setDesigns(updatedDesigns);
    }
   
    useEffect(() => {
        const storedDesigns = getLocalDesigns();
        setDesigns(storedDesigns || []);
    }, []);
    
    const handleEditDesign = (design: Design) => {
        setEditingDesignId(design._id);
        setMenuCollapsed(true); // Move blocks list to the left to make room for the editor UI
        // Logic to display the editor UI for the selected design
        // Move blocks list to the left to make room for the editor UI
    };
    const toggleMenu = () => {
        setMenuCollapsed(!menuCollapsed);
    };
    /**
     IMPORTANT! ***!!!  TO DO: Error Check for existing name! !!!*** 
    **/
    const copyDesign = async (design: Design | Partial<Design>) => {
        delete design._id;
        const updatedDesign = { ...design, name: 'copy' + design.name } as NewDesign;
        try {
            const newDesign = await createNewDesign(updatedDesign);
            const updatedDesigns = [...designs, newDesign];
            setDesigns(updatedDesigns);
            setLocalDesigns(updatedDesigns);
        } catch (err) {
            console.log(err);
        }
        handleClose();
    }
    const handleAddDesign =async () => {
        // Logic to add a new design to the list
        const newDesign: NewDesign = {
            name: newDesignName,
            owner: 'LocalUser',
            canvas: {
                dim: { width: 200, height: 300 },
                border: 1,
                background: 'whitesmoke'
            },
            blocks: [],
            // Set other properties for the new design
        };
        const newSavedDesign = await createNewDesign(newDesign);
        const updatedDesigns = [...designs, newSavedDesign];
        
        setDesigns(updatedDesigns);
        setLocalDesigns(updatedDesigns);
        handleClose();
    };

    const handleDeleteDesign = (designId: string) => {
        // Logic to delete a design from the list
        deleteDesign(designId);
        const updatedDesigns = designs.filter((design) => design._id !== designId);
        setDesigns(updatedDesigns);
        setLocalDesigns(updatedDesigns);
    };

     const handleRenameDesign = (designId: string, newName: string) => {
        const updatedDesigns = designs.map((design:Design) =>
            design._id === designId ? { ...design, name: newName } : design
        );
        setDesigns(updatedDesigns);
        setLocalDesigns(updatedDesigns);
        setRenamingDesignId(null);
    };

    const handleClose = () => {
        setOpen(false);
    };
    
    const handleDoubleClick = (designId: string, designName: string) => {
        setRenamingDesignId(designId);
        setRenamingDesignName(designName);
    };

    return (
        <>
            <Grid container>
                <Grid item xs={menuCollapsed ? 1 : 3} sx={{ transitionDuration:'0.3s' }}>
                    {/* Button to toggle menu */}
                    <Grid item sx={{ border: "1px solid darkslategray", backgroundColor: "ghostwhite", }} >
                    <IconButton size="small" onClick={toggleMenu} className={classes.buttonStyle} title={menuCollapsed ? 'Expand' : 'Minimize'}>
                    {menuCollapsed ? <ChevronRight fontSize='small'/> : <ChevronLeft fontSize='small' />}
                        </IconButton>
                        <IconButton sx={{ color: "steelblue" }} size="large" title="Add New Design" onClick={() => setOpen(true)}><LibraryAddIcon fontSize="large" /></IconButton>
                        {!menuCollapsed ? <span style={{fontSize:'2rem', alignSelf: 'center', textAlign:'center',marginLeft:'10%' }}>Designs</span> : <></>}
                    </Grid>
                    {/* Button to add new design */}
                    {!menuCollapsed && (
                        <>
                         
                            {/* Dialog for adding a new design */}
                            <Dialog open={open} onClose={handleClose}>
                                <DialogTitle>Add New Design</DialogTitle>
                                <DialogContent>
                                    <TextField
                                        label="Design Name"
                                        value={newDesignName}
                                        onChange={(e) => setNewDesignName(e.target.value)}
                                    />
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleAddDesign}>Add</Button>
                                    <Button onClick={handleClose}>Cancel</Button>
                                </DialogActions>
                            </Dialog>
                        </>
                    )}
                {/* Design List */}
                <List>
                    {designs.map((design: Design, index) => (
                        <ListItem disablePadding key={'design ' + design._id} sx={{ borderBottom: "1px solid gray", background: index % 2 ? 'whitesmoke' : "white", borderRight: '1px solid darkslategray', paddingLeft:'2px' }}>
                            <Grid container alignContent="center" alignItems="center" textAlign="center">
                                
                            {renamingDesignId === design._id ? (
                                <TextField
                                    value={renamingDesignName}
                                    onChange={(e) => setRenamingDesignName(e.target.value)}
                                    onBlur={() => handleRenameDesign(design._id, renamingDesignName)}
                                    autoFocus
                                />
                            ) : (
                                    <span onDoubleClick={() => handleDoubleClick(design._id, design.name)} style={{
                                        fontSize: menuCollapsed ? '0.6rem' : '1rem',
                                    }}><CollectionsIcon fontSize="small" sx={{ color: 'steelblue', marginRight:'5px' }} />{design.name}</span>
                            )}
                            
                            {!menuCollapsed && (
                                <Grid item xs={6} sx={{ marginRight: "0", marginLeft: "auto", backgroundColor: index % 2 ? 'whitesmoke' : "white" }}>
                                    <IconButton title="Edit" color={"info"} onClick={() => handleEditDesign(design)}><EditIcon/></IconButton>
                                    <IconButton title="Delete" color={"warning"} onClick={() => handleDeleteDesign(design._id)}><DeleteForeverIcon /></IconButton>
                                    <IconButton title="Rename" color={"secondary"} onClick={() => { setRenamingDesignId(design._id); setRenamingDesignName(design.name); }}><RenameIcon /></IconButton>
                                    <IconButton title="Copy" color={"inherit"} onClick={() => copyDesign(design)}><CopyIcon/></IconButton>
                            </Grid>
                            )}
                        </Grid>
                        </ListItem>
                    ))}
                </List>
                
               
            </Grid>
                <Grid item sm={menuCollapsed ? 11 : 9} xs={menuCollapsed ? 11 : 9} >
                {editingDesignId !== null ? (
                    <Editor
                        key={'editor' + editingDesignId}
                        design={designs.find((design) => design._id === editingDesignId)}
                        setDesign={setDesign }
                    />
                ) : null}
            </Grid>
    
            </Grid>
        </>
    );
};

export default Designs;