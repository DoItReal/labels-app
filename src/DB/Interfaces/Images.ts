/**
 * name: string;
 * DataUrl: string;
 * size: number;
 * uploadedAt:string;
 * owner:string;
 */
export interface Image {
    name: string;
    DataUrl: string;
    size: number;
    uploadedAt: string;
    owner: string;
}
export function isImage(obj: any): obj is Image {
    return (
        typeof obj.name === 'string' &&
        typeof obj.DataUrl === 'string' &&
        typeof obj.size === 'number' &&
        typeof obj.uploadedAt === 'string' &&
        typeof obj.owner === 'string'
    );
}
/**
 * _id: string;
 * name:string;
 * image: HTMLImageElement;
 * size: number;
 */
export interface Iimage {
    _id: string;
    name: string;
    image: HTMLImageElement;
    size: number;
}
export function isIimage(obj: any): obj is Iimage {
    return (
        typeof obj._id === 'string' &&
        typeof obj.name === 'string' &&
        obj.image instanceof HTMLImageElement &&
        typeof obj.size === 'number'
    );
}
export function isIimageArray(obj: any): obj is Iimage[] {
    return (
        Array.isArray(obj) &&
        obj.every(isIimage)
    );
}