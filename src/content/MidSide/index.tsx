import { LegacyRef, MutableRefObject, useRef } from 'react';
import { IaddedLabels } from '../Content';
import AddedLabels from './AddedLabels';
import './index.css';
import { IenableStates } from '../../App';
import { Label } from '../../labels';
import { labelDataType } from '../../db';

interface states extends IenableStates {
    labels: IaddedLabels[],
    addLabel: (arg: IaddedLabels) => void,
    previewLabel: labelDataType | undefined
}

export default function MidSide({ labels, addLabel, enableStates, updateStates, previewLabel }: states) {
    const closePreview = () => {
        updateStates('preview', false);
    }
    return (
        <div id="midSide">
            {enableStates.get('preview') ? <Preview label={ previewLabel} handleClose={closePreview } />:null}
            <AddedLabels labels={labels} updateLabel={addLabel } />
        </div>
    );
}

function Preview({ label, handleClose }: { label: labelDataType | undefined, handleClose: () => void }) {
    const previewURL = useRef<string>('');
    if (label !== undefined) {
        //to do Get width and height of A4 page, signsInPage from PDF class
        let width = 720;
        let height = 920;
        let signsInPage = 8;
        var sign = new Label(width / 2 - 10, height / (signsInPage / 2) - 10);
        sign.setContent(label.allergens, { bg: decodeURI(label.bg), en: label.en, de: label.de, rus: label.rus });
        sign.setId(label._id);
        previewURL.current = sign.generate().toDataURL('image/jpeg');
    }
   
    return (
        <div>
            <button onClick={handleClose} className="closeButton">X</button>
            {label !== undefined ? <div id="SignPreview" > <img src={previewURL.current}></img> </div> : null}
        </div>
        );
}
