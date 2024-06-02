export interface Image {
    name: string;
    DataUrl: string;
    size: number;
    uploadedAt: string;
    owner: string;
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
