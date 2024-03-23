export function findIndexByProperty(arr: Array<any>=[], propName: string, propValue: string) {
    if (arr.length === 0) return -1;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i][propName] === propValue) {
            return i;
        }
    }
    return -1; // Return -1 if the object is not found
}
export function isNotNullOrUndefined<T extends Object>(input: null | undefined | T): input is T {
    return input != null;
}
export const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
}
export function debounce(func: Function, delay: number) {
    let timeoutId: NodeJS.Timeout | null = null; // Initialize timeoutId

    return (...args: any[]) => {
        // Clear the existing timeout
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        // Set a new timeout
        timeoutId = setTimeout(() => {
            func(...args);
            timeoutId = null; // Reset timeoutId after the function is executed
        }, delay);
    };
}