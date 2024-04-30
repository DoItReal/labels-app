/*
TO DO: 
labelDataType {
    _id: string,
    allergens: Array<number>,
    category: Array<string>,
    translations: Array<MealTranslations>,
    owner: string // id of the user who created the label
}
MealTranslations { 
    lang:string, //bg, en, de, ru...
    name:string, //name of the meal in the specific language
    description:string //description of the meal in the specific language
    }
*/
export interface MealTranslation {
    lang: string, // bg, en, de, rus...
    name: string, // name of the meal in the specific language
    description: string // description of the meal in the specific language
}
export const isMealTranslation = (arg: any): arg is MealTranslation => {
    return (
        arg.hasOwnProperty("lang") &&
        arg.hasOwnProperty("name") &&
        arg.hasOwnProperty("description")
    ) ? true : false;
};
export interface labelDataType {
    _id: string, // id of the label
    allergens: Array<number>, // array of allergens
    category: Array<string>, // array of categories
    translations: Array<MealTranslation>, // array of translations
    owner: string // id of the user who created the label
}
export const isLabelDataType = (arg: any): arg is labelDataType => {
    return (
        arg.hasOwnProperty("_id") &&
        arg.hasOwnProperty("allergens") &&
        arg.hasOwnProperty("category") &&
        arg.hasOwnProperty("owner") && 
        arg.hasOwnProperty("translations") &&
        arg.translations.every((el: any) => isMealTranslation(el))
    ) ? true : false;
}

export const isLabelDataTypeArray = (arg: any): arg is labelDataType[] => {
    return arg.every((el: any) => isLabelDataType(el));
}
