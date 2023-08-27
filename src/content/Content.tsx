import LeftSide from './LeftSide/index';
import MidSide from './MidSide/index';
import RightSide from './RightSide/index';
import './content.css';

import { IenableStates } from '../App';
import { CreateLabel } from './LeftSide/SaveLabel';
import { useState } from 'react';
import { labelDataType, labelDataArrType } from '../db';
export interface IaddedLabels extends labelDataType {
    count:number
};
export default function Content({ enableStates, updateStates }: IenableStates) {
    const [dbData, setDbData]: [dbData: labelDataArrType | undefined, setDbData: (arg: labelDataArrType|undefined) => void] = useState();
    const [addedLabels, setAddedLabels] = useState<IaddedLabels[]>([]);
    const [previewLabel, setPreviewLabel] = useState<labelDataType | undefined>();
    const setPreview = (label: labelDataType) => {
        setPreviewLabel(label);
    };
    const addLabel = (label: IaddedLabels) => {  
        setAddedLabels(current => [...current].map(lbl => {
            if (lbl._id === label._id) {
                return {
                    ...lbl,
                    count: label.count
                }
            }
            else return lbl;
        }));       
    };
    const addNewLabel = (label: labelDataType) => {
        if (findId(label._id) !== -1) {
            setAddedLabels(current => [...current].map(lbl => {
                if (lbl._id === label._id) {
                    return {
                        ...lbl,
                        count: lbl.count + 1
                    }
                }
                else return lbl;
            }));
        } else {
            let tmpList = [...addedLabels];
            let tmp = structuredClone(label);
            tmp.count = 1;
            tmpList.push(tmp);
            console.log(tmpList);
            setAddedLabels(current => current.concat([tmp]));
        }
    };
    const addLabels = (labels: labelDataArrType) => {
        labels.forEach(label => addNewLabel(label));
    };
    const findId = (id: string) => {
        for (let i = 0; i < addedLabels.length; i++) {
            if (addedLabels[i]._id === id) return i;
        }
        return -1;
    };
    return (
        <div id="mainContent">
            <LeftSide enableStates={enableStates} updateStates={updateStates} dbData={dbData} setDbData={setDbData} addLabel={addNewLabel} addLabels={addLabels} setPreview={setPreview }/>
            <MidSide labels={addedLabels} addLabel={addLabel} enableStates={enableStates} updateStates={updateStates} previewLabel={previewLabel }/>
            <RightSide enable={enableStates} setEnable={updateStates} labels={addedLabels }/>
            <CreateLabel enable={enableStates} setEnable={updateStates} />
        </div>
        );
}




