import { labelDataType } from '../../DB/Interfaces/Labels';
import { Design, Dimensions, Position, UnifiedBlock } from '../../DB/Interfaces/Designs';

export interface CanvasProps {
    design: Design;
    blocks: UnifiedBlock[];
    label: labelDataType;
    qrCode?: Boolean;
}

/**
 * *** This is 1 queue item which holds the information for 1 text to be drawn on the canvas ***
 * context: CanvasRenderingContext2D
 * text: string
 * x: number
 * y: number
 * font: string
 * color: string
 * position: Position
 */
export interface ItextQueue {
    context: CanvasRenderingContext2D;
    text: string;
    x: number;
    y: number;
    font: string;
    color: string;
    position: Position;
    next?: ItextQueue;
}

/**
 * *** This is 1 queue item which holds the information for 1 allergen image to be drawn on the canvas ***
 * context: CanvasRenderingContext2D
 * image: number
 * x: number
 * y: number
 * fontSize: number
 * position: Position
 * color: string
 */
export interface IallergenQueue {
    context: CanvasRenderingContext2D;
    image: number;
    x: number;
    y: number;
    fontSize: number;
    position: Position;
    color: string;
    next?: IallergenQueue;
}

/**
 * *** This is 1 queue item which holds the information for 1 image to be drawn on the canvas ***
 * context: CanvasRenderingContext2D
 * imageId: string
 * dimensions: Dimensions;
 * transparency: number;
 * position: Position;
 */
export interface IimageQueue {
    context: CanvasRenderingContext2D;
    imageId: string;
    dimensions: Dimensions;
    transparency: number;
    position: Position;
    next?: IimageQueue;
}

export type Tqueue = ItextQueue | IallergenQueue | IimageQueue;
/**
 * *** This is an array of Tqueue items which holds the information for all the text, allergen images and images to be drawn on the canvas ***
 * Tqueue: ItextQueue | IallergenQueue | IimageQueue
 */
export type TqueueArray = Tqueue[];

// Type guard for ItextQueue
export const isTextQueue = (queue: any): queue is ItextQueue => {
    return queue && typeof queue.text === 'string' && typeof queue.font === 'string';
};

// Type guard for ItextQueue array
/*
export const isTextQueueArray = (queue: any): queue is ItextQueue[] => {
    return Array.isArray(queue) && queue.every(isTextQueue);
};
*/

// Type guard for IallergenQueue
export const isAllergenQueue = (queue: any): queue is IallergenQueue => {
    return queue && typeof queue.image === 'number' && typeof queue.fontSize === 'number';
};

// Type guard for IallergenQueue array
/*
export const isAllergenQueueArray = (queue: any): queue is IallergenQueue[] => {
    return Array.isArray(queue) && queue.every(isAllergenQueue);
};
*/

// Type guard for IimageQueue
export const isImageQueue = (queue: any): queue is IimageQueue => {
    return queue && typeof queue.imageId === 'string' && typeof queue.dimensions === 'object' && typeof queue.transparency === 'number';
};

// Type guard for IimageQueue array
/*
export const isImageQueueArray = (queue: any): queue is IimageQueue[] => {
    return Array.isArray(queue) && queue.every(isImageQueue);
};
*/
export const isTqueueArray = (queue: any): queue is TqueueArray => {
    return Array.isArray(queue) && queue.every(isTextQueue || isAllergenQueue || isImageQueue);
}