import { NewDesign, Design} from "../Interfaces/Designs";
const address = "http://localhost:8080/";
export const createNewDesign = (design: NewDesign) => {
    return (new Promise<Design>((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", address + 'designs');
        xhr.withCredentials = true;
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                resolve(JSON.parse(xhr.responseText));
            } else if (xhr.status !== 200) {
                reject(new Error('Error in saving new Design'));
            }
        };
        xhr.send(JSON.stringify(design));
    }));
}
export const updateDesign = (design: Design) => {
    return (new Promise<Design>((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open("PATCH", address + 'designs/' + design._id);
        xhr.withCredentials = true;
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                resolve(design);
            } else if (xhr.status !== 200) {
                reject(new Error('Error in saving new Design'));
            }
        };
        xhr.send(JSON.stringify(design));
    }));
}
export function fetchDesigns() {
    //get data from db
    return (new Promise<Design[]>((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", address + 'designs', true);
        xhr.withCredentials = true;
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                resolve(JSON.parse(xhr.responseText));
            } else if (xhr.status !== 200) {
                reject(new Error('Error in fetching Designs'));
            }
        };
        xhr.onerror = () => reject(new Error('Error in fetching Designs'));

        xhr.send();
    }));

}
export const deleteDesign = (designId: string) => {
    return (new Promise<string>((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open("DELETE", address + 'designs/' + designId);
        xhr.withCredentials = true;
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                resolve(designId);
            } else if (xhr.status !== 200) {
                reject(new Error('Error in deleting Design'));
            }
        };
        xhr.send();
    }));
}
