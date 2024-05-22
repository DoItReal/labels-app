import { IallergensMap } from "../DB/Interfaces/Allergens";

const initAllergen: IallergensMap = {
    _id: '0',
    name: 'Empty Allergen Config',
    allergens: [],
    creationDate: new Date(),
    permission: 'none',
   
    };
const AllergenEditor = ({ allergen, setAllergen }: {allergen: IallergensMap | undefined, setAllergen: (allergen: IallergensMap) => void}) => {
    if (!allergen) allergen = initAllergen;
    return (
        <div>
            <h1>Allergen Editor</h1>
            <h2>{allergen.name}</h2>
            <p>Creation Date: {new Date(allergen.creationDate).toLocaleDateString('bg-BG')}</p>
            <p>Permission: {allergen.permission}
            </p>
            <p>Allergens:</p>
            <ul>
                {allergen.allergens.map((a, index) => (
                    <li key={index}>{a.name}
                        <img src={a.imageDataURL}></img>
                        {a.description}
                    </li>

                ))}
            </ul>

        </div>
    );
};

export default AllergenEditor;