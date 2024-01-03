import React, { useEffect, useState } from 'react';
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

interface Design {
    id: number;
    name: string;
    // Add other design properties as needed
}

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
    const [editingDesign, setEditingDesign] = useState<Design | null>(null);
    const [open, setOpen] = useState(false);
    const [newDesignName, setNewDesignName] = useState('');
    const [renamingDesignId, setRenamingDesignId] = useState<number | null>(null);
    const [renamingDesignName, setRenamingDesignName] = useState('');

    useEffect(() => {
        const storedDesigns = sessionStorage.getItem('designs');
        if (storedDesigns) {
            setDesigns(JSON.parse(storedDesigns));
        } else {
            const fetchDesignsFromDB = async () => {
                try {
                    console.log('try');
                    // Simulating fetching designs from a database using an API call
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
        setEditingDesign(design);
        // Logic to display the editor UI for the selected design
        // Move designs list to the left to make room for the editor UI
    };

    const handleAddDesign = () => {
        // Logic to add a new design to the list
        const newDesign: Design = {
            id: designs.length + 1,
            name: newDesignName,
            // Set other properties for the new design
        };
        const updatedDesigns = [...designs, newDesign];
        setDesigns(updatedDesigns);
        sessionStorage.setItem('designs', JSON.stringify(updatedDesigns));
        handleClose();
    };

    const handleDeleteDesign = (designId: number) => {
        // Logic to delete a design from the list

        const updatedDesigns = designs.filter((design) => design.id !== designId);
        setDesigns(updatedDesigns);
        sessionStorage.setItem('designs', JSON.stringify(updatedDesigns));
    };

     const handleRenameDesign = (designId: number, newName: string) => {
        const updatedDesigns = designs.map((design) =>
            design.id === designId ? { ...design, name: newName } : design
        );
        setDesigns(updatedDesigns);
        sessionStorage.setItem('designs', JSON.stringify(updatedDesigns));
        setRenamingDesignId(null);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleDoubleClick = (designId: number, designName: string) => {
        setRenamingDesignId(designId);
        setRenamingDesignName(designName);
    };

    return (
        <Grid container>
            <Grid item xs={5}>
                {/* Design List */}
                <List>
                    {designs.map((design) => (
                        <ListItem key={design.id}>
                            {renamingDesignId === design.id ? (
                                <TextField
                                    value={renamingDesignName}
                                    onChange={(e) => setRenamingDesignName(e.target.value)}
                                    onBlur={() => handleRenameDesign(design.id, renamingDesignName)}
                                />
                            ) : (
                                    <span onDoubleClick={() => { setRenamingDesignId(design.id); setRenamingDesignName(design.name); } }>{design.name}</span>
                            )}
                            
                            <Button onClick={() => handleEditDesign(design)}>Edit</Button>
                            <Button onClick={() => handleDeleteDesign(design.id)}>Delete</Button>
                            <Button onClick={() => { setRenamingDesignId(design.id); setRenamingDesignName(design.name); } }>Rename</Button>
                        
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
            <Grid item xs={7}>
                {/* Editor UI (your existing implementation) */}
                {/* Display editor for the selected design */}
            </Grid>
    
        </Grid>
    );
};

export default Designs;