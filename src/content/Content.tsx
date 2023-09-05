import LeftSide from './LeftSide/index';
import MidSide from './MidSide/index';
import RightSide from './RightSide/index';
import './content.css';
import { IenableStates } from '../App';
import { CreateLabel } from './LeftSide/SaveLabel';
import { useState } from 'react';
import { labelDataType } from '../db';

export interface IaddedLabel extends labelDataType {
    count:number
};
export interface IcontentProps extends IenableStates {
    dbData: labelDataType[] | undefined,
    setDbData: (arg: labelDataType[]) => void,
    addedLabels: IaddedLabel[],
    addLabel: (arg: IaddedLabel) => void,
    previewLabel: labelDataType | undefined,
    setPreview: (arg: labelDataType) => void,
    addNewLabel: (arg: labelDataType) => void,
    addLabels: (arg: labelDataType[]) => void,
}

export default function ContentStates({ enableStates, updateStates }: IenableStates) {
    const [dbData, setDbData]: [dbData: labelDataType[] | undefined, setDbData: (arg: labelDataType[] | undefined) => void] = useState();
    const [addedLabels, setAddedLabels] = useState<IaddedLabel[]>([]);
    const [previewLabel, setPreviewLabel] = useState<labelDataType | undefined>();
    const setPreview = (label: labelDataType) => {
        setPreviewLabel(label);
    };
    const addLabel = (label: IaddedLabel) => {
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
            setAddedLabels(current => current.concat([tmp]));
        }
    };
    const addLabels = (labels: labelDataType[]) => {
        labels.forEach(label => addNewLabel(label));
    };
    const findId = (id: string) => {
        for (let i = 0; i < addedLabels.length; i++) {
            if (addedLabels[i]._id === id) return i;
        }
        return -1;
    };
    const props: IcontentProps = { enableStates, updateStates, dbData, setDbData, addNewLabel, addLabels, setPreview, addLabel, addedLabels, previewLabel };
    return (
        <Content props={ props } />
        );
}

function Content({ props }: { props: IcontentProps }) {
    return (
        <div id="mainContent">
            <LeftSide {...props} />
            <MidSide {...props} />
            <RightSide {...props} />
            <CreateLabel {...props} />
        </div>
    );
}

