import { IallergensSchema, IallergensSchemaDB, isIallergensSchema, isIallergensSchemasArray } from "../Interfaces/AllergensSchemas";
import { addLocalAllergensSchema, deleteLocalAllergensSchema } from "../SessionStorage/AllergensSchemas";
import { address } from "./server";
export const fetchAllergensSchemas = () => {
    //get data from db
    return (new Promise<IallergensSchema[]>((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", address + 'allergensschema', true);
        xhr.withCredentials = true;
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200 || xhr.status === 304) {
                    const data = JSON.parse(xhr.responseText);
                    if (isIallergensSchemasArray(data)) {
                        resolve(data);
                    } else {
                        reject(new Error('Error in fetching AllergensSchema from DB! Data is not IallergensSchema[]'));
                    }
                } else {
                    reject(new Error('Error in fetching AllergensSchema from DB' + xhr.status));
                }
            }
        };
        xhr.onerror = () => reject(new Error('Error in fetching AllergensSchema from DB'));

        xhr.send();
    }));

}
export const createNewAllergensSchemaDB = (allergensSchema: IallergensSchemaDB) => {
    return (new Promise<IallergensSchema>((resolve, reject) => {
        //get data from localStorage
        let xhr = new XMLHttpRequest();
        xhr.open("POST", address + 'allergensschema');
        xhr.withCredentials = true;
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const responseAllergensSchema = JSON.parse(xhr.responseText);
                if (isIallergensSchema(responseAllergensSchema))
                    //add the new label to localStorage
                    addLocalAllergensSchema(responseAllergensSchema);
                resolve(responseAllergensSchema);
            } else if (xhr.status !== 200) {
                reject(new Error('Error in creating new AllergenSchema'));
            }
        };
        xhr.send(JSON.stringify(allergensSchema));
    }));
}
export const deleteAllergensSchemaDB = (id: string) => {
    return (new Promise<string>((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open("DELETE", address + 'allergensschema/' + id);
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                if (xhr.responseText === 'null')
                    reject(new Error('Error in deleting allergensSchema'));
                else {
                    // update Local Storage Data
                    deleteLocalAllergensSchema(id);
                    resolve('AllergensSchema Deleted Succesfully');
                }
            } else if (xhr.status !== 200) {
                reject(new Error('Error in deleting AllergensSchema!'));
            }
        };
        xhr.send();
    }));
}
export const editAllergensSchemaDB = (editedAllergensSchema: any) => {
    return (new Promise<IallergensSchema>((resolve, reject) => {
        const { _id } = editedAllergensSchema;
        let xhr = new XMLHttpRequest();
        xhr.open("PATCH", address + 'allergensschema/' + _id);
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.withCredentials = true;
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                // update Local Storage Data
                resolve(JSON.parse(xhr.responseText));
            } else if (xhr.status !== 200) {
                reject(new Error('Error in Updating AllergensSchema!'));
            }
        };
        xhr.send(JSON.stringify(editedAllergensSchema));
    }));
}