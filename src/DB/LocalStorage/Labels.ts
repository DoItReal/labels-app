import { labelDataType } from '../Interfaces/Labels';
export const getLabels = (): labelDataType[] => {
    return JSON.parse(localStorage.getItem('labels') || '[]');
}
export const updateLabels = (labels: labelDataType[]) => {
    localStorage.setItem('labels', JSON.stringify(labels));
}
export const deleteLabel = (id: string) => {
    const labels = getLabels();
    const index = labels.findIndex((item) => item._id === id);
    if (index !== -1) {
        labels.splice(index, 1);
        updateLabels(labels);
    }
}
export const editLabel = (label: labelDataType) => {
    const labels = getLabels();
    const index = labels.findIndex((item) => item._id === label._id);
    if (index !== -1) {
        labels[index] = label;
        updateLabels(labels);
    }
}
export const addLabel = (label: labelDataType) => {
    const labels = getLabels();
    labels.push(label);
    updateLabels(labels);
}
export const getLocalLabelById = (id: string): labelDataType | undefined => {
    const labels = getLabels();
    return labels.find((item) => item._id === id);
}