document.addEventListener('DOMContentLoaded', function() {
    // Get the search button element
    const searchButton = document.getElementById('search-button');

    // Get the search input element
    const searchInput = document.getElementById('search-input');

    // Add event listener to the search button
    searchButton.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent page refresh

        // Get the city name from the search input
        const city = searchInput.value;

        // Check if the city is empty or undefined
        if (!city) {
            console.error('City is not defined or empty');
            return; // Exit the function if city is not defined
        }

        // Make API call to OpenWeatherMap
        const apiKey = '46bf27ee4a6615f3d91fa9948c938df9';
        const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                // Clear previous data from the screen
                const todayElement = document.querySelector('#today');
                todayElement.innerHTML = '';

                // Clear previouse data from 5day forecast
                                // Clear previous data from the screen
                                const fivedayElement = document.querySelector('#fiveday');
                                todayElement.innerHTML = '';

                // Extract the temperature, wind, and humidity from the API response
                const temperature = data.list[0].main.temp;
                const wind = data.list[0].wind.speed;
                const humidity = data.list[0].main.humidity;

                // Display the city name
                const cityNameElement = document.createElement('h2');
                cityNameElement.textContent = city;
                todayElement.appendChild(cityNameElement);

                // Display the current date
                const currentDate = new Date();
                const dateElement = document.createElement('p');
                dateElement.textContent = currentDate.toDateString();
                todayElement.appendChild(dateElement);

                // Display the temperature
                const temperatureElement = document.createElement('p');
                temperatureElement.textContent = `Temperature: ${temperature} K`;
                todayElement.appendChild(temperatureElement);

                // Display the wind
                const windElement = document.createElement('p');
                windElement.textContent = `Wind: ${wind} m/s`;
                todayElement.appendChild(windElement);

                // Display the humidity
                const humidityElement = document.createElement('p');
                humidityElement.textContent = `Humidity: ${humidity}%`;
                todayElement.appendChild(humidityElement);
            });
    });
});
