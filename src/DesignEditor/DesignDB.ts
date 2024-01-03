import { Design } from "./Editor";
const address = "http://localhost:8080/";
export const createNewDesign = (design: Design) => {
console.log('test');
    return (new Promise<Design>((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", address + 'designs');
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
