import { Image } from "./ImageUpload";

const address = "http://localhost:8080/";

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
export function fetchImages() {
    //get data from db
    return (new Promise<string>((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", address + 'images', true);
        xhr.withCredentials = true;
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                // return JSON.parse(xhr.responseText);
                //  sessionStorage.setItem('designs', JSON.stringify(fetchedDesigns));
                //  setDbData(this.data);
                resolve(xhr.response);
            } else if (xhr.status !== 200) {
                reject(new Error('Error in fetching Designs'));
            }
        };
        xhr.onerror = () => reject(new Error('Error in fetching Designs'));

        xhr.send();
    }));

}