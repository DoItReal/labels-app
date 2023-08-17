import './App.css';
import { Nav} from './nav/Nav1';
import Content from './content/Content';

import './style.css';
import DB from './db';
import { useState } from 'react';

export var db = new DB();
/* 
import Categories from './ts/categories';
import Allergens from './ts/allergens';
import addedLabelsList from './ts/addedLabelsList';
import { Labels, Label } from './ts/signs';


var png = new PNGs();
var categories = new Categories();
var allergens = new Allergens();
var labelList = new addedLabelsList();
var labels = new Labels();
 */
export interface IenableStates {
    enableStates: Map<string, boolean>, updateStates: (key: string, value: boolean) => void
}
function App() {
    const [enableStates, setEnableStates] = useState<Map<string, boolean>>(new Map());
    const updateStates = (key: string, value: boolean) => {

        setEnableStates(new Map(enableStates.set(key, value)));

    } 
        return (

            <div className="App">
                <script type="text/javascript" src="https://unpkg.com/pdf-lib" />
                <script type="text/javascript" src="https://unpkg.com/jquery" />

              
                <Nav enableStates={enableStates} updateStates={updateStates } />
                <Content enableStates={enableStates} updateStates={updateStates} />

            </div>
        );
}

/*
function createLabel() {

    let inputBG: HTMLInputElement = document.querySelector('#LabelBG');
    let inputEN: HTMLInputElement = document.querySelector('#LabelEN');
    let inputDE: HTMLInputElement = document.querySelector('#LabelDE');
    let inputRUS: HTMLInputElement = document.querySelector('#LabelRUS');

    let arr = allergens.selectedAllergens.map(Number);
    arr = arr.sort((a, b) => a - b);

    let label = {
        'allergens': arr,
        'bg': inputBG.value,
        'en': inputEN.value,
        'de': inputDE.value,
        'rus': inputRUS.value,
        'category': categories.selectedCategories
    };
    //   let label = '{ "allergens":[' + arr + '],"bg":"' + inputBG.value + '", "en":"' + inputEN.value + '", "de":"' + inputDE.value + '", "rus":"' + inputRUS.value + '",' + '"category":[' + selectedCategories + ']}';
    db.createNewLabel(JSON.stringify(label));
    inputBG.value = '';
    inputEN.value = '';
    inputDE.value = '';
    inputRUS.value = '';

}
function saveLabel(id: string) {

    let inputBG: HTMLInputElement = document.querySelector('#LabelBG');
    let inputEN: HTMLInputElement = document.querySelector('#LabelEN');
    let inputDE: HTMLInputElement = document.querySelector('#LabelDE');
    let inputRUS: HTMLInputElement = document.querySelector('#LabelRUS');
    let arr = allergens.selectedAllergens.map(Number);
    arr = arr.sort((a, b) => a - b);
    let label = {
        "allergens": arr,
        "bg": inputBG.value,
        "en": inputEN.value,
        "de": inputDE.value,
        "rus": inputRUS.value,
        "category": categories.selectedCategories
    }
    db.saveLabel(JSON.stringify(label), id);
}
function createNewLabel() {
    $("#saveButton").text("Create New Label");
    $("#saveLabel p input").val('');
    $('.filter_list input[type="checkbox"]').each(function () {
        if ($(this).is(":checked")) $(this).click();
    });
    $('#saveButton').unbind();
    $("#saveButton").on('click', () => {
        createLabel();
    });

}

function search() {
    console.log(1);
    labels.labels = [];
    let value = String($('#searchInput').val());
    for (let i = 0; i < db.data.length; i++) {
        if (db.data[i].bg.toLowerCase().search(value.toLowerCase()) !== -1) labels.labels.push(db.data[i]);
    }
    labels.update();

}
function initEventsSearch() {
    $("#searchInput").keyup(function (e) {
        search();
    });
}

//add Delete Button
function deleteButton() {
    var inputID = [];
    for (let i = 0; i < db.data.length; i += 1) {
        let checkbox = document.getElementById(db.data[i]._id) as HTMLInputElement;
        if (checkbox && checkbox.checked) {
            inputID.push(db.data[i]);
        }
    }
    console.log(inputID);
    if (inputID.length > 1) {
            for (let i = 0; i < inputID.length; i++) {
                db.deleteLabel(String(inputID[i]._id));
            }
    } else if (inputID.length == 1) {
        db.deleteLabel(inputID[0]._id);
    }
    setTimeout(labels.update, 500);
}           
*/
export default App;
