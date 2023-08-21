import { LabelsContainerStates } from './LabelsContainer/index';
import { CreateLabel } from './SaveLabel/index';
import './style.css';
import { IenableStates } from '../../App';
import  { labelDataArrType, labelDataType } from '../../db';
import { Dispatch, SetStateAction } from 'react';
export interface IlabelsContainerStates extends IenableStates {
    dbData: labelDataArrType | undefined,
    setDbData: (arg: labelDataArrType) => void
    addLabel: (arg: labelDataType) => void,
    addLabels: (arg: labelDataArrType) => void
}
export default function LeftSide({ enableStates, updateStates, dbData, setDbData,addLabel, addLabels}: IlabelsContainerStates) {
    return (
        <div id="leftSide">
            <LabelsContainerStates enableStates={enableStates} updateStates={updateStates} dbData={dbData} setDbData={setDbData} addLabel={addLabel} addLabels={addLabels }/>
        </div>
    );
}



