const imageContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');

let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let photosArray = [];

function setAttributes(element, attributes) {
    for (const key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
}

let count = 5;
async function fetchApiKey() {
    try {
        const response = await fetch('https://crisecheguren.com/keys');
        const data = await response.json();
        return data.unsplashKey;
    } catch (error) {
        console.log(error);
    }
}

let apiKey;
let apiUrl;

async function initialize() {
    apiKey = await fetchApiKey();
    apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${count}`;
    getPhotos();
}

function imageLoaded() {
    imagesLoaded++;

    if (imagesLoaded === totalImages) {
        ready = true;
        loader.hidden = true;
        count = 30;
        apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${count}`;
    }
}

function displayPhotos() {
    imagesLoaded = 0;
    totalImages = photosArray.length;

    photosArray.forEach((photo) => {
        const item = document.createElement('a');
        setAttributes(item, {
            href: photo.links.html,
            target: '_blank'
        });
        const img = document.createElement('img');

        setAttributes(img, {
            src: photo.urls.regular,
            alt: photo.alt_description,
            title: photo.description
        });

        img.addEventListener('load', imageLoaded);

        item.appendChild(img);
        imageContainer.appendChild(item);
    });
}

async function getPhotos() {
    try {
        const response = await fetch(apiUrl);
        photosArray = await response.json();
        displayPhotos();

    } catch {
        //catch error
    }
}

window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && ready) {
        ready = false;
        getPhotos();

    }
});

initialize();
