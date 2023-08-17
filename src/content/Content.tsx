import LeftSide from './LeftSide/index';
import MidSide from './MidSide/index';
import './content.css';

import { IenableStates } from '../App';
import { CreateLabel } from './LeftSide/SaveLabel';

export default function Content({ enableStates, updateStates }: IenableStates) {
   
    return (
        <div id="mainContent">
            <LeftSide enableStates={enableStates} updateStates={updateStates} />
           <MidSide />
            <RightSide />
            <CreateLabel enable={enableStates} setEnable={updateStates} />
        </div>
        );
}


function RightSide() {
    return (
        <div id="rightSide">
            <div className="previewList" />
            <iframe id="pdf" />
        </div>
        );
}

