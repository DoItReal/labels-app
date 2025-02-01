import { Theme } from "@emotion/react";
import { IconButton, Menu, Typography, MenuItem, ListItemText, ListItemIcon, Checkbox, SxProps } from "@mui/material";
import { useState } from "react";
import LanguageIcon from "@mui/icons-material/Language";

const LanguageSelection = ({ languages, selectedLanguages, handleLanguageSelection }: { languages: string[], selectedLanguages: string[], handleLanguageSelection: Function }) => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget as HTMLElement);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    return (
        <>
            {/* Styled Icon Button */}
            <IconButton onClick={handleMenuOpen} size="large" sx={iconButtonStyle}>
                <LanguageIcon />
            </IconButton>

            {/* Styled Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                sx={menuStyle}
                PaperProps={{
                    sx: menuPaperStyle,
                }}
            >
                <Typography variant="subtitle2" sx={menuTitleStyle}>
                    Select Languages
                </Typography>
                {languages.map((lang) => {
                    const isSelected = selectedLanguages.includes(lang);
                    return (
                        <MenuItem key={lang} onClick={() => handleLanguageSelection(lang)} sx={menuItemStyle(isSelected)}>
                            <ListItemText primary={lang.toUpperCase()} />
                            <ListItemIcon>
                                <Checkbox checked={isSelected} sx={checkboxStyle(isSelected)} />
                            </ListItemIcon>
                        </MenuItem>
                    );
                })}
            </Menu>
        </>
    );
};

// Styles
const iconButtonStyle: SxProps<Theme> = {
    color: "primary.main",
};

const menuPaperStyle: SxProps<Theme> = {
    borderRadius: 2,
    minWidth: 200,
    boxShadow: 3,
    bgcolor: "background.paper",
};

const menuStyle: SxProps<Theme> = {
    "& .MuiMenuItem-root": {
        transition: "0.2s",
        "&:hover": { bgcolor: "action.hover" },
    },
};

const menuTitleStyle: SxProps<Theme> = {
    px: 2,
    py: 1,
    color: "text.secondary",
};

const menuItemStyle = (isSelected: boolean): SxProps<Theme> => ({
    display: "flex",
    justifyContent: "space-between",
    bgcolor: isSelected ? "primary.light" : "transparent",
    color: isSelected ? "primary.contrastText" : "text.primary",
    "&:hover": { bgcolor: "primary.main", color: "primary.contrastText" },
    borderRadius: 1,
    mx: 1,
    my: 0.5,
});

const checkboxStyle = (isSelected: boolean): SxProps<Theme> => ({
    color: isSelected ? "primary.contrastText" : "primary.main",
});

export default LanguageSelection;