import { labelDataType } from "../db";
import { IaddedLabel } from "./Content";

export interface IcontentProps {
    dbData: labelDataType[] | undefined,
    setDbData: (arg: labelDataType[]) => void,
    handleCreateLabel: (arg: any) => Promise<boolean>,
    selectedLabels: IaddedLabel[],
    addLabel: (arg: IaddedLabel) => void,
    addNewLabel: (arg: labelDataType) => void,
    addLabels: (arg: labelDataType[]) => void,
    deleteLabel: (arg: labelDataType) => void,
    deleteLabels: (arg: labelDataType[]) => void,
    handleSaveLabel: (arg: labelDataType) => void,
    enableLabelForm: boolean,
    handleLabelFormClose: () => void,
    addLabelsById: () => void,
    selectLabelsById: (arg: string[]) => void
}