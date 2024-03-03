import { LabelsContainerStates } from './LabelsContainer/index';
import './style.css';
import  { labelDataType } from '../../db';
import { IcontentProps } from '../InterfacesContent';

export interface IlabelsContainerProps {
    dbData: labelDataType[] | undefined,
    setDbData: (arg: labelDataType[]) => void
    addNewLabel: (arg: labelDataType) => void,
    addLabels: (arg: labelDataType[]) => void,
    deleteLabel: (arg: labelDataType) => void,
    handleSaveLabel: (arg: labelDataType) => void,
    deleteLabels: (arg: labelDataType[]) => void,
    selectLabelsById: (arg: string[]) => void,
    addLabelsById: () => void
}
export default function LeftSide({ dbData, setDbData, addNewLabel, addLabels, deleteLabel, handleSaveLabel, deleteLabels, addLabelsById, selectLabelsById }: IcontentProps) {
    const props = { dbData, setDbData, addNewLabel, addLabels, deleteLabel, handleSaveLabel, deleteLabels, addLabelsById, selectLabelsById };
    return (
                <LabelsContainerStates {...props} />
    );
}



