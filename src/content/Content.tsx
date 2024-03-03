import { ErrorUI } from '../Error';
import LeftSide from './LeftSide/index';
import RightSide from '../PDF/index';
import { CreateLabel } from './LeftSide/SaveLabel';
import { useState, useContext } from 'react';
import { labelDataType } from '../db';
import { db } from '../App';
import { findIndexByProperty } from '../tools/helpers';
import { Box, Grid } from '@mui/material';
import { enableStatesContext } from '../App';
import AddedLabelsTable from './LeftSide/LabelsContainer/AddedLabels';
import { addSelectedLabel, fetchSelectedLabels } from '../PDF/selectedLabelsDB';
import { IcontentProps } from './InterfacesContent';
export interface IaddedLabel extends labelDataType {
    count:number
};
export const isIaddedLabel = (label: any): label is IaddedLabel => {
    return label && label._id && label.count;
}

export default function ContentStates() {
    const [error, setError] = useState<JSX.Element | null>(null);
    const [dbData, setDbData] = useState<labelDataType[]>([]);
    const [addedLabels, setAddedLabels] = useState<IaddedLabel[]>(fetchSelectedLabels());
    const [enableStates, setEnableStates] = useContext(enableStatesContext);
    const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
    const enableLabelForm = enableStates.get('labelForm');
    const handleLabelFormClose = () => {
        setEnableStates('labelForm',false);
    }
    //add label using setDbData(label)
    const addDbLabel = (label: labelDataType) => {
        if (props.dbData instanceof Array) {
            const tmp = [...props.dbData, label];
            props.setDbData(tmp);
        } else {
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
        addSelectedLabel(label);
        setAddedLabels(fetchSelectedLabels());
    };
    //add Array<labelDataType> to selected
    const addLabels = (labels: labelDataType[]) => {
        labels.forEach(label => addNewLabel(label));
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
    const addLabelsById = () => {
        for (const label of selectedLabels) {
            for (const dbLabel of dbData) {
                if (dbLabel._id === label) {
                    addLabels([dbLabel]);
                    break;
                }
            }
        }
    };
    const selectLabelsById = (labels: string[]) => {
        setSelectedLabels([...labels]);
    }
    const props: IcontentProps = {dbData,enableLabelForm,addLabelsById,selectLabelsById, setDbData,handleCreateLabel,handleLabelFormClose, addNewLabel, addLabels, addLabel, selectedLabels:addedLabels, deleteLabel:deleteDBLabel,deleteLabels:deleteDBLabels, handleSaveLabel };
    return (
        <>
        <Content props={props} />
            {error !== null ? error : null }
            </>
        );
}

function Content({ props }: { props: IcontentProps }) {
    return (
        <>
            <Box minHeight={8 / 10} sx={{
            position: 'sticky',
            display: 'block',
            p: 0,
            m:0,
            minWidth: '100%',
            width: '100%',
            justifyContent: 'stretch',
            alignItems: 'stretch',
        }}>
            <Grid container spacing={0} m={0} p={0} height={1} sx={{ p: 0, m: 0,overflow:'auto'}} >
                    <Grid xs={12} md={6} m={0} p={0} height={1 } >
              <LeftSide {...props} />
            </Grid>
                    <Grid xs={12} md={6} m={0} p={0} height={1}>
                        <AddedLabelsTable labels={props.selectedLabels} updateLabel={props.addLabel }/>
                    </Grid>
                  
           
         

            </Grid>
            </Box>
            <RightSide /> 
         { props.enableLabelForm ? <CreateLabel {...props} /> : null }
         </>
    );
}

