import { ErrorUI } from '../Error';
import LeftSide from './LeftSide/index';
import MidSide from './MidSide/index';
import RightSide from './RightSide/index';
import './content.css';
import { CreateLabel } from './LeftSide/SaveLabel';
import { useState } from 'react';
import { labelDataType } from '../db';
import { db } from '../App';
import { findIndexByProperty } from '../tools/helpers';

export interface IaddedLabel extends labelDataType {
    count:number
};
export interface IcontentProps {
    dbData: labelDataType[] | undefined,
    setDbData: (arg: labelDataType[]) => void,
    handleCreateLabel:(arg:any) => Promise<boolean>,
    addedLabels: IaddedLabel[],
    addLabel: (arg: IaddedLabel) => void,
    addNewLabel: (arg: labelDataType) => void,
    addLabels: (arg: labelDataType[]) => void,
    deleteLabel: (arg: labelDataType) => void,
    deleteLabels: (arg: labelDataType[]) => void,
    handleSaveLabel: (arg:labelDataType)=>void
}

export default function ContentStates() {
    const [error, setError] = useState<JSX.Element | null>(null);
    const [dbData, setDbData] = useState<labelDataType[]>([]);
    const [addedLabels, setAddedLabels] = useState<IaddedLabel[]>([]);
    //add label using setDbData(label)
    const addDbLabel = (label: labelDataType) => {
        if (props.dbData instanceof Array) {
            const tmp = [...props.dbData, label];
            props.setDbData(tmp);
        } else {
            console.log('second');
            props.setDbData([label]);
        }
        
    }
    //add label to selected
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
    //add 1 label to selected
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
    //add Array<labelDataType> to selected
    const addLabels = (labels: labelDataType[]) => {
        labels.forEach(label => addNewLabel(label));
    };
    //find ID of label in selected
    const findId = (id: string) => {
        for (let i = 0; i < addedLabels.length; i++) {
            if (addedLabels[i]._id === id) return i;
        }
        return -1;
    };
    //delete Label from DB and remove it from dbData
    const deleteDBLabel = (label: labelDataType) => {
        return (new Promise<void>(async (resolve, reject) => {
        const update = (array: labelDataType[]): labelDataType[] => {
            const index = findIndexByProperty(array, '_id', label._id);
            if (index === -1) return structuredClone(array);          
            array.splice(index, 1);
            return structuredClone(array);
        };
        
        try {
            await db.deleteLabel(label._id).then(async(lbl) => {
                const array = [...dbData];
                setDbData(array => update(array));
            });
            resolve();

        } catch (error) {
            reject(new Error(String(error)));
            
            }
        }));
    }
    //delete selected labels 
    const deleteDBLabels =  (labels: labelDataType[]) => {
        labels.forEach(async (label) => {
            try {
                await deleteDBLabel(label);
            } catch (error) {
                const time = 5000;
                setError(<ErrorUI error={String(error)} time={time} />);
                setTimeout(()=>setError(null), time);
            }
        });
    }
    //handle saving label and updating dbData
    const handleSaveLabel = async (label: labelDataType) => {
        try {
            const editedLabel = await db.saveLabel(label);
            const array = [...dbData];
            const index = findIndexByProperty(array, '_id', editedLabel._id);
            if (index === -1) return;
            array[index] = editedLabel;
            setDbData(array);
            } catch (error) {
            console.log(error);
        }
    }
    //handle create label and updating dbData
    const handleCreateLabel = async (label: any) => {
        try {
            const lbl = await db.createNewLabel(label);
            addDbLabel(lbl);
            return true;
        } catch (error) {
            return false;
        }
}
    const props: IcontentProps = {dbData, setDbData,handleCreateLabel, addNewLabel, addLabels, addLabel, addedLabels, deleteLabel:deleteDBLabel,deleteLabels:deleteDBLabels, handleSaveLabel };
    return (
        <>
        <Content props={props} />
            {error !== null ? error : null }
            </>
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

