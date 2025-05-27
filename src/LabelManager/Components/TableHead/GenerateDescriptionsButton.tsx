import React, { useState } from "react";
import {
    CircularProgress,
    IconButton,
    Tooltip
} from "@mui/material";
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { labelDataType } from '../../../DB/Interfaces/Labels';
import { generateDescriptionsForLabels } from "../../tools/generateDescriptions";

const DescriptionGenerator = ({
    labels,
    setLabels,
    sourceLang,
}: {
    labels: labelDataType[];
    setLabels: (labels: labelDataType[]) => void;
    sourceLang: string;
}) => {
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState({ total: 0, current: 0 });
    const [errors, setErrors] = useState<string[]>([]);

    const handleGenerate = async () => {
        setErrors([]);
        setLoading(true);

        const { updatedLabels, errors } = await generateDescriptionsForLabels(
            labels,
            sourceLang,
            (current, total) => setProgress({ current, total })
        );

        setLabels(updatedLabels);
        setErrors(errors);
        setLoading(false);
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "start" }}>
            <Tooltip title="Generate Description">
                <IconButton onClick={handleGenerate} color="primary" size="small">
                    {loading ? <CircularProgress size={20} /> : <SmartToyIcon fontSize="small" />}
                </IconButton>
            </Tooltip>
            {loading && (
                <div style={{ fontSize: "0.7rem" }}>
                    Generating {progress.current}/{progress.total}
                </div>
            )}
            {errors.length > 0 && (
                <div style={{ color: "red", fontSize: "0.75rem", marginTop: "4px" }}>
                    {errors.length} generation{errors.length > 1 ? "s" : ""} failed
                </div>
            )}
        </div>
    );
};

export default DescriptionGenerator;
