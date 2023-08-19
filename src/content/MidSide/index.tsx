import { Dispatch, SetStateAction } from 'react';
import { labelDataType } from '../../db';
import './index.css';
export default function MidSide({ labels, setLabels }: { labels: labelDataType[], setLabels: Dispatch<SetStateAction<labelDataType[]>> }) {
    return (
        <div id="midSide">
            <div id="SignPreview" />
            <AddedLabels labels={labels} setLabels={setLabels } />
        </div>
    );
}


function AddedLabels({ labels, setLabels }: { labels: labelDataType[], setLabels: Dispatch<SetStateAction<labelDataType[]>> }) {
    const rows: Array<React.ReactNode> = [];
    labels && labels.map(label => {
       
        rows.push(<tr key={label._id }>
                <td><button> Remove </button></td>
                <td><label>{label.bg}</label></td>
                <td><input type="number" min="1" max="20"></input></td>
            </tr>
            );
        });
    return (
        <div className="addedLabels">
            <table>
                <tbody>
                    {rows}
                    </tbody>
                </table>
        </div>
        );

}