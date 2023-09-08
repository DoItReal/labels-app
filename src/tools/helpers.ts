export function findIndexByProperty(arr: Array<any>=[], propName: string, propValue: string) {
    if (arr.length === 0) return -1;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i][propName] === propValue) {
            return i;
        }
    }
    return -1; // Return -1 if the object is not found
}