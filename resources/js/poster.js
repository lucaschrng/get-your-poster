const html2canvas = require('html2canvas');
const Vibrant = require('node-vibrant');

let poster = document.querySelector('.poster');
let title = document.querySelector('.album-title');
let titleSpans = document.querySelectorAll('.album-title span');
let albumCover = document.querySelector('.album-cover');
let trackList = document.querySelector('.track-list');
let dotSeparators = document.querySelectorAll('.separator');
let downloadBtn = document.querySelector('.poster-img a');
let preview = document.querySelector('.preview');
let loader = document.querySelector('.loader-wrapper');
let span = document.querySelector('.poster-generate > span');
let invertToggle = document.querySelector('#invert');
let justifyToggle = document.querySelector('#justify');
let foldedToggle = document.querySelector('#folded');
let hasFoldedTexture = true;
let hideArtistToggle = document.querySelector('#hidden-artist');
let hideTitleToggle = document.querySelector('#hidden-title');
let hideTracksToggle = document.querySelector('#hidden-tracks');
let wallpaperToggle = document.querySelector('#wallpaper');
let optionPanel = document.querySelector('.options');
let colorPicker = document.querySelector('#custom-color');
let customImageButton = document.querySelector('.custom-image p button');
let customImageInput = document.querySelector('.custom-image p button input');
let customImageDrop = document.querySelector('.option.custom-image');
let titleFontSize = 120;
let minSeparatorWidth = 0;
let trackListFontSize = 24;

// initialisation

initialisePage();

// set event listeners

invertToggle.addEventListener('change', () => {
    poster.classList.toggle('invert');
    generateImage();
})

foldedToggle.addEventListener('change', () => {
    hasFoldedTexture = !hasFoldedTexture;
    generateImage();
})

wallpaperToggle.addEventListener('change', () => {
    poster.classList.toggle('wallpaper');
    optionPanel.classList.toggle('wallpaper');
    generateImage();
})

justifyToggle.addEventListener('change', () => {
    poster.classList.toggle('justify-title');
    generateImage();
})

hideArtistToggle.addEventListener('change', () => {
    poster.classList.toggle('hidden-artist');
    generateImage();
})

hideTitleToggle.addEventListener('change', () => {
    poster.classList.toggle('hidden-title');
    generateImage();
})

hideTracksToggle.addEventListener('change', () => {
    poster.classList.toggle('hidden-tracks');
    generateImage();
})

colorPicker.addEventListener('change', () => {
    document.documentElement.style.setProperty('--accent-color', colorPicker.value);
    generateImage();
})

customImageButton.addEventListener('click', () => {
    customImageInput.click();
})

customImageInput.addEventListener('change', (event) => {
    let file = customImageInput.files[0];
    let reader = new FileReader();
    reader.addEventListener('load', () => {
        albumCover.src = reader.result;
        albumCover.addEventListener('load', () => {
            initialisePage(albumCover);
        })
    })
    reader.readAsDataURL(file);
})

customImageDrop.addEventListener('dragenter', preventDefaults, false);
customImageDrop.addEventListener('dragenter', highlight, false)
customImageDrop.addEventListener('dragover', preventDefaults, false);
customImageDrop.addEventListener('dragover', highlight, false)
customImageDrop.addEventListener('dragleave', preventDefaults, false);
customImageDrop.addEventListener('dragleave', unhighlight, false);
customImageDrop.addEventListener('drop', preventDefaults, false);
customImageDrop.addEventListener('drop', unhighlight, false);
customImageDrop.addEventListener('drop', handleDrop, false);

function preventDefaults(event) {
    event.preventDefault()
    event.stopPropagation()
}

function highlight() {
    customImageDrop.classList.add('highlight');
}

function unhighlight() {
    customImageDrop.classList.remove('highlight');
}

function handleDrop(event) {
    let file = event.dataTransfer.files[0];
    let reader = new FileReader();
    reader.addEventListener('load', () => {
        albumCover.src = reader.result;
        albumCover.addEventListener('load', () => {
            initialisePage();
        })
    })
    reader.readAsDataURL(file);
}

preview.addEventListener('load', () => {
    preview.style.height = 'auto';
})

if (!isWrapped()) {
    while (titleSpans[0].getBoundingClientRect().width > title.getBoundingClientRect().width) {
        title.style.fontSize = `${titleFontSize}px`;
        titleFontSize--;
    }
} else {
    title.style.fontSize = '90px';
    titleFontSize = 90;
}

while (isDoubleWrapped()) {
    title.style.fontSize = `${titleFontSize}px`;
    titleFontSize--;
}

title.style.lineHeight = `${titleFontSize}px`;

while (minSeparatorWidth < 20) {
    trackList.style.fontSize = `${trackListFontSize}px`;
    span.style.fontSize = `${trackListFontSize}px`;
    trackListFontSize--;

    minSeparatorWidth = Math.min(...Array.from(dotSeparators).map(
        separator => separator.getBoundingClientRect().width,
    ));
}

dotSeparators.forEach(separator => {
    let separatorWidth = separator.getBoundingClientRect().width;
    let dotCount = Math.floor(separatorWidth / span.getBoundingClientRect().width);
    for (let i = 0; i < dotCount; i++) {
        separator.innerHTML += '.';
    }
})

// declare functions

async function initialisePage() {
    albumCover.setAttribute('crossOrigin', '');
    const palette = await Vibrant.from(albumCover).getPalette();
    colorPicker.value = palette.Vibrant.hex;
    document.documentElement.style.setProperty('--accent-color', palette.Vibrant.hex);
    generateImage();
}

function generateImage() {
    downloadBtn.style.zIndex = null;
    downloadBtn.style.color = null;
    loader.style.display = 'flex';
    window.scrollTo(0, 0);
    html2canvas(document.querySelector(".poster"), {
        allowTaint: true,
        useCORS: true,
        scale: Math.min(window.devicePixelRatio, 2)
    }).then(async canvas => {
        if (hasFoldedTexture) await addTexture(canvas);
        loader.style.display = 'none';
        preview.style.visibility = 'visible';
        preview.src = canvas.toDataURL("image/png", 1.0);
        downloadBtn.href = canvas.toDataURL("image/png", 1.0);
        downloadBtn.style.zIndex = 1;
        downloadBtn.style.color = '#ffffff';
    })
}

async function addTexture(canvas) {
    let ctx = canvas.getContext("2d");

    let textureImg = new Image();
    textureImg.src = `${window.location.origin}/img/folded_texture.jpg`;
    await new Promise(resolve => textureImg.onload = resolve);

    ctx.globalCompositeOperation = "screen";
    let scale = Math.min(window.devicePixelRatio, 2);

    let canvasAspectRatio = canvas.width / canvas.height;
    let imgAspectRatio = textureImg.width / textureImg.height;
    let width, height, x = 0, y = -canvas.height / scale;

    if (imgAspectRatio > canvasAspectRatio) {
        width = canvas.height * imgAspectRatio / scale;
        height = canvas.height / scale;
        x = (canvas.width / scale - width) / 2;
    } else {
        width = canvas.width / scale;
        height = canvas.width / imgAspectRatio / scale;
        y += (canvas.height / scale - height) / 2;
    }
    ctx.drawImage(textureImg, x, y, width, height);
}

function isWrapped() {
    let isWrapped = false;
    let topPos = titleSpans[0].offsetTop;
    titleSpans.forEach(span => {
        if (!(span.offsetTop === topPos)) {
            isWrapped = true;
        }
    });
    return isWrapped;
}

function isDoubleWrapped() {
    let isWrapped = false;
    let topPos = titleSpans[0].offsetTop;
    titleSpans.forEach(span => {
        if (!(span.offsetTop < topPos * 2)) {
            isWrapped = true;
        }
    });
    return isWrapped;
}
