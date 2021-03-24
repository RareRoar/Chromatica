import {SlideManager} from './slideManager.js';
import {Navigator} from './navigator.js';
import { DbEmulator, registerButtonHandler, authButtonHandler } from './dbEmulator.js';

const navigator = new Navigator();
const slideManager = new SlideManager();

let links = document.getElementsByClassName('nav-item-left');
for(let i = 0; i < links.length; i++){
    links[i].onclick = function() {
        navigator.pushSlide(slideManager.slides[i]);
    };
}
let db = new DbEmulator();
let link = document.getElementsByClassName('nav-item-right')[0];
link.onclick = function() {
    navigator.pushSlide(slideManager.slides[slideManager.slides.length - 1]);
    document.getElementById('register-button').onclick = () => {
        const signUpLogin = document.getElementById('sign-up-login');
    const signUpPassword = document.getElementById('sign-up-password');
    const signUpConfirm = document.getElementById('sign-up-confirm');

    if (signUpPassword.value === signUpConfirm.value) {
        
        db.registerUser(signUpLogin.value, signUpPassword.value);
    }
    console.log(db.tree);
    };
    document.getElementById('auth-button').onclick = () => {
        const signInLogin = document.getElementById('sign-in-login');
    const signInPassword = document.getElementById('sign-in-password');
    const signInConfirm = document.getElementById('sign-in-confirm');
    if (db.authenticateUser(signInLogin.value, signInPassword.value)) {
        
            document.getElementById('join-link').innerHTML = signInLogin;
    }
    console.log(db.tree);
    };
};