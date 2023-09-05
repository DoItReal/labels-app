import './labelTable.css';
import { labelDataType } from '../../../db';
import { useEffect, useRef, useState } from 'react';
import { SaveLabel } from '../SaveLabel/index';
import { IlabelsProps } from './index';
import { ReactComponent as EditButtonSVG } from './editButtonSVG.svg';
import { ReactComponent as PreviewButtonSVG } from './previewButtonSVG.svg';
import { ReactComponent as AddLabelButtonSVG } from './addLabelButtonSVG.svg';
import { IaddedLabel } from '../../Content';
export function Filter(dbData: labelDataType[] | undefined, filterText: string, filterCategory: Array<string>) {
    let filteredList: labelDataType[] = [];
    if (!dbData || dbData.length === 0) return [];
    filterCategory.forEach((item) => {
        if (item === "all") {
            filteredList = dbData;
            return;
        }
        dbData.forEach(e => {
            if (e.category && e.category.length === 0) {
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

export function LabelTable({ dbData, filterText, filterCategory, selectLabel, unSelectLabel, generateList, unSelectAll, enableStates, updateStates, setPreview, addLabel }: IlabelsProps) {
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
                <LabelRow label={data} key={data._id} dataKey={data._id} setEdit={setEdit} selectLabel={selectLabel} unSelectLabel={unSelectLabel} selectAll={selectAll} updateStates={updateStates} setPreview={setPreview} addLabel={addLabel }/>
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
                        <th className="headOptions">Options</th>
                </tr>
            </thead>
            <tbody>
                {rows.length > 0 && rows}
                </tbody>   
        </table>
            <>{editLabel != null ? <SaveLabel enable={saveEnable} setEnable={setSaveEnable} label={editLabel} clearLabel={() => setEditLabel(null) } />: null }</>
        </>);
}
function LabelRow({ label, dataKey, setEdit, selectLabel, unSelectLabel, selectAll, updateStates, setPreview, addLabel }:
    {
        label: labelDataType,
        dataKey: string,
        setEdit: (arg: labelDataType) => void,
        selectLabel: (arg: labelDataType) => void,
        unSelectLabel: (arg: labelDataType) => void,
        selectAll: boolean,
        updateStates: (key: string, value: boolean) => void,
        setPreview: (label: labelDataType) => void,
        addLabel: (arg:labelDataType)=>void
    }) {
    const handleAddLabel = () => { 
        addLabel(label);
    } 
    return (
        <tr data-key={dataKey }>
            <td><InputCheckbox selectLabel={selectLabel} unSelectLabel={unSelectLabel} label={label} selectAll={selectAll } /></td>
            <LabelCell bg={label.bg} key={label.bg} />
            <td>
                <EditButton label={label} setEdit={ setEdit }/>
                <PreviewButton label={label} updateStates={updateStates} setPreview={setPreview } />
                <AddSingleLabelButton addLabel={handleAddLabel } />
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
function AddSingleLabelButton({ addLabel }: { addLabel: ()=>void}) {
    return (<button className="addLabel" title="Add Label" onClick={addLabel }><AddLabelButtonSVG /></button>);
}
function EditButton({ label, setEdit }: { label: labelDataType, setEdit: (arg:labelDataType)=>void}) {
    
    const setEditButton = () => {
        setEdit(label);
    };
    return (

        <button className="editButton" onClick={setEditButton} title="Edit"><EditButtonSVG/></button>
        );
}
function PreviewButton({ label, updateStates, setPreview }: { label: labelDataType, updateStates: (key: string, value: boolean) => void, setPreview:(label:labelDataType)=>void }) {
  
    function preview() {
        updateStates('preview', true);
        setPreview(label);
        
    }
    return (
        <button className="previewButton" onClick={preview } title="Preview"><PreviewButtonSVG /></button>
        );
}
