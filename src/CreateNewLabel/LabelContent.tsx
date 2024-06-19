import { ChangeEvent, useEffect, useState } from "react";
import { Category } from '../content/UI/CategoryUI';
import { Allergens } from "../content/UI/AllergensUI";
import './labelContent.css';
import { IsaveLabelInput } from './index';
import { translate } from '../tools/translate';
import TranslateButtonSVG from '@mui/icons-material/Translate';
import { Box, Container, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput} from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2';
import { MealTranslation } from "../DB/Interfaces/Labels";
import { getFullLanguageName } from "../tools/langUtils";
import { labelDataType } from '../DB/Interfaces/Labels';
import LabelCanvas from '../DesignEditor/LabelCanvas';
import { getLocalDesigns } from "../DB/LocalStorage/Designs";

export const LabelContent = ({ currentAllergens, setCurrentAllergens, filterCategory, setFilterCategory, translation, setTranslation, handleSubmit, type }: IsaveLabelInput) => {
    const [preview, setPreview] = useState<any>(null);
    const setNameValue = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, lang: string) => {
        let tmp = [...translation];
        tmp.map((el: MealTranslation) => {
            if (el.lang === lang) {
                el.name = e.target.value;
            }
        });
        setTranslation(tmp);
    }
    const setDescriptionValue = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, lang: string) => {
        let tmp = [...translation];
        tmp.map((el: MealTranslation) => {
            if (el.lang === lang) {
                el.description = e.target.value;
            }
        });
        setTranslation(tmp);
    }
    const handleTranslate = async (text: string, lang: string) => {
        console.log(translation);
        let tmp = [ ...translation ];
        await Promise.all(tmp.map(async (el: MealTranslation) => {
            const langCode = el.lang;
            if (langCode === lang) return el;
            if (el.name === '') {
                try {
                    let translation = await translate(text, langCode);
                    el.name = translation.replace(/["]/g, '');
                } catch (error) {
                    console.log(error);
                }
            }
            return el;
        }));

        setTranslation(tmp);
    };
    
    useEffect(() => { 
        const designs = getLocalDesigns();
        if (!designs || designs.length < 1) return;
        const design = designs[0];
        const labelNew:labelDataType = {
            _id: 'new',
            allergens: currentAllergens,
            category: filterCategory,
            translations: translation,
            owner: 'new',
        };
        const label = <LabelCanvas design={design} blocks={design.blocks} label={labelNew} />;
        setPreview(label);
    }, [translation, currentAllergens]);

    return (
        <Container  disableGutters >
                <Box component="form" onSubmit={handleSubmit }
                    sx={{
                        
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-center',
                        width: '100%',
                        padding:'0 5% 0 5%'
                    }}>
                <Grid container rowSpacing={1} columnSpacing={1} sx={{} }>
                    <Grid xs={12} sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: '50px',
                    }}> {/* To rework this */ }
                            {preview ? preview : 'no preview loaded'}
                            </Grid>
                        
                        <Grid xs={12} sx={{
                            alignItems: 'center',
                            fontSize: '1.2rem',
                            fontWeight: 'bold'
                        }}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '1.4rem'
                        }}>
                        <Category filterCategory={filterCategory} setFilterCategory={setFilterCategory} /> 
                      </Box>
                        </Grid>
                    <Grid xs={12} sx={{
                        alignItems: 'center',
                        fontSize: '1.2rem',
                        fontWeight: 'bold'
                    }}>
                      
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '1.4rem',
                        }}>
                          <Allergens currentAllergens={currentAllergens} setCurrentAllergens={setCurrentAllergens} />
                        </Box>
                    </Grid>

                    {/* Translation section */ }
                        {translation.map((transl: MealTranslation) => (
                     
                            <Grid container key={transl.lang + 'ID'} sx={{
                                display: 'flex'
                            }}>   
                                <Grid xs={12} sx={{textAlign:'center'} }>
                                    <LabelNameElement key={transl.lang + 'nameInput' } transl={transl} setNameValue={setNameValue} handleTranslate={handleTranslate } />
                                </Grid>
                                <DescriptionElement key={transl.lang + 'descriptionInput'} transl={transl} setDescriptionValue={setDescriptionValue} />
                            </Grid>
                    
                        ) 
                    )}
                        {/* End of translation section */ }

                    <Grid xs={12} sx={{textAlign:'center'} }>
                        <button type="submit" className="submitButton">{type}</button>
                    </Grid>
                </Grid>
            </Box>
        </Container>        
        );
}
const LabelNameElement = ({ transl, setNameValue, handleTranslate }:
     {
          transl: MealTranslation,
          setNameValue: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, lang: string) => void,
          handleTranslate: (text: string, lang: string) => void
     }
) => {
return (<FormControl fullWidth variant="outlined" size="small" >
    <InputLabel color='info' htmlFor={"label_" + transl.lang} sx={{ fontSize: '1.4rem', fontWeight: 'bold' }}>{getFullLanguageName(transl.lang)}</InputLabel>
    <OutlinedInput
        fullWidth
        id={"labelId_" + transl.lang}
        className={getFullLanguageName(transl.lang).toLowerCase()}
        value={transl.name || ''}
        onChange={e => setNameValue(e, transl.lang)}
        sx={{
            fontSize: '1.4rem', fontWeight: 'bold'
        }}
        endAdornment={
            <InputAdornment position="end">
                <IconButton
                    size="large"
                    title="Translate"
                    aria-label="toggle translation"
                    onClick={() => {
                        handleTranslate(transl.name, transl.lang);
                    }
                    }
                    onMouseDown={(event: React.MouseEvent<HTMLButtonElement>) => {
                        event.preventDefault();
                    }
                    }
                    edge="end"
                    className="button-translate"
                >
                    <Box height={1} width={1} sx={{
                        display: 'flex',
                        position: 'relative',
                        backgroundColor: "lightblue",
                        border: '1px solid blue',
                        borderRadius: '5px'
                    }} >
                        <TranslateButtonSVG fontSize="large" />
                    </Box>
                </IconButton>
            </InputAdornment>
        }
        label={getFullLanguageName(transl.lang)}
    />
</FormControl>
);
}



const DescriptionElement = ({ transl, setDescriptionValue }:
    {
        transl: MealTranslation,
        setDescriptionValue: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,lang: string) => void
    }) => {
    return (
        <FormControl fullWidth variant="outlined" size="small">
            <InputLabel color='info' htmlFor={"description_" + transl.lang} sx={{ fontSize: '1.4rem', fontWeight: 'bold' }}>
                {getFullLanguageName(transl.lang) + " Description"}
            </InputLabel>
            <OutlinedInput
                fullWidth
                id={"descriptionId_" + transl.lang}
                className={getFullLanguageName(transl.lang).toLowerCase() + "-description"}
                value={transl.description || ''}
                onChange={e => setDescriptionValue(e, transl.lang)}
                sx={{ fontSize: '1.4rem', fontWeight: 'bold' }}
                label={getFullLanguageName(transl.lang) + " Description"}
            />
        </FormControl>
    );
}