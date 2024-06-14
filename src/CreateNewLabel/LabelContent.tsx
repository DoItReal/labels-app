import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Category } from '../content/UI/CategoryUI';
import { Allergens } from "../content/UI/AllergensUI";
import './labelContent.css';
import { Label } from '../labels';
import { IsaveLabelInput } from './index';
import { translate } from '../tools/translate';
import TranslateButtonSVG from '@mui/icons-material/Translate';
import { Box, Container, FormControl, IconButton, Input, InputAdornment, InputLabel, OutlinedInput, TextField} from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2';
import { MealTranslation } from "../DB/Interfaces/Labels";
import { getFullLanguageName } from "../tools/langUtils";


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
        let width = window.innerWidth / 2;    // 720;
        let height = window.innerHeight*1.2;    // 920;
        let signsInPage = 8;
        let label = new Label(width / 2 - 10, height / (signsInPage / 2) - 10);
        label.setContent(currentAllergens, translation);
        let canvas = label.generate();
        setPreview(<img alt="Label preview" src={canvas.toDataURL('image/jpeg')}></img>);
    }, [translation, currentAllergens]);

    return (
        <Container maxWidth="sm" disableGutters >
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
                        marginTop: '35px',
                    }}>
                            {preview ? <div className="preview">{preview}</div> : <div className="preview">'no preview loaded' </div>}
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
                            <FormControl fullWidth variant="outlined" size="small" >
                                    <InputLabel color='info' htmlFor={"label_" + transl.lang} sx={{ fontSize: '1.4rem', fontWeight: 'bold' }}>{getFullLanguageName(transl.lang) }</InputLabel>
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
                                </Grid>
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