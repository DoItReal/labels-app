import { formatDate } from '../../tools/helpers';
import { debounce } from 'lodash';
import { Button, Input, InputLabel } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { IloadedCatalog } from '../../DB/Interfaces/Catalogs';
import Grid from '@mui/material/Grid2';

interface InfoBarProps {
    catalog: IloadedCatalog;
    saveCatalog?: () => void;
    updateCatalog?: (catalog: IloadedCatalog) => void;
}

const InfoBar = ({
    catalog,
    saveCatalog,
    updateCatalog,
}: InfoBarProps) => {
    const [name, setName] = useState(catalog.name);

    useEffect(() => {
        setName(catalog.name);
    }, [catalog.name]);

    const handleNameChange = useMemo(() =>
        debounce((newValue: string) => {
            if (updateCatalog) {
                updateCatalog({ ...catalog, name: newValue });
            }
        }, 1000), [catalog, updateCatalog]);

    const isEditable = updateCatalog;

    return (
        <Grid container spacing={1} style={{ marginTop: 5, minWidth: '100%', height: '100%' }}>
            <Grid>
                <InputLabel>Catalog Name</InputLabel>
                <Input
                    type="text"
                    placeholder="Catalog Name"
                    size="medium"
                    value={isEditable ? name : catalog.name}
                    disabled={!isEditable}
                    onChange={(e) => {
                        if (!isEditable) return;
                        setName(e.target.value);
                        handleNameChange(e.target.value);
                    }}
                />
            </Grid>
            <Grid>
                <InputLabel>Created At</InputLabel>
                <Input value={formatDate(catalog.date)} disabled />
            </Grid>
            <Grid>
                <InputLabel>Size</InputLabel>
                <Input value={catalog.size} disabled />
            </Grid>
            {saveCatalog && (
                <Grid>
                    <Button variant="contained" color="primary" onClick={saveCatalog}>
                        Save
                    </Button>
                </Grid>
            )}
        </Grid>
    );
};

export default InfoBar;