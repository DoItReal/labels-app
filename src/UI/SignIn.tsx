/* eslint-disable react/jsx-no-undef */
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Unstable_Grid2';
import { Avatar, Box, Button, Container, Typography } from '@mui/material';
import { Link, Navigate } from 'react-router-dom';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useContext, useState } from 'react';
import { Iuser, loginUser } from '../Login/Login';
import { Alert } from '../components/Alert';
import { Copyright } from './Copyright';
import { userContext } from '../App';
import Playground from '../DesignEditor/Editor';
export function LoginUI() {
  
    const [user, setUser]:[user:Iuser,setUser:(arg:Iuser)=>void] = useContext(userContext);
    const [error, setError] = useState<JSX.Element | null>(null);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const user = await loginUser({
                email,
                password
            }); const time = 2000;
            setError(<Alert severity="success" handleClose={() => setError(null)}><strong>Logging in...!</strong></Alert>);
            setTimeout(() => {
                setError(null);
                setUser({ username: user.username, email: user.email, token: user.authentication.sessionToken });
            }, time);


        }
        catch (error) {
            console.log(error);
            const time = 5000;
            setError(<Alert severity="error" handleClose={() => setError(null)}>Failed to login. <strong>Invalid email or password!</strong></Alert>);
            setTimeout(() => setError(null), time);
        }
    }

    return (
        <Container component="main" maxWidth="xs">
        <Playground />
            {user.token && user.token !== '' ? <Navigate to="../" replace={true} /> : null}
            {error !== null ? error : null}
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        backgroundColor: 'transperant',
                        borderRadius: '10px',
                        border: '1px solid',
                        borderColor:'primary',
                        padding: '5px'
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>   
                            <Grid xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                autoComplete="email"
                                onChange={ e => setEmail(e.target.value) }
                                    autoFocus
                                />
                            </Grid>
                            <Grid xs={12}>
                                <TextField
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="password"
                                onChange={e => setPassword(e.target.value) }
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        <Grid container justifyContent="flex-end">
                        <Grid>
                            <Link to="../register" style={{
                                textDecoration:'none'
                            } }>
                                <Typography variant="subtitle1" sx={{
                                    color: 'text.primary',
                                    ':hover': { color: 'text.secondary' },
                                }}>
                                    Do not have an account? <strong>Sign up</strong>
                                </Typography>
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 5 }} />
            </Container>
    );
}

