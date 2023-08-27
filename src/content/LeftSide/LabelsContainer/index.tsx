import SearchContainer from './SearchContainer';
import FilterNavContainer from './FilterNavContainer';
import Labels from './Labels';
import { Dispatch, SetStateAction, useState } from 'react';
import './index.css';
import { labelDataType, labelDataArrType } from '../../../db';
import { IlabelsContainerStates } from '../index';
interface Tprops {
    filterText: string,
    setFilterText: Dispatch<SetStateAction<string>>,
    dbData: labelDataArrType | undefined,
    setDbData: (arg: labelDataArrType) => void,
    filterCategory: Array<string>,
    setFilterCategory: React.Dispatch<SetStateAction<string[]>>,
    addLabels: (arg: labelDataArrType) => void,
    selectedLabels: Array<labelDataType>,
    setSelectedLabels: (arg: labelDataArrType) => void
    enableStates: Map<string,boolean>,
    updateStates: (key: string, value: boolean) => void,
    setPreview: (label:labelDataType)=>void
};

export default function LabelsContainer({ props }: { props: Tprops }) {
    const findIndexOfLabel = (label: labelDataType) => {
        for (let i = 0; i < props.selectedLabels.length; i++) {
            if (label._id == props.selectedLabels[i]._id)         return i;
        }
        return -1;
    };

    const selectLabel = (label: labelDataType) => {
        let index = findIndexOfLabel(label);
        if (index != -1) return;
        props.selectedLabels.push(label);
        props.setSelectedLabels([...props.selectedLabels]);
    };
    const unSelectLabel = (label: labelDataType) => {
        let tmpList = [...props.selectedLabels];
        let index = findIndexOfLabel(label);
        if (index != -1) {
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
    return (
        <div id="SignsContainer" className="focus">
            <SearchContainer setDbData={props.setDbData} filterText={props.filterText} setFilterText={props.setFilterText} filterCategory={props.filterCategory} setFilterCategory={props.setFilterCategory} />
            <FilterNavContainer filterCategory={props.filterCategory} setFilterCategory={props.setFilterCategory} generateList={generateList} />
            <Labels dbData={props.dbData} filterText={props.filterText} filterCategory={props.filterCategory} selectLabel={selectLabel} unSelectLabel={unSelectLabel} unSelectAll={unSelectAll} generateList={generateList} enableStates={props.enableStates} updateStates={props.updateStates} setPreview={props.setPreview }/>
        </div>
    );
}

export function LabelsContainerStates({ enableStates, updateStates, dbData, setDbData, addLabels, setPreview }: IlabelsContainerStates) {
    const [filterCategory, setFilterCategory] = useState<string[]>(['all']);
    const [filterText, setFilterText] = useState('');
    const [selectedLabels, setSelectedLabels] = useState<labelDataArrType>([]);
   // let initState: labelDataArrType = [{ _id: '0', category: [], allergens: [1], bg: "No Labels Loaded", en: '', de: '', rus: '' }];
    var props:Tprops = {filterText:filterText,setFilterText:setFilterText,dbData:dbData,setDbData:setDbData,filterCategory:filterCategory,setFilterCategory:setFilterCategory,addLabels:addLabels, selectedLabels:selectedLabels,setSelectedLabels:setSelectedLabels, enableStates:enableStates,updateStates:updateStates, setPreview:setPreview};
    return (
        <LabelsContainer props={props}/>
        );
}
