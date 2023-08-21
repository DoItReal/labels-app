import { Label } from '../../../labels';
import './labelTable.css';
import { labelDataType, labelDataArrType } from '../../../db';
import { EventHandler, useEffect, useRef, useState } from 'react';
import { SaveLabel } from '../SaveLabel/index';
import Draggable from 'react-draggable';
export function Filter(dbData: labelDataArrType | undefined, filterText: string, filterCategory: Array<string>) {
    let filteredList: labelDataArrType = [];
    if (!dbData || dbData.length == 0) return [];

    filterCategory.forEach((item) => {
        if (item === "all") {
            filteredList = dbData;
            return;
        }
        dbData.forEach(e => {
            if (e.category && e.category.length == 0) {
                return;
            } else {
                for (let i = 0; i < e.category.length; i++) {
                    if (e.category[i] === item) { filteredList.push(e); }
                }
            }
        });
        for (let i = 0; i < filteredList.length - 1; i++) {
            for (let j = i + 1; j < filteredList.length; j++) {
                if (filteredList[i]._id === filteredList[j]._id) {
                    filteredList.splice(j, 1);
                    j -= 1;
                }
            }

        }
        return filteredList;
    });
  
    return filteredList.filter(data => data.bg.toLowerCase().indexOf(filterText.toLowerCase()) !== -1);
}

export function LabelTable({ dbData, filterText, filterCategory, selectLabel, unSelectLabel, generateList, unSelectAll }:
    {
        dbData: labelDataArrType | undefined,
        filterText: string,
        filterCategory: Array<string>,
        selectLabel: (arg: labelDataType) => void,
        unSelectLabel: (arg: labelDataType) => void,
        generateList: () => void,
        unSelectAll: () => void
    }) {
    const rows: Array<React.ReactNode> = [];
   
    const [selectAll, setSelectAll] = useState(false);
    const [editLabel, setEditLabel] = useState <labelDataType| null>();
    const [saveEnable, setSaveEnable] = useState(false);
    const data = Filter(dbData, filterText, filterCategory);

    const setEdit = (label: labelDataType) => {
        setEditLabel({ ...label });
        if (saveEnable) setSaveEnable(false);
            setSaveEnable(true);
    }
    const changeCheckbox = () => {
        if (selectAll) unSelectAll();
        setSelectAll(!selectAll);
    };

    if (data.length > 0) {
        data.forEach((data: labelDataType) => {
            rows.push(
                <LabelRow label={data} key={data._id} dataKey={data._id} setEdit={setEdit} selectLabel={selectLabel} unSelectLabel={unSelectLabel} selectAll={selectAll } />
            )
        });
    } else {
        rows.push(<tr data-key="empty" key="empty"><td colSpan={3} >No Labels Loaded</td></tr>)
    }

    return (
       <>
        <table className="labelTable">
            <thead>
                <tr>
                    <th className="headInput"><input type="checkbox" onChange={changeCheckbox} /></th>
                    <th className="headLabel">Label</th>
                        <th className="headOptions">Options <button onClick={generateList}></button></th>
                </tr>
            </thead>
            <tbody>
                {rows.length > 0 && rows}
                </tbody>   
        </table>
            <>{editLabel != null ? <SaveLabel enable={saveEnable} setEnable={setSaveEnable} label={editLabel} clearLabel={() => setEditLabel(null) } />: null }</>
        </>);
}
function LabelRow({ label, dataKey, setEdit, selectLabel, unSelectLabel, selectAll }: { label: labelDataType, dataKey: string, setEdit: (arg: labelDataType) => void, selectLabel: (arg: labelDataType) => void, unSelectLabel: (arg: labelDataType)=>void, selectAll:boolean }) {
   
    return (
        <tr data-key={dataKey }>
            <td><InputCheckbox selectLabel={selectLabel} unSelectLabel={unSelectLabel} label={label} selectAll={selectAll } /></td>
            <LabelCell bg={label.bg} key={label.bg} />
            <td>
                <EditButton label={label} setEdit={ setEdit }/>
                <PreviewButton label={label} />
                
            </td>
        </tr>
    );

}
function InputCheckbox({ label, selectLabel, unSelectLabel, selectAll }: { label: labelDataType, selectLabel: (arg: labelDataType) => void, unSelectLabel: (arg: labelDataType) => void, selectAll: boolean }) {
    const ref = useRef < HTMLInputElement >(null);
    const firstRender = useRef(true);
    const [checked, setChecked] = useState(false);;
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            selectLabel(label);
            
        } else {
            unSelectLabel(label);
        }
        setChecked(current => !current);
    }
    useEffect(() => {
        if (firstRender.current) { firstRender.current = false; return };
        if (selectAll) {
            setChecked(true);
            selectLabel(label);
        } else {
            setChecked(false);
        }
    }, [selectAll])
    if (ref && ref.current) ref.current.checked = checked;

    return (
        <input ref={ref} onChange={ handleChange } className="listRowCheckbox"  type="checkbox" />
    );
}
function LabelCell({ bg }: { bg: string }) {

    return (
        <td>{bg}</td>
    );
}
function EditButton({ label, setEdit }: { label: labelDataType, setEdit: (arg:labelDataType)=>void}) {
    
    const setEditButton = () => {
        setEdit(label);
    };
    return (
        
        <button id="editButton" onClick={setEditButton }>Edit</button>
        );
}
function PreviewButton({ label }: { label: labelDataType }) {
  
    //to do Get width and height of A4 page, signsInPage from PDF class
    let width = 720;
    let height = 920;
    let signsInPage = 8;

    function preview() {
        const tmp = document.querySelector('#SignPreview');
        if (!tmp || !(tmp instanceof HTMLDivElement)) {
            throw new Error('Failed to get canvas');
        }
        let previewDiv = tmp;
        let sign = new Label(width / 2 - 10, height / (signsInPage / 2) - 10);
        sign.setContent(label.allergens, { bg: decodeURI(label.bg), en: label.en, de: label.de, rus: label.rus });
        sign.setId(label._id);
        previewDiv.innerHTML = '';
        previewDiv.append(sign.generate());
    }
    return (
        <button id="previewButton" onClick={preview }>Preview</button>
        );
}