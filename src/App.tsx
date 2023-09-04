import './App.css';
import { Nav} from './nav/Nav1';
import Content from './content/Content';
import './style.css';
import DB from './db';
import { useState, Fragment } from 'react';
import { Route, Link, Routes, BrowserRouter, Navigate, useLocation, useNavigate, HashRouter } from 'react-router-dom';
import Login, { useUser, Iuser } from './Login/Login';
import Register from './Login/Register';
export var db = new DB();

export interface IenableStates {
    enableStates: Map<string, boolean>, updateStates: (key: string, value: boolean) => void
}


function App() {
    const { user, setUser, logout } = useUser();

    return (
        
        <HashRouter basename="/">
            
            <div>      
                <Routes>
                    <Route path="/" element={
                        <RequireAuth user={user }>
                            <Index user={user} logout={logout } />
                        </RequireAuth>
                    } />
       
                    <Route path="/login" element={<Login user={user} setUser={setUser }/>} />
                    <Route path="/register" element={<Register user={user}  setUser={setUser } /> } />
                    </Routes>
                 </div>
            </HashRouter>
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

function RequireAuth({ user, children }: {user:Iuser, children: any }) {
    const isAuthenticated = user.token && user.token !== ''; // your logic here
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="../login" state={{ from: location }} />;
    }

    return children;
}