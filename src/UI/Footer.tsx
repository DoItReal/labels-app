import Container from '@mui/material/Container';
import { Copyright } from './Copyright';
import Typography from '@mui/material/Typography';
export default function StickyFooter() {
    return (

        <Container disableGutters
            component="footer"
            sx={{
                display: 'flex',
                position: 'sticky',
                minWidth: "100%",


                m: 0,
                bottom: 0,
                py: 2,
                px: 0,
                mt: 'auto',
                backgroundColor: (theme) =>
                    theme.palette.mode === 'light'
                        ? theme.palette.grey[200]
                        : theme.palette.grey[800],
            }}
        > 
        <Container disableGutters maxWidth="xs" sx={{position: 'relative', marginRight: "auto", width: '100%', marginLeft: 0}}>
      <Typography component="a" href="/#/terms" target="_blank" rel="noopener noreferrer" color="primary">
  Terms and Conditions
</Typography>
        </Container>
            <Container disableGutters maxWidth="xs" sx={{ position: 'relative', marginLeft: "auto", width: '100%', marginRight: 0 }}>
                <Copyright fontSize="1rem" />
            </Container>
        </Container>

    );
}