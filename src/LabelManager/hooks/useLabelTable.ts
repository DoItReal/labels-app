import { useState } from "react";
import { labelDataType, isLabelDataType, isLabelDataTypeArray } from '../../DB/Interfaces/Labels';
import { createNewLabelDB, editLabelDB } from '../../DB/Remote/Labels';
import { editLabel } from '../../DB/LocalStorage/Labels';

export const useLabelTable = () => {
    const [labels, setLabels] = useState<labelDataType[]>([]);
    const [editLabels, setEditLabels] = useState<labelDataType[]>([]);
    const [editMode, setEditMode] = useState(false);

    const activeLabels = editMode ? editLabels : labels;
    const setActiveLabels = editMode ? setEditLabels : setLabels;

    const toggleEdit = () => setEditMode(!editMode);

    const updateLabel = async (label: labelDataType) => {
        try {
            const updatedLabel = await editLabelDB(label);
            if (isLabelDataType(updatedLabel)) {
                editLabel(updatedLabel);
            } else {
                console.error("Invalid label format after DB update");
            }
        } catch (err) {
            console.error("Update failed", err);
        }
    };

    const updateLabels = async (labels: labelDataType[]) => {
        for (const label of labels) await updateLabel(label);
    };

    const saveAll = async () => {
        const currentLabels:labelDataType[] = editMode ? editLabels : labels;

        // Check for edit mode and update labels accordingly
        if (editMode) {
            // If in edit mode, update labels directly
            await updateLabels(editLabels);
            return;
        }
        // If not in edit mode, we need to save new labels

        // Filter out labels that have no translations with name or description
        const modifiedLabels = currentLabels.filter(
            label => label.translations.some(t => t.name || t.description)
        );
        // Check if modifiedLabels is an array and has elements
        if (!modifiedLabels.length || !isLabelDataTypeArray(modifiedLabels)) return;
        // Save each label to the database
        for (const label of modifiedLabels) {
            try {
                await createNewLabelDB({
                    ...label,
                    owner: "",
                    translations: label.translations.map(t => ({
                        lang: t.lang,
                        name: t.name.trim(),
                        description: t.description.trim(),
                    }))
                });
            } catch (err) {
                console.error("Failed to save label", err, label);
            }
        }

        console.log("All labels saved");
    };

    return {
        labels,
        editLabels,
        setLabels,
        setEditLabels,
        editMode,
        toggleEdit,
        activeLabels,
        setActiveLabels,
        saveAll
    };
};