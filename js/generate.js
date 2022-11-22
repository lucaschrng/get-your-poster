let separatorText = '................................................................................................................................';

let album_id = document.querySelector('.album_id').value;
let poster = document.querySelector('.poster');
let downloadBtn = document.querySelector('.poster-img a');
let preview = document.querySelector('.preview');

axios.get('/api/album.php?album_id=' + album_id)

    .then(function (response) {
    // en cas de réussite de la requête
    let album = response.data.slice(0, -1);
    album = JSON.parse(album);

    buildPoster(album);
    })

    .then(function () {
    // dans tous les cas
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

    // title.innerHTML = album.title;

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
    
    // let titleWords = "My beautiful dark twisted fantasy".split(" ");
    // console.log(titleWords);

    // for (let i = 0; i < album.title.length; i++) {
    //     if (letter != " ") {
    //         let letterSpan = document.createElement('span');
    //         letterSpan.innerHTML = album.title[i];
    //     }
    // }
    // title.innerHTML = album.title;

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


    function loadVibrant() {
        Vibrant.from(cover).getPalette(function(err, palette) {});
        Vibrant.from(cover).getPalette().then(function(palette) {
            let vibrantColor = palette.Vibrant._rgb;
            document.documentElement.style.setProperty('--accent-color', 'rgb(' + vibrantColor[0] + ', ' + vibrantColor[1] + ', ' + vibrantColor[2] + ')');
        });
    }

    const fac = new FastAverageColor();
    loadVibrant();

    // fac.getColorAsync(album.cover_small)
    //     .then(color => {
    //         document.documentElement.style.setProperty('--accent-color', color.rgba);
    //         let luminance = rgbToHsl(color.value[0], color.value[1], color.value[2]);
    //         if (luminance[2] > 0.80 || luminance[1] < 0.25) {
    //             loadVibrant();
    //         }
    //     })
    //     .catch(e => {
    //         console.log(e);
    //     });

        cover.addEventListener('load', () => {
            setTimeout(() => {
                html2canvas(document.querySelector(".poster"), {
                    allowTaint: true, useCORS: true
                    }).then(function (canvas) {
                        let anchorTag = document.createElement("a");
                        document.body.appendChild(anchorTag);
                        preview.src = canvas.toDataURL();
                        downloadBtn.href = canvas.toDataURL();
                        downloadBtn.download = album.artist.name.split(' ').join('') + "-" + album.title.split(' ').join('') + '_Poster.png';
                        downloadBtn.style.zIndex = 1;
                        downloadBtn.style.color = '#ffffff';
                        // anchorTag.download = "filename.jpg";
                        // anchorTag.href = canvas.toDataURL();
                        // anchorTag.target = '_blank';
                        // anchorTag.click();
                    })
            }, 2000);
        })
}

function rgbToHsl(r, g, b) {
    r /= 255, g /= 255, b /= 255;

    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if (max == min) {
      h = s = 0; // achromatic
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }

        h /= 6;
    }

    return [ h, s, l ];
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