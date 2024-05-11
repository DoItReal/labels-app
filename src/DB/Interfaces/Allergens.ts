export interface Iallergen {
    name: string;
    imageDataURL: string;
}
export const isIallergen = (arg: any): arg is Iallergen => {
    return arg.name !== undefined &&
        arg.imageDataURL !== undefined;
}
export interface IallergensMap {
    _id: string;
    name: string;
    allergens: Iallergen[];
    creationDate: Date;
    permission: 'none' | 'read'| 'write' | 'owner';
}
export const isIallergensMap = (arg: any): arg is IallergensMap => {
    return arg._id !== undefined &&
        arg.name !== undefined &&
        arg.allergens !== undefined &&
        arg.creationDate !== undefined &&
        arg.permission !== undefined;
}
export const isIallergensMapArray = (arg: any): arg is IallergensMap[] => {
    return arg.every((e: any) => isIallergensMap(e));
}
export interface InewAllergen {
    name: string;
    allergens: Iallergen[];
}
export const isInewAllergen = (arg: any): arg is InewAllergen => {
    return arg.name !== undefined &&
        arg.allergens !== undefined &&
        arg.owner !== undefined;
}