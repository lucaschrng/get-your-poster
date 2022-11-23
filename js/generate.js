let album_id = document.querySelector('.album_id').value;
let poster = document.querySelector('.poster');
let downloadBtn = document.querySelector('.poster-img a');
let preview = document.querySelector('.preview');
let loader = document.querySelector('.loader');
let span = document.querySelector('.poster-generate > span');
let fz = '28px';

let apiKey = 'bd96b85d26504575df8c1cdc4e08b281';
let artisParam = findGetParameter('artist');
let albumParam = findGetParameter('album');

console.log(albumParam);

axios.get('http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=' + apiKey + '&artist=' + artisParam + '&album=' + albumParam + '&format=json')

    .then(function (response) {
    album = response.data.album;
    console.log(album);

    buildPoster(album);
    })

function buildPoster(album) {
    let infos = document.createElement('div');

    let artist = document.createElement('h2');
    artist.innerHTML = album.artist;

    let title = document.createElement('h1');
    let titleContent = removeMention(album.name, 'remaster');    

    titleWords = titleContent.split(' ');
    titleWords.forEach(word => {
        let wordNode = document.createElement('span');
        wordNode.innerHTML = word;
        title.appendChild(wordNode);
    })

    if (album.name.length > 13) {
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
    cover.src = 'https://lastfm.freetls.fastly.net/i/u/' + album.image[0]['#text'].slice(41);

    let songTitleMaxLength = 0;

    album.tracks.track.forEach((track, index) => {
        let trackTitle = removeMention(track.name, 'remaster');
        trackTitle = removeMention(trackTitle, 'album version');
        if (trackTitle.length > songTitleMaxLength) {
            songTitleMaxLength = trackTitle.length;
        }
    });

    if (songTitleMaxLength > 28 || album.tracks.track.length > 18) {
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
    tracklist.style.gridTemplateRows = "repeat(" + Math.ceil(album.tracks.track.length / 2) + ", 1fr)";
    tracklist.style.fontSize = fz;
    span.style.fontSize = fz;

    album.tracks.track.forEach((track, index) => {
        let trackTitle = removeMention(track.name, 'remaster');
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
                downloadBtn.download = album.artist.split(' ').join('') + "-" + album.name.split(' ').join('') + '_Poster';
                downloadBtn.style.zIndex = 1;
                downloadBtn.style.color = '#ffffff';
            })
        }, 2000);
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

function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    location.search
        .slice(1)
        .split("&")
        .forEach(function (item) {
            tmp = item.split("=");
            if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        });
    return result;
}