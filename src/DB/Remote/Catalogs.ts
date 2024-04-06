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
import { Icatalog, IloadedCatalog, isCatalog, isCatalogArray } from '../Interfaces/Catalogs';
const address = 'http://localhost:8080/';

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
           //     console.log(catalogs)
           //     console.log(isCatalogArray(catalogs))
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
    const modifiedCatalog = { ...catalog,_id:'', labels: catalog.labels.map(label => ({ _id: label._id, count: label.count })) };
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
                resolve(JSON.parse(xhr.responseText));
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
export const deleteCatalogDB = (id: string) => {
    return (new Promise<void>((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open("DELETE", address + 'catalogs/' + id);
        xhr.withCredentials = true;
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                resolve();
            } else if (xhr.status !== 200) {
                reject(new Error('Error in deleting Catalog'));
            }
        };
        xhr.send();
    }));
}