import FilterNavContainer from './FilterNavContainer';
import { useState, createContext } from 'react';
import './index.css';
import { labelDataType } from '../../../db';
import { IlabelsContainerProps } from '../index';
import LabelTable from './LabelTable';
import { Box } from '@mui/material';

//@ts-ignore
export const filterCategoryContext = createContext<[string[],(arg:string[])=>void]>();
interface Tprops {
    dbData: labelDataType[] | undefined,
    setDbData: (arg: labelDataType[]) => void,
    addLabels: (arg: labelDataType[]) => void,
    addLabel: (arg: labelDataType) => void,
    deleteLabel: (arg:labelDataType) => void,
    selectedLabels: Array<labelDataType>,
    setSelectedLabels: (arg: labelDataType[]) => void,
    handleSaveLabel: (label: labelDataType) => void,
    deleteLabels: (arg:labelDataType[])=> void
};
export interface IlabelsProps {
    dbData: labelDataType[] | undefined,
    selectLabel: (arg: labelDataType) => void,
    unSelectLabel: (arg: labelDataType) => void,
    addLabel: (arg:labelDataType)=>void,
    generateList: () => void,
    unSelectAll: () => void,
    deleteLabel: (arg: labelDataType) => void,
    handleSaveLabel: (arg: labelDataType) => void,
    deleteLabels: (arg:labelDataType[])=>void
}
export default function LabelsContainer({ props }: { props: Tprops }) {
    const findIndexOfLabel = (label: labelDataType) => {
        for (let i = 0; i < props.selectedLabels.length; i++) {
            if (label._id === props.selectedLabels[i]._id)         return i;
        }
        return -1;
    };

    const selectLabel = (label: labelDataType) => {
        let index = findIndexOfLabel(label);
        if (index !== -1) return;
        props.selectedLabels.push(label);
        props.setSelectedLabels([...props.selectedLabels]);
    };
    const unSelectLabel = (label: labelDataType) => {
        let tmpList = [...props.selectedLabels];
        let index = findIndexOfLabel(label);
        if (index !== -1) {
            tmpList.splice(index, 1);
            props.setSelectedLabels([...tmpList]);
        } else  
        console.log('the label is not in the list');
    }
    const unSelectAll = () => {
        props.setSelectedLabels([]);
    }
    const generateList = () => {
        props.addLabels([...props.selectedLabels]);
    };
   
    const labelsProps:IlabelsProps = { dbData:props.dbData,selectLabel,unSelectLabel,unSelectAll,generateList, addLabel:props.addLabel, deleteLabel:props.deleteLabel, handleSaveLabel:props.handleSaveLabel, deleteLabels:props.deleteLabels };
    return (
        <Box height={1} sx={{ display: 'flex',p:0,m:0, flexDirection: 'column' }} >
            <Box  sx={{ display: 'flex',p:0,m:0, width: '100%' }}>
                <FilterNavContainer setDbData={props.setDbData} generateList={generateList} selectedLabels={props.selectedLabels} setSelectedLabels={props.setSelectedLabels} deleteLabels={props.deleteLabels} />
            </Box>
            <Box height={9 / 10} sx={{  overflow: 'auto' }}>
                <LabelTable {...labelsProps} />
            </Box>
        </Box>
       
    );
}

export function LabelsContainerStates({ dbData, setDbData,addNewLabel, addLabels, deleteLabel,deleteLabels, handleSaveLabel }: IlabelsContainerProps) {
    const [filterCategory, setFilterCategory] = useState<string[]>(['all']);
    const [filterText, setFilterText] = useState('');
    const [selectedLabels, setSelectedLabels] = useState<labelDataType[]>([]);
   // let initState: labelDataArrType = [{ _id: '0', category: [], allergens: [1], bg: "No Labels Loaded", en: '', de: '', rus: '' }];
    var props:Tprops = {dbData:dbData,setDbData:setDbData,addLabels:addLabels, selectedLabels:selectedLabels,setSelectedLabels:setSelectedLabels, addLabel:addNewLabel, deleteLabel,deleteLabels, handleSaveLabel};
    return (
        <filterCategoryContext.Provider value={[filterCategory, setFilterCategory]}>
            <LabelsContainer props={props} />
        </filterCategoryContext.Provider>
        );
}
