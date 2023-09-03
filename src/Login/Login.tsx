import { useState } from 'react';
import './login.css';

export interface Iuser {
    username: string, email: string, token: string
};

async function loginUser(credentials: {email:string,password:string}) {
    return fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })
        .then(data => data.json())
}


export default function Login({ setUser }: { setUser: (arg: {username:string, email:string, token:string})=>void}) {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const handleSubmit = async (e:React.FormEvent) => {
        e.preventDefault();
        try {
            const token = await loginUser({
                email,
                password
            });
            setUser({ username: token.username, email: token.email, token: token.authentication.sessionToken });
        }
        catch (error) {
            console.log('Failed to login. Invalid email or password!');
        }
    }

    return (
        <div className="login-wrapper">
            <h1>Please Log In </h1>
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