import { IallergensMap, InewAllergen, isIallergensMap, isIallergensMapArray } from "../Interfaces/Allergens";
import { addLocalAllergen, deleteLocalAllergen } from "../LocalStorage/Allergens";
import { address } from "./server";
export const fetchAllergens = () => {
    //get data from db
    return (new Promise<IallergensMap[]>((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", address + 'allergens', true);
        xhr.withCredentials = true;
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200 || xhr.status === 304) {
                    const data = JSON.parse(xhr.responseText);
                    if (isIallergensMapArray(data)) {
                        resolve(data);
                    } else {
                        reject(new Error('Error in fetching Allergens from DB! Data is not IallergensMap[]'));
                    }
                } else {
                    reject(new Error('Error in fetching Allergens from DB' + xhr.status));
                }
            }
        };
        xhr.onerror = () => reject(new Error('Error in fetching Allergens from DB'));

        xhr.send();
    }));

}
export const createNewAllergenDB = (allergen: InewAllergen) => {
    return (new Promise<IallergensMap>((resolve, reject) => {
        //get data from localStorage
        let xhr = new XMLHttpRequest();
        xhr.open("POST", address + 'allergens');
        xhr.withCredentials = true;
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const responseAllergen = JSON.parse(xhr.responseText);
                if (isIallergensMap(responseAllergen))
                    //add the new label to localStorage
                    addLocalAllergen(responseAllergen);
                resolve(responseAllergen);
            } else if (xhr.status !== 200) {
                reject(new Error('Error in creating new Allergen'));
            }
        };
        xhr.send(JSON.stringify(allergen));
    }));
}
export const deleteAllergenDB = (id: string) => {
    return (new Promise<string>((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open("DELETE", address + 'allergens/' + id);
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                if (xhr.responseText === 'null')
                    reject(new Error('Error in deleting allergen'));
                else {
                    // update Local Storage Data
                    deleteLocalAllergen(id);
                    resolve('Allergen Deleted Succesfully');
                }
            } else if (xhr.status !== 200) {
                reject(new Error('Error in deleting Allergen!'));
            }
        };
        xhr.send();
    }));
}
export const editAllergenDB = (editedAllergen: any) => {
    return (new Promise<IallergensMap>((resolve, reject) => {
        const { _id } = editedAllergen;
        let xhr = new XMLHttpRequest();
        xhr.open("PATCH", address + 'allergens/' + _id);
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                // update Local Storage Data
                resolve(JSON.parse(xhr.responseText));
            } else if (xhr.status !== 200) {
                reject(new Error('Error in Updating Allergen!'));
            }
        };
        xhr.send(JSON.stringify(editedAllergen));
    }));
}