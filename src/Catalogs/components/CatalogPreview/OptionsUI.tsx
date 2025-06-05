import { Button } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useContext } from "react";
import { enableStatesContext } from "../../../App";
import { IloadedCatalog } from "../../../DB/Interfaces/Catalogs";
import { Design } from "../../../DB/Interfaces/Designs";
import DesignSelector from "./DesignSelector";

const OptionsUI = ({ catalog, design, setDesign, qrCode, setQrCode, twoSided, setTwoSided }:
    {
        catalog: IloadedCatalog,
        design: Design | null,
        setDesign: (design: Design) => void,
        qrCode: Boolean,
        setQrCode: (bool: Boolean) => void,
        twoSided: boolean,
        setTwoSided: (bool: boolean) => void
    }) => {
    const [enableStates, updateStates] = useContext(enableStatesContext);
    return (
        <Grid container>
            <Grid>
                <DesignSelector design={design} setDesign={setDesign} />
            </Grid>
            <Grid>
                {/* Create PDF and show popovers */}
                <Button onClick={() => updateStates('createPDF', true)}>Create PDF</Button>
                <Button onClick={() => setQrCode(!qrCode)}>
                    {qrCode ? 'Hide QR Code' : 'Show QR Code'}
                </Button>
            </Grid>
            <Grid>
                <Button onClick={() => setTwoSided(!twoSided)}>
                    {twoSided ? '1 Sided Print' : '2 Sided Print'}
                </Button>
            </Grid>
        </Grid>
    );
};

export default OptionsUI;