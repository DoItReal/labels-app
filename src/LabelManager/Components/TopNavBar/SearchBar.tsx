import { useState } from 'react';
import { Autocomplete, Badge, Box, IconButton, TextField } from "@mui/material";
import Grid from '@mui/material/Grid2';
import { labelDataType } from "../../../DB/Interfaces/Labels";
import { getLabels } from "../../../DB/LocalStorage/Labels";
import SendIcon from '@mui/icons-material/Send';


export const SearchBar = ({ addLabels }: { addLabels: (label: labelDataType|labelDataType[]) => void }) => {
    const [selectedLabels, setSelectedLabels] = useState<labelDataType[]>([]);
    const [addedLabels, setAddedLabels] = useState<labelDataType[]>([]);

    // Fetch all labels but exclude those that were already submitted
    const availableLabels = getLabels().reverse().filter(label => !addedLabels.some(added => added._id === label._id));

    const handleAddLabels = (labelsArr: any[]) => {
        // const updatedSelectedLabels = [...selectedLabels];
        if (selectedLabels.length === 0) {
            setSelectedLabels(labelsArr);
            return;
        }
        const labelCountMap = new Map<string, number>(); // Map to store label counts

        // Count the number of times each label is selected
        labelsArr.forEach(label => {
            const labelId = label._id;
            labelCountMap.set(labelId, (labelCountMap.get(labelId) || 0) + 1);
        });
        // Filter out labels that are selected an odd number of times
        const updatedSelectedLabels = labelsArr.filter((label) => {
            const labelId = label._id;
            const labelCount = labelCountMap.get(labelId) || 0;

            // If the label is selected an odd number of times, keep it in selectedLabels
            if (labelCount >= 1) {
                let count = labelCount % 2 === 0 ? 0 : 1;
                labelCountMap.set(labelId, count); // Decrease count by 1
                return labelCount % 2 === 0 ? false : true; // Keep label in selectedLabels
            }

            return false; // Remove label from selectedLabels
        });
        setSelectedLabels(updatedSelectedLabels);
    };

    const handleSubmit = () => {
        if (selectedLabels.length === 0) return;

        addLabels(selectedLabels);
        setAddedLabels(prev => [...prev, ...selectedLabels]); // Add to the exclusion list after submission
        setSelectedLabels([]); // Clear selection after submitting
    }
    return (
        <Grid container sx={{ width: '100%', display: 'flex', flexDirection: 'center', flex: 'center' }}>
            <Grid size={{ xs: 6 }} >
                <Box>
                    <Autocomplete
                        multiple
                        id="combo-box-demo"
                        options={availableLabels}
                        limitTags={5}
                        disableCloseOnSelect
                        getOptionLabel={(option) => {
                            const opt = option.translations.find((el: any) => el.lang === 'bg');
                            return opt ? opt.name : '';
                        }}
                        renderInput={(params) => <TextField {...params} label="Select Label/s" />}
                        value={selectedLabels }
                        onChange={(event, value) => handleAddLabels(value)}
                        renderOption={(props, option, { selected }) => (
                            <li {...props} style={{
                                backgroundColor: selectedLabels.some(label => label._id === option._id) ? 'lightblue' : 'inherit',
                                border: selectedLabels.some(label => label._id === option._id) ? '1px dotted black' : 'inherit',
                            }}>
                                {option.translations.find((el: any) => el.lang === 'bg')?.name}
                            </li>
                        )}
                    />
                </Box>
            </Grid>
            <Grid size={{ xs: 1 }}>
                <Box>
                    <IconButton onClick={handleSubmit}>
                        <Badge badgeContent={selectedLabels.length} color="primary">
                            <SendIcon />
                        </Badge>
                    </IconButton>
                </Box>
            </Grid>
        </Grid>
    );
};
export default SearchBar;
