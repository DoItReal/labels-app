import { ChangeEvent, useEffect, useState } from "react";
import { Category } from '../../UI/CategoryUI';
import { Allergens } from "../../UI/AllergensUI";
import './labelContent.css';
import { Label } from '../../../labels';
import { IsaveLabelInput } from './index';
import { translate } from '../../../tools/translate';
import { ReactComponent as TranslateButtonSVG } from './translateSVG.svg';
import { Box, Container, TextField} from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2';


export function LabelContent({ currentAllergens, setCurrentAllergens, filterCategory, setFilterCategory, translation, setTranslation, handleSubmit, type }: IsaveLabelInput) {
   const [preview, setPreview] = useState<any>(null);
 
    const  handleTranslate = async (text:string) => {
        let tmp = { ...translation };

        if (tmp.bg === '') {
            try {
                let translation = await translate(text, 'bg');
                tmp.bg = translation.replace(/["]/g, '');
            } catch (error) {
                console.log(error);
            }
        }
        if (tmp.en === '') {
            try {
                let translation = await translate(text, 'en');
                tmp.en = translation.replace(/["]/g, '');
            } catch (error) {
                console.log(error);
            }
        }
        if (tmp.de === '') {
            try {
                let translation = await translate(text, 'de');
                tmp.de = translation.replace(/["]/g, '');
            } catch (error) {
                console.log(error);
            }
        }
        if (tmp.rus === '') {
            try {
                let translation =  await translate(text, 'ru');
                tmp.rus = translation.replace(/["]/g, '');
            } catch (error) {
                console.log(error);
            }
        }
        inputChange(tmp);
    }
    const setBG = (e: ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
        let tmp = { ...translation };
        tmp.bg = e.target.value;
        inputChange(tmp);
    };
    const setEN = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        let tmp = { ...translation };
        tmp.en = e.target.value;
        inputChange(tmp);
    };
    const setDE = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        let tmp = { ...translation };
        tmp.de = e.target.value;
        inputChange(tmp);
    };
    const setRUS = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        let tmp = { ...translation };
        tmp.rus = e.target.value;
        inputChange(tmp);
    };


    const inputChange = (newTranslation: { bg: string, en: string, de: string, rus: string }) => {
        setTranslation(newTranslation);
        
    };
    
    useEffect(() => { 
        let width = 720;
        let height = 920;
        let signsInPage = 8;
        let sign = new Label(width / 2 - 10, height / (signsInPage / 2) - 10);
        sign.setContent(currentAllergens, { bg: translation.bg, en: translation.en, de: translation.de, rus: translation.rus });
        let canvas = sign.generate();
        setPreview(<img alt="Label preview" src={canvas.toDataURL('image/jpeg')}></img>);
    }, [translation, currentAllergens]);

    return (
        <Container maxWidth="sm" disableGutters >
                <Box component="form" onSubmit={handleSubmit }
                    sx={{
                        
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                        width: '100%',
                        padding:'0 5% 0 5%'
                    }}>
                <Grid container rowSpacing={1} columnSpacing={1} sx={{} }>
                    <Grid xs={12} sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: '6%',
                    }}>
                            {preview ? <div className="preview">{preview}</div> : <div className="preview">'no preview loaded' </div>}
                            </Grid>
                        
                        <Grid xs={10} sx={{
                            alignItems: 'center',
                            fontSize: '1.2rem',
                            fontWeight: 'bold'
                        }}>
                            <div className="label">Category: <Category filterCategory={filterCategory} setFilterCategory={setFilterCategory} /> </div>
                      
                        </Grid>
                    <Grid xs={10} sx={{
                        alignItems: 'center',
                        fontSize: '1.2rem',
                        fontWeight: 'bold'
                    }}>
                      
                        <div className="label">Allergens: <Allergens currentAllergens={currentAllergens} setCurrentAllergens={setCurrentAllergens} /></div>
                    </Grid>
                    <Grid xs={12} sx={{
                        display:'flex'
                    } }>    
                        <TextField
                            fullWidth
                            id="label_bg"
                            label="Bulgarian"
                            name="text"
                            defaultValue={translation.bg}
                            onChange={e => setBG(e)}
                            className="bulgarian"
                            autoFocus
                            variant="outlined"
                            inputProps={{ sx: { fontSize: '1.4rem', textAlign: 'center' } }} 
                            sx={{ textAlign: 'center' }}
                            margin="none"
                            size="small"
                            />
                            <button type="button" className="button-translate" onClick={() => handleTranslate(translation.bg)} title="Translate">
                                <TranslateButtonSVG />
                            </button>
                    </Grid>
                    <Grid xs={12} sx={{
                        display: 'flex'
                    }}>
                        <TextField
                            fullWidth
                            id="label_en"
                            label="English"
                            name="text"
                            defaultValue={translation.en}
                            onChange={e => setEN(e)}
                            className="english"
                            autoFocus
                            variant="outlined"
                            inputProps={{ sx: { fontSize: '1.4rem', textAlign: 'center' } }}
                            sx={{ textAlign: 'center' }}
                            margin="none"
                            size="small"
                        />
                        <button type="button" className="button-translate" onClick={() => handleTranslate(translation.en)} title="Translate">
                            <TranslateButtonSVG />
                        </button>
                        </Grid>
                    <Grid xs={12} sx={{
                        display: 'flex'
                    }}>
                        <TextField
                            fullWidth
                            id="label_en"
                            label="German"
                            name="text"
                            defaultValue={translation.de}
                            onChange={e => setDE(e)}
                            className="deutsch"
                            autoFocus
                            variant="outlined"
                            inputProps={{ sx: { fontSize: '1.4rem', textAlign: 'center' } }}
                            sx={{ textAlign: 'center' }}
                            margin="none"
                            size="small"
                        />
                        <button type="button" className="button-translate" onClick={() => handleTranslate(translation.de)} title="Translate">
                            <TranslateButtonSVG />
                        </button>
                    </Grid>
                    <Grid xs={12} sx={{
                        display: 'flex'
                    }}>
                        <TextField
                            fullWidth
                            id="label_ru"
                            label="Russian"
                            name="text"
                            defaultValue={translation.rus}
                            onChange={e => setRUS(e)}
                            className="russian"
                            autoFocus
                            variant="outlined"
                            inputProps={{ sx: { fontSize: '1.4rem', textAlign:'center' } }}
                            sx={{ textAlign: 'center' }}
                            margin="none"
                            size="small"
                        />
                        <button type="button" className="button-translate" onClick={() => handleTranslate(translation.rus)} title="Translate">
                            <TranslateButtonSVG />
                        </button>
                    </Grid>
                    <Grid xs={12} sx={{textAlign:'center'} }>
                        <button type="submit" className="submitButton">{type}</button>
                    </Grid>
                </Grid>
            </Box>
        </Container>        
        );
}

/*
    <div id="allergensDiv">
      
         * Allergens:
        <select className="allergens-select" placeholder="allergens">
            <option value="1">1 Gluten</option>
            <option value="2">2 Celery</option>
            <option value="3">3 Peanuts</option>
            <option value="4">4 Lupin</option>
            <option value="5">5 Soya</option>
            <option value="6">6 Eggs</option>
            <option value="7">7 Molluscs</option>
            <option value="8">8 Lactose</option>
            <option value="9">9 Nuts</option>
            <option value="10">10 Sulphur dioxide</option>
            <option value="11">11 Sesame</option>
            <option value="12">12 Fish</option>
            <option value="13">13 Crustaceans</option>
            <option value="14">14 Mustard</option>
            <option value="15">15 Mushrooms</option>
        </select>
    </div>
    
    */