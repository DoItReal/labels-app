import { labelDataType } from '../../DB/Interfaces/Labels';
import LabelRow from './DataTableComponents/LabelRow';
import { useRef } from 'react';

const DataTable = ({ labels, selectedLanguages, handleTranslationChange, handleAllergensChange, handleCategoryChange }: { labels: labelDataType[], selectedLanguages: string[], handleTranslationChange: (labelId: string, lang: string,
    field: "name" | "description",
    value: string) => void, handleAllergensChange: (labelId: string, allergens: number[]) => void, handleCategoryChange: (labelId: string, categories: string[]) => void
}) => {
    
    const rowRefs = useRef<{ [rowIndex: number]: (HTMLInputElement | null)[] }>({});

    if (labels.length === 0) {
        return <div>No labels available</div>;  // Placeholder for empty state
    }
    return (
        <>
  {
        labels.map((label, rowIndex) => (
            <LabelRow
                key={label._id}
                label={label}
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