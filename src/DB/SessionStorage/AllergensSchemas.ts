import { IallergensSchema } from "../Interfaces/AllergensSchemas";

export const getLocalAllergensSchemas = (): IallergensSchema[] | null => {
    const storedAllergensSchemas = sessionStorage.getItem('allergensSchemas');
    if (storedAllergensSchemas) {
        return JSON.parse(storedAllergensSchemas);
    }else 
    return null;
}
export const setLocalAllergensSchemas = (allergensSchemas: IallergensSchema[]) => {
    sessionStorage.setItem('allergensSchemas', JSON.stringify(allergensSchemas));
}
export const addLocalAllergensSchema = (allergensSchema: IallergensSchema) => {
    const storedAllergensSchemas = getLocalAllergensSchemas();
    if (storedAllergensSchemas) {
        storedAllergensSchemas.push(allergensSchema);
        setLocalAllergensSchemas(storedAllergensSchemas);
    } else {
        setLocalAllergensSchemas([allergensSchema]);
    }
}
export const deleteLocalAllergensSchema = (id: string) => {
    const storedAllergensSchemas = getLocalAllergensSchemas();
    if (storedAllergensSchemas) {
        const updatedAllergensSchemas = storedAllergensSchemas.filter((a) => a._id !== id);
        setLocalAllergensSchemas(updatedAllergensSchemas);
    }
}