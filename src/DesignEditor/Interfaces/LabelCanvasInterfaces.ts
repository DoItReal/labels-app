//All interfeces in ../LabelCanvas.tsx are defined here
import { labelDataType } from '../../DB/Interfaces/Labels';
import { Design, Dimensions, Position, UnifiedBlock } from './CommonInterfaces'; 

export interface CanvasProps {
    design: Design;
    blocks: UnifiedBlock[];
    label: labelDataType;
}
export interface ItextQueue {
    context: CanvasRenderingContext2D;
    text: string;
    x: number;
    y: number;
    font: string;
    color: string;
    position: Position;
}
export const isTextQueue = (queue: (ItextQueue | ItextQueue[]) | IallergenQueue | IimageQueue): queue is ItextQueue => {
    return Array.isArray(queue) && queue.every(item => 'text' in item && (item as ItextQueue).text !== undefined);
}
export const isTextQueueArray = (queue: TqueueArray | Tqueue): queue is ItextQueue[] => {
    return Array.isArray(queue) && queue.every((q) => isTextQueue(q));
}
export interface IallergenQueue {
    context: CanvasRenderingContext2D;
    image: number;
    x: number;
    y: number;
    fontSize: number;
    position: Position;
    color: string;
}
export const isAllergenQueue = (queue: ItextQueue | IallergenQueue | IimageQueue): queue is IallergenQueue => {
    return Array.isArray(queue) && queue.every(item=> 'image' in item && (item as IallergenQueue).image !== undefined);
}
export interface IimageQueue {
    context: CanvasRenderingContext2D;
    imageId: string;
    dimensions: Dimensions;
    transperancy: number;
    position: Position;
}
export const isImageQueue = (queue: ItextQueue | IallergenQueue | IimageQueue): queue is IimageQueue => {
    return Array.isArray(queue) && queue.every(item => 'imageId' in item && (item as IimageQueue).imageId !== undefined);
}
export type Tqueue = (ItextQueue | ItextQueue[]) | IallergenQueue | IimageQueue;
export type TqueueArray = Tqueue[];
