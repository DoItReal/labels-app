/* responsability for:
    -Icatalogs 
            --Local--   
        => fetchCatalogs - fetches catalogs from server and returns a promise of type Icatalog[]
        => loadCatalogsLocally - gets (catalogs:Icatalog[]) modifies it to Icatalogs and saves it to local storage
        => updateCatalogsLocally - updates catalogs in local storage
        => getCatalogs - get catalogs from local storage in type Icatalogs
            --MongoDB--
        => createCatalogDB - creates a new catalog in the database
        => updateCatalogDB - updates a catalog in the database
        
        == TO DO ==
          ==> editCatalogsLocally
          ==> deleteCatalogsLocally
*/
import { Icatalog, IloadedCatalog, isCatalog, isCatalogArray } from './Interfaces/CatalogDB';
import { Icatalogs, isIcatalogs } from './Interfaces/CatalogsDB';
const address = 'http://localhost:8080/';




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

//DB API MongoDB
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