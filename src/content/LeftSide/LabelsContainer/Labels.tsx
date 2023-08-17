import { LabelTable } from './LabelTable';
import { labelDataArrType } from '../../../db';

import './labels.css';
export default function Labels({ dbData, filterText, filterCategory }: { dbData: labelDataArrType | undefined, filterText: string, filterCategory:Array<string> }) {
    return (
        <div id="Signs"><LabelTable dbData={dbData} filterText={filterText} filterCategory={filterCategory } /></div>
        );

}