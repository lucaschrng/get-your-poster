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

    album.tracks.data.forEach((track, index) => {
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

    poster.appendChild(infos);
    poster.appendChild(cover);
    poster.appendChild(tracklist);

    // Use `Vibrant` in script
    // Vibrant is exported to global. window.Vibrant === Vibrant
    Vibrant.from(cover).getPalette(function(err, palette) {});
    // Promise
    Vibrant.from(cover).getPalette().then(function(palette) {
        document.documentElement.style.setProperty('--accent-color', 'rgb(' + palette.Vibrant._rgb[0] + ', ' + palette.Vibrant._rgb[1] + ', ' + palette.Vibrant._rgb[2] + ')');
    });
}