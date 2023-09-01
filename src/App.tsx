import './App.css';
import { Nav} from './nav/Nav1';
import Content from './content/Content';
import './style.css';
import DB from './db';
import { useState, Fragment } from 'react';
import { Route, Link, Routes, BrowserRouter, Navigate, useLocation, useNavigate } from 'react-router-dom';
export var db = new DB();

export interface IenableStates {
    enableStates: Map<string, boolean>, updateStates: (key: string, value: boolean) => void
}



function App() {
  
    return (

        <BrowserRouter>
            <div>
               
                <Routes>
                    <Route path="/" element={
                        <RequireAuth>
                        <Index />
                        </RequireAuth>
                    } />
       
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<h1>Register</h1> } />
                    </Routes>
                 </div>
            </BrowserRouter>
        );
}

export default App;
function Login() {

    return <h1>Login</h1>;
}
function Index() {
    const [enableStates, setEnableStates] = useState<Map<string, boolean>>(new Map());
    const updateStates = (key: string, value: boolean) => {

        setEnableStates(new Map(enableStates.set(key, value)));

    } 
    return (
        <div className="App">
            <script type="text/javascript" src="https://unpkg.com/pdf-lib" />
            <script type="text/javascript" src="https://unpkg.com/jquery" />


            <Nav enableStates={enableStates} updateStates={updateStates} />
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