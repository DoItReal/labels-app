export interface Position {
    x: number;
    y: number;
}
export interface Dimensions {
    width: number;
    height: number;
}
//TO DO get textParameters based on DB INPUT or from API
export const textParameters = ['bg', 'en', 'de', 'rus'] as const;
export type TtextParameter = typeof textParameters[number] | '';
export type TimageParameter = 'image' | 'allergens';
export type TypeBlock = {
    id: number;
    position: Position;
    dimensions: Dimensions;
    font: string;
    color: string;
    __v?: number;
}
export interface textFieldBlock extends TypeBlock {
    textParameter: TtextParameter;
}
export interface allergenFieldBlock extends TypeBlock {
    type: 'allergens';
}
export interface imageFieldBlock extends TypeBlock {
    type: 'image';
    imageID: number;
}
export type UnifiedBlock = textFieldBlock | imageFieldBlock | allergenFieldBlock;
export function isUnifiedBlock(obj: any): obj is UnifiedBlock {
    if (!obj || typeof obj !== 'object') {
        return false;
    }
    if ('type' in obj) {
        if (obj.type === 'allergens') {
            return (
                typeof obj.id === 'number' &&
                typeof obj.position === 'object' && /* You may need a more specific check for Position */
                typeof obj.dimensions === 'object' && /* You may need a more specific check for Dimensions */
                typeof obj.font === 'string' &&
                typeof obj.color === 'string'
            );
        } else if (obj.type === 'image') {
            return (
                typeof obj.id === 'number' &&
                typeof obj.position === 'object' && /* You may need a more specific check for Position */
                typeof obj.dimensions === 'object' && /* You may need a more specific check for Dimensions */
                typeof obj.font === 'string' &&
                typeof obj.color === 'string' &&
                typeof obj.imageID === 'number'
            );
        }
    } else if ('textParameter' in obj) {
        return (
            typeof obj.id === 'number' &&
            typeof obj.position === 'object' && /* You may need a more specific check for Position */
            typeof obj.dimensions === 'object' && /* You may need a more specific check for Dimensions */
            typeof obj.font === 'string' &&
            typeof obj.color === 'string' &&
            typeof obj.textParameter === 'string' /* You may need a more specific check for TtextParameter */
        );
    }

    return false;
}
export function isUnifiedBlockArray(arr: any): arr is UnifiedBlock[] {
    return Array.isArray(arr) && arr.every((obj: any) => isUnifiedBlock(obj));
}
export interface Design {
    _id: string; // Represents the ID in the database
    name: string;
    owner: string; //Represents the ID of the owner in the database
    canvas: { dim: Dimensions, border: number };
    blocks: UnifiedBlock[];
}
export function isDesign(obj: any): obj is Design {

    return (
        typeof obj._id === 'string' &&
        typeof obj.name === 'string' &&
        typeof obj.owner === 'string' &&
        typeof obj.canvas === 'object' && obj.canvas.dim && obj.canvas.dim.width && obj.canvas.dim.height &&
        Array.isArray(obj.designs) &&
        obj.designs.every((d: any) => isUnifiedBlock(d) /* Check UnifiedBlock properties here */) // Add conditions for UnifiedBlock if needed
    );
}
export function isDesignArray(arr: any): arr is Design[] {
    return Array.isArray(arr) && arr.every((obj: any) => isDesign(obj));
}
export interface NewDesign {
    name: string;
    owner: string; //Represents the ID of the owner in the database
    canvas: { dim: Dimensions };
    blocks: UnifiedBlock[];
}

export type HandleType = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top' | 'right' | 'bottom' | 'left' | null;