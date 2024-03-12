import { IloadedLabel, isIloadedLabel, isIloadedLabelArray } from "../content/Content";
import { isLabelDataType, labelDataType } from "../db";
import { db } from '../App';
const address = 'http://localhost:8080/';
interface IcatalogLabelPointer {
    _id: string;
    count: number;
}
export const isCatalogLabelPointer = (label: any): label is IcatalogLabelPointer => {
        return label && label._id && label.count;
}
export const isCatalogLabelPointerArray = (labels: any[]): labels is IcatalogLabelPointer[] => {
    return labels.every(isCatalogLabelPointer);
}
export interface Icatalog {
    _id: string;
    name: string;
    owner: string;
    labels: IcatalogLabelPointer[];
    volume: number;
    size: number;
    date: string;
    lastUpdated: string;
    updates:number
}
export const isCatalog = (catalog: any): catalog is Icatalog => {
    return catalog &&
        catalog._id &&
        catalog.name &&
        catalog.owner &&
        catalog.labels && isCatalogLabelPointerArray(catalog.labels) &&
        catalog.volume &&
        catalog.size &&
        catalog.date &&
        catalog.lastUpdated &&
        catalog.updates;
}
export const isCatalogArray = (catalogs: any[]): catalogs is Icatalog[] => {
    return catalogs.every(isCatalog);
}
export interface IloadedCatalog extends Icatalog {
    labels: IloadedLabel[]
}
export const isLoadedCatalog = (catalog: any): catalog is IloadedCatalog => {
       return catalog &&
        catalog._id && typeof catalog._id === 'string' &&
        catalog.name && typeof catalog.name === 'string' &&
        catalog.owner && typeof catalog.owner === 'string' &&
        catalog.labels && isIloadedLabelArray(catalog.labels) &&
        'volume' in catalog && typeof catalog.volume === 'number' &&
        'size' in catalog && typeof catalog.size === 'number' &&
        'date' in catalog && typeof catalog.date === 'string' &&
        'lastUpdated' in catalog && typeof catalog.lastUpdated === 'string' &&
        'updates' in catalog && typeof catalog.updates === 'number' ? true : false
    
}
interface Icatalogs {
    [key: string]: Icatalog;
}
export const isIcatalogs = (catalogs: any): catalogs is Icatalogs => {
    return catalogs && Object.values(catalogs).every(isCatalog);
}
//fetches catalogs from server and returns a promise of type Icatalog[]


export const fetchCatalogs = () => {
    return (new Promise<Icatalog[]>((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", address + 'catalogs/');
        xhr.withCredentials = true;
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const catalogsStr = xhr.responseText;
                const catalogs = catalogsStr ? JSON.parse(catalogsStr) as Icatalog[] : [];
                //check if catalogs is not '{}' and is of type Icatalogs
                if (isCatalogArray(catalogs)) {
                    resolve(catalogs);
                }
            } else if (xhr.status !== 200) {
                reject(new Error('Error in fetching Catalogs'));
            }
        };
        xhr.send();
    }
    ));
}
//gets (catalogs:Icatalog[]) modifies it to Icatalogs and saves it to local storage
export const loadCatalogsLocally = (catalogs: Icatalog[]) => {
    // if catalogs is not of type Icatalogs, return and do not proceed further
    if (!catalogs) return;
    const catalogObj: Icatalogs = {};
    for (const catalog of catalogs) {
        catalogObj[catalog._id] = catalog;
    }
    if (!isIcatalogs(catalogObj)) return;
    sessionStorage.setItem('catalogs', JSON.stringify(catalogObj));
}

export const newCatalog: (labels: IloadedLabel[]) => IloadedCatalog = (labels = []) => {
    return {
        _id: '1',
        name: 'New Catalog',
        owner: 'admin',
        labels,
        volume: labels.length,
        size: labels.length > 0 ? labels.reduce((acc, curr) => acc + curr.count, 0) : 0,
        date: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        updates: 0
    } as IloadedCatalog
};
export const fetchCatalogsLocally = () => {
    const catalogsStr = sessionStorage.getItem('catalogs');
    if (catalogsStr) {
        const parsedCatalogs = JSON.parse(catalogsStr) as Icatalogs;
        return parsedCatalogs;
    }
    return null;
}
const dummyCatalog = newCatalog([]);

export const loadCatalog = async (id: string) => {
    if (id === dummyCatalog._id) {
        sessionStorage.setItem('selectedCatalog', JSON.stringify({ ...dummyCatalog, labels: [] }));
        return { ...dummyCatalog, labels: [] };
    }
    const catalogs = fetchCatalogsLocally();
    
    const labelsArr: IloadedLabel[] = [];
    if (catalogs) {
        //if id is not in parsedCatalogs, return empty array
        const selectedCatalog = catalogs[id];
        
       if(!selectedCatalog) return null;
        for (const labelPointer of selectedCatalog.labels) {
            
            try {
                const label = await db.getLabelById(labelPointer._id);
                if (!isLabelDataType(label)) throw new Error('Label is not of type IloadedLabel'); 
                const addedLabel = { ...label, count: labelPointer.count };
                if (isIloadedLabel(addedLabel) ) {
                    labelsArr.push(addedLabel);
                }
            } catch (e) {
                console.log(e);
            }
        }
        sessionStorage.setItem('selectedCatalog', JSON.stringify({ ...selectedCatalog, labels: labelsArr }));
        return { ...selectedCatalog, labels: labelsArr };
        
    }
    return null;

} 

//loads selected catalog from local storage
export const fetchLoadedCatalog = () => {
    const catalog = sessionStorage.getItem('selectedCatalog');
    if (catalog !== null) {
        return JSON.parse(catalog) as IloadedCatalog;
    }
    return {};
}
//adds selected catalog to local storage
   export const saveLoadedCatalog = (catalog:IloadedCatalog) => {
         sessionStorage.setItem('selectedCatalog', JSON.stringify(catalog));
}
//removes selected catalog from local storage
export const deleteSelectedLabels = (label: labelDataType[] | null = null) => {
    const catalogString = sessionStorage.getItem('selectedCatalog');
    const catalog = catalogString ? JSON.parse(catalogString) as IloadedCatalog : null;
    if (catalog === null) return;
    //if label is null, remove all catalog from selected catalog
    if (label === null) {
      
        if (catalog) {
            const newCatalog = { ...catalog, labels: [] };
            saveLoadedCatalog(newCatalog);
        }
    }
    //else remove the label or catalog from selected catalog
    else {
        const newCatalog = {
            ...catalog, labels: catalog.labels.filter((lbl: IloadedLabel) =>
                !label.some((lbl2: labelDataType) => lbl2._id === lbl._id))
        };
            saveLoadedCatalog(newCatalog);
        }
    }

//adds label to selected Catalog
export const addSelectedLabel =  (label: labelDataType) => {
    // fetch locally loadedCatalog from local storage 
    // if it does not exist it means no catalog is selected and we create a new catalog
    const catalog: IloadedCatalog | {} = fetchLoadedCatalog();
    console.log(Boolean(isLoadedCatalog(catalog)));
    if (catalog && isLoadedCatalog(catalog) && catalog.labels.length > 0) {
        //if label is already in selected catalog, increment count
        if (catalog.labels.some(lbl => lbl._id === label._id)) {
            const newLabels = catalog.labels.map(lbl => {
                if (lbl._id === label._id) {
                    return {
                        ...lbl,
                        count: lbl.count + 1
                    }
                } else return lbl;
            });
            saveLoadedCatalog(structuredClone({ ...catalog,size:catalog.size+1, labels: newLabels }));
        }
        //else add label to selected catalog
        else {
            const newCatalog = {
                ...catalog, labels: [ ...catalog.labels,{ ...label, count: 1 }]
            };
            newCatalog.volume += 1;
            newCatalog.size += 1;
            if (isLoadedCatalog(newCatalog)) {
                saveLoadedCatalog(newCatalog);
            }
        }
    }
    //else create newCatalog and add label to it
    else {
        console.log('new Catalog');
            const catalog = newCatalog([ { ...label, count: 1 }]);
            saveLoadedCatalog(catalog);
        }
}

export const createCatalogDB  = (catalog: IloadedCatalog) => {
//TODO 
    const modifiedCatalog = { ...catalog,_id:'65e8cd9784f929813a398288', labels: catalog.labels.map(label => ({ _id: label._id, count: label.count })) };
    if (!isCatalog(modifiedCatalog)) {
        return;
    }
    return (new Promise<Icatalog>((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", address + 'catalogs');
        xhr.withCredentials = true;
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                resolve(modifiedCatalog);
            } else if (xhr.status !== 200) {
                reject(new Error('Error in saving Catalog'));
            }
        };
        xhr.send(JSON.stringify(modifiedCatalog));
    }));
}
export const updateCatalogDB = (catalog: IloadedCatalog) => {
    const modifiedCatalog = { ...catalog, labels: catalog.labels.map(label => ({ _id: label._id, count: label.count })) };
    if (!isCatalog(modifiedCatalog)) {
        return;
    }
    return (new Promise<Icatalog>((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open("PUT", address + 'catalogs/' + catalog._id);
        xhr.withCredentials = true;
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                resolve(modifiedCatalog);
            } else if (xhr.status !== 200) {
                reject(new Error('Error in saving Catalog'));
            }
        };
        xhr.send(JSON.stringify(modifiedCatalog));
    }));
}