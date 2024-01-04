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
} from '@mui/material';
import Editor from '../DesignEditor/Editor';
import { Design } from '../DesignEditor/Editor';


function fetchDesigns() {
const address = "http://localhost:8080/";
    //get data from db
    return (new Promise<string>((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", address + 'designs', true);
        xhr.withCredentials = true;
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
               // return JSON.parse(xhr.responseText);
              //  sessionStorage.setItem('designs', JSON.stringify(fetchedDesigns));
              //  setDbData(this.data);
                resolve(xhr.response);
            } else if (xhr.status !== 200) {
                reject(new Error('Error in fetching Designs'));
            }
        };
        xhr.onerror = () => reject(new Error('Error in fetching Designs'));

        xhr.send();
    }));

}
const Designs: React.FC = () => {
    const [designs, setDesigns] = useState<Design[]>([]);
    const [editingDesignId, setEditingDesignId] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const [newDesignName, setNewDesignName] = useState('');
    const [renamingDesignId, setRenamingDesignId] = useState<string | null>(null);
    const [renamingDesignName, setRenamingDesignName] = useState('');

    useEffect(() => {
        const storedDesigns = sessionStorage.getItem('designs');
        if (storedDesigns) {
            setDesigns(JSON.parse(storedDesigns));
            
        } else {
            const fetchDesignsFromDB = async () => {
                try {
                    const fetchedDesigns: string = await fetchDesigns();
                    const JSONfetchedDesigns: Design[] = JSON.parse(fetchedDesigns);
                    setDesigns(JSONfetchedDesigns);
                    // Store designs in session storage
                    sessionStorage.setItem('designs', fetchedDesigns);
                } catch (error) {
                    console.error('Error fetching designs:', error);
                }
            };

            fetchDesignsFromDB();
        }
    }, []);
    
    const handleEditDesign = (design: Design) => {
        setEditingDesignId(design._id);
        
        // Logic to display the editor UI for the selected design
        // Move designs list to the left to make room for the editor UI
    };

    const handleAddDesign = () => {
        // Logic to add a new design to the list
        const newDesign: Design = {
            _id: String('LocalDesign' + designs.length + 1),
            name: newDesignName,
            owner: 'LocalUser',
            designs: [],
            // Set other properties for the new design
        };
        const updatedDesigns = [...designs, newDesign];
        setDesigns(updatedDesigns);
        sessionStorage.setItem('designs', JSON.stringify(updatedDesigns));
        handleClose();
    };

    const handleDeleteDesign = (designId: string) => {
        // Logic to delete a design from the list

        const updatedDesigns = designs.filter((design) => design._id !== designId);
        setDesigns(updatedDesigns);
        sessionStorage.setItem('designs', JSON.stringify(updatedDesigns));
    };

     const handleRenameDesign = (designId: string, newName: string) => {
        const updatedDesigns = designs.map((design:Design) =>
            design._id === designId ? { ...design, name: newName } : design
        );
        setDesigns(updatedDesigns);
        sessionStorage.setItem('designs', JSON.stringify(updatedDesigns));
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
        <Grid container>
            <Grid item xs={3}>
                {/* Design List */}
                <List>
                    {designs.map((design: Design) => (
                        <ListItem key={'design ' + design._id}>
                            {renamingDesignId === design._id ? (
                                <TextField
                                    value={renamingDesignName}
                                    onChange={(e) => setRenamingDesignName(e.target.value)}
                                    onBlur={() => handleRenameDesign(design._id, renamingDesignName)}
                                    autoFocus
                                />
                            ) : (
                                    <span onDoubleClick={() => handleDoubleClick(design._id, design.name) }>{design.name}</span>
                            )}
                            
                            <Button onClick={() => handleEditDesign(design)}>Edit</Button>
                            <Button onClick={() => handleDeleteDesign(design._id)}>Delete</Button>
                            <Button onClick={() => { setRenamingDesignId(design._id); setRenamingDesignName(design.name); } }>Rename</Button>
                        
                        </ListItem>
                    ))}
                </List>
                {/* Button to add new design */}
                <Button onClick={() => setOpen(true)}>Add Design</Button>
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
            </Grid>
            <Grid item xs={9} >
                {editingDesignId !== null ? (
                    <Editor
                        key={'editor' + editingDesignId }
                        design={designs.find((design) => design._id === editingDesignId)}
                    />
                ) : null}
            </Grid>
    
        </Grid>
    );
};

export default Designs;