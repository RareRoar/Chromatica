import {Slide} from './slide.js';

export class SlideManager {

    constructor() {
        this.slideTitleList = [
            'presentation',
            'inspiration',
            'spectrum',
            'collection',
            'authentication'
        ];
        this.slides = [];
        this.loadSlides();
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