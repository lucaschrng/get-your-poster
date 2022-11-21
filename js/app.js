let input = document.querySelector('.search-input');
let results = document.querySelector('.results');

input.addEventListener('keyup', () => {
    search(input.value);
})

function search(keyword) {
    axios.get('/api/search.php?keyword=' + keyword)

        .then(function (response) {
        // en cas de réussite de la requête
        let albums = response.data.slice(0, -1);
        albums = JSON.parse(albums).data;

        console.log(albums);

        let albumIndex = 0;
        let offset = 0;

        removeResults();
        while (albumIndex < 10) {
            console.log('hey');
            if (albumIndex + offset < albums.length) {
                if (albums[albumIndex + offset].record_type === "album") {
                    addResult(albums[albumIndex + offset]);
                    albumIndex++; 
                } else {
                    if (albumIndex + offset < albums.length) {
                        offset++;
                    } else {
                        albumIndex = 10;
                    }
                }
            } else {
                albumIndex = 10;
            }
        }

        })

        .then(function () {
        // dans tous les cas
        })
}

function addResult(album) {
    let card = document.createElement('a');
    card.href = '/generate.php?album_id=' + album.id;

    let cover = document.createElement('img');
    cover.src = album.cover_big;

    card.appendChild(cover);

    let infos = document.createElement('div');
    let title = document.createElement('h2');
    title.innerHTML = album.title;
    let artist = document.createElement('h3');
    artist.innerHTML = album.artist.name;

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