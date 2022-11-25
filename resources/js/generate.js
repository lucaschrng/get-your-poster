const axios = require('axios').default;
const html2canvas = require('html2canvas');
const Vibrant = require('node-vibrant');

let album_id = document.querySelector('.album_id').value;
let poster = document.querySelector('.poster');
let downloadBtn = document.querySelector('.poster-img a');
let preview = document.querySelector('.preview');
let loader = document.querySelector('.loader');
let span = document.querySelector('.poster-generate > span');
let fz = '27px';

axios.get('/api/album/' + album_id)

    .then(function (response) {
    album = response.data;

    buildPoster(album);
    })

function buildPoster(album) {
    let albumTitle = album.name;
    console.log(album.artists);
    let albumArtists = album.artists;
    let albumCoverUrl = album.images[0].url;
    let albumTracks = album.tracks.items;

    let infos = document.createElement('div');

    let albumArtistTitle = '';

    albumArtists.forEach((artist, index) => {
        console.log(index);
        console.log(artist.name);
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

    titleWords = titleContent.split(' ');
    titleWords.forEach(word => {
        let wordNode = document.createElement('span');
        wordNode.innerHTML = word;
        title.appendChild(wordNode);
    })

    if (albumTitle.length > 13) {
        title.style.fontSize = '80px';
        title.style.lineHeight = '80px';
    }
    if (titleWords.length > 6) {
        title.style.fontSize = '72px';
        title.style.lineHeight = '64px';
    }

    infos.appendChild(artist);
    infos.appendChild(title);

    let cover = document.createElement('img');
    cover.src = albumCoverUrl;

    let songTitleMaxLength = 0;

    albumTracks.forEach((track, index) => {
        let trackTitle = track.name;
        trackTitle = removeMention(trackTitle, 'remaster');
        trackTitle = removeMention(trackTitle, 'album version');
        if (trackTitle.length > songTitleMaxLength) {
            songTitleMaxLength = trackTitle.length;
        }
    });

    if (songTitleMaxLength > 28 || albumTracks.length > 18) {
        fz = '24px';
    }
    if (songTitleMaxLength > 30) {
        fz = '22px';
    }
    if (songTitleMaxLength > 34) {
        fz = '20px';
    }
    if (songTitleMaxLength > 37) {
        fz = '18px';
    }
    if (songTitleMaxLength > 42) {
        fz = '16px';
    }
    if (songTitleMaxLength > 48) {
        fz = '12px';
    }
    if (songTitleMaxLength > 64) {
        fz = '11px';
    }

    let tracklist = document.createElement('ul');
    tracklist.style.gridTemplateRows = "repeat(" + Math.ceil(albumTracks.length / 2) + ", 1fr)";
    tracklist.style.fontSize = fz;
    span.style.fontSize = fz;

    albumTracks.forEach((track, index) => {
        let trackTitle = track.name;
        trackTitle = removeMention(trackTitle, 'remaster');
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

    document.querySelectorAll('.separator').forEach(separator => {
        separatorWidth = getWidth(separator);
        dotNb = Math.floor(separatorWidth / getWidth(span));
        for (let i = 0; i < dotNb; i++) {
            separator.innerHTML += '.';
        }
    })

    cover.setAttribute('crossOrigin', '');
    Vibrant.from(cover).getPalette(function(err, palette) {});
    Vibrant.from(cover).getPalette().then(function(palette) {
        let vibrantColor = palette.Vibrant._rgb;
        document.documentElement.style.setProperty('--accent-color', 'rgb(' + vibrantColor[0] + ', ' + vibrantColor[1] + ', ' + vibrantColor[2] + ')');
    });

    cover.addEventListener('load', () => {
        setTimeout(() => {
            window.scrollTo(0, 0);
            html2canvas(document.querySelector(".poster"), {
                allowTaint: true, 
                useCORS: true,
                scale: Math.min(window.devicePixelRatio, 2)
            }).then(function (canvas) {
                let anchorTag = document.createElement("a");
                document.body.appendChild(anchorTag);
                loader.style.display = 'none';
                preview.src = canvas.toDataURL("image/png", 1.0);
                downloadBtn.href = canvas.toDataURL("image/png", 1.0);
                downloadBtn.download = albumArtistTitle.replace(',','').split(' ').join('') + "-" + albumTitle.split(' ').join('') + '_Poster';
                downloadBtn.style.zIndex = 1;
                downloadBtn.style.color = '#ffffff';
            })
        }, 0);
    })
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

function getWidth(element) {
    let rect = element.getBoundingClientRect();
    return rect.right - rect.left;
}