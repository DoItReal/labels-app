import { Labels } from './labels';

export interface labelDataType {
    _id: string,
    allergens: Array<number>,
    category: Array<string>,
    bg: string,
    en: string,
    de: string,
    rus: string
}
export type labelDataArrType = Array<labelDataType>;

const labels = new Labels();
export default class DB {
    address: string;
    data:any;
    constructor() {
        this.address = "https://labels-service-392708.lm.r.appspot.com/";
        this.data = [];
    }
    fetchSigns(setDbData: (arg: labelDataArrType) => void) {
        

        //get data from db
        return (new Promise<void>((resolve, reject)=> {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", this.address + 'signs', true);
     
        xhr.onreadystatechange = () => {
  
                if (xhr.readyState === 4 && xhr.status === 200) {
                    this.data = JSON.parse(xhr.responseText);
                    setDbData(this.data);
                 
                    resolve();
                } else if (xhr.status !== 200) {
                    reject(new Error('Error in fetching DB'));
                }
     
        };
        xhr.onerror = () => console.log('error');
        xhr.send();
        }));
       
    }  
    getSignById(id: string) {
        fetch(this.address + 'signs/' + id).then(response => response.json()).then(sign => { return sign });
    }
    createNewLabel(label:any, data = this.data) {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", this.address + 'signs');
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                console.log(xhr.status);
                console.log(xhr.responseText);
                let startIndex = xhr.responseText.search('_id') + 6;
                let endIndex = xhr.responseText.search('__v') - 3;
                let id = xhr.responseText.slice(startIndex, endIndex);
                label._id = id;
                data.push(label);
                labels.update();
            }
        };
        xhr.send(JSON.stringify(label));
    }
    saveLabel(label: any, data = this.data) {
        let id = label._id;
        delete label._id;
        let xhr = new XMLHttpRequest();
        xhr.open("PATCH", this.address + 'signs/' + id);
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                console.log(xhr.status);
                console.log(xhr.responseText);

                let index = findIndexByProperty(data, '_id', id);
                if (index !== -1) data[index] = JSON.parse(xhr.responseText);
            //    search();
                labels.update();
            }
        };
        xhr.send(JSON.stringify(label));
    }
    deleteLabel(id: string, data = this.data) {
        //if (password != 'asd123456') return;
        let xhr = new XMLHttpRequest();
        xhr.open("DELETE", this.address + 'signs/' + id);
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                console.log(xhr.status);
                console.log(xhr.responseText);

                let index = findIndexByProperty(data, '_id', id);
                if (index !== -1) data.splice(index, 1);
                labels.update();
            }
        };
        xhr.send();
    }
}

function findIndexByProperty(arr:Array<any>, propName:string, propValue:string) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i][propName] === propValue) {
            return i;
        }
    }
    return -1; // Return -1 if the object is not found
}