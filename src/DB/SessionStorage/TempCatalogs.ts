import { IloadedLabel, IloadedCatalog, isLoadedCatalog} from "../Interfaces/Catalogs";
import { labelDataType } from "../Interfaces/Labels";
import { newCatalog } from "./Catalogs";


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


//get selected catalog from local storage returns [IloadedCatalog] | null
export const getSelectedCatalog = () => {
    const catalog = sessionStorage.getItem('tempCatalog');
    if (catalog !== null) {
        return JSON.parse(catalog) as IloadedCatalog;
    }
    return null;
}

//saves selected catalog to local storage
export const saveSelectedCatalog = (catalog: IloadedCatalog) => {
    sessionStorage.setItem('tempCatalog', JSON.stringify(catalog));
}
//removes selected catalog from selectedCatalog
export const deleteSelectedLabels = (label: labelDataType[] | null = null) => {
    const catalogString = sessionStorage.getItem('tempCatalog');
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
            const newLabels = catalog.labels.map((lbl: IloadedLabel) => {
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
        const catalog = newCatalog([{ ...label, count: 1 }]);
        saveSelectedCatalog(catalog);
    }
}
