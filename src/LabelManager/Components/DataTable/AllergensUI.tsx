import { ReactNode, useEffect, useState } from 'react';
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
export function Allergens({ currentAllergens, setCurrentAllergens }: { currentAllergens: number[], setCurrentAllergens: (arg:number[])=>void }) {
    const [currentValue, setCurrentValue] = useState<string[]>([]);
    var allAllergensNames: Map<number, string> = new Map([
        [1, "Gluten"],
        [2, "Celery"],
        [3, "Peanuts"],
        [4, "Lupin"],
        [5, "Soya"],
        [6, "Eggs"],
        [7, "Molluscs"],
        [8, "Lactose"],
        [9, "Nuts"],
        [10, "Sulphur Dioxide"],
        [11, "Sesame"],
        [12, "Fish"],
        [13, "Crustaceans"],
        [14, "Mustard"],
        [15, "Mushrooms"]
    ]);
    
    const handleChange = (event: SelectChangeEvent<string[]>) => {
        const {
            target: { value },
        } = event;

        const selectedAllergenNames = typeof value === 'string' ? value.split(',') : value;

        const allergenIds: number[] = [];

        for (const name of selectedAllergenNames) {
            allAllergensNames.forEach((val, key) => {
                if (name === val && !allergenIds.includes(key)) {
                    allergenIds.push(key);
                }
            });
        }

        setCurrentAllergens([...allergenIds]);
        setCurrentValue(selectedAllergenNames);
    };
    // if currentAllergens is not empty and didMount is false
    useEffect(() => {
        const names: string[] = [];
        for (const id of currentAllergens) {
            const name = allAllergensNames.get(id);
            if (name) names.push(name);
        }
        setCurrentValue(names);
    }, [currentAllergens]);
   
    const MenuItems:ReactNode[] = [];
     allAllergensNames.forEach((value, key) => {
         MenuItems.push(<MenuItem
             key={key}
             value={value}
         >
             {value}
         </MenuItem>);
    });
    return (
        <FormControl size="small" sx={{ m: 1, minWidth: '10em', maxWidth:'20em' }}>
            <InputLabel id="demo-multiple-chip-label">Allergens</InputLabel>
            <Select
                labelId="demo-multiple-chip-label"
                id="demo-multiple-chip"
                multiple
                value={currentValue}
                onChange={handleChange}
                input={<OutlinedInput id="select-multiple-chip" label="Allergens" />}
                renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.1 }}>
                        {selected.map((value) => (
                            <Chip key={value} label={value} size='small' sx={{ bgcolor: 'steelblue' }} />
                        ))}
                    </Box>
                )}
                MenuProps={MenuProps}
            >
                {MenuItems }
            </Select>
        </FormControl>
    );
}


