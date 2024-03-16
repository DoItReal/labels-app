import { Icatalog, isCatalog } from "./CatalogDB";

export interface Icatalogs {
    [key: string]: Icatalog;
}
//type check for Icatalogs
export const isIcatalogs = (catalogs: any): catalogs is Icatalogs => {
    return catalogs && Object.values(catalogs).every(isCatalog);
}