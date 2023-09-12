import SearchContainer from './SearchContainer';
import FilterNavContainer from './FilterNavContainer';
import Labels from './Labels';
import { Dispatch, SetStateAction, useState } from 'react';
import './index.css';
import { labelDataType } from '../../../db';
import { IlabelsContainerProps } from '../index';

interface Tprops {
    filterText: string,
    setFilterText: Dispatch<SetStateAction<string>>,
    dbData: labelDataType[] | undefined,
    setDbData: (arg: labelDataType[]) => void,
    filterCategory: Array<string>,
    setFilterCategory: React.Dispatch<SetStateAction<string[]>>,
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
    filterText: string,
    filterCategory: Array<string>,
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
   
    const labelsProps:IlabelsProps = { dbData:props.dbData, filterText:props.filterText,filterCategory:props.filterCategory,selectLabel,unSelectLabel,unSelectAll,generateList, addLabel:props.addLabel, deleteLabel:props.deleteLabel, handleSaveLabel:props.handleSaveLabel, deleteLabels:props.deleteLabels };
    return (
        <div id="SignsContainer" className="focus">
            <SearchContainer setDbData={props.setDbData} filterText={props.filterText} setFilterText={props.setFilterText} filterCategory={props.filterCategory} setFilterCategory={props.setFilterCategory} />
            <FilterNavContainer filterCategory={props.filterCategory} setFilterCategory={props.setFilterCategory} generateList={generateList} selectedLabels={props.selectedLabels} setSelectedLabels={props.setSelectedLabels} deleteLabels={props.deleteLabels }/>
            <Labels props={labelsProps }/>
        </div>
    );
}

export function LabelsContainerStates({ dbData, setDbData,addNewLabel, addLabels, deleteLabel,deleteLabels, handleSaveLabel }: IlabelsContainerProps) {
    const [filterCategory, setFilterCategory] = useState<string[]>(['all']);
    const [filterText, setFilterText] = useState('');
    const [selectedLabels, setSelectedLabels] = useState<labelDataType[]>([]);
   // let initState: labelDataArrType = [{ _id: '0', category: [], allergens: [1], bg: "No Labels Loaded", en: '', de: '', rus: '' }];
    var props:Tprops = {filterText:filterText,setFilterText:setFilterText,dbData:dbData,setDbData:setDbData,filterCategory:filterCategory,setFilterCategory:setFilterCategory,addLabels:addLabels, selectedLabels:selectedLabels,setSelectedLabels:setSelectedLabels, addLabel:addNewLabel, deleteLabel,deleteLabels, handleSaveLabel};
    return (
        <LabelsContainer props={props}/>
        );
}
