const axios = require('axios').default;

let input = document.querySelector('.search-input');
let keywords;
let results = document.querySelector('.results');
let cross = document.querySelector('.cross');
let trendingTitle = document.querySelector('.trending-title');
let lastClick = 0;

// initialise page
getTop50();

// add event listeners

cross.addEventListener('click', () => {
    input.value = "";
    input.focus();
    getTop50();
})

input.addEventListener('keyup', () => {
    keywords = encodeURI(input.value);
    lastClick = Date.now();
    
    setTimeout(() => {
        if (Date.now() - lastClick > 300) {
            if (keywords === "") {
                getTop50();
                document.body.scrollTop = 0;
            } else {
                search(keywords);
                document.body.scrollTop = 0;
            }
        }
    }, 300);
})

// declare functions

function getTop50() {
    axios.get('api/top50')

        .then(function (response) {
        let albums = response.data.items;

        let albumIndex = 0;
        let offset = 0;
        let displayedAlbums = [];

        trendingTitle.style.opacity = 1;
        removeResults();

        while (albumIndex < 50) {
            if (albumIndex + offset < albums.length) {
                if (albums[albumIndex + offset].track.album.album_type === "album" && !displayedAlbums.includes(albums[albumIndex + offset].track.album.name)) {

                    let albumId = albums[albumIndex + offset].track.album.id;
                    let albumTitle = albums[albumIndex + offset].track.album.name;
                    let albumArtist = albums[albumIndex + offset].track.album.artists[0].name;
                    let albumCoverUrl = albums[albumIndex + offset].track.album.images[0].url;
                    displayedAlbums.push(albumTitle);

                    addResult(albumId, albumTitle, albumArtist, albumCoverUrl);
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
}

function search(keywords) {
    axios.get('api/search/' + keywords)

        .then(function (response) {
        let albums = response.data.albums.items;

        let albumIndex = 0;
        let offset = 0;

        trendingTitle.style.opacity = null;
        removeResults();

        while (albumIndex < 50) {

            if (albumIndex + offset < albums.length) {
                if (albums[albumIndex + offset].album_type === "album") {

                    let albumId = albums[albumIndex + offset].id;
                    let albumTitle = albums[albumIndex + offset].name;
                    let albumArtist = albums[albumIndex + offset].artists[0].name;
                    let albumCoverUrl = albums[albumIndex + offset].images[0].url;

                    addResult(albumId, albumTitle, albumArtist, albumCoverUrl);
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
}

function addResult(albumId, albumTitle, albumArtist, albumCoverUrl) {
    // temporary patch
    if (albumTitle === "<COPINGMECHANISM>") {
        albumTitle = "&lt;COPINGMECHANISM&gt;";
    }

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