export class Navigator {

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
            slideBlock.innerHTML = this.state.currentSlide.htmlContent;
            document.body.insertBefore(slideBlock, document.getElementsByTagName('footer')[0]);
        }
        else {
            console.log('ERROR: Current slide is undefined!');
        }
    }
}