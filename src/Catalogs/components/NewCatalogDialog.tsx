// NewCatalogDialog.tsx
import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Button,
} from '@mui/material';

interface NewCatalogDialogProps {
    open: boolean;
    newCatalogName: string;
    setNewCatalogName: (name: string) => void;
    handleAddCatalog: () => void;
    handleClose: () => void;
}

const NewCatalogDialog: React.FC<NewCatalogDialogProps> = ({
    open,
    newCatalogName,
    setNewCatalogName,
    handleAddCatalog,
    handleClose,
}) => (
    <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Catalog</DialogTitle>
        <DialogContent>
            <TextField
                label="Catalog Name"
                value={newCatalogName}
                onChange={(e) => setNewCatalogName(e.target.value)}
                fullWidth
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={handleAddCatalog}>Add</Button>
            <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
    </Dialog>
);

export default NewCatalogDialog;
