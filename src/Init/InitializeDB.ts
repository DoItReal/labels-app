import { fetchLabels } from "../DB/Labels"
import { updateLabels } from "../LocalStorage/Labels"

export const initDB = async () => {
    //fetch Labels and set them to LocalStorage
    try {
        updateLabels(await fetchLabels());
        //fetch Catalogs and set them to LocalStorage

        //fetch Designs and set them to LocalStorage

    } catch (error) {
        console.error(error);
    }
}
