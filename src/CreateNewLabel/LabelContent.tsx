import { ChangeEvent, useEffect, useState, useCallback } from "react";
import { Category } from '../content/UI/CategoryUI';
import { Allergens } from "../content/UI/AllergensUI";
import './labelContent.css';
import { IsaveLabelInput } from './index';
import { translate } from '../tools/translate';
import TranslateButtonSVG from '@mui/icons-material/Translate';
import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField} from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2';
import { MealTranslation } from "../DB/Interfaces/Labels";
import { getFullLanguageName } from "../tools/langUtils";
import { labelDataType } from '../DB/Interfaces/Labels';
import LabelCanvas from '../DesignEditor/LabelCanvas';
import { getLocalDesigns } from "../DB/LocalStorage/Designs";
import DescriptionIcon from '@mui/icons-material/Description';

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
  /*  const handleDescriptionTranslate = async (text: string, lang: string) => {
        let tmp = [ ...translation ];
        await Promise.all(tmp.map(async (el: MealTranslation) => {
            const langCode = el.lang;
            if (langCode === lang) return el;
            if (el.description === '') {
                try {
                    let translation = await translate(text, langCode);
                    el.description = translation.replace(/["]/g, '');
                } catch (error) {
                    console.log(error);
                }
            }
            return el;
        }));
        setTranslation(structuredClone(tmp));
    }*/
       const handleDescriptionTranslate = useCallback(async (text: string, lang: string) => {
        const updatedTranslations = await Promise.all(translation.map(async el => {
            if (el.lang !== lang && el.description === '') {
                try {
                    let translatedText = await translate(text, el.lang);
                    return { ...el, description: translatedText.replace(/["]/g, '') };
                } catch (error) {
                    console.log(error);
                }
            }
            return el;
        }));
        setTranslation(updatedTranslations);
    }, [translation, setTranslation]);
    
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
                                <Grid container sx={{textAlign:'center'} }>
                                    <LabelNameElement key={transl.lang + 'nameInput' } transl={transl} setNameValue={setNameValue} handleTranslate={handleTranslate } />
                                    <DescriptionElement key={transl.lang + 'descriptionInput'} transl={transl} setDescriptionValue={setDescriptionValue} translate={handleDescriptionTranslate } />
                                </Grid>
                               
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
    return (
        <Grid xs={10}>
        <FormControl fullWidth variant="outlined" size="small" >
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
        </Grid>
);
}



const DescriptionElement = ({ transl, setDescriptionValue, translate }:
    {
        transl: MealTranslation,
        setDescriptionValue: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, lang: string) => void,
        translate: (text: string, lang: string) => Promise<void>
    }) => {
    const [open, setOpen] = useState(false);
    const [currentDescription, setCurrentDescription] = useState(transl.description || '');

    useEffect(() => {
        setCurrentDescription(transl.description || '');
    }, [transl.description]);


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = () => {
        const mockEvent = {
            target: { value: currentDescription }
        } as ChangeEvent<HTMLInputElement>;
        setDescriptionValue(mockEvent, transl.lang);
        setOpen(false);
    };
    const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setCurrentDescription(e.target.value);
    };
    const handleTranslate = async () => {
        await translate(currentDescription, transl.lang);

    }

    return (
        <Grid xs={2}>
            <FormControl variant="outlined" size="small">
                <IconButton
                    size="large"
                    title={"Description " +transl.lang }
                    aria-label="toggle description"
                    onClick={handleClickOpen}
                    onMouseDown={(event: React.MouseEvent<HTMLButtonElement>) => {
                        event.preventDefault();
                    }
                    }
                    edge="end"
                    className="button-description-open"
                >
                    <Box height={1} width={1} sx={{
                        display: 'flex',
                        position: 'relative',
                        backgroundColor: "lightblue",
                        border: '1px solid blue',
                        borderRadius: '5px'
                    }} >
                        <DescriptionIcon fontSize="large" />
                    </Box>
                </IconButton>
            </FormControl>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">{getFullLanguageName(transl.lang) + " Description"}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id={"dialog-descriptionId_" + transl.lang}
                        value={currentDescription}
                        onChange={handleDescriptionChange}
                        fullWidth
                        multiline
                        label={getFullLanguageName(transl.lang) + " Description"}
                        variant="outlined"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>

                    <Button onClick={handleTranslate} color="primary">
                        Translate
                    </Button>
                    <Button onClick={handleSave} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid>
    );
}