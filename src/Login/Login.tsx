import { Alert } from '../components/Alert';
import { useState } from 'react';
import './login.css';
import { Link, Navigate } from 'react-router-dom';

export interface Iuser {
    username: string, email: string, token: string
};

export async function loginUser(credentials: {email:string,password:string}) {
    return fetch('https://labels-service-392708.lm.r.appspot.com/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })
        .then(data => data.json())
}


export default function Login({ user, setUser }: { user:Iuser, setUser: (arg: {username:string, email:string, token:string})=>void}) {
    const [error, setError] = useState<JSX.Element | null>(null);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const handleSubmit = async (e:React.FormEvent) => {
        e.preventDefault();
        try {
            const user = await loginUser({
                email,
                password
            }); const time = 2000;
            setError(<Alert variant="outlined" severity="success" handleClose={()=>setError(null) }><strong>Logging in...!</strong></Alert>);
            setTimeout(() => {
                setError(null);
                setUser({ username: user.username, email: user.email, token: user.authentication.sessionToken });
            }, time);
            
            
        }
        catch (error) {
            const time = 5000;
            setError(<Alert variant="outlined" severity="error" handleClose={()=>setError(null) }>Failed to login. <strong>Invalid email or password!</strong></Alert>);
            setTimeout(() => setError(null), time);
        }
    }
 
    return (
        <>
        { error !== null ? error : null}
        <div className="login-wrapper">
            
            {user.token && user.token !== '' ? <Navigate to="../" replace={true } /> : null }
            <h1>Please Log In </h1>
            <Link to="../register" >
                Register
            </Link>
            <form onSubmit={handleSubmit}>
            <label>
                    <p>Email:</p>
                    <input type="email" placeholder="Email" onChange={e=>setEmail(e.target.value) } />
            </label>
            <label>
                <p>Password:</p>
                    <input type="password" placeholder="Password" onChange={e=>setPassword(e.target.value) }/>
            </label>
                <button type="submit" >Login</button>
            
            </form>
            </div>
            </>
        );
}

export function useUser() {

    const getUser = () => {
        let userString = sessionStorage.getItem('token');
        if (!userString) {
            return ({ username: '', email: '', token: '' });
        } else {
            const user = JSON.parse(userString);
            return user;
        }
    }
    const [user, setUser] = useState<Iuser>(getUser());
    const saveUser = (user: Iuser) => {
        sessionStorage.setItem('token', JSON.stringify(user));
        setUser(user);
    }
    const logout = () => {
        sessionStorage.removeItem('token');
        setUser(getUser());
    }
    return {
        setUser: saveUser,
        user,
        logout
    }
}