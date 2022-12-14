const axios = require('axios').default;
const html2canvas = require('html2canvas');
const { invert } = require('lodash');
const Vibrant = require('node-vibrant');
const { getDataUrlFromArr } = require('array-to-image');

let album_id = document.querySelector('.album_id').value;
let poster = document.querySelector('.poster');
let downloadBtn = document.querySelector('.poster-img a');
let preview = document.querySelector('.preview');
let loader = document.querySelector('.loader-wrapper');
let span = document.querySelector('.poster-generate > span');
let invertToggle = document.querySelector('#invert');
let isInvert = true;
let justifyToggle = document.querySelector('#justify');
let isJustify = false;
let foldedToggle = document.querySelector('#folded');
let isFolded = true;
let artistToggle = document.querySelector('#hidden-artist');
let isHiddenArtist = false;
let titleToggle = document.querySelector('#hidden-title');
let isHiddenTitle = false;
let tracksToggle = document.querySelector('#hidden-tracks');
let isHiddenTracks = false;
let wallpaperToggle = document.querySelector('#wallpaper');
let isWallpaper = false;
let optionPanel = document.querySelector('.options');
let colorPicker = document.querySelector('#custom-color');
let customImageButton = document.querySelector('.custom-image p button');
let customImageInput = document.querySelector('.custom-image p button input');
let customImageDrop = document.querySelector('.option.custom-image');
let isCustomImg = false;
let fz = '27px';
let posterArr;
let textureArr;

invertToggle.addEventListener('change', () => {
    isInvert = !isInvert;
    if (isInvert) {
        poster.classList.add('invert');
    } else {
        poster.classList.remove('invert');
    }
    fastRender();
})

justifyToggle.addEventListener('change', () => {
    isJustify = !isJustify;
    if (isJustify) {
        document.querySelector('.poster h1').style.justifyContent = 'space-between';
    } else {
        document.querySelector('.poster h1').style.justifyContent = null;
    }
    fastRender();
})

foldedToggle.addEventListener('change', () => {
    isFolded = !isFolded;
    fastRender();
})

artistToggle.addEventListener('change', () => {
    isHiddenArtist = !isHiddenArtist;
    if (isHiddenArtist) {
        poster.classList.add('hidden-artist');
    } else {
        poster.classList.remove('hidden-artist');
    }
    fastRender();
})

titleToggle.addEventListener('change', () => {
    isHiddenTitle = !isHiddenTitle;
    if (isHiddenTitle) {
        poster.classList.add('hidden-title');
    } else {
        poster.classList.remove('hidden-title');
    }
    fastRender();
})

tracksToggle.addEventListener('change', () => {
    isHiddenTracks = !isHiddenTracks;
    if (isHiddenTracks) {
        poster.classList.add('hidden-tracks');
    } else {
        poster.classList.remove('hidden-tracks');
    }
    fastRender();
})

wallpaperToggle.addEventListener('change', () => {
    isWallpaper = !isWallpaper;
    if (isWallpaper) {
        poster.classList.add('wallpaper');
        optionPanel.classList.add('wallpaper');
    } else {
        poster.classList.remove('wallpaper');
        optionPanel.classList.remove('wallpaper');
    }
    fastRender();
})

customImageButton.addEventListener('click', () => {
    customImageInput.click();
})

customImageInput.addEventListener('change', (event) => {
    let file = customImageInput.files[0];
    let reader = new FileReader();

    reader.addEventListener('load', () => {
        document.querySelector('.cover').src = reader.result;
        document.querySelector('.cover').addEventListener('load', () => {
            setAccentColor(document.querySelector('.cover'));
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
        document.querySelector('.cover').src = reader.result;
        document.querySelector('.cover').addEventListener('load', () => {
            setAccentColor(document.querySelector('.cover'));
        })
    })

    reader.readAsDataURL(file);
}

preview.addEventListener('load', () => {
    preview.style.height = 'auto';
})

colorPicker.addEventListener('change', () => {
    updateColor(colorPicker.value);
    fastRender();
})

getAndBuild();

function getAndBuild() {
    while (poster.childElementCount > 2) {
        poster.removeChild(poster.lastChild);
    }

    axios.get('/api/album/' + album_id)

    .then(function (response) {
    album = response.data;

    buildPoster(album);
    })
}

function buildPoster(album) {
    preview.style.visibility = 'hidden';
    loader.style.display = 'flex';

    let albumTitle = album.name;
    let albumArtists = album.artists;
    let albumCoverUrl = album.images[0].url;
    let albumTracks = album.tracks.items;

    let infos = document.createElement('div');

    let albumArtistTitle = '';

    albumArtists.forEach((artist, index) => {
        if (index !== 0) {
            albumArtistTitle += ', ' + artist.name;
        } else {
            albumArtistTitle += artist.name;
        }
    });

    let artist = document.createElement('h2');
    artist.innerHTML = albumArtistTitle;

    let title = document.createElement('h1');
    let titleContent = removeMention(albumTitle, 'remaster');
    titleContent = removeHyphenMention(titleContent, 'remaster');

    titleWords = titleContent.split(' ');
    titleWords.forEach(word => {
        let wordNode = document.createElement('span');
        wordNode.innerHTML = word;
        title.appendChild(wordNode);
    })

    infos.appendChild(artist);
    infos.appendChild(title);

    let cover = document.createElement('img');
    cover.src = albumCoverUrl;
    cover.classList.add('cover');

    let songTitleMaxLength = 0;

    albumTracks.forEach((track, index) => {
        let trackTitle = track.name;
        trackTitle = removeMention(trackTitle, 'remaster');
        trackTitle = removeMention(trackTitle, 'album version');
        if (trackTitle.length > songTitleMaxLength) {
            songTitleMaxLength = trackTitle.length;
        }
    });

    let tracklist = document.createElement('ul');
    tracklist.style.gridTemplateRows = "repeat(" + Math.ceil(albumTracks.length / 2) + ", 1fr)";
    tracklist.style.fontSize = fz;
    span.style.fontSize = fz;

    albumTracks.forEach((track, index) => {
        let trackTitle = track.name;
        trackTitle = removeMention(trackTitle, 'remaster');
        trackTitle = removeHyphenMention(trackTitle, 'remaster');
        trackTitle = removeMention(trackTitle, 'album version');
        
        let song = document.createElement('li');
        let trackNumber = document.createElement('span');
        trackNumber.innerHTML = index + 1;
        let separator = document.createElement('span');
        separator.classList.add('separator');
        let songTitle = document.createElement('span');
        songTitle.innerHTML = trackTitle;

        song.appendChild(trackNumber);
        song.appendChild(separator);
        song.appendChild(songTitle);
        
        tracklist.appendChild(song);
    });

    poster.appendChild(infos);
    poster.appendChild(cover);

    poster.appendChild(tracklist);

    let titleFz = 120;

    if (!checkWrap(title)) {
        while (getWidth(document.querySelector('h1 span')) > getWidth(title)) {
            titleFz--;
            title.style.fontSize = titleFz + 'px';
        }
    }

    if (checkWrap(title)) {
        title.style.fontSize = '90px';
        titleFz = 90;
    }

    while (checkWrap2(title)) {
        titleFz--;
        title.style.fontSize = titleFz + 'px';
    }
    title.style.lineHeight = titleFz + 'px';

    let minSeparatorWidth = 100000;

    document.querySelectorAll('.separator').forEach(separator => {
        if (getWidth(separator) < minSeparatorWidth) {
            minSeparatorWidth = getWidth(separator);
        }
    });

    let trackFz = 24;

    while (minSeparatorWidth < 10) {
        minSeparatorWidth = 100000;
        trackFz--;

        tracklist.style.fontSize = trackFz + 'px';
        span.style.fontSize = trackFz + 'px';

        document.querySelectorAll('.separator').forEach(separator => {
            if (getWidth(separator) < minSeparatorWidth) {
                minSeparatorWidth = getWidth(separator);
            }
        });
    }

    document.querySelectorAll('.separator').forEach(separator => {
        let separatorWidth = getWidth(separator);
        dotNb = Math.floor(separatorWidth / getWidth(span));
        for (let i = 0; i < dotNb; i++) {
            separator.innerHTML += '.';
        }
    })

    setAccentColor(cover);

    downloadBtn.download = albumArtistTitle.replaceAll('.','').replaceAll(',','-').split(' ').join('') + "-" + albumTitle.split(' ').join('') + '_Poster';
}

function removeMention(string, mention) {
    let content = '';
    let bracketsContent = '';
    let inBrackets = false;
    
    if (string.toLowerCase().includes(mention)) {
        for (let i = 0; i < string.length; i++) {
    
            if (string[i] == '(') {
                inBrackets = true;
                content = content.slice(0, -1);
            } else if (string[i] == ')') {
                inBrackets = false;
                if (!bracketsContent.toLowerCase().includes(mention)) {
                    content += " (" + bracketsContent + ")";
                }
            } else if (!inBrackets) {
                content += string[i];
            } else {
                bracketsContent += string[i];
            }
        }
    } else {
        content = string;
    }
    return content;   
}

function removeHyphenMention(string, mention) {
    let content = '';
    let hyphenContent = '';
    let afterHyphen = false;
    
    if (string.toLowerCase().includes(mention)) {
        for (let i = 0; i < string.length; i++) {
    
            if (string[i] == '-') {
                afterHyphen = true;
                content = content.slice(0, -1);
            } else if (i === string.length - 1) {
                afterHyphen = false;
                hyphenContent += string[i];
                if (!hyphenContent.toLowerCase().includes(mention)) {
                    content += " -" + hyphenContent ;
                }
            } else if (!afterHyphen) {
                content += string[i];
            } else {
                hyphenContent += string[i];
            }
        }
    } else {
        content = string;
    }
    return content;   
}

function getWidth(element) {
    let rect = element.getBoundingClientRect();
    return rect.right - rect.left;
}

function getHeight(element) {
    let rect = element.getBoundingClientRect();
    return rect.top - rect.bottom;
}

function checkWrap(element) {
    let isWrap = false;
    let topPos = element.childNodes[0].offsetTop;
    element.childNodes.forEach(child => {
        if (!(child.offsetTop === topPos)) {
            isWrap = true;
        }
    });
    return isWrap;
}

function checkWrap2(element) {
    let isWrap = false;
    let topPos = element.childNodes[0].offsetTop;
    element.childNodes.forEach(child => {
        if (!(child.offsetTop < topPos*2)) {
            isWrap = true;
        }
    });
    return isWrap;
}


function setAccentColor(imgNode) {
    imgNode.setAttribute('crossOrigin', '');
    Vibrant.from(imgNode).getPalette().then(function(palette) {
        let vibrantColor = palette.Vibrant._rgb;
        colorPicker.value = palette.Vibrant.hex;
        document.documentElement.style.setProperty('--accent-color', 'rgb(' + vibrantColor[0] + ', ' + vibrantColor[1] + ', ' + vibrantColor[2] + ')');
        fastRender();
    });
}

function fastRender() {
    downloadBtn.style.zIndex = null;
    downloadBtn.style.color = null;
    loader.style.display = 'flex';
    window.scrollTo(0, 0);
    html2canvas(document.querySelector(".poster"), {
        allowTaint: true, 
        useCORS: true,
        scale: Math.min(window.devicePixelRatio, 2)
    }).then(function (canvas) {
        posterArr = canvas.getContext('2d').getImageData(0, -getHeight(poster)*Math.min(window.devicePixelRatio, 2), getWidth(poster)*Math.min(window.devicePixelRatio, 2), getHeight(poster)*Math.min(window.devicePixelRatio, 2)).data;
        if (isFolded) {
            renderTexture();
        } else {
            loader.style.display = 'none';
            preview.style.visibility = 'visible';
            preview.src = canvas.toDataURL("image/png", 1.0);
            downloadBtn.href = canvas.toDataURL("image/png", 1.0);
            downloadBtn.style.zIndex = 1;
            downloadBtn.style.color = '#ffffff';
        }
    })
}

function renderTexture() {
    document.querySelector('.overlay').style.opacity = 1;
    document.querySelector('.overlay').style.translate = ((getWidth(document.querySelector('.overlay')) - getWidth(poster))/ -2) + 'px 0';
    html2canvas(document.querySelector(".poster"), {
        allowTaint: true, 
        useCORS: true,
        scale: Math.min(window.devicePixelRatio, 2)
    }).then(function (canvas) {
        textureArr = canvas.getContext('2d').getImageData(0, -getHeight(poster)*Math.min(window.devicePixelRatio, 2), getWidth(poster)*Math.min(window.devicePixelRatio, 2), getHeight(poster)*Math.min(window.devicePixelRatio, 2)).data;
        loader.style.display = 'none';
        preview.style.visibility = 'visible';
        let imgUrl = applyBlend(textureArr, posterArr);
        preview.src = imgUrl;
        downloadBtn.href = imgUrl;
        downloadBtn.style.zIndex = 1;
        downloadBtn.style.color = '#ffffff';
    })
    document.querySelector('.overlay').style.opacity = null;
}

function blendScreen(a, b) {
		return 255 - (((255 - a) * (255 - b)) >> 8);
}

function applyBlend(arr1, arr2) {
    let resultArr = [];
    for (let i = 0; i < arr1.length; i+=4) {
        resultArr.push(blendScreen(arr1[i], arr2[i]));
        resultArr.push(blendScreen(arr1[i+1], arr2[i+1]));
        resultArr.push(blendScreen(arr1[i+2], arr2[i+2]));
        resultArr.push(arr1[i+3]);
    }
    return getDataUrlFromArr(resultArr, getWidth(poster)*Math.min(window.devicePixelRatio, 2), -getHeight(poster)*Math.min(window.devicePixelRatio, 2));
}

function updateColor(hex) {
    document.documentElement.style.setProperty('--accent-color', hex);
}