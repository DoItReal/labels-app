import { NewDesign, Design, isDesign, isDesignArray } from "./Interfaces/CommonInterfaces";
const address = "http://localhost:8080/";
export const createNewDesign = (design: NewDesign) => {
    return (new Promise<Design>((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", address + 'designs');
        xhr.withCredentials = true;
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                resolve(JSON.parse(xhr.responseText));
            } else if (xhr.status !== 200) {
                reject(new Error('Error in saving new Design'));
            }
        };
        xhr.send(JSON.stringify(design));
    }));
}
export const updateDesign = (design: Design) => {
    const address = "http://localhost:8080/";
    return (new Promise<Design>((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open("PATCH", address + 'designs/' + design._id);
        xhr.withCredentials = true;
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                resolve(design);
            } else if (xhr.status !== 200) {
                reject(new Error('Error in saving new Design'));
            }
        };
        xhr.send(JSON.stringify(design));
    }));
}
export function fetchDesigns() {
    const address = "http://localhost:8080/";
    //get data from db
    return (new Promise<string>((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", address + 'designs', true);
        xhr.withCredentials = true;
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                resolve(xhr.response);
            } else if (xhr.status !== 200) {
                reject(new Error('Error in fetching Designs'));
            }
        };
        xhr.onerror = () => reject(new Error('Error in fetching Designs'));

        xhr.send();
    }));

}
export const deleteDesign = (designId: string) => {
const address = "http://localhost:8080/";
    return (new Promise<string>((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open("DELETE", address + 'designs/' + designId);
        xhr.withCredentials = true;
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                resolve(designId);
            } else if (xhr.status !== 200) {
                reject(new Error('Error in deleting Design'));
            }
        };
        xhr.send();
    }));
}
//return the blocks from session storage as Design[] or null
export const getLocalDesigns = (): Design[] | null => {
    const storedDesignsString = sessionStorage.getItem('designs');

        try {
            if (!storedDesignsString) {
                const fetchDesignsString = async () => {
                    await fetchDesigns().then(response => { response && setLocalDesigns(JSON.parse(response)); getLocalDesigns(); } );
                }
                //Its going in infinity loop if no designs saved!
                fetchDesignsString();
            }
            const storedDesigns = storedDesignsString && JSON.parse(storedDesignsString);
            if (isDesignArray(storedDesigns))
                return(storedDesigns);
            else return(null);
        } catch (error) {
            console.log(error);
            return(null);
        }
}

export const setLocalDesigns = (designs: Design[]) => {
    sessionStorage.setItem('designs', JSON.stringify(designs));
}
export const updateLocalDesign = (design: Design) => {
    const storedDesigns = getLocalDesigns();
    if (storedDesigns && isDesignArray(storedDesigns)) {
        const updatedDesigns = storedDesigns.map(designItem => {
            if (designItem._id === design._id) {
                return design;
            } else {
                return designItem;
            }
        });
        setLocalDesigns(updatedDesigns);
    }
}