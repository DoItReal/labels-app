
export async function registerUser(credentials: { email: string, password: string, username:string }) {
    return (new Promise<void>((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", "https://labels-service-392708.lm.r.appspot.com/auth/register");
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                console.log(xhr.status);
                console.log(xhr.responseText);
                resolve();
            } else if (xhr.status !== 200) {
                reject(new Error('Error in registering new user!'));
            }
        };
        xhr.send(JSON.stringify(credentials));
    }));
}
