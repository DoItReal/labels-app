import LeftSide from './LeftSide/index';
import MidSide from './MidSide/index';
import RightSide from './RightSide/index';
import './content.css';

import { IenableStates } from '../App';
import { CreateLabel } from './LeftSide/SaveLabel';
import { useState } from 'react';
import {labelDataType, labelDataArrType } from '../db';
export default function Content({ enableStates, updateStates }: IenableStates) {
    const [dbData, setDbData]: [dbData: labelDataArrType | undefined, setDbData: (arg: labelDataArrType|undefined) => void] = useState();
    const [addedLabels, setAddedLabels] = useState<labelDataType[]>([]);
    const addLabel = (label: labelDataType) => {
        let tmpList = [...addedLabels];
        tmpList.push(label);
        setAddedLabels(tmpList);
    };
    const addLabels = (labels: labelDataArrType) => {
        let tmpList = [...addedLabels];
        tmpList = tmpList.concat(labels);
        setAddedLabels(tmpList);
    };
    return (
        <div id="mainContent">
            <LeftSide enableStates={enableStates} updateStates={updateStates} dbData={dbData} setDbData={setDbData} addLabel={addLabel} addLabels={addLabels }/>
            <MidSide labels={addedLabels} setLabels={setAddedLabels} />
            <RightSide enable={enableStates} setEnable={updateStates} labels={addedLabels }/>
            <CreateLabel enable={enableStates} setEnable={updateStates} />
        </div>
        );
}




