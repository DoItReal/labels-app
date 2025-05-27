import { getLabels } from "../../../DB/LocalStorage/Labels";
import { Icatalog } from "../../../DB/Interfaces/Catalogs";
import { getCatalogs } from "../../../DB/SessionStorage/Catalogs";
import { labelDataType } from "../../../DB/Interfaces/Labels";
import { Button, Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useState } from "react";
import { SelectChangeEvent } from '@mui/material';

const CatalogSelection = ({ addLabels }:
    { addLabels: (labels: labelDataType | labelDataType[]) => void }) => {
    const [selectedCatalogId, setSelectedCatalogId] = useState<string>("");

    const handleSelect = (event: SelectChangeEvent) => {
        setSelectedCatalogId(event.target.value as string);
    };
    const catalogs = getCatalogs();

    const addCatalogLabels = () => {
        const selectedCatalog = catalogs?.[selectedCatalogId];
        if (!selectedCatalog) return;

        const allLabels = getLabels();
        const selectedLabels: labelDataType[] = selectedCatalog.labels
            .map((labelRef) => allLabels.find((l) => l._id === labelRef._id))
            .filter((l): l is labelDataType => Boolean(l));

        addLabels(selectedLabels);
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
                    {catalogs &&
                        Object.values(catalogs).map((catalog: Icatalog) => (
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