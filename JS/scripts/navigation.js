/*
async function loadSlide(slideName) {
    const response = await fetch(`../JS/slides/${slideName}.html`);
    
    let slideBlock = document.createElement('div');
    slideBlock.id = 'slide-block';
    slideBlock.innerHTML = await response.text();
    console.log(slideBlock.innerHTML)
    document.body.insertBefore(slideBlock, document.getElementsByTagName('footer')[0]);
}

let links = document.getElementsByClassName('nav-item-left');
for(let i=0; i<links.length; i++){
    links[i].onclick = function() { 
        let oldSlideBlock = document.getElementById('slide-block');
        if (oldSlideBlock != null) {
            oldSlideBlock.parentNode.removeChild(oldSlideBlock);
        }
        loadSlide(links[i].dataset.slideName);
    } ;
}
*/

function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                return rawFile.responseText;
                
            }
        }
    }
}

class SlideManager {

    constructor() {
        this.slideTitleList = ['presentation', 'inspiration', 'collection', 'spectrum', 'authentication'];
        this.loadSlides();
        this.slides = [];
    }


    async loadSlide(slideTitle) {
        const response = await fetch(`./slides/${slideTitle}.html`);
        const slideContent = await response.text();
        return new Slide(slideTitle, slideContent);
    }

    async loadSlides() {
        for (let slideTitle of this.slideTitleList) {

            const nextSlide = await this.loadSlide(slideTitle);
            this.slides.push(nextSlide);
        }
    }
}

class Slide {

    constructor(title, htmlContent) {
        this.title = title;
        this.htmlContent = htmlContent;
    }

    get html() {
        return this.htmlContent;
    }

    set html(value) {
        this.htmlContent = value;
    }
}

class Navigator {

    constructor() {
        this.initialize();
        this.configureOnPopHandler();
        this.state = {
            currentSlide: null,
        };
    }

    initialize() {
        window.history.replaceState(this.state, null, "");
    }

    configureOnPopHandler() {
        let that = this;
        window.onpopstate = function (event) {
            if (event.state) { that.state = event.state; }
            that.render();
        };
    }

    pushSlide(slide) {
        this.state.currentSlide = slide;
        window.history.pushState(this.state, null, "");
        this.render();
    }


    render() {
        let oldSlideBlock = document.getElementById('slide-block');
        if (oldSlideBlock != null) {
            oldSlideBlock.parentNode.removeChild(oldSlideBlock);
        }
        let slideBlock = document.createElement('div');
        slideBlock.id = 'slide-block';
        if (this.state.currentSlide != undefined) {
            slideBlock.innerHTML = this.state.currentSlide.html;
            document.body.insertBefore(slideBlock, document.getElementsByTagName('footer')[0]);
        }
        else {
            console.log('ERROR: Current slide is undefined!');
        }
    }
}

const nav = new Navigator();
const sl = new SlideManager();
console.log(sl.slides);
let links = document.getElementsByClassName('nav-item-left');
for(let i=0; i<links.length; i++){
    links[i].onclick = function() {
        
        nav.pushSlide(sl.slides[i]);

    } ;
}