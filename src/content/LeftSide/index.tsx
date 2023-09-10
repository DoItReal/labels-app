import { LabelsContainerStates } from './LabelsContainer/index';
import './style.css';
import  { labelDataType } from '../../db';
import { IcontentProps } from '../Content';

export interface IlabelsContainerProps {
    dbData: labelDataType[] | undefined,
    setDbData: (arg: labelDataType[]) => void
    addNewLabel: (arg: labelDataType) => void,
    addLabels: (arg: labelDataType[]) => void,
    setPreview: (label: labelDataType) => void,
    deleteLabel: (arg: labelDataType) => void,
    handleSaveLabel: (arg: labelDataType) => void,
    deleteLabels: (arg: labelDataType[]) => void
}
export default function LeftSide({ dbData, setDbData, addNewLabel, addLabels, setPreview, deleteLabel, handleSaveLabel, deleteLabels }: IcontentProps) {
    const props = { dbData, setDbData, addNewLabel, addLabels, setPreview, deleteLabel, handleSaveLabel, deleteLabels };
    return (
        <div id="leftSide">
            <LabelsContainerStates {...props} />
        </div>
    );
}



