async function loadSlide(slideName) {
    const response = await fetch(`../JS/slides/${slideName}.html`);
    let slideBlock = document.createElement('div');
    slideBlock.innerHTML = await response.text();
    console.log(slideBlock.innerHTML)
    document.body.insertBefore(slideBlock, document.getElementsByTagName('footer')[0]);
}

//loadSlide(links[i].dataset.slideName)
let links = document.getElementsByClassName('nav-item-left');
for(let i=0; i<links.length; i++){
    links[i].onclick = function() { loadSlide(links[i].dataset.slideName);} ;
}
