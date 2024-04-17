import { AlertTitle, Alert as AlertUI } from '@mui/material';

type severity='error' | 'success' | "info" | "warning";
type variant = "standard" | "filled" | "outlined";

function capsFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
interface Ialert {
    severity: severity,
    variant?: variant,
    title?: string,
    handleClose?: () => void,
    children: any
}
export function Alert({ severity, variant = "filled", title, handleClose = () => { }, children }: Ialert) {
    if (!title) title = capsFirstLetter(severity);
    return (
        <AlertUI onClose={handleClose} severity={severity} variant={variant}
            sx={{
                position: 'absolute',
                left: 0,
                bottom: 0,
                marginBottom:'1px',
                width: '100%',
                zIndex:10000
            }} >
                <AlertTitle>{title}</AlertTitle>
                {children}
            </AlertUI>
    );
}