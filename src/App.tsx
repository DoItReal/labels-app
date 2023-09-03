import './App.css';
import { Nav} from './nav/Nav1';
import Content from './content/Content';
import './style.css';
import DB from './db';
import { useState, Fragment } from 'react';
import { Route, Link, Routes, BrowserRouter, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Login, { useUser, Iuser } from './Login/Login';
export var db = new DB();

export interface IenableStates {
    enableStates: Map<string, boolean>, updateStates: (key: string, value: boolean) => void
}



function App() {
    const { user, setUser, logout } = useUser();
    if (!user.token || user.token === '') return <Login setUser={setUser} />;

    return (
        
        <BrowserRouter>
            <div>      
                <Routes>
                    <Route path="labels-app/" element={
                        <RequireAuth>
                            <Index user={user} logout={logout } />
                        </RequireAuth>
                    } />
       
                    <Route path="labels-app/login" element={<Login setUser={setUser }/>} />
                    <Route path="labels-app/register" element={<h1>Register</h1> } />
                    </Routes>
                 </div>
            </BrowserRouter>
        );
}

export default App;

function Index({ user, logout }: { user: Iuser, logout: ()=>void } ) {
    const [enableStates, setEnableStates] = useState<Map<string, boolean>>(new Map());
    const updateStates = (key: string, value: boolean) => {

        setEnableStates(new Map(enableStates.set(key, value)));

    } 
    return (
        <div className="App">
            <script type="text/javascript" src="https://unpkg.com/pdf-lib" />
            <script type="text/javascript" src="https://unpkg.com/jquery" />


            <Nav enableStates={enableStates} updateStates={updateStates} user={user} logout={logout } />
            <Content enableStates={enableStates} updateStates={updateStates} />

        </div>
    );
}

function RequireAuth({ children }: { children: any }) {
    const isAuthenticated = true; // your logic here
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} />;
    }

    return children;
}