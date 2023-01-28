import axios from 'axios';

let deleteButton = document.querySelector('.cross');
let searchInput = document.querySelector('.search-input');
let resultsDiv = document.querySelector('.results');
let trendingTitle = document.querySelector('.trending-title');
let displayTimeout;

// initialisation

displayTop50();

// set event listeners

searchInput.addEventListener('keyup', () => {
    let queryKeywords = encodeURI(searchInput.value);

    clearTimeout(displayTimeout);
    displayTimeout = setTimeout(() => {
        document.body.scrollTop = 0;
        if (queryKeywords === "") {
            displayTop50();
        } else {
            displaySearchResults(queryKeywords);
        }
    }, 300);
})

deleteButton.addEventListener('click', () => {
    searchInput.value = "";
    searchInput.focus();
    displayTop50();
})

// declare functions

function displayTop50() {
    axios.get('/trending')
        .then(response => {
            resultsDiv.innerHTML = '';

            let albums = response.data;
            albums.forEach(album => {
                displayResult(album);
            })

            trendingTitle.style.opacity = 1;
        })
        .catch(error => {
            console.log(error);
        })
}

function displaySearchResults(queryKeywords) {
    axios.get(`/search/${queryKeywords}`)
        .then(response => {
            trendingTitle.style.opacity = null;
            resultsDiv.innerHTML = '';

            let albums = response.data;
            albums.forEach(album => {
                displayResult(album);
            })
        })
        .catch(error => {
            console.log(error);
        })
}

function displayResult({id, album_cover_url, name, artists}) {
    let card = document.createElement('a');
    card.href = `/poster/${id}`;
    resultsDiv.appendChild(card);

    let cover = document.createElement('img');
    cover.src = album_cover_url;
    card.appendChild(cover);

    let infos = document.createElement('div');
    card.appendChild(infos);

    let title = document.createElement('h2');
    title.textContent = name;
    infos.appendChild(title);

    let artistsNames = document.createElement('h3');
    artistsNames.textContent = artists;
    infos.appendChild(artistsNames);
}
