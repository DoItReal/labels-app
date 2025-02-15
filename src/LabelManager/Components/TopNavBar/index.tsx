import { AppBar, Toolbar, IconButton, Button, Box, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState } from "react";
import LanguageSelection from "./LanguageSelection";
import NewLabels from "./NewLabelsButton";




const TopNavBar = ({ languages, selectedLanguages, handleLanguageSelection, addNewLabels }: {languages:string[],selectedLanguages:string[],handleLanguageSelection:(lang:string)=>void,addNewLabels:()=>void}) => {
    const [search, setSearch] = useState("");

  

    return (
        <AppBar position="static" color="default" elevation={1}>
            <Toolbar sx={{ display: "flex", gap: 2 }}>
                {/* Language Selection Dropdown */}
                <LanguageSelection languages={languages} selectedLanguages={selectedLanguages} handleLanguageSelection={handleLanguageSelection} />
                {/* Action Buttons */}
                <NewLabels addNewLabel={addNewLabels} />
                <Button startIcon={<EditIcon />} variant="contained" color="secondary">
                    Edit Labels
                </Button>

                {/* Search Bar (Grows to take up space) */}
                <Box sx={{ flexGrow: 1 }}>
                    <TextField
                        size="small"
                        variant="outlined"
                        placeholder="Search labels..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        InputProps={{
                            startAdornment: <SearchIcon color="action" />,
                        }}
                        sx={{ width: "100%" }}
                    />
                </Box>

                {/* More Options */}
                <IconButton>
                    <MoreVertIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
};

export default TopNavBar;
