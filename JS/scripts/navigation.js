import {SlideManager} from './slideManager.js';
import {Navigator} from './navigator.js';
import { DbEmulator, registerButtonHandler } from './dbEmulator.js';

const navigator = new Navigator();
const slideManager = new SlideManager();

let links = document.getElementsByClassName('nav-item-left');
for(let i = 0; i < links.length; i++){
    links[i].onclick = function() {
        navigator.pushSlide(slideManager.slides[i]);
    };
}

let link = document.getElementsByClassName('nav-item-right')[0];
let db = new DbEmulator();
link.onclick = function() {
    navigator.pushSlide(slideManager.slides[slideManager.slides.length - 1]);
    document.getElementById('register-button').onclick = () => registerButtonHandler();
    document.getElementById('auth-button').onclick = () => authButtonHandler();
};