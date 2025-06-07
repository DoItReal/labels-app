import { labelDataType } from "../../../DB/Interfaces/Labels";
import { isNotNullOrUndefined } from "../../../tools/helpers";

// TODO: to save in db and fetch it
export const dataMap = new Map([
    ['bg', 'Bulgarian'],
    ['en', 'English'],
    ['de', 'Deutsch'],
    ['ru', 'Russian'],
    ['allergens', 'Allergens'],
    ['count', 'Count'],
    ['actions', 'Actions']
]);

export const getRows = (data: labelDataType[], includeActions = false) =>
    data.map(el => {
        const translationObject = Object.fromEntries(
            el.translations.map(translation => [translation.lang, translation.name])
        );

        const baseRow = {
            id: el._id,
            //@ts-ignore
            count: el.count,
            allergens: el.allergens,
            ...translationObject
        };

        return includeActions
            ? { ...baseRow, actions: { name: 'Actions', type: 'actions', width: 50 } }
            : baseRow;
    });
export const keys = (rows: any[]) => {
    return Object.keys(rows[0]);
}

export const dataColUnfiltered = (keys: string[]) =>
    keys
        .filter(key => dataMap.has(key)) // This already filters out invalid keys
        .map(key => ({
            name: dataMap.get(key),
            type: key,
            width: 150
        })).filter(isNotNullOrUndefined);