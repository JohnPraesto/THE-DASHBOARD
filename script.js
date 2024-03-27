/////////////// DATE AND TIME

function updateTime() {
    const timeElement = document.getElementById('time');
    const currentDate = new Date();
    const timeOptions = { hour: 'numeric', minute: 'numeric', hour24: true };
    const timeString = currentDate.toLocaleTimeString(undefined, timeOptions);
    timeElement.textContent = timeString;
}

function updateDate() {
    const dateElement = document.getElementById('date');
    const currentDate = new Date();
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = currentDate.toLocaleDateString(undefined, dateOptions);
    dateElement.textContent = dateString;
}

setInterval(updateTime, 10000);
setInterval(updateDate, 10000);

updateTime();
updateDate();

////////////////// DATE AND TIME END


////////////////// HEADLINE START

// Get the input element
const headlineInput = document.querySelector('.headline');

// Retrieve the text from local storage if it exists
const savedText = localStorage.getItem('headlineText');
if (savedText) {
    headlineInput.value = savedText;
}

// Add an event listener to the input field to save the text to local storage when it changes
headlineInput.addEventListener('input', function() {
    localStorage.setItem('headlineText', headlineInput.value);
});

////////////////// HEADLINE END




////////////////// START LINK BOXES

// Select the link button and link container
const linkButton = document.querySelector('#box1 .link-button');
const linkContainer = document.querySelector('#box1 .link-container');

// Add event listener to the "Add link" button
linkButton.addEventListener('click', () => {
    const linkBoxes = linkContainer.querySelectorAll('.link-box');

    if (linkBoxes.length >= 4) {
        alert("No more link boxes allowed");
        return;
    }

    // Prompt the user for the link and headline
    const link = prompt("Enter the link:");
    const headline = prompt("Enter the headline:");

    if (link && headline) {
        const newLinkBox = document.createElement('button');
        newLinkBox.className = 'link-box';
        newLinkBox.textContent = headline;
        
        const linkUrlInput = document.createElement('input');
        linkUrlInput.type = 'hidden'; // Hide the input for the URL
        linkUrlInput.value = link; // Set the value to the link
        
        newLinkBox.appendChild(linkUrlInput);
        
        linkContainer.appendChild(newLinkBox);

        // Save the link-box to local storage
        saveLinkBoxToLocalStorage(link, headline);

            // Fetch the favicon of the website
            fetchFavicon(link)
            .then(faviconUrl => {
                if (faviconUrl) {
                    const faviconImg = document.createElement('img');
                    faviconImg.src = faviconUrl;
                    faviconImg.alt = 'Favicon';
                    newLinkBox.prepend(faviconImg); // Prepend the favicon before the headline
                }
            })
            .catch(error => {
                console.error('Error fetching favicon:', error);
            });
        
        newLinkBox.addEventListener('click', () => {
            const url = newLinkBox.querySelector('input[type="hidden"]').value;
            if (url) {
                window.open(url, '_blank');
            }
        });

        newLinkBox.addEventListener('contextmenu', (event) => {
            event.preventDefault(); // Prevent the default right-click context menu
            linkContainer.removeChild(newLinkBox); // Remove the link-box from the container
        
            // Remove the link-box from local storage
            removeLinkBoxFromLocalStorage(link);
        });

    } else {
        alert("Link and headline are required.");
    }
});

function fetchFavicon(url) {
    return new Promise((resolve, reject) => {
        const faviconUrl = new URL('/favicon.ico', url).toString();
        const img = new Image();
        img.onload = () => resolve(faviconUrl);
        img.onerror = () => reject();
        img.src = faviconUrl;
    });
}

// Function to save the link-box to local storage
function saveLinkBoxToLocalStorage(link, headline) {
    const existingLinkBoxes = JSON.parse(localStorage.getItem('linkBoxes')) || [];
    existingLinkBoxes.push({ link, headline });
    localStorage.setItem('linkBoxes', JSON.stringify(existingLinkBoxes));
}

// Function to remove the link-box from local storage
function removeLinkBoxFromLocalStorage(link) {
    let existingLinkBoxes = JSON.parse(localStorage.getItem('linkBoxes')) || [];
    existingLinkBoxes = existingLinkBoxes.filter(item => item.link !== link);
    localStorage.setItem('linkBoxes', JSON.stringify(existingLinkBoxes));
}

// Function to create a new link-box
function createLinkBox(link, headline) {
    const newLinkBox = document.createElement('button');
    newLinkBox.className = 'link-box';
    newLinkBox.textContent = headline;

    const linkUrlInput = document.createElement('input');
    linkUrlInput.type = 'hidden'; // Hide the input for the URL
    linkUrlInput.value = link; // Set the value to the link
    
    newLinkBox.appendChild(linkUrlInput);
    
    // Fetch the favicon of the website
    fetchFavicon(link)
        .then(faviconUrl => {
            if (faviconUrl) {
                const faviconImg = document.createElement('img');
                faviconImg.src = faviconUrl;
                faviconImg.alt = 'Favicon';
                newLinkBox.prepend(faviconImg); // Prepend the favicon before the headline
            }
        })
        .catch(error => {
            console.error('Error fetching favicon:', error);
        });

    newLinkBox.addEventListener('click', () => {
        const url = newLinkBox.querySelector('input[type="hidden"]').value;
        if (url) {
            window.open(url, '_blank');
        }
    });

    // Add event listener to remove link-box on right-click
    newLinkBox.addEventListener('contextmenu', (event) => {
        event.preventDefault(); // Prevent the default right-click context menu
        linkContainer.removeChild(newLinkBox); // Remove the link-box from the container

        // Remove the link-box from local storage
        removeLinkBoxFromLocalStorage(link);
    });

    return newLinkBox;
}

// Function to load link-boxes from local storage when the page loads
window.addEventListener('load', () => {
    const existingLinkBoxes = JSON.parse(localStorage.getItem('linkBoxes')) || [];
    existingLinkBoxes.forEach(({ link, headline }) => {
        const newLinkBox = createLinkBox(link, headline);
        linkContainer.appendChild(newLinkBox);
    });
});

////////////////// END LINK BOXES




////////////////// BACKGROUND START

document.addEventListener('DOMContentLoaded', () => {
    const savedBackgroundImage = localStorage.getItem('backgroundImage');
    if (savedBackgroundImage) {
        document.body.style.backgroundImage = `url('${savedBackgroundImage}')`;
    }
});

function changeBackground() {
    fetchRandomImage()
        .then(response => response.json())
        .then(data => {
            const imageUrl = data.urls.regular;
            document.body.style.backgroundImage = `url('${imageUrl}')`;
       
            localStorage.setItem('backgroundImage', imageUrl);
        })
        .catch(error => console.error('Error fetching random image:', error));
}

function fetchRandomImage() {
    const accessKey = 'fg-V2yjpT8E_tXSqCp5cJ0ZP47qSg8y3-BnEJThTTgs'; // Your Unsplash access key
    const url = `https://api.unsplash.com/photos/random?client_id=${accessKey}`;

    return fetch(url);
}

////////////////// BACKGROUND END



////////////////// START TEXT AREA

// Get the textarea element
const textarea = document.querySelector('.text-area');

// Check if there's any saved text in localStorage
const savedText2 = localStorage.getItem('savedText2');

// If there's saved text, set it as the value of the textarea
if (savedText2) {
    textarea.value = savedText2;
}

// Add an event listener to the textarea for input changes
textarea.addEventListener('input', function() {
    // When the text changes, save it to localStorage
    localStorage.setItem('savedText2', textarea.value);
});

////////////////// END TEXT AREA