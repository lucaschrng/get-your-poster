let separatorText = '................................................................................................................................';

let album_id = document.querySelector('.album_id').value;
let poster = document.querySelector('.poster');

axios.get('/generate.php?album_id=' + album_id)

    .then(function (response) {
    // en cas de réussite de la requête
    let album = response.data.slice(0, -1);
    album = JSON.parse(album);

    console.log(album);

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
    title.innerHTML = album.title;

    if (album.title.length > 13) {
        title.style.fontSize = '80px';
        title.style.lineHeight = '80px';
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
        if (track.title.length > songTitleMaxLength) {
            songTitleMaxLength = track.title.length;
        }
        let song = document.createElement('li');
        let trackNumber = document.createElement('span');
        trackNumber.innerHTML = index + 1;
        let separator = document.createElement('span');
        separator.innerHTML = separatorText;
        separator.classList.add('separator');
        let songTitle =document.createElement('span');
        songTitle.innerHTML = track.title;

        song.appendChild(trackNumber);
        song.appendChild(separator);
        song.appendChild(songTitle);
        
        tracklist.appendChild(song);
    });

    console.log(songTitleMaxLength);

    if (songTitleMaxLength > 37) {
        tracklist.childNodes.forEach(li => {
            li.style.fontSize = '22px';
        })
    }
    if (songTitleMaxLength > 40) {
        tracklist.childNodes.forEach(li => {
            li.style.fontSize = '20px';
        })
    }
    if (songTitleMaxLength > 60) {
        tracklist.childNodes.forEach(li => {
            li.style.fontSize = '12px';
        })
    }

    poster.appendChild(infos);
    poster.appendChild(cover);
    poster.appendChild(tracklist);


    Vibrant.from(cover).getPalette(function(err, palette) {});
    Vibrant.from(cover).getPalette().then(function(palette) {
        let vibrantColor = palette.Vibrant._rgb;
        let vibrantAvg = (vibrantColor[0] + vibrantColor[1] + vibrantColor[2]) / 3;
        console.log(vibrantAvg);
        document.documentElement.style.setProperty('--accent-color', 'rgb(' + vibrantColor[0] + ', ' + vibrantColor[1] + ', ' + vibrantColor[2] + ')');
    });

    // const colorThief = new ColorThief();
    // cover.crossOrigin = "Anonymous";

    // cover.addEventListener('load', () => {
    //     let color = colorThief.getColor(cover);
    //     let colorAvg = (color[0] + color[1] + color[2]) / 3;
    //     console.log(colorAvg);
    //     // document.documentElement.style.setProperty('--accent-color', 'rgb(' + color[0] + ', ' + color[1] + ', ' + color[2] + ')');
    // })

    // setTimeout(() => {
    //     html2canvas(document.querySelector(".poster"), {
    //         allowTaint: true, useCORS: true
    //     }).then(function (canvas) {
    //         var anchorTag = document.createElement("a");
    //         document.body.appendChild(anchorTag);
    //         document.querySelector(".poster-img").appendChild(canvas);
    //         // anchorTag.download = "filename.jpg";
    //         // anchorTag.href = canvas.toDataURL();
    //         // anchorTag.target = '_blank';
    //         // anchorTag.click();
    //     });
    // }, 2000);
}