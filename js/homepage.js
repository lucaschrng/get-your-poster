let input = document.querySelector('.search-input');
let keywords = input.value.split(' ').join('+');
let results = document.querySelector('.results');
let deleteBtn = document.querySelector('.cross');


input.addEventListener('keyup', () => {
    keywords = input.value.split(' ').join('+');
    console.log(keywords);
    search(keywords);
})

deleteBtn.addEventListener('click', () => {
    input.value = "";
    input.select();
})

function search(keywords) {
    axios.get('/api/search?keyword=' + keywords)

        .then(function (response) {
        // en cas de réussite de la requête
        let albums = response.data.slice(0, -1);
        console.log(albums);
        albums = JSON.parse(albums).data;

        console.log(albums);

        let albumIndex = 0;
        let offset = 0;

        removeResults();
        while (albumIndex < 50) {
            if (albumIndex + offset < albums.length) {
                if (albums[albumIndex + offset].record_type === "album") {
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
    let card = document.createElement('a');
    card.href = '/poster?album_id=' + album.id;

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