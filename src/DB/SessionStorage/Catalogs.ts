import { IloadedLabel, isCatalog, isIloadedLabel, Icatalog, IloadedCatalog, isLoadedCatalog, IcatalogLabelPointer, isCatalogLabelPointer, Icatalogs, isIcatalogs } from "../Interfaces/Catalogs";
import { isLabelDataType, labelDataType } from "../Interfaces/Labels";
import { fetchLabelById } from "../Remote/Labels";


/* Responsability for:
                    ***** Managing Loaded Catalog [Icatalog] in sessionStorage  *****
    - loadCatalogsLocally: (catalogs: Icatalog[]) => Icatalogs - gets (catalogs:Icatalog[]) modifies it to Icatalogs and saves it to local storage
    - updateCatalogsLocally: (catalogs: Icatalogs) => void - updates catalogs in local storage
    - getCatalogs: () => Icatalogs | null - get catalogs from local storage in type Icatalogs
    - newCatalog: (labels: IloadedLabel[]) => IloadedCatalog - creates a new catalog [IloadedCatalog]
    - getSelectedCatalog: () => IloadedCatalog - fetches catalog from localStorage
    - loadCatalog: (id: string) => Promise<IloadedCatalog | null> - loads catalog from localStorage
    - saveSelectedCatalog: (catalog: IloadedCatalog) => void - saves catalog to localStorage
    - deleteSelectedLabels: (label: labelDataType[] | null) => void - deletes selected labels from the catalog and saves it to localStorage
    - addSelectedLabel: (label: labelDataType) => void - adds selected label to the catalog and save it in localStorage

    ***Thinking about moving these functions to CatalogsDB.ts***

        - IcatalogToIcatalogs: (catalogs: Icatalog[]) => Icatalogs - converts array of catalogs to object of catalogs
        - editCatalogLocally: (catalog: Icatalog) => void - updates catalog in localStorage
        - deleteCatalogLocally: (id: string) => void - deletes catalog from localStorage
 
 */

//gets (catalogs:Icatalog[]) modifies it to Icatalogs and saves it to local storage
export const loadCatalogsLocally = (catalogs: Icatalog[]) => {
    // if catalogs is not of type Icatalogs, return and do not proceed further
    if (!catalogs) return null;
    const catalogObj: Icatalogs = {};
    for (const catalog of catalogs) {
        catalogObj[catalog._id] = catalog;
    }
    if (!isIcatalogs(catalogObj)) return null;
    sessionStorage.setItem('catalogs', JSON.stringify(catalogObj));
    return catalogObj;
}
export const updateCatalogsLocally = (catalogs: Icatalogs) => {
    if (!isIcatalogs(catalogs)) return;
    sessionStorage.setItem('catalogs', JSON.stringify(catalogs));
}

//get catalogs from session storage returns Icatalogs | null
export const getCatalogs = () => {
    const catalogsStr = sessionStorage.getItem('catalogs');
    if (catalogsStr) {
        const parsedCatalogs = JSON.parse(catalogsStr) as Icatalogs;
        return parsedCatalogs;
    }
    return null;
}
//creates a new catalog
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
const dummyCatalog = newCatalog([]);
//transform the catalog to IloadedCatalog from catalogId
export const catalogToLoadedCatalog = async (catalogId: string | Icatalog): Promise<IloadedCatalog> => {

    if (typeof catalogId !== 'string' && isCatalog(catalogId)) {
        const catalog = { ...catalogId };
        const labelsArr: IloadedLabel[] = await parseLabels(catalog.labels);
        return { ...catalog, labels: labelsArr };
    }
    const catalogs = getCatalogs();
    if (catalogs) {
        const catalog = catalogs[catalogId];
        const labelsArr: IloadedLabel[] = await parseLabels(catalog.labels);
        return { ...catalog, labels: labelsArr };
    }
    return dummyCatalog;
}
export const loadedCatalogToCatalog = (loadedCatalog: IloadedCatalog): Icatalog => {
    return {
        _id: loadedCatalog._id,
        name: loadedCatalog.name,
        owner: loadedCatalog.owner,
        labels: loadedCatalog.labels.map((label:IloadedLabel) => {
            if (isIloadedLabel(label)) {
                return {
                    _id: label._id,
                    count: label.count
                }
            }
            return null;
        }).filter(isCatalogLabelPointer),
        date: loadedCatalog.date,
        lastUpdated: loadedCatalog.lastUpdated,
        updates: loadedCatalog.updates,
        volume: loadedCatalog.volume,
        size: loadedCatalog.size
    }
}
//parsesLabels from labelPointers
const parseLabels = (labelPointers: IcatalogLabelPointer[]): Promise<IloadedLabel[]> => {
    return new Promise(async (resolve, reject) => {
        try {
            const labelsArr: IloadedLabel[] = [];
            for (const labelPointer of labelPointers) {
                const label = await fetchLabelById(labelPointer._id);
                if (!isLabelDataType(label)) {
                    throw new Error('Label is not of type LabelDataType');
                }
                const addedLabel = { ...label, count: labelPointer.count };
                if (isIloadedLabel(addedLabel)) {
                    labelsArr.push(addedLabel);
                }
            }
            resolve(labelsArr);
        } catch (error) {
            reject(error);
        }
    });
};
//get selected catalog from local storage returns [IloadedCatalog] | null
export const getSelectedCatalog = () => {
    const catalog = sessionStorage.getItem('selectedCatalog');
    if (catalog !== null) {
        return JSON.parse(catalog) as IloadedCatalog;
    }
    return null;
}
//loads selected catalog from local storage and creates selectedCatalog in local storage if it does not exist
export const loadCatalog = async (id: string) => {
    if (id === dummyCatalog._id) {
       
    }
    const catalogs = getCatalogs();

    const labelsArr: IloadedLabel[] = [];
    if (catalogs) {
        //if id is not in parsedCatalogs, return empty array
        const selectedCatalog = catalogs[id];

        if (!selectedCatalog) {
            sessionStorage.setItem('selectedCatalog', JSON.stringify({ ...dummyCatalog, labels: [] }));
            return { ...dummyCatalog, labels: [] };
        }
        for (const labelPointer of selectedCatalog.labels) {

            //TO GET LABEL FROM LOCAL STORAGE
            try {
                const label = await fetchLabelById(labelPointer._id);
                if (!isLabelDataType(label)) {
                    throw new Error('Label is not of type LabelDataType');
                }
                const addedLabel = { ...label, count: labelPointer.count };
                if (isIloadedLabel(addedLabel)) {
                    labelsArr.push(addedLabel);
                }
            } catch (e) {
                console.log(e);
            }
        }
        sessionStorage.setItem('selectedCatalog', JSON.stringify({ ...selectedCatalog, labels: labelsArr }));
        return { ...selectedCatalog, labels: labelsArr };

    }
    sessionStorage.setItem('selectedCatalog', JSON.stringify({ ...dummyCatalog, labels: [] }));
    return { ...dummyCatalog, labels: [] };

}
//saves selected catalog to local storage
export const saveSelectedCatalog = (catalog: IloadedCatalog) => {
    sessionStorage.setItem('selectedCatalog', JSON.stringify(catalog));
}
//removes selected catalog from selectedCatalog
export const deleteSelectedLabels = (label: labelDataType[] | null = null) => {
    const catalogString = sessionStorage.getItem('selectedCatalog');
    const catalog = catalogString ? JSON.parse(catalogString) as IloadedCatalog : null;
    if (catalog === null) return;
    //if label is null, remove all catalog from selected catalog
    if (label === null) {

        if (catalog) {
            const newCatalog = { ...catalog, labels: [] };
            saveSelectedCatalog(newCatalog);
        }
    }
    //else remove the label or catalog from selected catalog
    else {
        const newCatalog = {
            ...catalog, labels: catalog.labels.filter((lbl: IloadedLabel) =>
                !label.some((lbl2: labelDataType) => lbl2._id === lbl._id))
        };
        saveSelectedCatalog(newCatalog);
    }
}
//adds label to selectedCatalog
export const addSelectedLabel = (label: labelDataType) => {
    // fetch locally loadedCatalog from local storage 
    // if it does not exist it means no catalog is selected and we create a new catalog
    const catalog: IloadedCatalog | null = getSelectedCatalog();
    if (catalog && isLoadedCatalog(catalog) && catalog.labels.length > 0) {
        //if label is already in selected catalog, increment count
        if (catalog.labels.some((lbl: IloadedLabel) => lbl._id === label._id)) {
            const newLabels = catalog.labels.map((lbl:IloadedLabel) => {
                if (lbl._id === label._id) {
                    return {
                        ...lbl,
                        count: lbl.count + 1
                    }
                } else return lbl;
            });
            saveSelectedCatalog(structuredClone({ ...catalog, size: catalog.size + 1, labels: newLabels }));
        }
        //else add label to selected catalog
        else {
            const newCatalog = {
                ...catalog, labels: [...catalog.labels, { ...label, count: 1 }]
            };
            newCatalog.volume += 1;
            newCatalog.size += 1;
            if (isLoadedCatalog(newCatalog)) {
                saveSelectedCatalog(newCatalog);
            }
        }
    }
    //else create newCatalog and add label to it
    else {
        console.log('new Catalog');
        const catalog = newCatalog([{ ...label, count: 1 }]);
        saveSelectedCatalog(catalog);
    }
}
export const updateSelectedLabel = (label: IloadedLabel) => {
    const catalog: IloadedCatalog | null = getSelectedCatalog();
    if (catalog && isLoadedCatalog(catalog) && catalog.labels.length > 0) {
        const newLabels = catalog.labels.map((lbl:IloadedLabel) => {
            if (lbl._id === label._id) {
                return label;
            } else return lbl;
        });
        saveSelectedCatalog(structuredClone({ ...catalog, labels: newLabels }));
    }
}
export const IcatalogToIcatalogs = (catalogs: Icatalog[]): Icatalogs => {
    const catalogObj: Icatalogs = {};
    for (const catalog of catalogs) {
        catalogObj[catalog._id] = catalog;
    }
    return catalogObj;
}

// edits catalog in local storage 'catalogs'
export const editCatalogLocally = (catalog: Icatalog) => {
    const catalogs = getCatalogs();
    if (catalogs) {
        const updatedCatalogs = { ...catalogs, [catalog._id]: catalog };
        sessionStorage.setItem('catalogs', JSON.stringify(updatedCatalogs));
    }
}
//deletes catalog from local storage
export const deleteCatalogLocally = (id: string) => {
    const catalogs = getCatalogs();
    if (catalogs) {
        delete catalogs[id];
        sessionStorage.setItem('catalogs', JSON.stringify(catalogs));
    }
}