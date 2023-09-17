import { Box, Chip, FormControl, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent } from '@mui/material';
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};
export function Category({ filterCategory, setFilterCategory }: { filterCategory: string[], setFilterCategory: (arg:string[])=>void}) {
    var allCategories: Array<string> = ["all", "Salads", "Soups", "Breakfast", "Vegan", "Fish", "Pork", "Chicken", "Pasta", "Rice", "Oriental Night", "BG Night"];

    const handleChange = (event: SelectChangeEvent<typeof filterCategory>) => {
        const {
            target: { value },
        } = event;
        setFilterCategory(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    return (
        <FormControl size="small" sx={{ m: 1, width: '100%', display:'flex', flexWrap:'wrap' }}>
            <InputLabel id="demo-multiple-chip-label">Category</InputLabel>
            <Select
                labelId="demo-multiple-chip-label"
                id="demo-multiple-chip"
                multiple
                value={filterCategory}
                onChange={handleChange}
                input={<OutlinedInput id="select-multiple-chip" label="Category" />}
                renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                            <Chip key={value} label={value} />
                        ))}
                    </Box>
                )}
                MenuProps={MenuProps}
            >
                {allCategories.map((category) => (
                    <MenuItem
                        key={category}
                        value={category}
                    >
                        {category}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}