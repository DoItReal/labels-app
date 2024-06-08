import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { userContext } from '../App';
import { Iuser } from '../Login/Login';
import Logout from '@mui/icons-material/Logout';
import { DarkModeUISwitch } from './ThemeMode';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { deepOrange } from '@mui/material/colors';


export default function ResponsiveAppBar({ toggleMode }: {toggleMode:()=>void}) {
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const [user, setUser, logout]:[user:Iuser,setUser:(arg:Iuser)=>void,logout:()=>void] = useContext(userContext);
    const navigate = useNavigate();
    
    const pages = [
        {
            name: 'Home',
            key: 'Home',
            handleClick: () => {
                handleCloseNavMenu();
                navigate('./home');
            }
        },
        {
            name: 'Catalogs',
            key: 'CatalogsEditor',
            handleClick: () => {
                handleCloseNavMenu();
                navigate('./catalogs');
            }
        },
        {
            name: 'Design Editor',
            key: 'DesignEditor',
            handleClick: () => {
                handleCloseNavMenu(); 
                navigate('./editor');
            }
        },
        {
            name: 'Config',
            key: 'Configuration',
            handleClick: () => {
                handleCloseNavMenu();
                navigate('./config');
            }
        }
        /*
        {
        name: 'Pricing',
        key: 'Pricing',
            handleClick: () => { handleCloseNavMenu() }
        },
        {
        name: 'Blog',
        key:'Blog',
            handleClick: () => { handleCloseNavMenu() }
        }
        */
    ];
    const settings = [
        {
            key: 'Profile',
            name: 'Profile',
            handleClick: () => { handleCloseUserMenu() }
        }, {
            key: 'Account',
            name: 'Account',
            handleClick: () => { handleCloseUserMenu() }
        }, {
            key: 'Dashboard',
            name: 'Dashboard',
            handleClick: () => { handleCloseUserMenu() }
        }, {
            key: 'Logout',
            name: 'Logout',
            label: 'Logout',
            icon: <Logout fontSize='small' />,
            handleClick: () => { handleCloseUserMenu(); logout() }
        }, {
            key: 'DarkMode',
            name: <DarkModeUISwitch onChange={toggleMode} />,
            handleClick: () => { }
        }
    ];
    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
 
    return (
        <AppBar position="static">
            
            <Container sx={{
                minWidth: '100%',
                justifyContent: 'flex-start',
                
            } }>
                <Toolbar disableGutters variant="dense">
                    <AdbIcon sx={{
                        display: { xs: 'none', md: 'flex' },
                        mr: 1                       
                    }} />
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'text.secondary',
                            textDecoration: 'none',
                        }}
                    >
                        EZ Labels
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                            PaperProps={{
                                elevation: 0,
                                sx: {
                                    overflow: 'visible',
                                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                    mt: 1.5,
                                    '& .MuiAvatar-root': {
                                        width: 32,
                                        height: 32,
                                        ml: -0.5,
                                        mr: 1,
                                    },
                                    '&:before': {
                                        content: '""',
                                        display: 'block',
                                        position: 'absolute',
                                        top: 0,
                                        right: 85,
                                        width: 10,
                                        height: 10,
                                        bgcolor: 'background.paper',
                                        transform: 'translateY(-50%) rotate(45deg)',
                                        zIndex: 0,
                                    },
                                },
                            }}
                        >
                            {pages.map((page) => (
                                <MenuItem key={page.key} onClick={handleCloseNavMenu}>
                                    <Typography textAlign="center" onClick={page.handleClick }>{page.name}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        Labels APP
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                            <Button
                                key={page.key}
                                onClick={() => {page.handleClick();handleCloseNavMenu();}}
                                sx={{ my: 2, color: 'white', display: 'block' }}
                            >
                                {page.name}
                            </Button>
                        ))}
                    </Box>

                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt={user.username} sx={{ bgcolor: deepOrange[500] }}> {user.username[0] }</Avatar>
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                            PaperProps={{
                                elevation: 0,
                                sx: {
                                    overflow: 'visible',
                                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                    mt: 1.5,
                                    '& .MuiAvatar-root': {
                                        width: 32,
                                        height: 32,
                                        ml: -0.5,
                                        mr: 1,
                                    },
                                    '&:before': {
                                        content: '""',
                                        display: 'block',
                                        position: 'absolute',
                                        top: 0,
                                        right: 14,
                                        width: 10,
                                        height: 10,
                                        bgcolor: 'background.paper',
                                        transform: 'translateY(-50%) rotate(45deg)',
                                        zIndex: 0,
                                    },
                                },
                            }}
                        >
                            {user.token && user.token !== '' ? settings.map((setting) => (
                                <MenuItem key={setting.key} onClick={setting.handleClick}>
                                    <Typography textAlign="center" onClick={setting.handleClick} sx={{ display: 'flex' }} >{setting.icon ? <> {setting.icon}{setting.name}</>: setting.name}</Typography>
                                </MenuItem>
                            )) :<div> <MenuItem key='menuLogin' onClick={()=> navigate('./login') }>
                                    <Typography textAlign="center" onClick={() => navigate('./login')} sx={{ display: "flex" }}><LoginIcon sx={{marginRight:1} } />Sign In</Typography>
                            </MenuItem>
                                    <MenuItem key='menuRegister' onClick={() => navigate('./register')}>
                                        <Typography textAlign="center" onClick={() => navigate('./register')} sx={{ display: 'flex' }}><PersonAddIcon sx={{marginRight:1} } />Sign Up</Typography>
                                    </MenuItem>
                                    <MenuItem key='darkMode'>
                                        <Typography textAlign="center" sx={{ display: 'flex' }}><DarkModeUISwitch onChange={toggleMode} /></Typography>
                                    </MenuItem>
                                </div>
                                }
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
            </AppBar>
    );
}

