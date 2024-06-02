import { ImageURL } from "../Interfaces/Designs";
import { Image, Iimage } from "../Interfaces/Images";
import { address } from './server';

export function fetchImages() {
    //get data from db
    return (new Promise<ImageURL[]>((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", address + 'images', true);
        xhr.withCredentials = true;
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                resolve(JSON.parse(xhr.response));

            } else if (xhr.status !== 200) {

                reject(new Error('Error in fetching Images'));
            }

        };
        //Error handling
        xhr.onerror = () => reject(new Error('Error in fetching Images'));

        //Send the request
        xhr.send();

    }));

}
export const saveNewImage = (image: Image) => {
    console.log(image);
    return (new Promise<Image>((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", address + 'images');
        xhr.withCredentials = true;
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                resolve(image);
            } else if (xhr.status !== 200) {
                reject(new Error('Error in saving new Picture'));
            }
        };
        xhr.send(JSON.stringify(image));
    }));
}
