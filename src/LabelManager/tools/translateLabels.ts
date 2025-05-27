// tools/translateLabels.ts
import { labelDataType } from "../../DB/Interfaces/Labels";
import { translate } from "../../tools/translate";

export const translateAllLabels = async (
    labels: labelDataType[],
    sourceLang: string,
    attr: "name" | "description",
    onProgress?: (current: number, total: number) => void
): Promise<{ updatedLabels: labelDataType[], errors: string[] }> => {
    const translatedLabels:labelDataType[] = structuredClone(labels);
    const errors: string[] = [];
    const total = translatedLabels.length;
    let current = 0;

    for (let label of translatedLabels) {
        const sourceTranslation = label.translations.find((t) => t.lang === sourceLang);

        for (let translation of label.translations) {
            if (translation.lang === sourceLang) continue;

            try {
                switch (attr) {
                    case "name":
                        if (!translation.name && sourceTranslation?.name) {
                            const result = await translate(sourceTranslation.name, translation.lang);
                            translation.name = result.replace(/^"(.*)"$/, "$1");
                        }
                        break;
                    case "description":
                        if (!translation.description && sourceTranslation?.description) {
                            const result = await translate(sourceTranslation.description, translation.lang);
                            translation.description = result.replace(/^"(.*)"$/, "$1");
                        }
                        break;
                }
            } catch {
                errors.push(`Failed to translate ${attr} for ${translation.lang}`);
            }
        }

        current++;
        onProgress?.(current, total);
    }

    return { updatedLabels: translatedLabels, errors };
};