import { Typography, Link as LinkUI } from "@mui/material";
import { Copyright as CopyrightIcon } from '@mui/icons-material';

export function Copyright(props: any) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright '}<CopyrightIcon /> {' '}
            <LinkUI color="inherit" href="https://doitreal.github.io/labels-app/">
                Your Website
            </LinkUI>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}