type allergenSchema = {
    name: string;
    number: number;
};
export const isAllergensSchema = (arg: any): arg is allergenSchema => {
    return arg.name !== undefined &&
        arg.number !== undefined;
}
export const isAllergensSchemaArray = (arg: any): arg is allergenSchema[] => {
    return arg.every((e: any) => isAllergensSchema(e));
}
export interface IallergensSchema {
    _id: string;
    name: string;
    owner?: string;
    readOnlyAccess?: string[];
    readWriteAccess?: string[];
    creationDate?: Date;
    allergens: allergenSchema[];
}
export const isIallergensSchema = (arg: any): arg is IallergensSchema => {
    return (
        arg._id !== undefined &&
        arg.name !== undefined &&
        arg.allergens !== undefined &&
        isAllergensSchemaArray(arg.allergens)
    );
}
export const isIallergensSchemasArray = (arg: any): arg is IallergensSchema[] => {
    return arg.every((e: any) => isIallergensSchema(e));
}

export interface IallergensSchemaDB {
    _id: string;
    name: string;
    owner: string;
    readOnlyAccess: string[];
    readWriteAccess: string[];
    creationDate: Date;
    schema: allergenSchema[];
}
export const isAllergensSchemaDB = (arg: any): arg is IallergensSchemaDB => {
    return arg._id !== undefined &&
        arg.name !== undefined &&
        arg.owner !== undefined &&
        arg.readOnlyAccess !== undefined &&
        arg.readWriteAccess !== undefined &&
        arg.creationDate !== undefined &&
        arg.schema !== undefined &&
        isAllergensSchemaArray(arg.schema);
}
export const isIallergensSchemaDBArray = (arg: any): arg is IallergensSchemaDB[] => {
    return arg.every((e: any) => isAllergensSchemaDB(e));
}