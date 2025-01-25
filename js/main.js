const csvFilePath = 'city_coordinates.csv'; // Replace with your actual .csv file path

// Base URL for 7timer API
const apiEndpoint = 'http://www.7timer.info/bin/astro.php?lon=113.17&lat=23.09&ac=0&lang=en&unit=metric&output=internal&tzshift=0';

// Function to fetch and parse CSV file
async function loadCity_Coordinates() {
    const response = await fetch(csvFilePath);
    const csvText = await response.text();
    const rows = csvText.split('\n').slice(1); // Skip header row
    const city_coordinates = rows.map(row => {
        const [lat, lon, city, country] = row.split(',');
        return { lat: parseFloat(lat), lon: parseFloat(lon), city, country };
    });
    return city_coordinates;
}

// Populate dropdown with city_coordinates
async function populateDropdown() {
    const city_coordinates = await loadCity_Coordinates();
    const dropdown = document.getElementById('city-dropdown');
    city_coordinates.forEach(({ city }, index) => {
        const option = document.createElement('option');
        option.value = index; // Use index to reference city later
        option.textContent = city;
        dropdown.appendChild(option);
    });
}

// Handle form submission
document.getElementById('weather-form').addEventListener('submit', async event => {
    event.preventDefault();
    const selectedIndex = document.getElementById('city-dropdown').value;
    if (selectedIndex === '') return;

    const city_coordinates = await loadCity_Coordinates();
    const { lat, lon, city, country } = city_coordinates[selectedIndex];

    // Fetch weather data from 7timer API
    const weatherResponse = await fetch(
        `${apiEndpoint}?lon=${lon}&lat=${lat}&product=civillight&output=json`
    );
    const weatherData = await weatherResponse.json();

    // Display weather information
    const weatherResult = document.getElementById('weather-result');
    if (weatherResponse.ok) {
        const forecast = weatherData.dataseries;
        weatherResult.innerHTML = `<h2>7-Day Weather Forecast for ${city}</h2>`;
        forecast.forEach(day => {
            const date = new Date(day.date.toString().slice(0, 4), day.date.toString().slice(4, 6) - 1, day.date.toString().slice(6));
            weatherResult.innerHTML += `
                <div class="weather-day">
                    <span>${date.toDateString()}</span>
                    <span>${day.temp2m.min}°C / ${day.temp2m.max}°C</span>
                    <span>${day.weather}</span>
                </div>
            `;
        });
    } else {
        weatherResult.innerHTML = `<p>Error: Unable to fetch weather data.</p>`;
    }
});

// Load and populate city_coordinates on page load
populateDropdown();
