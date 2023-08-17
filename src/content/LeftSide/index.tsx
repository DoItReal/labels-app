import { LabelsContainerStates } from './LabelsContainer/index';
import { CreateLabel } from './SaveLabel/index';
import './style.css';
import { IenableStates } from '../../App';
export default function LeftSide({ enableStates, updateStates }: IenableStates) {
    return (
        <div id="leftSide">
            <LabelsContainerStates enableStates={enableStates} updateStates={updateStates} />
        </div>
    );
}



