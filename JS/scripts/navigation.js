import {DbEmulator} from './dbEmulator.js';
import {Slide} from './slide.js';
import {SlideManager} from './slideManager.js';
import {Navigator} from './navigator.js';

class Palette {
    constructor(title, colors) {
        this.title = title;
        this.colors = colors;
    }
}

customElements.define('presentation-section', class extends HTMLElement {
    connectedCallback() {
        const tmpl = document.getElementById('tmpl');
        this.attachShadow({mode: 'open'});
        this.shadowRoot.append( tmpl.content.cloneNode(true) );
    }
});


const navigator = new Navigator();
const slideManager = new SlideManager();

let db = new DbEmulator();
let links = document.getElementsByClassName('nav-item-left');
for(let i = 0; i < links.length; i++){
    links[i].onclick = function() {
        navigator.pushSlide(slideManager.slides[i]);
        if (links[i].dataset.slideName === 'spectrum') {

            function LightenDarkenColor(col, amt) {
                let shift = 0;
                var num = parseInt(col, 16);
                let r, g, b = 0;
                r = (num >> 16);
                g = ((num >> 8) & 0x00FF);
                b = (num & 0x0000FF);
                if (amt > 0) {
                    r += (0xFF - r) / amt;
                    g += (0xFF - g) / amt;
                    b += (0xFF - b) / amt;
                }
                else {
                    r += r / amt;
                    g += g / amt;
                    b += b / amt;
                }
                var newColor = b | (g << 8) | (r << 16);
                return newColor.toString(16).padStart(6, '0');
              }
            
            let table = document.getElementById("spectrum-table");
            for (let row of table.rows) 
            {
                for(let cell of row.cells) 
                {
                        cell.onclick = () => {
                            let choise = document.getElementById("choise-table");
                            let color = cell.firstChild.dataset.color;
                            choise.rows[0].cells[0].firstChild.style.backgroundColor = color;
                            let darker = '#' + LightenDarkenColor(color.replace('#', ''), 2);
                            let lighter = '#' + LightenDarkenColor(color.replace('#', ''), -5);
                            choise.rows[1].cells[0].firstChild.style.backgroundColor = darker;
                            choise.rows[1].cells[1].firstChild.style.backgroundColor = lighter;
                            document.getElementById("hex-input").value = color;
                        }
                }
            }
            let paletteOptgroup = document.getElementById('palette-list');
            for (let paletteTitle of db.getPaletteList()) {
                let newElement = document.createElement('option');
                newElement.innerHTML = paletteTitle;
                newElement.value = paletteTitle;
                paletteOptgroup.appendChild(newElement);
            }
            let paletteTable = document.getElementById('imm-palette');
            for (let row of paletteTable.rows) 
            {
                for(let cell of row.cells) 
                {
                    cell.firstChild.onclick = () => {
                        let choise = document.getElementById("choise-table");
                        cell.firstChild.style.backgroundImage = 'none';
                        cell.firstChild.style.backgroundColor = choise.rows[0].cells[0].firstChild.style.backgroundColor;
                    }
                }
            }
            let select = document.getElementsByTagName('select')[0];
            let paletteTitleInput = document.getElementById('palette-title');
            select.onchange = () => {
                if (select.value == 'new') {
                }
                else {
                    let palette = db.getPalette(select.value);
                    paletteTitleInput.value = palette.title;
                    let index = 0;
                    for (let row of paletteTable.rows) 
                    {
                        for(let cell of row.cells) 
                        {
                            if (palette.colors[index] != '') {
                                cell.firstChild.style.backgroundImage = 'none';
                                cell.firstChild.style.backgroundColor = palette.colors[index];
                            }
                            index += 1;
                        }
                    }
                }
            }
            function rgb2hex(rgb) {
                if (rgb === '') {
                    return '';
                }
                rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
                function hex(x) {
                    return ("0" + parseInt(x).toString(16)).slice(-2);
                }
                return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
            }
            
            let saveButton = document.getElementById('save-button');
            saveButton.onclick = () => {
                if (paletteTitleInput.value != '') {
                    let colorArray = [];
                    for (let row of paletteTable.rows) 
                    {
                        for(let cell of row.cells) 
                        {
                            colorArray.push(rgb2hex(cell.firstChild.style.backgroundColor));
                        }
                    }
                    db.savePalette(new Palette(paletteTitleInput.value, colorArray));
                }
            }
            let colorButton = document.getElementById('get-color');
            colorButton.onclick = () => {
                let choise = document.getElementById("choise-table");
                let color = document.getElementById('hex-input').value;
                color = color.replace('#', '').slice(0, 6).padStart(6, '0');
                document.getElementById('hex-input').value = `#${color}`;
                choise.rows[0].cells[0].firstChild.style.backgroundColor = `#${color}`;
                let darker = '#' + LightenDarkenColor(color, 2);
                let lighter = '#' + LightenDarkenColor(color, -5);
                choise.rows[1].cells[0].firstChild.style.backgroundColor = darker;
                choise.rows[1].cells[1].firstChild.style.backgroundColor = lighter;
            }
        }
        if (links[i].dataset.slideName === 'collection') {
            let paletteOptgroup = document.getElementById('palette-list');
            for (let paletteTitle of db.getPaletteList()) {
                let newElement = document.createElement('option');
                newElement.innerHTML = paletteTitle;
                newElement.value = paletteTitle;
                paletteOptgroup.appendChild(newElement);
            }
            let removing = false;
            let removeButton = document.getElementById('remove-button');
            removeButton.onclick = () => {
                removing = !removing;
                if (removing) {
                    removeButton.style.background = '#530179';
                }
                else {
                
                    removeButton.style.background = '#7900B2';
                }
            }
            let paletteTable = document.getElementById('imm-palette');
            for (let row of paletteTable.rows) 
            {
                for(let cell of row.cells) 
                {
                    cell.firstChild.onclick = () => {
                        if (removing) {
                            cell.firstChild.style.backgroundColor = "none";
                            cell.firstChild.style.backgroundImage = "url('../JS/img/transparent.jpg')";
                        }
                        else {
                            let choise = document.getElementById("choise-table");
                            let color = cell.firstChild.style.backgroundColor;
                            choise.rows[0].cells[0].firstChild.style.backgroundColor = color;
                            let darker = '#' + LightenDarkenColor(color.replace('#', ''), 2);
                            let lighter = '#' + LightenDarkenColor(color.replace('#', ''), -5);
                            choise.rows[1].cells[0].firstChild.style.backgroundColor = darker;
                            choise.rows[1].cells[1].firstChild.style.backgroundColor = lighter;
                        }
                    }
                }
            }
            let select = document.getElementsByTagName('select')[0];
            let paletteTitleInput = document.getElementById('palette-title');
            select.onchange = () => {
                if (select.value == '--new--') {
                    for (let row of paletteTable.rows) 
                    {
                        for(let cell of row.cells) 
                        {
                            cell.firstChild.style.backgroundImage = "url('../JS/img/transparent.jpg')";
                        }
                    }
                }
                else {
                    let palette = db.getPalette(select.value);
                    paletteTitleInput.value = palette.title;
                    let index = 0;
                    for (let row of paletteTable.rows) 
                    {
                        for(let cell of row.cells) 
                        {
                            if (palette.colors[index] != '') {
                                cell.firstChild.style.backgroundImage = 'none';
                                cell.firstChild.style.backgroundColor = palette.colors[index];
                            }
                            index += 1;
                        }
                    }
                }
            }
            
            document.getElementById('logout-button').onclick = () => {
                db.logout();
                navigator.pushSlide(slideManager.slides[slideManager.slides.length - 1]);
                document.getElementsByClassName('nav-item-right')[0].innerHTML = 'Join Chromatica';
            }
            let saveButton = document.getElementById('save-button');
                        saveButton.onclick = () => {
                            if (paletteTitleInput.value != '') {
                                let colorArray = [];
                                for (let row of paletteTable.rows) 
                                {
                                    for(let cell of row.cells) 
                                    {
                                        colorArray.push(rgb2hex(cell.firstChild.style.backgroundColor));
                                    }
                                }
                                db.savePalette(new Palette(paletteTitleInput.value, colorArray));
                            }
                        }

        }
    };
    
}

let link = document.getElementsByClassName('nav-item-right')[0];
link.onclick = function() {
    navigator.pushSlide(slideManager.slides[slideManager.slides.length - 1]);
    document.getElementById('register-button').onclick = () => {
    const signUpLogin = document.getElementById('sign-up-login');
    const signUpPassword = document.getElementById('sign-up-password');
    const signUpConfirm = document.getElementById('sign-up-confirm');
        
    if (signUpPassword.value === signUpConfirm.value) {
        
        db.registerUser(signUpLogin.value, signUpPassword.value);
        signUpLogin.value = '';
        signUpPassword.value = '';
        signUpConfirm.value = '';
    }
    };
    document.getElementById('auth-button').onclick = () => {
        const signInLogin = document.getElementById('sign-in-login');
    const signInPassword = document.getElementById('sign-in-password');
    if (db.authenticateUser(signInLogin.value, signInPassword.value)) {
        document.getElementById('join-link').innerHTML = signInLogin.value;
    }
    };
};