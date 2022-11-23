let input = document.querySelector('.search-input');
let keywords = input.value.split(' ').join('+');
let results = document.querySelector('.results');
let deleteBtn = document.querySelector('.cross');

let apiKey = 'bd96b85d26504575df8c1cdc4e08b281';

input.addEventListener('keyup', () => {
    keywords = input.value.split(' ').join('+');
    search(keywords);
})

deleteBtn.addEventListener('click', () => {
    input.value = "";
    input.select();
})

function search(keywords) {
    axios.get('https://ws.audioscrobbler.com/2.0/?method=album.search&album=' + keywords + '&api_key=' + apiKey + '&format=json')

        .then(function (response) {
        // en cas de réussite de la requête
        let albums = response.data.results.albummatches.album;
        console.log(albums);

        let albumIndex = 0;

        removeResults();
        while (albumIndex < 50) {
            if (albumIndex < albums.length) {
                addResult(albums[albumIndex]);
                albumIndex++;
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
    let card = document.createElement('a');
    card.href = './poster.html?artist=' + album.artist.split(' ').join('+') + '&album=' + album.name.split(' ').join('+');

    let cover = document.createElement('img');
    cover.src = 'https://lastfm.freetls.fastly.net/i/u/300x300/' + album.image[0]['#text'].slice(41);

    card.appendChild(cover);

    let infos = document.createElement('div');
    let title = document.createElement('h2');
    title.innerHTML = album.name;
    let artist = document.createElement('h3');
    artist.innerHTML = album.artist;

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