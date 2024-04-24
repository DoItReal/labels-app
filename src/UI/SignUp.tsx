import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Unstable_Grid2';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useContext, useRef, useState } from 'react';
import { Alert } from '../components/Alert';
import { registerUser } from '../Login/Register';
import { Iuser, loginUser } from '../Login/Login';
import { Link, Navigate } from 'react-router-dom';
import { Copyright } from './Copyright';
import { userContext } from '../App';
import Terms from '../Terms/index';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

export default function SignUp() {
    const [user, setUser]: [user: Iuser, setUser: (arg: Iuser) => void] = useContext(userContext);
    const [showError, setShowError] = useState<JSX.Element | null>(null);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [emailR, setEmailR] = useState('');
    const [password, setPassword] = useState('');
    const [passwordR, setPasswordR] = useState('');
    const [isTermsAccepted, setIsTermsAccepted] = useState(false);
    const [isTermsDialogOpen, setIsTermsDialogOpen] = useState(false);
    const [isTermsScrolledToBottom, setIsTermsScrolledToBottom] = useState(false);
    
    const error = useRef<unknown>(null);
    
    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsTermsAccepted(event.target.checked);
     };
    const handleShowTerms = () => {
        setIsTermsDialogOpen(true);
    };
  
    const handleCloseTermsDialog = () => {
        setIsTermsDialogOpen(false);
    };
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (username.length < 5) { // to check if the username exists
            const time = 5000;
            setShowError(<Alert severity="error" variant="outlined" handleClose={() => setShowError(null)}><strong>Username must be at least 5 characters long!</strong></Alert>);
            setTimeout(() => setShowError(null), time);
            return;
        } else if (email.length === 0 || email !== emailR) { // to check if the email exists!
            const time = 5000;
            const err = email.length === 0 ? 'Please enter email!' : 'The emails does not match!';
            setShowError(<Alert severity="error" variant="outlined" handleClose={() => setShowError(null)}><strong>{String(err)}</strong></Alert>);
            setTimeout(() => setShowError(null), time);
            return;
        } else if (password.length < 8 || password !== passwordR) { // to check if the password is strong
            const time = 5000;
            const err = password.length < 8 ? "The password muse be at least 8 characters long" : "The passwords does not match";
            setShowError(<Alert severity="error" variant="outlined" handleClose={() => setShowError(null)}><strong>{String(err)}</strong></Alert>);
            setTimeout(() => setShowError(null), time);
            return;
        }

        try {
            await registerUser({ email, password, username });
            const time = 2000;
            setShowError(<Alert severity="success" variant="outlined" handleClose={() => setShowError(null)}>
                'Succesfuly registered user: '<strong>{username}</strong>
            </Alert>);
            setTimeout(() => setShowError(null), time);
        } catch (err) {
            const time = 5000;
            setShowError(<Alert severity="error" variant="outlined" handleClose={() => setShowError(null)}><strong>{String(err)}</strong></Alert>);
            setTimeout(() => setShowError(null), time);
            error.current = err;
        }
        if (error.current !== null) {
            console.log(error.current);
            return;
        }
        try {
            const user = await loginUser({
                email,
                password
            });

            const time = 2000;
            setShowError(<Alert severity="success" variant="outlined" title='' handleClose={() => setShowError(null)}>
                'Logging in: '<strong>{username}</strong>
            </Alert>);
            setTimeout(() => {
                setUser({ username: user.username, email: user.email, token: user.authentication.sessionToken });
                setShowError(null)
            }, time);
        }
        catch (error) {
            const time = 5000;
            setShowError(<Alert severity="error" variant="outlined"><strong>{String(error)}</strong></Alert>);
            setTimeout(() => setShowError(null), time);
        }
    }

    return (
        <Container component="main" maxWidth="xs">
            {showError !== null ? showError : null}
            {user.token && user.token !== '' ? <Navigate to="../" replace={true} /> : null}
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        backgroundColor: 'transperant',
                        borderRadius: '10px',
                        border: '1px solid',
                        borderColor: 'primary',
                        padding: '5px'
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                <Box component="form" noValidate={false} onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid xs={12}>
                                <TextField
                                    autoComplete="username"
                                    name="username"
                                    required
                                    fullWidth
                                    id="username"
                                label="Username"
                                onChange={e=>setUsername(e.target.value) }
                                    autoFocus
                                />
                            </Grid>
                            <Grid xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    type="email"
                                    label="Email Address"
                                    name="email"
                                    onChange={(e=>setEmail(e.target.value))}
                                    autoComplete="email"
                                />
                        </Grid>
                        <Grid xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="email2"
                                type="email"
                                label="Repeat Email Address"
                                onChange={e=>setEmailR(e.target.value) }
                                name="email2"
                                autoComplete="email"
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
                                    onChange={e=>setPassword(e.target.value) }
                                    autoComplete="new-password"
                                />
                        </Grid>
                        <Grid xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="password2"
                                label="Repeat Password"
                                type="password"
                                id="password"
                                onChange={e=>setPasswordR(e.target.value) }
                                autoComplete="new-password"
                            />
                        </Grid>
                        <Grid container alignItems="center">
                              <Grid xs={8}>
                                <FormControlLabel
                                  control={<Checkbox checked={isTermsAccepted} onChange={handleCheckboxChange} value="acceptTerms" color="primary" />}
                                  label="I accept the Terms of Service and Privacy Policy."
                                />
                              </Grid>
                              <Grid xs={4}>
                                <Button onClick={handleShowTerms} color="primary" variant="outlined" size="small">
                                  <InfoOutlinedIcon fontSize="small" />
                                </Button>
                              </Grid>
                        </Grid>
                            <Grid xs={12}>
                                <FormControlLabel
                                    control={<Checkbox value="allowExtraEmails" color="primary" />}
                                    label="I want to receive inspiration, marketing promotions and updates via email."
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            disabled={!isTermsAccepted}
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign Up
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid>
                            <Link to="../login" style={{
                                textDecoration: 'none'
                            }}>
                                <Typography variant="subtitle1" sx={{
                                    color: 'text.primary',
                                    ':hover': { color: 'text.secondary' },
                                }}>
                                    Already have an account? <strong>Sign in</strong>
                                </Typography>
                            </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <TermsDialog open={isTermsDialogOpen} onClose={handleCloseTermsDialog} onAccept={()=>setIsTermsAccepted(true)} setIsTermsAccepted={setIsTermsAccepted} isTermsScrolledToBottom={isTermsScrolledToBottom} setIsTermsScrolledToBottom={setIsTermsScrolledToBottom} />
                <Copyright sx={{ mt: 5 }} />
            </Container>
    );
}

interface TermsDialogProps {
  open: boolean;
  onClose: () => void;
  onAccept: () => void;
  setIsTermsAccepted: (value: boolean) => void;
  setIsTermsScrolledToBottom: (isScrolled: boolean) => void;
  isTermsScrolledToBottom: boolean;
}

const TermsDialog: React.FC<TermsDialogProps> = ({
  open,
  onClose,
  onAccept,
  setIsTermsAccepted,
  setIsTermsScrolledToBottom,
  isTermsScrolledToBottom
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const handleAcceptTerms = () => {
    onAccept();
    onClose();
  };

  const handleScroll = () => {
    if (contentRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
      const isScrolledToBottom = scrollTop + clientHeight === scrollHeight;
      setIsTermsScrolledToBottom(isScrolledToBottom);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Terms of Service and Privacy Policy</DialogTitle>
      <DialogContent dividers onScroll={handleScroll} ref={contentRef} style={{ maxHeight: '60vh', overflowY: 'auto' }}>
        <Terms />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleAcceptTerms} color="primary" variant="contained" disabled={!isTermsScrolledToBottom}>
          Accept Terms
        </Button>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
