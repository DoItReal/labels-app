import { AlertTitle, Alert as AlertUI } from '@mui/material';
import './styles/alert.css';

type severity='error' | 'success' | "info" | "warning";
type variant = "standard" | "filled" | "outlined";

function capsFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
interface Ialert {
    severity: severity,
    variant: variant,
    title?: string,
    handleClose?: () => void,
    children: any
}
export function Alert({ severity, variant = "standard", title, handleClose = () => { }, children }: Ialert) {
    if (!title) title = capsFirstLetter(severity);
    return (
        <div className="alert">
            <AlertUI onClose={ handleClose } severity={severity} variant={variant}>
                <AlertTitle>{title}</AlertTitle>
                {children}
            </AlertUI>
        </div>
    );
}