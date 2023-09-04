import { useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import { Iuser, loginUser } from './Login';


async function registerUser(credentials: { email: string, password: string, username:string }) {
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

export default function Register({ user, setUser }: {user:Iuser, setUser: (arg: { username: string, email: string, token: string }) => void }) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [emailR, setEmailR] = useState('');
    const [password, setPassword] = useState('');
    const [passwordR, setPasswordR] = useState('');
    const error = useRef<unknown>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (username.length < 5) { // to check if the username exists
            console.log('Error: Username must be at least 5 characters long!');
            return;
        } else if (email !== emailR) { // to check if the email exists!
            console.log('Error: The emails does not match!');
            return;
        } else if (password !== passwordR) { // to check if the password is strong
            console.log('Error: The passwords does not match!');
            return;
        } 

        try {
            await registerUser({ email, password, username });
            console.log('Succesfuly registered user: ' + username ); // to add UI element
        } catch (err) {
            console.log(err);
            error.current = err;
        }
        if (error.current !== null) {
            console.log(error.current);
            return;
        }
        try {
            const user = await loginUser({
                email,
                password
            });
            setUser({ username: user.username, email: user.email, token: user.authentication.sessionToken });
            console.log('success'); // to add UI element
        }
        catch (error) {
            console.log('Failed to login. Invalid email or password!' + error); // to add UI element
        }
    }

    return (
        
        <div className="login-wrapper">
            {user.token && user.token !== '' ? <Navigate to="../labels-app/" replace={true} /> : null}
            <h1>Please Register </h1>
            <form onSubmit={handleSubmit}>
                <label>
                    <p>Username:</p>
                    <input type="text" placeholder="Username" onChange={e => setUsername(e.target.value)} />
                </label>
                <label>
                    <p>Email:</p>
                    <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
                </label>
                <label>
                    <p>Repeat Email:</p>
                    <input type="email" placeholder="Email" onChange={e => setEmailR(e.target.value)} />
                </label>
                <label>
                    <p>Password:</p>
                    <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
                </label>
                <label>
                    <p>Repeat Password:</p>
                    <input type="password" placeholder="Password" onChange={e => setPasswordR(e.target.value)} />
                </label>
                <button type="submit" >Register</button>

            </form>
        </div>
        );
}