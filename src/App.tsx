import './App.css';
import { Nav} from './nav/Nav1';
import Content from './content/Content';

import './style.css';
import DB from './db';
import { useState } from 'react';

export var db = new DB();

export interface IenableStates {
    enableStates: Map<string, boolean>, updateStates: (key: string, value: boolean) => void
}
function App() {
    const [enableStates, setEnableStates] = useState<Map<string, boolean>>(new Map());
    const updateStates = (key: string, value: boolean) => {

        setEnableStates(new Map(enableStates.set(key, value)));

    } 
        return (

            <div className="App">
                <script type="text/javascript" src="https://unpkg.com/pdf-lib" />
                <script type="text/javascript" src="https://unpkg.com/jquery" />

              
                <Nav enableStates={enableStates} updateStates={updateStates } />
                <Content enableStates={enableStates} updateStates={updateStates} />

            </div>
        );
}

export default App;
