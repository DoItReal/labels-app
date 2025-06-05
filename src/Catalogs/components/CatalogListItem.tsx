// CatalogListItem.tsx
import React from 'react';
import {
    Grid,
    IconButton,
    ListItem,
    TextField,
} from '@mui/material';
import {
    Edit as EditIcon,
    DeleteForever as DeleteForeverIcon,
    DriveFileRenameOutline as RenameIcon,
    Visibility as VisibilityIcon,
    FeaturedPlayList as FeaturedPlayListIcon,
} from '@mui/icons-material';

interface CatalogListItemProps {
    catalog: any;
    index: number;
    menuCollapsed: boolean;
    renamingCatalogId: string | null;
    renamingCatalogName: string;
    setRenamingCatalogName: (name: string) => void;
    handleRenameCatalog: (id: string, name: string) => void;
    handleDoubleClick: (id: string, name: string) => void;
    handlePreviewCatalog: (catalog: any) => void;
    handleEditCatalog: (catalog: any) => void;
    handleDeleteCatalog: (id: string) => void;
    setRenamingCatalogId: (id: string | null) => void;
}

const CatalogListItem: React.FC<CatalogListItemProps> = ({
    catalog,
    index,
    menuCollapsed,
    renamingCatalogId,
    renamingCatalogName,
    setRenamingCatalogName,
    handleRenameCatalog,
    handleDoubleClick,
    handlePreviewCatalog,
    handleEditCatalog,
    handleDeleteCatalog,
    setRenamingCatalogId,
}) => (
    <ListItem
        disablePadding
        key={catalog._id}
        sx={(theme) => ({
            borderBottom: `1px solid ${theme.palette.divider}`,
            background: index % 2 ? theme.palette.background.default : theme.palette.background.paper,
            borderRight: `1px solid ${theme.palette.divider}`,
            paddingLeft: '2px',
        })}
    >
        {renamingCatalogId === catalog._id ? (
            <TextField
                value={renamingCatalogName}
                onChange={(e) => setRenamingCatalogName(e.target.value)}
                onBlur={() => handleRenameCatalog(catalog._id, renamingCatalogName)}
                autoFocus
            />
        ) : (
            <span
                onDoubleClick={() => handleDoubleClick(catalog._id, catalog.name)}
                style={{ fontSize: menuCollapsed ? '0.6rem' : '1rem' }}
            >
                <FeaturedPlayListIcon fontSize="small" sx={{ color: 'orange', marginRight: '5px' }} />
                {catalog.name}
            </span>
        )}

        {!menuCollapsed && (
            <Grid item xs={6} sx={{ marginLeft: 'auto', backgroundColor: 'inherit' }}>
                <IconButton title="Preview" color="info" onClick={() => handlePreviewCatalog(catalog)}>
                    <VisibilityIcon />
                </IconButton>
                <IconButton title="Edit" color="info" onClick={() => handleEditCatalog(catalog)}>
                    <EditIcon />
                </IconButton>
                <IconButton title="Delete" color="warning" onClick={() => handleDeleteCatalog(catalog._id)}>
                    <DeleteForeverIcon />
                </IconButton>
                <IconButton title="Rename" color="secondary" onClick={() => {
                    setRenamingCatalogId(catalog._id);
                    setRenamingCatalogName(catalog.name);
                }}>
                    <RenameIcon />
                </IconButton>
            </Grid>
        )}
    </ListItem>
);

export default CatalogListItem;
