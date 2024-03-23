//To be removed the storing function from here and to be added to the local storage implemented in the browser
//Will include just functionality for manipulating that data

import { findIndexByProperty } from './tools/helpers';

export interface labelDataType {
    _id: string,
    allergens: Array<number>,
    category: Array<string>,
    bg: string,
    en: string,
    de: string,
    rus: string,
    owner: string
}
export const isLabelDataType = (arg: any): arg is labelDataType => {
    return (arg._id &&
        arg.allergens &&
        arg.category &&
        arg.bg &&
        arg.en &&
        arg.de &&
        arg.rus &&
        arg.owner) ? true : false;
}

export default class DB {
    address: string;
    data:labelDataType[];
    constructor() {
     //   this.address = "https://labels-service-392708.lm.r.appspot.com/";
        this.address = "http://localhost:8080/";
        this.data = [];
    }
    fetchSigns(setDbData: (arg: labelDataType[]) => void) {
        //get data from db
        return (new Promise<void>((resolve, reject)=> {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", this.address + 'signs', true);
      xhr.withCredentials = true;
        xhr.onreadystatechange = () => {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    this.data = JSON.parse(xhr.responseText);
                    setDbData(this.data);              
                    resolve();
                } else if (xhr.status !== 200) {
                    reject(new Error('Error in fetching DB'));
                }
        };
            xhr.onerror = () => reject(new Error('Error in fetching DB'));

            xhr.send();
        }));
       
    }  
    getLabelById(id: string) {
        //get data from db
        return (new Promise<labelDataType>((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open("GET", this.address + 'signs/' + id , true);
            xhr.withCredentials = true;
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    resolve(JSON.parse(xhr.responseText));
                } else if (xhr.status !== 200) {
                    reject(new Error('Error in fetching Label'));
                }
            };
            xhr.onerror = () => reject(new Error('Error in fetching Label'));

            xhr.send();
        }));
    }
    createNewLabel(label:any, data = this.data) {
        return (new Promise<labelDataType>((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", this.address + 'signs');
 	xhr.withCredentials = true;
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange =  () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                let startIndex = xhr.responseText.search('_id') + 6;
                let endIndex = xhr.responseText.search('__v') - 3;
                let id = xhr.responseText.slice(startIndex, endIndex);
                label._id = id;
                data.push(label);
                resolve(label);
            } else if (xhr.status !== 200) {
              //  if (this.getSignByBG(label._id) !== null) reject(new Error('Error: Label: "' + label.bg + '" already exist!')); 
                reject(new Error('Error in creating new Label'));
            }
        };
            xhr.send(JSON.stringify(label));
        }));
    }
    saveLabel(label: any, data = this.data) {
        return (new Promise<labelDataType>((resolve, reject) => {
        let id = label._id;
        delete label._id;
        let xhr = new XMLHttpRequest();
        xhr.open("PATCH", this.address + 'signs/' + id);
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                // update offline DB Data
                let index = findIndexByProperty(data, '_id', id);
                if (index !== -1) data[index] = JSON.parse(xhr.responseText);
                resolve(data[index]);
            } else if (xhr.status !== 200) {
                reject(new Error('Error in saving Label!'));
            }
        };
            xhr.send(JSON.stringify(label));
        }));
    }
    deleteLabel(id: string, data = this.data) {
        return (new Promise<labelDataType>((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open("DELETE", this.address + 'signs/' + id);
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {

                let index = findIndexByProperty(data, '_id', id);
                if (index !== -1) data.splice(index, 1);
                if (xhr.responseText === 'null') reject(new Error('Error in deleting label'));
                resolve(JSON.parse(xhr.responseText));

            } else if (xhr.status !== 200) {
                reject(new Error('Error in deleting Label!'));
            }
        };
            xhr.send();
        }));
    }
}

