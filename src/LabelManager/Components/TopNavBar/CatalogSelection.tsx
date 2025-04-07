import { getLabels } from "../../../DB/LocalStorage/Labels";
import { Icatalog } from "../../../DB/Interfaces/Catalogs";
import { getCatalogs } from "../../../DB/SessionStorage/Catalogs";
import { labelDataType } from "../../../DB/Interfaces/Labels";
import Typography from "@mui/material/Typography/Typography";
import { Stack, Card, CardContent, Button, Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useState } from "react";
import { SelectChangeEvent } from '@mui/material';
const CatalogSelection = ({ addLabels }: { addLabels: (labels: labelDataType|labelDataType[]) => void }) => {
    const [selectedCatalogId, setSelectedCatalogId] = useState<string>("");

    const handleSelect = (event: SelectChangeEvent) => {
        setSelectedCatalogId(event.target.value as string);
    };
    const Catalogs = getCatalogs();

    const addCatalogLabels = () => {
        const selectedCatalog = Catalogs?.[selectedCatalogId];
        if (!selectedCatalog) return;

        const labelIds = selectedCatalog.labels.map((l) => l._id);
        const allLabels = getLabels();

        const labels: labelDataType[] = labelIds
            .map((id) => allLabels.find((l) => l._id === id))
            .filter((l): l is labelDataType => !!l);
        addLabels(labels);
    };


    return (
        <Box display="flex" alignItems="center" sx={{ minWidth: 300 }} gap={2 }>
            <FormControl fullWidth>
                <InputLabel id="catalog-select-label">Choose Catalog</InputLabel>
                <Select
                    labelId="catalog-select-label"
                    value={selectedCatalogId}
                    onChange={handleSelect}
                    label="Choose Catalog"
                >
                    {Catalogs &&
                        Object.values(Catalogs).map((catalog: Icatalog) => (
                            <MenuItem key={catalog._id} value={catalog._id}>
                                {catalog.name}
                            </MenuItem>
                        ))}
                </Select>
            </FormControl>

            <Button
                variant="contained"
                onClick={addCatalogLabels}
                disabled={!selectedCatalogId}
                sx={{ alignSelf: 'flex-start', mt: '8px' }} 
            >
                Add Labels
            </Button>
        </Box>
    );
};

export default CatalogSelection;