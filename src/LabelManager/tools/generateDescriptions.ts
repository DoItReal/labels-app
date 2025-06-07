// tools/generateDescriptions.ts
import { labelDataType } from "../../DB/Interfaces/Labels";
import generateDescriptionAI from "../../tools/completionAI";

export const generateDescriptionsForLabels = async (
    labels: labelDataType[],
    sourceLang: string,
    onProgress?: (current: number, total: number) => void
): Promise<{ updatedLabels: labelDataType[]; errors: string[] }> => {
    const updatedLabels: labelDataType[] = structuredClone(labels);
    const errors: string[] = [];
    const total = updatedLabels.length;
    let current = 0;

    const generateDescription = async (labelName: string) => {
        const prompt = `Generate just one description for the following label: "${labelName}". The description should be informative, suitable for a meal and to describe it up to 20 words. It must be suitable for use from API without`;
        try {
            const result: string = await generateDescriptionAI(prompt);
            return result.replace(/^"(.*)"$/, "$1");
        } catch {
            throw new Error("Failed to generate description");
        }
    };

    for (let label of updatedLabels) {
        const index = label.translations.findIndex((t) => t.lang === sourceLang);
        if (index === -1) continue;

        const translation = label.translations[index];
        if (!translation.description?.trim() && translation.name?.trim()) {
            try {
                const generated = await generateDescription(translation.name);
                translation.description = generated;
            } catch {
                errors.push(`Failed to generate for: ${translation.name}`);
            }
        }
        current++;
        onProgress?.(current, total);
    }

    return { updatedLabels, errors };
};