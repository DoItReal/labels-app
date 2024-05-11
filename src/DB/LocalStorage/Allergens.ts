import { IallergensMap } from "../Interfaces/Allergens";

export const getLocalAllergens = (): IallergensMap[] | null => {
    const storedAllergens = localStorage.getItem('allergens');
    if (storedAllergens) {
        return JSON.parse(storedAllergens);
    }
    return null;
}
export const setLocalAllergens = (allergens: IallergensMap[]) => {
    localStorage.setItem('allergens', JSON.stringify(allergens));
}
export const addLocalAllergen = (allergen: IallergensMap) => {
    const storedAllergens = getLocalAllergens();
    if (storedAllergens) {
        storedAllergens.push(allergen);
        setLocalAllergens(storedAllergens);
    } else {
        setLocalAllergens([allergen]);
    }
}
export const deleteLocalAllergen = (id: string) => {
    const storedAllergens = getLocalAllergens();
    if (storedAllergens) {
        const updatedAllergens = storedAllergens.filter((allergen) => allergen._id !== id);
        setLocalAllergens(updatedAllergens);
    }
}