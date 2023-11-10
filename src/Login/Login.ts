import { useState } from 'react';
import './login.css';


export interface Iuser {
    username: string, email: string, token: string
};

export async function loginUser(credentials: { email: string, password: string }) {
	var headers = new Headers();
	headers.append('Content-Type', 'application/json');
	headers.append('Accept', 'application/json');    
return fetch('http://localhost:8080/auth/login', {
   // return fetch('https://labels-service-392708.lm.r.appspot.com/auth/login', {
        method: 'POST',
	mode: 'cors',
	credentials: 'include',
        headers: {'Content-Type' : 'application/json'},
	//'Accept' : 'application/json'},
        body: JSON.stringify(credentials)
    })
        .then(data => data.json())
}

export interface IuseUser {
    setUser: (user: Iuser) => void,
    user: Iuser,
    logout: ()=>void
}
export function useUser():IuseUser {

    const getUser = () => {
        let userString = sessionStorage.getItem('token');
        if (!userString) {
            //it does not create sesstionStorage item 'token' just returns dummy 
            return ({ username: '', email: '', token: '' });
        } else {
            const user = JSON.parse(userString);
            return user;
        }
    }
    const [user, setUser] = useState<Iuser>(getUser());
    const saveUser = (user: Iuser) => {
        sessionStorage.setItem('token', JSON.stringify(user));
	//document.cookie = 'LABELS-AUTH=' + user.token + ';' + {path:'/'};
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