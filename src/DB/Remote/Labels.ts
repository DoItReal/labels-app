import { addLabel, deleteLabel, editLabel } from "../LocalStorage/Labels";
import { isLabelDataType, isLabelDataTypeArray, labelDataType } from "../Interfaces/Labels";
import { address } from './server';


export const fetchLabels = () => {
    //get data from db
    return (new Promise<labelDataType[]>((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", address + 'signs', true);
        xhr.withCredentials = true;
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200 || xhr.status === 304) {
                    const data = JSON.parse(xhr.responseText);
                    if (isLabelDataTypeArray(data)) {
                        resolve(data);
                    } else {
                        reject(new Error('Error in fetching Labels from DB! Data is not LabelDataType[]'));
                    }
                } else {
                    reject(new Error('Error in fetching Labels from DB' + xhr.status));
                }
            }
        };
        xhr.onerror = () => reject(new Error('Error in fetching Labels from DB' ));

        xhr.send();
    }));

}  
export const fetchLabelById = (id: string) => {
    //get data from db
    return (new Promise<labelDataType>((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", address + 'signs/' + id, true);
        xhr.withCredentials = true;
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200 || xhr.status === 304) {
                    const data = JSON.parse(xhr.responseText);
                    if (isLabelDataType(data))
                        resolve(data);
                    else
                        reject(new Error('Error in fetching Label! Data is not LabelDataType'));
                } else if (xhr.status !== 200) {
                    reject(new Error('Error in fetching Label'));
                }
            }
        };
        xhr.onerror = () => reject(new Error('Error in fetching Label'));

        xhr.send();
    }));
}
export const createNewLabelDB = (label: any) => {
    return (new Promise<labelDataType>((resolve, reject) => {
        //get data from localStorage
        let xhr = new XMLHttpRequest();
        xhr.open("POST", address + 'signs');
        xhr.withCredentials = true;
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const responseLabel = JSON.parse(xhr.responseText);
               /* old way of getting id
               let startIndex = xhr.responseText.search('_id') + 6;
                let endIndex = xhr.responseText.search('__v') - 3;
                let id = xhr.responseText.slice(startIndex, endIndex);
                */
               if(isLabelDataType(responseLabel))
                //add the new label to localStorage
                addLabel(responseLabel);
                resolve(responseLabel);
            } else if (xhr.status !== 200) {
                reject(new Error('Error in creating new Label'));
            }
        };
        xhr.send(JSON.stringify(label));
    }));
}
export const editLabelDB = (editedLabel: labelDataType) => {
    return (new Promise<labelDataType>((resolve, reject) => {
        const { _id, ...label } = editedLabel;
        let xhr = new XMLHttpRequest();
        xhr.open("PATCH", address + 'signs/' + _id);
        xhr.withCredentials = true;
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                // update Local Storage Data
                editLabel(editedLabel);
                resolve(JSON.parse(xhr.responseText));
            } else if (xhr.status !== 200) {
                reject(new Error('Error in Updating Label!'));
            }
        };
        xhr.send(JSON.stringify(label));
    }));
}
export const deleteLabelDB = (id: string) => {
    return (new Promise<string>((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open("DELETE", address + 'signs/' + id);
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                if (xhr.responseText === 'null')
                    reject(new Error('Error in deleting label'));
                else {
                    // update Local Storage Data
                    deleteLabel(id);
                    resolve('Label Deleted Succesfully');
                }
            } else if (xhr.status !== 200) {
                reject(new Error('Error in deleting Label!'));
            }
        };
        xhr.send();
    }));
}