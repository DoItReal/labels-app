import { LabelTable } from './LabelTable';
import { IlabelsProps } from './index';
import './labels.css';
import Test from '../../../test';
export default function Labels({ props }: { props:IlabelsProps } ) {
    return <Test dbData={props.dbData } />;
    /*
    return (
        <div id="LabelsContainer"><LabelTable {...props }/></div>
        );
        */
}