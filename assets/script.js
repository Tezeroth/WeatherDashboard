

// Get the search button element
const searchButton = document.getElementById('search-button');

// Get the search input element
const searchInput = document.getElementById('search-input');

// Add event listener to the search button
searchButton.addEventListener('click', function(event) {
    event.preventDefault(); // Prevent page refresh

    // Get the city name from the search input
    var city = searchInput.value;

    // Make API call to OpenWeatherMap
    const apiKey = '46bf27ee4a6615f3d91fa9948c938df9';
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // Extract the temperature, wind, and humidity from the API response
            const temperature = data.main.temp;
            const wind = data.wind.speed;
            const humidity = data.main.humidity;

            // Display the temperature, wind, and humidity in the console
            console.log(`Temperature: ${temperature} K`);
            console.log(`Wind: ${wind} m/s`);
            console.log(`Humidity: ${humidity}%`);
        })
        .catch(error => {
            console.error('Error:', error);
        });
});



var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=46bf27ee4a6615f3d91fa9948c938df9";
