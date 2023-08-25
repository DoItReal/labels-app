import { ChangeEvent, ChangeEventHandler, Dispatch, SetStateAction } from 'react';
import { labelDataType } from '../../db';
import { IaddedLabels } from '../Content';
import './index.css';
export default function MidSide({ labels, addLabel }: { labels: IaddedLabels[], addLabel: (arg: IaddedLabels)=>void }) {
    return (
        <div id="midSide">
            <div id="SignPreview" />
            <AddedLabels labels={labels} updateLabel={addLabel } />
        </div>
    );
}


function AddedLabels({ labels, updateLabel }: { labels: IaddedLabels[], updateLabel: (arg: IaddedLabels)=>void }) {
    const rows: Array<React.ReactNode> = [];
   
    labels && labels.map(label => {
       
        rows.push(
            <LabelRow label={label} updateLabel={updateLabel} />
            );
        });
    return (
        <div className="addedLabels">
            <table className="labelTable">
                <thead>
                    <tr>
                        <th className="headRemove">Remove</th>
                        <th className="headLabel">Label</th>
                        <th className="headCount">Count</th>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                    </tbody>
                </table>
        </div>
        );

}
function LabelRow({ label, updateLabel }: { label: IaddedLabels, updateLabel: (arg: IaddedLabels)=>void }) {
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        event.stopPropagation();
        let tmp = { ...label };
        tmp.count = Number(event.target.value);
        updateLabel(tmp);
    }
    return (
        <tr key={label._id}>
            <td><button> Remove </button></td>
            <td><label>{label.bg}</label></td>
            <td><input type="number" min="1" max="20" value={label.count} onChange={(event)=>handleInputChange(event)}></input></td>
        </tr>
        );
}