import { address } from "../DB/Remote/server";

async function generateAI(prompt: string, model: string = "google/gemini-2.0-flash-exp:free") {

    return (new Promise<string>((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", address +"ai");
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.withCredentials = true;
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                resolve(xhr.responseText);
            } else if (xhr.status !== 200) {
                reject(new Error('Error in AI completion!'));
            }
        };
        xhr.send(JSON.stringify({ prompt, model }));
    }));
}
//mock in case of localhost 
async function generateMock(prompt: string, model: string = "random") {
    return (new Promise<string>((resolve, reject) => {
        setTimeout(() => {
            Math.random() > 0.5 ? resolve("Generated text") :
            reject("Generated text");
        }, 1000);
    }));
}
//export the function based on the environment
//export default process.env.NODE_ENV === 'production' ? generateAI : generateAI;
export default process.env.NODE_ENV === 'production' ? generateAI : generateMock;