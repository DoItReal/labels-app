import { LabelTable } from './LabelTable';
import { labelDataArrType, labelDataType } from '../../../db';

import './labels.css';
export default function Labels({ dbData, filterText, filterCategory, selectLabel, unSelectLabel, generateList, unSelectAll }:
    {
        dbData: labelDataArrType | undefined,
        filterText: string,
        filterCategory: Array<string>,
        selectLabel: (arg: labelDataType) => void,
        unSelectLabel: (arg: labelDataType) => void,
        generateList: () => void,
        unSelectAll: () => void
    }) {
    return (
        <div id="Signs"><LabelTable dbData={dbData} filterText={filterText} filterCategory={filterCategory} selectLabel={selectLabel} unSelectLabel={unSelectLabel} generateList={generateList} unSelectAll={unSelectAll }/></div>
        );

}