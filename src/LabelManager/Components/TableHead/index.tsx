import {
    TableRow,
    TableCell,
    TableHead,
} from "@mui/material";
import React from "react";
import DescriptionGeneratorButton from "./GenerateDescriptionsButton";
import { labelDataType } from "../../../DB/Interfaces/Labels";
import TranslateButton from "./TranslateButton";
export default function TableHeadComponent({ labels, selectedLanguages, setLabels }:
    {
        labels: labelDataType[],
        selectedLanguages: string[],
        setLabels: (labels: any) => void,
    })
{
    return (
        <TableHead>
            <TableRow>
                <TableCell>Select</TableCell>
                <TableCell>Allergens</TableCell>
                <TableCell>Categories</TableCell>
                {selectedLanguages.map((lang, index) => (
                    <React.Fragment key={lang}>
                        <TableCell key={`${lang}-name`}>{`Name (${lang.toUpperCase()})`}
                            <div style={{ display: "flex", gap: "4px", marginTop: "4px" }}>

                                <TranslateButton
                                    sourceLang={lang}
                                    attr="name"
                                    labels={labels}
                                    setLabels={setLabels}
                                />
                                <DescriptionGeneratorButton
                                    labels={labels}
                                    sourceLang={lang}
                                    setLabels={setLabels}
                                />
                            </div>
                        </TableCell>
                        <TableCell key={`${lang}-desc`}>{`Description (${lang.toUpperCase()})`}
                            <TranslateButton sourceLang={lang} attr="description" labels={labels} setLabels={setLabels} />
                        </TableCell>
                    </React.Fragment>
                ))}
                <TableCell>Preview</TableCell>
            </TableRow>
        </TableHead>
    );
};