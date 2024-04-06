import { fetchCatalogs } from "../DB/Remote/Catalogs";
import { loadCatalogsLocally } from "../DB/SessionStorage/Catalogs";
import { fetchLabels } from "../DB/Remote/Labels"
import { updateLabels } from "../DB/LocalStorage/Labels"
import { fetchDesigns } from "../DB/Remote/Designs";
import { setLocalDesigns } from "../DB/LocalStorage/Designs";

export const initDB = async () => {
    //fetch Labels and set them to LocalStorage
    try {
        fetchLabels().then(labels => { updateLabels(labels) });
        //fetch Catalogs and set them to LocalStorage
        fetchCatalogs().then(catalogs => { loadCatalogsLocally(catalogs) });
        //fetch Designs and set them to LocalStorage
        fetchDesigns().then(designs => { setLocalDesigns(designs) });
    } catch (error) {
        console.error(error);
    }
}
