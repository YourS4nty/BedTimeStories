// Function to obtain the current date in the format YYYYMMDD
function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months start from 0
    const day = String(now.getDate()).padStart(2, '0');

    return `${year}${month}${day}`;
}

async function searchElement() {
    const dateInput = getCurrentDate();

    try {
        const response = await fetch('./output.txt');
        const data = await response.json();

        const foundElement = data.find(element => element.id === dateInput);

        if (foundElement) {
            showResult(foundElement);
            yes(foundElement.href);
        } else {
            showResult(null, 'No element found for this date.');
        }
    } catch (error) {
        showResult(null, 'Error loading the file.');
    }
}

function showResult(element, errorMessage) {
    const resultDiv = document.getElementById('result');

    if (errorMessage) {
        resultDiv.innerHTML = `<p style="color: red;">${errorMessage}</p>`;
    } else {
        resultDiv.innerHTML = `
                    <p id="title">Title: ${element.texto}</p>
                    <img src="${element.imagenSrc}">
                `;
    }
}

function yes(url) {

    // Use CORS Anywhere as a proxy to overcome CORS
    const corsAnywhereUrl = 'https://cors-anywhere.herokuapp.com/';
    const proxyUrl = corsAnywhereUrl + url;

    const fixing = document.getElementById('fixing')
    fixing.setAttribute('href', proxyUrl)

    fetch(proxyUrl)
        .then(response => {
            if (response.ok) {
                return response.text();
            } else {
                throw new Error(`Error loading the page. Response status: ${response.status}`);
            }
        })
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // Exclude the element with the selector #inbody
            const inBodyElement = doc.querySelector('#inbody');
            if (inBodyElement) {
                inBodyElement.remove();
            }

            // Select only the specific fragment
            const specificFragment = doc.querySelector('.field-item');

            // Check if the fragment is null before accessing innerHTML
            if (specificFragment) {
                // Display the content of the specific fragment in the div with id "resultx"
                document.getElementById('resultx').innerHTML = specificFragment.innerHTML + '<footer>Coded With ❤️ By <a href="https://your4portfolio.vercel.app">@YourS4nty</a></footer>';
            } else {
                console.error('The specific fragment was not found on the page.');
            }
        })
        .catch(error => {
            console.error(`Error loading the page: ${error.message}`);
        });
}

document.addEventListener('DOMContentLoaded', function () {
    searchElement();
});
