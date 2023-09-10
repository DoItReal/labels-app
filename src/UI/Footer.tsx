import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { Copyright } from './Copyright';
export default function StickyFooter() {
    return (
   
                <Box
                    component="footer"
                sx={{
                    display: 'absolute',
                    position:'sticky',
                    width: '100%',
                    bottom:0,
                        py: 2,
                        px: 1,
                    mt: 'auto',
                        backgroundColor: (theme) =>
                            theme.palette.mode === 'light'
                                ? theme.palette.grey[200]
                                : theme.palette.grey[800],
                    }}
        >
            <Container maxWidth="xs" sx={{ marginLeft:"auto", marginRight:0 }}>
                        <Copyright />
                    </Container>
                </Box>
            
    );
}