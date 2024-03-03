import { IaddedLabel } from "../content/Content";
import { labelDataType } from "../db";

//adds selected labels to local storage
   export const saveSelectedLabels = (selectedLabels:IaddedLabel[]) => {
         localStorage.setItem('selectedLabels', JSON.stringify(selectedLabels));
}
//removes selected labels from local storage
export const deleteSelectedLabels = (label: labelDataType[] | null = null) => {
    //if label is null, remove all selected labels
    if (label === null)
        localStorage.removeItem('selectedLabels');
    //else remove the label or labels from selected labels
    else {
        const tmp = localStorage.getItem('selectedLabels');
        if (tmp) {
            const current = JSON.parse(tmp);
            const newLabels = current.filter((lbl: IaddedLabel) => 
                !label.some((lbl2: labelDataType) => lbl2._id === lbl._id));
            saveSelectedLabels(newLabels);
        }
    }
}
//loads selected labels from local storage
export const fetchSelectedLabels = () => {
    const tmp = localStorage.getItem('selectedLabels');
    if (tmp) {
        return JSON.parse(tmp) as IaddedLabel[];
    } else {
        return [];
    }
}

//adds label to selected
export const addSelectedLabel = (label: labelDataType) => {
    const tmp = fetchSelectedLabels();
    if (tmp && tmp.length > 0) {
        //if label is already in selected labels, increment count
        if (tmp.some(lbl => lbl._id === label._id)) {
            const newLabels = tmp.map(lbl => {
                if (lbl._id === label._id) {
                    return {
                        ...lbl,
                        count: lbl.count + 1
                    }
                } else return lbl;
            });
            saveSelectedLabels(newLabels);
        }
        //else add label to selected labels
        else {
            const newLabels = [...tmp, { ...label, count: 1 }];
            saveSelectedLabels(newLabels);
        }
    }
    //else add label to selected labels
    else {
        saveSelectedLabels([{ ...label, count: 1 }]);
    }
}