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


export const LabelContent = ({ currentAllergens, setCurrentAllergens, filterCategory, setFilterCategory, translation, setTranslation, handleSubmit, type }: IsaveLabelInput) => {
    const [preview, setPreview] = useState<any>(null);

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

        inputChange(tmp);
    };
    const setBG = (e: ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
        let tmp = [ ...translation ];
        tmp.map((el: MealTranslation) => {
            if (el.lang === 'bg') {
                el.name = e.target.value;
            }
        });
        inputChange(tmp);
    };
    const setEN = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        let tmp = [...translation];
        tmp.map((el: MealTranslation) => {
            if (el.lang === 'en') {
                el.name = e.target.value;
            }
        });
        inputChange(tmp);
    };
    const setDE = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        let tmp = [...translation];
        tmp.map((el: MealTranslation) => {
            if (el.lang === 'de') {
                el.name = e.target.value;
            }
        });
        inputChange(tmp);
    };
    const setRUS = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        let tmp = [...translation];
        tmp.map((el: MealTranslation) => {
            if (el.lang === 'ru') {
                el.name = e.target.value;
            }
        });
        inputChange(tmp);
    };


    const inputChange = (newTranslation: MealTranslation[]) => {
        setTranslation(newTranslation);
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
                    <Grid xs={12} sx={{
                        display:'flex'
                    }}>   
                        <FormControl fullWidth variant="outlined" size="small" >
                            <InputLabel color='info' htmlFor="label_bg" sx={{ fontSize: '1.4rem', fontWeight: 'bold' }}>Bulgarian</InputLabel>
                            <OutlinedInput
                                fullWidth
                                id="label_bg"
                                className="bulgarian"
                                value={translation.find((el) => el.lang === 'bg')?.name || ''}
                                onChange={e => setBG(e)}
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
                                                const transl = translation.find((el) => el.lang === 'bg');
                                                if (transl && transl.name !== '') {
                                                    handleTranslate(transl.name, 'bg');
                                                }
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
                                                <TranslateButtonSVG fontSize="large"/>
                                            </Box>
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Bulgarian"
                            />
                        </FormControl>
                    </Grid>
                    <Grid xs={12} sx={{
                        display: 'flex'
                    }}>
                        <FormControl fullWidth variant="outlined" size="small"  >
                            <InputLabel color='info' htmlFor="label_en" sx={{ fontSize: '1.4rem', fontWeight:'bold'  }}>English</InputLabel>
                            <OutlinedInput
                                 fullWidth
                                id="label_en"
                                className="english"
                                value={translation.find((el) => el.lang === 'en')?.name || ''}
                                onChange={e => setEN(e)}
                                sx={{ 
                                    fontSize: '1.4rem', fontWeight:'bold'
                                } }
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        size="large"
                                        title="Translate"
                                        aria-label="toggle translation"
                                        onClick={() => {
                                            const transl = translation.find((el) => el.lang === 'en');
                                            if (transl && transl.name !== '')
                                                handleTranslate(transl.name, 'en');
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
                            label="English"
                            />
                            </FormControl>
                        </Grid>
                    <Grid xs={12} sx={{
                        display: 'flex'
                    }}>
                        <FormControl fullWidth variant="outlined" size="small" >
                            <InputLabel color='info' htmlFor="label_de" sx={{ fontSize: '1.4rem', fontWeight: 'bold' }}>German</InputLabel>
                            <OutlinedInput
                                fullWidth
                                id="label_de"
                                className="deutsch"
                                value={translation.find((el) => el.lang === 'de')?.name || ''}
                                onChange={e => setDE(e)}
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
                                                const transl = translation.find((el) => el.lang === 'de');
                                                if (transl && transl.name !== '')
                                                    handleTranslate(transl.name, 'de');
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
                                label="Deutsch"
                            />
                        </FormControl>
                    </Grid>
                    <Grid xs={12} sx={{
                        display: 'flex'
                    }}>
                        <FormControl fullWidth variant="outlined" size="small" >
                            <InputLabel color='info' htmlFor="label_rus" sx={{ fontSize: '1.4rem', fontWeight: 'bold' }}>Russian</InputLabel>
                            <OutlinedInput
                                fullWidth
                                id="label_ru"
                                className="russian"
                                value={translation.find((el) => el.lang === 'ru')?.name || ''}
                                onChange={e => setRUS(e)}
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
                                                const transl = translation.find((el) => el.lang === 'ru');
                                                if (transl && transl.name !== '')
                                                    handleTranslate(transl.name, 'ru');
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
                                label="Russian"
                            />
                        </FormControl>
                    </Grid>
                    <Grid xs={12} sx={{textAlign:'center'} }>
                        <button type="submit" className="submitButton">{type}</button>
                    </Grid>
                </Grid>
            </Box>
        </Container>        
        );
}