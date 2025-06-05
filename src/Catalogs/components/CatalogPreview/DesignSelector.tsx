import { InputLabel, Select, MenuItem } from "@mui/material";
import { useState, useEffect } from "react";
import { Design, isDesign, isDesignArray } from "../../../DB/Interfaces/Designs";
import { getLocalDesigns } from "../../../DB/LocalStorage/Designs";

const DesignSelector = ({ design, setDesign }: { design: Design | null; setDesign: (design: Design) => void }) => {
    const [designs, setDesigns] = useState<Design[]>([]);

    const updateDesign = (id: string) => {
        // Find the design with the selected id
        const selectedDesign = designs.find((design) => design._id === id);
        if (selectedDesign && isDesign(selectedDesign)) {
            setDesign(selectedDesign);
        }
    };
    const initDesigns = () => {
        const fetchedDesigns = getLocalDesigns();
        if (fetchedDesigns && isDesignArray(fetchedDesigns)) {

            setDesigns(fetchedDesigns);
            setDesign(fetchedDesigns[0]);
        }
    }
    useEffect(() => {
        // Fetch designs from session storage on component mount
        initDesigns();
    }, []);

    if (!designs.length || !isDesignArray(designs)) {
        return null;
    }

    return (
        <>
            <InputLabel>Design</InputLabel>
            <Select value={design ? design._id : designs[0]._id} size="small" onChange={(e) => updateDesign(e.target.value)}>
                {designs.map((design) => (
                    <MenuItem key={design._id} value={design._id}>
                        {design.name}
                    </MenuItem>
                ))}
            </Select>
        </>
    );
};

export default DesignSelector;