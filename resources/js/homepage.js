const axios = require('axios').default;

let input = document.querySelector('.search-input');
let keywords = input.value.split(' ').join('+');
let results = document.querySelector('.results');
let cross = document.querySelector('.cross');

cross.addEventListener('click', () => {
    input.value = "";
    input.focus();
})

let lastClick = 0;

input.addEventListener('keyup', () => {
    keywords = input.value.split(' ').join('+');
    console.log(Date.now() - lastClick)
    lastClick = Date.now();
    
    setTimeout(() => {
        if (Date.now() - lastClick > 300) {
            if (keywords === "") {
                //show trending
            } else {
                search(keywords);
            }
        }
    }, 300);
})

function search(keywords) {
    axios.get('api/search/' + keywords)

        .then(function (response) {
        // en cas de réussite de la requête
        albums = response.data.albums.items;

        let albumIndex = 0;
        let offset = 0;

        removeResults();
        while (albumIndex < 50) {

            if (albumIndex + offset < albums.length) {
                if (albums[albumIndex + offset].album_type === "album") {
                    addResult(albums[albumIndex + offset]);
                    albumIndex++; 
                } else {
                    if (albumIndex + offset < albums.length) {
                        offset++;
                    } else {
                        albumIndex = 50;
                    }
                }
            } else {
                albumIndex = 50;
            }
        }

        })

        .then(function () {
        // dans tous les cas
        })
}

function addResult(album) {
    let albumId = album.id;
    let albumTitle = album.name;
    if (albumTitle === "<COPINGMECHANISM>") {
        albumTitle = "&lt;COPINGMECHANISM&gt;";
    }
    let albumArtist = album.artists[0].name;
    let albumCoverUrl = album.images[0].url;

    let card = document.createElement('a');
    card.href = '/poster/' + albumId;

    let cover = document.createElement('img');
    cover.src = albumCoverUrl;

    card.appendChild(cover);

    let infos = document.createElement('div');
    let title = document.createElement('h2');
    title.innerHTML = albumTitle;
    let artist = document.createElement('h3');
    artist.innerHTML = albumArtist;

    infos.appendChild(title);
    infos.appendChild(artist);
    card.appendChild(infos);

    results.appendChild(card);
}

function removeResults() {
    while (results.childElementCount > 0) {
        results.removeChild(results.childNodes[0]);
    }
}