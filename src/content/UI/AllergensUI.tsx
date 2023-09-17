import { useRef, ReactNode } from 'react';
import { png } from '../../labels';
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
    const currentValue = useRef<string[]>([]);
    const didMount = useRef(false);
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
        var Arr:number[] = [];
        for (const elem of value) {
            allAllergensNames.forEach((val, key) => {
                if (elem === val) {
                   let allergen = key;
                    if (allergen !== null) Arr.push(allergen);
                }
            });
        }
        setCurrentAllergens(Arr);                         
        currentValue.current = typeof value === 'string' ? value.split(',') : value
    };

    if (currentAllergens.length > 0 && !didMount.current) {
        for (const allergen of currentAllergens) {
            let val = allAllergensNames.get(allergen);
            if(val) currentValue.current.push(val);
        };
        didMount.current = true;
    } 
   
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
        <FormControl size="small" sx={{ m: 1, width: '100%' }}>
            <InputLabel id="demo-multiple-chip-label">Allergens</InputLabel>
            <Select
                labelId="demo-multiple-chip-label"
                id="demo-multiple-chip"
                multiple
                value={currentValue.current}
                onChange={handleChange}
                input={<OutlinedInput id="select-multiple-chip" label="Allergens" />}
                renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                            <Chip key={value} label={value} />
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


