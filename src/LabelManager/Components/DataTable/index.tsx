import { TableCell, TableRow } from '@mui/material';
import { labelDataType } from '../../../DB/Interfaces/Labels';
import LabelRow from './LabelRow';
import { useRef } from 'react';

const DataTable = ({ labels,removeLabel, selectedLanguages, handleTranslationChange, handleAllergensChange, handleCategoryChange }: { labels: labelDataType[],removeLabel:(label:string)=>void, selectedLanguages: string[], handleTranslationChange: (labelId: string, lang: string,
    field: "name" | "description",
    value: string) => void, handleAllergensChange: (labelId: string, allergens: number[]) => void, handleCategoryChange: (labelId: string, categories: string[]) => void
}) => {
    
    const rowRefs = useRef<{ [rowIndex: number]: (HTMLInputElement | null)[] }>({});

    if (labels.length === 0) {
        return <TableRow><TableCell>No labels available</TableCell></TableRow>;  // Placeholder for empty state
    }
    return (
        <>
  {
        labels.map((label, rowIndex) => (
            <LabelRow
                key={"labelRow"+label._id}
                label={label}
                removeLabel={removeLabel}
                selectedLanguages={selectedLanguages}
                handleTranslationChange={handleTranslationChange}
                handleAllergensChange={handleAllergensChange}
                handleCategoryChange={handleCategoryChange}
                rowIndex={rowIndex}
                rowRefs={rowRefs}
            />
        ))
    }
                    
    </>)
};

export default DataTable;