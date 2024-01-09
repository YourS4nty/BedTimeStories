/* 
 Script Coded BY @YourS4nty
 -How To Get The Name And Id
*/

// Import required libraries
const fs = require('fs').promises; // File system module for reading and writing files
const axios = require('axios'); // HTTP client for making requests
const cheerio = require('cheerio'); // Library for parsing HTML and manipulating the DOM

// Main function to perform web scraping
async function realizarScraping() {
    try {
        const elementosSet = new Set(); // Set to store unique elements

        // Loop to iterate until the page reaches 8
        for (let page = 1; page <= 8; page++) {
            // URL for scraping with the current page number
            const url = `https://cuentosparadormir.com/cuentos-cortos?page=${page}`;

            // Make a GET request using Axios
            const response = await axios.get(url);

            // Load HTML content of the page into Cheerio
            const $ = cheerio.load(response.data);

            // Example: Extract names, links, and image URLs from the page without duplicates
            $('tbody').find('td a').each((index, element) => {
                const texto = $(element).find('img').attr('title') || ''; // Get the image title
                const href = $(element).attr('href');
                const imagenSrc = $(element).find('img').attr('src') || '';

                // Add to the set only if there is a title (text) present
                if (texto) {
                    elementosSet.add({ texto, href, imagenSrc });
                }
            });
        }

        const elementos = Array.from(elementosSet); // Convert set to array

        // Create a text file with the information
        await fs.writeFile('output.txt', JSON.stringify(elementos, null, 2), 'utf-8');

        // Display a message indicating successful completion
        console.log('Scraping completed successfully. Data saved in output.txt.');

        // Call the function to add IDs
        agregarIds('output.txt');
    } catch (error) {
        console.error('Error:', error);
        // In case of an error, you can return an empty array or null as needed.
        return [];
    }
}

// Function to add IDs to the scraped data
async function agregarIds(archivo) {
    try {
        // Read the content of the file
        const contenido = await fs.readFile(archivo, 'utf-8');

        // Parse the content as JSON
        const elementos = JSON.parse(contenido);

        // Get the current date
        const fechaActual = new Date();

        // Iterate over the elements and add an 'id' field with date values
        elementos.forEach((elemento, index) => {
            if (index >= 5) { // Exclude the first 5 elements
                const idFecha = new Date(fechaActual);
                idFecha.setDate(idFecha.getDate() + index - 5); // Add days to get different dates

                // Format the date as "yyyyMMdd"
                const idFormatted = idFecha.toISOString().split('T')[0].replace(/-/g, '');

                elemento.id = idFormatted;
            }
        });

        // Write the new array with IDs to the same file
        await fs.writeFile(archivo, JSON.stringify(elementos, null, 2), 'utf-8');

        console.log('IDs successfully added to the file:', archivo);
    } catch (error) {
        console.error('Error adding IDs:', error);
    }
}

// Call the main function
realizarScraping();
