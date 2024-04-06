import { Design, isDesignArray } from "../Interfaces/Designs";

//return the blocks from session storage as Design[] or null
export const getLocalDesigns = (): Design[] | null => {
    return JSON.parse(sessionStorage.getItem('designs') || '[]');
}

export const setLocalDesigns = (designs: Design[]) => {
    sessionStorage.setItem('designs', JSON.stringify(designs));
}
export const updateLocalDesign = (design: Design) => {
    const storedDesigns = getLocalDesigns();
    if (storedDesigns && isDesignArray(storedDesigns)) {
        const updatedDesigns = storedDesigns.map(designItem => {
            if (designItem._id === design._id) {
                return design;
            } else {
                return designItem;
            }
        });
        setLocalDesigns(updatedDesigns);
    }
}