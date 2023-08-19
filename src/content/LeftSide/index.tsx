import { LabelsContainerStates } from './LabelsContainer/index';
import { CreateLabel } from './SaveLabel/index';
import './style.css';
import { IenableStates } from '../../App';
import  { labelDataArrType } from '../../db';
import { Dispatch, SetStateAction } from 'react';
export interface IlabelsContainerStates extends IenableStates {
    dbData: labelDataArrType | undefined,
    setDbData: (arg: labelDataArrType) => void
    setAddedLabels: Dispatch<SetStateAction<labelDataArrType>>
}
export default function LeftSide({ enableStates, updateStates, dbData, setDbData,setAddedLabels}: IlabelsContainerStates) {
    return (
        <div id="leftSide">
            <LabelsContainerStates enableStates={enableStates} updateStates={updateStates} dbData={dbData} setDbData={setDbData} setAddedLabels={setAddedLabels }/>
        </div>
    );
}



