import { useState } from 'react';
import './login.css';


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