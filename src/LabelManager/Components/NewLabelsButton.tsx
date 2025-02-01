import { Box, Button, IconButton } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { useState, useEffect, useRef } from "react";

const NewLabels = ({ addNewLabel }: { addNewLabel: (amount?: number) => void }) => {
    const [amount, setAmount] = useState<number>(1);
    const [editing, setEditing] = useState(false);
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    const minimum = 1;
    const maximum = 25;

    const increase = () => setAmount((prev) => Math.min(prev + 1, maximum));
    const decrease = () => setAmount((prev) => Math.max(prev - 1, minimum));

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setEditing(false);
            }
        };
        if (editing) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [editing]);

    return (
        <Box
            ref={wrapperRef}
            sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                width: "fit-content",
                position: "relative",
                height: "2.5rem",
                overflow: "hidden",
            }}
        >
            {editing ? (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        border: '1px solid',
                        borderColor: 'grey.300',
                        borderRadius: 1,
                        px: 1.5,
                        py: 0.5,
                    }}
                >
                    <IconButton
                        onClick={decrease}
                        size="small"
                        sx={{ p: 0.3 }}
                        disabled={amount === minimum}
                        aria-label="Decrease amount"
                    >
                        <Remove fontSize="small" />
                    </IconButton>
                    <Box sx={{ fontSize: '1rem', fontWeight: 'bold' }}>{amount}</Box>
                    <IconButton
                        onClick={increase}
                        size="small"
                        sx={{ p: 0.3 }}
                        disabled={amount === maximum}
                        aria-label="Increase amount"
                    >
                        <Add fontSize="small" />
                    </IconButton>
                </Box>
            ) : (
                // Default View (Just the Number)
                <Button
                    variant="text"
                    onClick={() => setEditing(true)}
                    sx={{ minWidth: 50, fontSize: "1rem", fontWeight: "bold" }}
                >
                    {amount}
                </Button>
            )}
            <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => addNewLabel(amount)}
                disabled={amount < minimum || amount > maximum}
            >
                Add {amount} Label{amount > 1 ? "s" : ""}
            </Button>
        </Box>
    );
};

export default NewLabels;