import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import type { } from '@mui/x-data-grid/themeAugmentation';
import  Nav from './nav/Nav';
import Content from './content/Content';
import './style.css';
import DB from './db';
import { useState,createContext} from 'react';
import { Route, Routes, Navigate, useLocation, HashRouter } from 'react-router-dom';
import { useUser, Iuser, IuseUser } from './Login/Login';
import { LoginUI } from './UI/SignIn';
import { Theme, ThemeProvider } from '@emotion/react';

import { Box, Container, createTheme, CssBaseline } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import SignUp from './UI/SignUp';
import StickyFooter from './UI/Footer';
export var db = new DB();

export interface IenableStates {
    enableStates: Map<string, boolean>,
    updateStates: (key: string, value: boolean) => void
}
const defaultTheme:Theme = createTheme();
const darkTheme = createTheme({
    palette: {
        mode: 'dark',   
    },
});

//@ts-ignore
export const userContext = createContext<IuseUser[0]>();
//@ts-ignore
export const enableStatesContext = createContext<IenableStates[0]>();

function App() {
    const { user, setUser, logout } = useUser();
    const [theme, setTheme] = useState(defaultTheme);
    const [darkMode, setDarkMode] = useState(false);
    const [enableStates, setEnableStates] = useState<Map<string, boolean>>(new Map());
    const updateStates = (key: string, value: boolean) => {
        setEnableStates(new Map(enableStates.set(key, value)));
    } 
    const toggleMode = () => {
        darkMode ? setTheme(defaultTheme) : setTheme(darkTheme);
        setDarkMode(!darkMode);
    }
    return (
        <userContext.Provider value={[user, setUser, logout]}>
            <enableStatesContext.Provider value={[enableStates,updateStates]}>
        <ThemeProvider theme={theme} >
                    <CssBaseline />     
                    <Container disableGutters
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100vh',
                            minWidth: '100%',
                            m: 0,
                    p: 0,
                }}
            >
            
        <HashRouter basename="/">               
                        <Nav toggleMode={toggleMode} /> 
                        <Routes>
                    <Route path="/" element={
                                <RequireAuth user={user}>
                                   
                                                <Content />
                                    
                        </RequireAuth>
                    } />
                        
                        <Route path="/login" element={<LoginUI />} />
                                <Route path="/register" element={<SignUp />} />
         
                        </Routes>
                </HashRouter>
                <StickyFooter />
            </Container>
                </ThemeProvider>
            </enableStatesContext.Provider>
        </userContext.Provider>
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
export default App;
