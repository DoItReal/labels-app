import { LabelsContainerStates } from './LabelsContainer/index';
import './style.css';
import { IenableStates } from '../../App';
import  { labelDataType } from '../../db';
import { IaddedLabel, IcontentProps } from '../Content';

export interface IlabelsContainerProps extends IenableStates {
    dbData: labelDataType[] | undefined,
    setDbData: (arg: labelDataType[]) => void
    addLabel: (arg: IaddedLabel) => void,
    addLabels: (arg: labelDataType[]) => void,
    setPreview: (label:labelDataType)=>void
}
export default function LeftSide({ enableStates, updateStates, dbData, setDbData, addLabel, addLabels, setPreview }: IcontentProps) {
    const props = { enableStates, updateStates, dbData, setDbData, addLabel, addLabels, setPreview };
    return (
        <div id="leftSide">
            <LabelsContainerStates {...props} />
        </div>
    );
}



