import { ErrorUI } from '../Error';
import LeftSide from './LeftSide/index';
import { CreateLabel } from '../CreateNewLabel/index';
import { useState, useContext } from 'react';
import { labelDataType } from '../DB/Interfaces/Labels';
import {createNewLabelDB, deleteLabelDB, editLabelDB } from '../DB/Remote/Labels';
import { findIndexByProperty } from '../tools/helpers';
import { Box, Grid } from '@mui/material';
import { enableStatesContext } from '../App';
import CatalogEditor from '../Catalogs/CatalogEditor';
import { addSelectedLabel, getSelectedCatalog, saveSelectedCatalog } from '../DB/SessionStorage/Catalogs';
import { IloadedCatalog, IloadedLabel, isLoadedCatalog } from '../DB/Interfaces/Catalogs';
import { IcontentProps } from './InterfacesContent';


export default function ContentStates() {
    
    const [error, setError] = useState<JSX.Element | null>(null);
    const [dbData, setDbData] = useState<labelDataType[]>([]);
    const [loadedCatalog, setLoadedCatalog] = useState<IloadedCatalog | null>(getSelectedCatalog());
   // const [loadedCatalog, setLoadedCatalog] = useState<IloadedCatalog>({});
    const [enableStates, setEnableStates] = useContext(enableStatesContext);
    const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
    const enableLabelForm = enableStates.get('labelForm');


    const setCatalog = (catalog: IloadedCatalog) => {
        setLoadedCatalog(catalog);
        saveSelectedCatalog(catalog);
    }
    const handleLabelFormClose = () => {
        setEnableStates('labelForm',false);
    }
    //add label using setDbData(label)
    const addDbLabel = (label: labelDataType) => {
        if (props.dbData instanceof Array) {
            const tmp = [...props.dbData, label];
            props.setDbData(tmp);
        } else {
            props.setDbData([label]);
        }
        
    }
    //add label to selected Catalog
    const addLabel = (label: IloadedLabel) => {
        //add label to selected catalog and update loadedCatalog
        addSelectedLabel(label);
        //fetch updated catalog and set it to loadedCatalog
        setLoadedCatalog(getSelectedCatalog());
    };
    //add 1 label to selected
    const addNewLabel = (label: labelDataType) => {
        addSelectedLabel(label);
        setLoadedCatalog(getSelectedCatalog());
    };
    //add Array<labelDataType> to selected
    const addLabels = (labels: labelDataType[]) => {
        labels.forEach(label => addNewLabel(label));
    };
    //delete Label from DB and remove it from dbData
    const deleteDBLabel = (label: labelDataType) => {
        return (new Promise<void>(async (resolve, reject) => {
        const update = (array: labelDataType[]): labelDataType[] => {
            const index = findIndexByProperty(array, '_id', label._id);
            if (index === -1) return structuredClone(array);          
            array.splice(index, 1);
            return structuredClone(array);
        };
        
        try {
            await deleteLabelDB(label._id).then(async(lbl) => {
                const array = [...dbData];
                setDbData(array => update(array));
            });
            resolve();

        } catch (error) {
            reject(new Error(String(error)));
            
            }
        }));
    }
    //delete selected catalog 
    const deleteDBLabels =  (labels: labelDataType[]) => {
        labels.forEach(async (label) => {
            try {
                await deleteDBLabel(label);
            } catch (error) {
                const time = 5000;
                setError(<ErrorUI error={String(error)} time={time} />);
                setTimeout(()=>setError(null), time);
            }
        });
    }
    //handle saving label and updating dbData
    const handleSaveLabel = async (label: labelDataType) => {
        try {
            const editedLabel = await editLabelDB(label);
            const array = [...dbData];
            const index = findIndexByProperty(array, '_id', editedLabel._id);
            if (index === -1) return;
            array[index] = editedLabel;
            setDbData(array);
            } catch (error) {
            console.log(error);
        }
    }
    //handle create label and updating dbData
    const handleCreateLabel = async (label: any) => {
        try {
            const lbl = await createNewLabelDB(label);
            addDbLabel(lbl);
            return true;
        } catch (error) {
            return false;
        }
        
    }
    const addLabelsById = () => {
        for (const label of selectedLabels) {
            for (const dbLabel of dbData) {
                if (dbLabel._id === label) {
                    addLabels([dbLabel]);
                    break;
                }
            }
        }
    };
    const selectLabelsById = (labels: string[]) => {
        setSelectedLabels([...labels]);
    }
    const props: IcontentProps = {
        dbData, enableLabelForm, addLabelsById, selectLabelsById, setDbData, handleCreateLabel, handleLabelFormClose, addNewLabel, addLabels, addLabel, loadedCatalog: loadedCatalog, setLoadedCatalog: setCatalog, deleteLabel:deleteDBLabel,deleteLabels:deleteDBLabels, handleSaveLabel };
    return (
        <>
        <Content props={props} />
            {error !== null ? error : null }
            </>
        );
}

function Content({ props }: { props: IcontentProps }) {
    return (
        <>
            <Box minHeight={8 / 10} sx={{
            position: 'sticky',
            display: 'block',
            p: 0,
            m:0,
            minWidth: '100%',
            width: '100%',
            justifyContent: 'stretch',
            alignItems: 'stretch',
        }}>
            <Grid container spacing={0} m={0} p={0} height={1} sx={{ p: 0, m: 0,overflow:'auto'}} >
                    <Grid item xs={12} md={isLoadedCatalog(props.loadedCatalog)? 6 : 12} m={0} p={0} height={1 } >
              <LeftSide {...props} />
            </Grid>
                    {isLoadedCatalog(props.loadedCatalog) ? (
                        <Grid item xs={12} md={6} m={0} p={0} height={1}>
                            <CatalogEditor catalog={props.loadedCatalog} setCatalog={props.setLoadedCatalog} />
                        </Grid>
                    ) : null}
                  
           
         

            </Grid>
            </Box>
         { props.enableLabelForm ? <CreateLabel {...props} /> : null }
         </>
    );
}

