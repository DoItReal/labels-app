import { address } from "../DB/Remote/server";
export async function translate(text:string, targetLanguage:string) {

    return (new Promise<string>((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", address +"translate");
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                resolve(xhr.responseText);
            } else if (xhr.status !== 200) {
                reject(new Error('Error in translating!'));
            }
        };
        xhr.send(JSON.stringify({ text, targetLanguage }));
    }));
}
