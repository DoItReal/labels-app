import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import type { } from '@mui/x-data-grid/themeAugmentation';
import  Nav from './nav/Nav';
import Content from './content/Content';
import './style.css';
import { useState,createContext} from 'react';
import { Route, Routes, Navigate, useLocation, HashRouter } from 'react-router-dom';
import { useUser, Iuser, IuseUser } from './Login/Login';
import { LoginUI } from './UI/SignIn';
import { Theme, ThemeProvider } from '@emotion/react';
import { createTheme, CssBaseline, Grid } from '@mui/material';
import SignUp from './UI/SignUp';
import StickyFooter from './UI/Footer';
import Playground from './Designs/index';
import Catalogs from './Catalogs';
import EmailVerification from './Login/EmailVerification';
import Terms from './Terms/index';
import Configuration from './Config/index';


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
    const navHeight = '4rem'; // Adjust as per your navigation bar height
    const footerHeight = '4em'; // Assuming the footer is 10% of viewport height
    return (
        <userContext.Provider value={[user, setUser, logout]}>
            <enableStatesContext.Provider value={[enableStates,updateStates]}>
        <ThemeProvider theme={theme} >
                    <CssBaseline />     
                    <Grid container direction="column" style={{ minHeight: '100vh', overflow: 'hidden' }}>
                        <HashRouter basename="/">    
                            <Grid item style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000 }}>
                                <Nav toggleMode={toggleMode} /> 
                            </Grid>
                            <Grid item style={{ marginTop: navHeight, marginBottom: footerHeight, maxHeight: `calc(100vh - ${navHeight} - ${footerHeight})`, overflow: 'auto' }}>
                                <Routes>
                        <Route path="/verificate/:verificationHash" element={
                            <EmailVerification />
                        }  />
                        <Route path="/terms" element={<Terms />} />
                        <Route path="/" element={
                                    <RequireAuth user={user}>
                                                    <Content />        
                            </RequireAuth>
                    } />
                        <Route path="/home" element={
                                <RequireAuth user={user}>
                                                <Content />        
                        </RequireAuth>
                    } />
                        <Route path="/editor" element={
                            <RequireAuth user={user}>
                                <Playground />
                            </RequireAuth>
                        } />
                        <Route path="/catalogs" element={
                            <RequireAuth user={user}>
                                <Catalogs />
                            </RequireAuth>
                        } />
                        <Route path="/config" element={
                            <RequireAuth user={user}>
                                <Configuration />
                            </RequireAuth>
                        } />
                        <Route path="/login" element={<LoginUI />} />
                                <Route path="/register" element={<SignUp />} />
                                    <Route path="*" element={<Navigate to="/404" />} />
                                </Routes>
                        </Grid>
                </HashRouter>
                        <Grid item style={{ position: 'fixed', bottom: 0, left: 0, right: 0, textAlign: 'center', zIndex: 1000 }}>
                            <StickyFooter />
                        </Grid>
            </Grid>
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
