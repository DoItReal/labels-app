import { isLabelDataType, labelDataType } from "../../DB/Interfaces/Labels";


export interface IloadedLabel extends labelDataType {
    count: number
};
export const isIloadedLabel = (label: any): label is IloadedLabel => {
    return label && label.count && isLabelDataType(label);
}
export const isIloadedLabelArray = (labels: any[]): labels is IloadedLabel[] => {
    return labels.every(isIloadedLabel);
}
export interface IcatalogLabelPointer {
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
    updates: number
}
export const isCatalog = (catalog: any): catalog is Icatalog => {
    return catalog &&
        '_id' in catalog &&
        'name' in catalog &&
        'owner' in catalog &&
        'labels' in catalog && isCatalogLabelPointerArray(catalog.labels) &&
        'volume' in catalog &&
        'size' in catalog &&
        'date' in catalog &&
        'lastUpdated' in catalog &&
        'updates' in catalog;
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