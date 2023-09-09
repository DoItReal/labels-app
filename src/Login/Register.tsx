import { useRef, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Iuser, loginUser } from './Login';
import { Alert } from '../components/Alert';


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

export default function Register({ user, setUser }: { user: Iuser, setUser: (arg: { username: string, email: string, token: string }) => void }) {
    const [showError, setShowError] = useState<JSX.Element | null>(null);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [emailR, setEmailR] = useState('');
    const [password, setPassword] = useState('');
    const [passwordR, setPasswordR] = useState('');
    const error = useRef<unknown>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (username.length < 5) { // to check if the username exists
            const time = 5000;
            setShowError(<Alert severity="error" variant="outlined" handleClose={()=>setShowError(null)}><strong>Username must be at least 5 characters long!</strong></Alert>);
            setTimeout(() => setShowError(null), time);
            return;
        } else if (email.length ===0 || email !== emailR) { // to check if the email exists!
            const time = 5000;
            const err = email.length === 0 ? 'Please enter email!' : 'The emails does not match!';
            setShowError(<Alert severity="error" variant="outlined" handleClose={() => setShowError(null)}><strong>{String(err)}</strong></Alert>);
            setTimeout(() => setShowError(null), time);
            return;
        } else if (password.length < 8 || password !== passwordR) { // to check if the password is strong
            const time = 5000;
            const err = password.length < 8 ? "The password muse be at least 8 characters long" : "The passwords does not match";
            setShowError(<Alert severity="error" variant="outlined" handleClose={() => setShowError(null)}><strong>{String(err) }</strong></Alert>);
            setTimeout(() => setShowError(null), time);
            return;
        } 

        try {
            await registerUser({ email, password, username });
            const time = 2000;
            setShowError(<Alert severity="success" variant="outlined" handleClose={() => setShowError(null)}>
                'Succesfuly registered user: '<strong>{username}</strong>
            </Alert>);
            setTimeout(() => setShowError(null), time);
        } catch (err) {
            const time = 5000;
            setShowError(<Alert severity="error" variant="outlined" handleClose={() => setShowError(null)}><strong>{ String(err) }</strong></Alert>);
            setTimeout(() => setShowError(null), time);
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

            const time = 2000;
            setShowError(<Alert severity="success" variant="outlined" title='' handleClose={() => setShowError(null)}>
                'Logging in: '<strong>{username}</strong>
            </Alert>);
            setTimeout(() => {
                setUser({ username: user.username, email: user.email, token: user.authentication.sessionToken });
                setShowError(null)
            }, 2000);
        }
        catch (error) {
            const time = 5000;
            setShowError(<Alert severity="error" variant="outlined"><strong>{ String(error) }</strong></Alert>);
            setTimeout(() => setShowError(null), time);
        }
    }

    return (
        <>{ showError !== null ? showError : null}
        <div className="login-wrapper">
            {user.token && user.token !== '' ? <Navigate to="../" replace={true} /> : null}
                <h1>Please Register </h1>
                <Link to="../login" >
                    Login
                </Link>
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
        </>
        );
}