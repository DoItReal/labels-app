import LeftSide from './LeftSide/index';
import MidSide from './MidSide/index';
import './content.css';

import { IenableStates } from '../App';
import { CreateLabel } from './LeftSide/SaveLabel';
import { useState } from 'react';
import {labelDataType, labelDataArrType } from '../db';
import { db } from '../App';
export default function Content({ enableStates, updateStates }: IenableStates) {
    const [dbData, setDbData]: [dbData: labelDataArrType | undefined, setDbData: (arg: labelDataArrType|undefined) => void] = useState();
    const [addedLabels, setAddedLabels] = useState<labelDataType[]>([]);
    return (
        <div id="mainContent">
            <LeftSide enableStates={enableStates} updateStates={updateStates} dbData={dbData} setDbData={setDbData} setAddedLabels={setAddedLabels }/>
            <MidSide labels={addedLabels} setLabels={setAddedLabels} />
            <RightSide />
            <CreateLabel enable={enableStates} setEnable={updateStates} />
        </div>
        );
}


function RightSide() {
    return (
        <div id="rightSide">
            <div className="previewList" />
            <iframe id="pdf" />
        </div>
        );
}

