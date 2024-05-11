import { fetchCatalogs } from "../DB/Remote/Catalogs";
import { loadCatalogsLocally } from "../DB/SessionStorage/Catalogs";
import { fetchLabels } from "../DB/Remote/Labels"
import { updateLabels } from "../DB/LocalStorage/Labels"
import { fetchDesigns } from "../DB/Remote/Designs";
import { setLocalDesigns } from "../DB/LocalStorage/Designs";
import { setLocalAllergens } from "../DB/LocalStorage/Allergens";
import { fetchAllergens } from "../DB/Remote/Allergens";

export const initDB = async () => {
    //fetch Labels and set them to LocalStorage
    try {
        fetchLabels().then(labels => { updateLabels(labels) });
        //fetch Catalogs and set them to LocalStorage
        fetchCatalogs().then(catalogs => { loadCatalogsLocally(catalogs) });
        //fetch Designs and set them to LocalStorage
        fetchDesigns().then(designs => { setLocalDesigns(designs) });
        //fetch Allergens and set them to LocalStorage
        fetchAllergens().then(allergens => { setLocalAllergens(allergens) });
    } catch (error) {
        console.error(error);
    }
}
