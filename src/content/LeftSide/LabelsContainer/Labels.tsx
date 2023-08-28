import { LabelTable } from './LabelTable';
import { IlabelsProps } from './index';
import './labels.css';

export default function Labels({ props }: { props:IlabelsProps } ) {
    return (
        <div id="LabelsContainer"><LabelTable {...props }/></div>
        );

}