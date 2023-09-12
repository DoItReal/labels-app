import { useContext, useRef } from 'react';
import { IcontentProps } from '../Content';
import AddedLabels from './AddedLabels';
import './index.css';
import { enableStatesContext } from '../../App';
import { Label } from '../../labels';
import { labelDataType } from '../../db';
import { Paper, Popover } from '@mui/material';

export default function MidSide({ addedLabels, addLabel }: IcontentProps) {
    const [enableStates, updateStates] = useContext(enableStatesContext);
    return (
        <div id="midSide">
            <AddedLabels labels={addedLabels} updateLabel={addLabel } />
        </div>
    );
}
