import SearchContainer from './SearchContainer';
import FilterNavContainer from './FilterNavContainer';
import Labels from './Labels';
import { Dispatch, SetStateAction, useState } from 'react';
import './index.css';
import { labelDataType, labelDataArrType } from '../../../db';
import { IenableStates } from '../../../App';

interface Tprops { filterText: string, setFilterText: Dispatch<SetStateAction<string>>, dbData: labelDataArrType | undefined, setDbData: (arg: labelDataArrType) => void, filterCategory: Array<string>, setFilterCategory: React.Dispatch<SetStateAction<string[]>> };
export default function LabelsContainer({ props }: { props: Tprops }) {
  
    return (
        <div id="SignsContainer" className="focus">
            <SearchContainer setDbData={props.setDbData} filterText={props.filterText} setFilterText={props.setFilterText} filterCategory={props.filterCategory} setFilterCategory={props.setFilterCategory} />
            <FilterNavContainer filterCategory={props.filterCategory} setFilterCategory={props.setFilterCategory} />
            <Labels dbData={props.dbData} filterText={props.filterText} filterCategory={props.filterCategory} />
        </div>
    );
}

export function LabelsContainerStates({enableStates, updateStates }:IenableStates) {
    const [filterCategory, setFilterCategory] = useState<string[]>(['all']);
    const [filterText, setFilterText] = useState('');
   // let initState: labelDataArrType = [{ _id: '0', category: [], allergens: [1], bg: "No Labels Loaded", en: '', de: '', rus: '' }];
    const [dbData, setDbData]: [dbData: labelDataArrType | undefined, setDbData: (arg: labelDataArrType) => void] = useState();
    var props:Tprops = {filterText:filterText,setFilterText:setFilterText,dbData:dbData,setDbData:setDbData,filterCategory:filterCategory,setFilterCategory:setFilterCategory};
    return (
        <LabelsContainer props={props}/>
        );
}
