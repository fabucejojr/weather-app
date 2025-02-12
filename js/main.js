const csvFilePath = fetch('/city_coordinates.csv'); // Ensure the file is correctly placed

async function loadCity_Coordinates() {
    try {
        //const response = await fetch(csvFilePath);
        const response = await fetch('city_coordinates.csv');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const csvText = await response.text();
        console.log("CSV Content:", csvText);

        const rows = csvText.trim().split('\n').slice(1); // Skip header row
        console.log("Raw CSV Rows:");

        const city_coordinates = rows.map(row => {
            const columns = row.split(',').map(col => col.trim()); // Trim extra spaces

            // Ensure all 4 columns exist before proceeding
            if (columns.length < 4 || !columns[0] || !columns[1] || !columns[2] || !columns[3]) {
                console.warn("Skipping invalid row:", columns);
                return null; // Ignore incomplete rows
            }

            const [lat, lon, city, country] = columns;
            return { lat: parseFloat(lat), lon: parseFloat(lon), city, country };
        }).filter(Boolean); // Remove null values

        console.log("Parsed City Data:", city_coordinates);
        return city_coordinates;
    } catch (error) {
        console.error("Error loading city coordinates:", error);
        return [];
    }

    // return parseCSV(csvText);
    // const rows = csvText.split('\n').slice(1); // Skip header row
    // const city_coordinates = rows.map(row => {
    //     const columns = row.trim().split(',');
    //     if (columns.length < 4) return null;
    //     const [lat, lon, city, country] = columns.map(col => col.trim());
    //     if (isNaN(parseFloat(lat)) || isNaN(parseFloat(lon)) || !city || !country) return null;
    //     return { lat: parseFloat(lat), lon: parseFloat(lon), city, country };
    // }).filter(Boolean);
    // return city_coordinates;
    //     } catch (error) {
    //         console.error('Error loading city coordinates:', error);
    //         return [];
    //     }
    // }

async function populateDropdown() {
    console.log("Running populateDropdown()...");

    const city_coordinates = await loadCity_Coordinates();
    console.log("Loaded Cities for Dropdown:", city_coordinates);

    const dropdown = document.getElementById('citySelected'); // Ensure this ID matches the HTML
    if (!dropdown) {
        console.error('Dropdown element not found!');
        return;
    }

    dropdown.innerHTML = '<option value="">Select a city</option>';

    city_coordinates.forEach(({ city }, index) => {
        console.log(`Adding city: ${city}`); // Debug each city added

        const option = document.createElement('option');
        option.value = index; // Reference city later
        option.textContent = city;
        dropdown.appendChild(option);
    });

    console.log("Dropdown populated successfully!");
    };
};
