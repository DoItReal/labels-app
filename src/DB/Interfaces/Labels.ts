export interface labelDataType {
    _id: string,
    allergens: Array<number>,
    category: Array<string>,
    bg: string,
    en: string,
    de: string,
    rus: string,
    owner: string
}
export const isLabelDataType = (arg: any): arg is labelDataType => {
    return (
        arg.hasOwnProperty("_id") &&
        arg.hasOwnProperty("allergens") &&
        arg.hasOwnProperty("category") &&
        arg.hasOwnProperty("bg") &&
        arg.hasOwnProperty("en") &&
        arg.hasOwnProperty("de") &&
        arg.hasOwnProperty("rus") &&
        arg.hasOwnProperty("owner")
    ) ? true : false;
}
export const isLabelDataTypeArray = (arg: any): arg is labelDataType[] => {
    return arg.every((el: any) => isLabelDataType(el));
}
