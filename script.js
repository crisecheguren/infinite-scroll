const imageContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');


let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let photosArray = [];

// helper function to set attributes on DOM elements
function setAttributes(element, attributes) {
    for (const key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
}

// unsplash API
let count = 5
const apiKey = 'kEzTaiPvO74Nu9UQKowSu4IXp-O3Ydcu-dFzRbsQVUM';
let apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${count}`

//check if all images were loaded
function imageLoaded() {
    
    imagesLoaded++;
    
    if (imagesLoaded === totalImages) {
        ready = true;
        loader.hidden=true;
        count = 30;
        apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${count}`
    }
}

// create elements for links and photos, add to DOM
function displayPhotos() {
    imagesLoaded = 0;
    totalImages = photosArray.length;
    

    
    photosArray.forEach((photo) => {
        // create anchor to link to unsplash
        const item = document.createElement('a');
        setAttributes(item, {
            href: photo.links.html,
            target: '_blank'
        });
        // create image for photo
        const img = document.createElement('img');

        setAttributes(img, {
            src: photo.urls.regular,
            alt: photo.alt_description,
            title: photo.description
        });

        // event listener, check when each is finished loading
        img.addEventListener('load', imageLoaded);

        // put image in anchor and then put both inside imageContainer
        item.appendChild(img);
        imageContainer.appendChild(item)
    });
}


// get photos from unsplash API

async function getPhotos() {
    try {
        const response = await fetch(apiUrl);
        photosArray = await response.json();
        displayPhotos();

    } catch {
        //catch error
    }
}

// check to see if scrolling near bottom of page, load more photos
window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && ready) {
        ready = false;
        getPhotos();
        
    }
})

// on load
getPhotos();
