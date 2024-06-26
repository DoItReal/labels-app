import { IloadedCatalog, IloadedLabel } from "../DB/Interfaces/Catalogs";
import { labelDataType } from "../DB/Interfaces/Labels";


export interface IcontentProps {
    dbData: labelDataType[] | undefined,
    setDbData: (arg: labelDataType[]) => void,
    handleCreateLabel: (arg: any) => Promise<boolean>,
    loadedCatalog: IloadedCatalog | null,
    setLoadedCatalog: (arg: IloadedCatalog) => void,
    addLabel: (arg: IloadedLabel) => void,
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