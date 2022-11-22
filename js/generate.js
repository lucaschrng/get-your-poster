let separatorText = '................................................................................................................................';

let album_id = document.querySelector('.album_id').value;
let poster = document.querySelector('.poster');
let downloadBtn = document.querySelector('.poster-img a');
let preview = document.querySelector('.preview');
let loader = document.querySelector('.loader');

axios.get('/api/album?album_id=' + album_id)

    .then(function (response) {
    let album = response.data.slice(0, -1);
    album = JSON.parse(album);

    buildPoster(album);
    })

function buildPoster(album) {
    let infos = document.createElement('div');

    let artist = document.createElement('h2');
    artist.innerHTML = album.artist.name;

    let title = document.createElement('h1');
    let titleContent = removeMention(album.title, 'remaster');    

    titleWords = titleContent.split(' ');
    titleWords.forEach(word => {
        let wordNode = document.createElement('span');
        wordNode.innerHTML = word;
        title.appendChild(wordNode);
    })

    if (album.title.length > 13) {
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
    cover.src = album.cover_xl;

    let tracklist = document.createElement('ul');
    tracklist.style.gridTemplateRows = "repeat(" + Math.ceil(album.tracks.data.length / 2) + ", 1fr)";

    let songTitleMaxLength = 0;

    album.tracks.data.forEach((track, index) => {
        let trackTitle = removeMention(track.title, 'remaster');
        trackTitle = removeMention(trackTitle, 'album version');
        if (trackTitle.length > songTitleMaxLength) {
            songTitleMaxLength = trackTitle.length;
        }
        let song = document.createElement('li');
        let trackNumber = document.createElement('span');
        trackNumber.innerHTML = index + 1;
        let separator = document.createElement('span');
        separator.innerHTML = separatorText;
        separator.classList.add('separator');
        let songTitle =document.createElement('span');
        songTitle.innerHTML = trackTitle;

        song.appendChild(trackNumber);
        song.appendChild(separator);
        song.appendChild(songTitle);
        
        tracklist.appendChild(song);
    });

    if (songTitleMaxLength > 28 || album.tracks.data.length > 18) {
        tracklist.childNodes.forEach(li => {
            li.style.fontSize = '24px';
        })
    }
    if (songTitleMaxLength > 30) {
        tracklist.childNodes.forEach(li => {
            li.style.fontSize = '22px';
        })
    }
    if (songTitleMaxLength > 34) {
        tracklist.childNodes.forEach(li => {
            li.style.fontSize = '20px';
        })
    }
    if (songTitleMaxLength > 37) {
        tracklist.childNodes.forEach(li => {
            li.style.fontSize = '18px';
        })
    }
    if (songTitleMaxLength > 42) {
        tracklist.childNodes.forEach(li => {
            li.style.fontSize = '16px';
        })
    }
    if (songTitleMaxLength > 48) {
        tracklist.childNodes.forEach(li => {
            li.style.fontSize = '12px';
        })
    }
    if (songTitleMaxLength > 64) {
        tracklist.childNodes.forEach(li => {
            li.style.fontSize = '11px';
        })
    }

    poster.appendChild(infos);
    poster.appendChild(cover);
    poster.appendChild(tracklist);

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
                downloadBtn.download = album.artist.name.split(' ').join('') + "-" + album.title.split(' ').join('') + '_Poster';
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