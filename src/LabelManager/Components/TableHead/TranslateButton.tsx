// TranslateButton.tsx
import React, { useState } from "react";
import { CircularProgress, IconButton, Tooltip } from "@mui/material";
import GTranslateIcon from "@mui/icons-material/GTranslate";
import { translateAllLabels } from "../../tools/translateLabels";
import { labelDataType } from "../../../DB/Interfaces/Labels";
interface Props {
    labels: labelDataType[];
    setLabels: React.Dispatch<React.SetStateAction<labelDataType[]>>;
    sourceLang: string;
    attr: "name" | "description";
}

const TranslateButton: React.FC<Props> = ({ labels, setLabels, sourceLang, attr }) => {
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState({ total: 0, current: 0 });
    const [errors, setErrors] = useState<string[]>([]);

    const handleTranslate = async () => {
        setErrors([]);
        setLoading(true);

        const { updatedLabels, errors } = await translateAllLabels(
            labels,
            sourceLang,
            attr,
            (current, total) => setProgress({ current, total })
        );

        setLabels(updatedLabels);
        setErrors(errors);
        setLoading(false);
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "start" }}>
            <Tooltip title={`Translate ${attr}`}>
                <IconButton onClick={handleTranslate} color="secondary" size="small">
                    {loading ? <CircularProgress size={20} /> : <GTranslateIcon fontSize="small" />}
                </IconButton>
            </Tooltip>
            {loading && (
                <div style={{ fontSize: "0.7rem" }}>
                    Translating {progress.current}/{progress.total}
                </div>
            )}
            {errors.length > 0 && (
                <div style={{ color: "red", fontSize: "0.75rem", marginTop: "4px" }}>
                    {errors.length} translation{errors.length > 1 ? "s" : ""} failed
                </div>
            )}
        </div>
    );
};

export default TranslateButton;