// This event listener ensures that the script runs only after the HTML document has been completely loaded and parsed
document.addEventListener('DOMContentLoaded', function() {
    // Get references to the search button, search input field, and history container from the DOM
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');
    const historyContainer = document.getElementById('history');

    // Load search history from local storage or initialize an empty array if no history exists
    const savedCities = JSON.parse(localStorage.getItem('searchHistory')) || [];

    // Function to save the search history to local storage
    const saveToLocalStorage = () => {
        localStorage.setItem('searchHistory', JSON.stringify(savedCities));
    };

    // Function to add a city to the search history and update local storage
    const addToHistory = (city) => {
        // Check if the city is not already in the search history
        if (!savedCities.includes(city)) {
            savedCities.push(city); // Add the city to the search history array
            saveToLocalStorage(); // Update local storage with the updated search history
            createSearchButton(city); // Create and add a search button for the city
        }
    };

    // Function to create a search button for a city and add it to the history container
    const createSearchButton = (city) => {
        const button = document.createElement('button'); // Create a new button element
        button.classList.add('list-group-item', 'list-group-item-action'); // Add classes to the button
        button.textContent = city; // Set the text content of the button to the city name

        // Event listener to handle click on the search button
        button.addEventListener('click', function() {
            searchInput.value = city; // Set the value of the search input field to the city name
            searchButton.dispatchEvent(new Event('click')); // Dispatch a click event on the search button
        });

        historyContainer.appendChild(button); // Append the button to the history container
    };

    // Load saved search history buttons
    savedCities.forEach(city => {
        createSearchButton(city); // Create a search button for each city in the search history
    });

    // Event listener to handle click on the search button
    searchButton.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent the default form submission behavior

        const city = searchInput.value.trim(); // Get the city name from the search input field

        // Check if the city name is not empty
        if (!city) {
            console.error('City is not defined or empty'); // Log an error if the city name is empty
            return; // Exit the function if the city name is empty
        }

        addToHistory(city); // Add the city to the search history

        const apiKey = '46bf27ee4a6615f3d91fa9948c938df9';
        const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

        // Fetch weather forecast data from the OpenWeatherMap API
        fetch(apiUrl)
            .then(response => response.json()) // Parse the JSON response
            .then(data => {
                const todayElement = document.querySelector('#today');
                todayElement.innerHTML = ''; // Clear previous content from the today element

                const cityNameElement = document.createElement('h1');
                cityNameElement.textContent = city; // Display the city name
                todayElement.appendChild(cityNameElement);

                // Display the current date
                const currentDate = new Date();
                const dateElement = document.createElement('h3');
                const formattedDate = currentDate.toLocaleDateString('en-GB');
                dateElement.textContent = `Date: ${formattedDate}`;
                todayElement.appendChild(dateElement);

                // Display temperature, wind speed, and humidity for the current weather
                if (data && data.list) {
                    const temperature = Math.round(data.list[0].main.temp - 273.15); // Convert temperature to Celsius
                    const wind = data.list[0].wind.speed;
                    const humidity = data.list[0].main.humidity;

                    // Create elements to display temperature, wind, and humidity
                    const temperatureElement = document.createElement('h4');
                    temperatureElement.textContent = `Temperature: ${temperature} °C`;
                    todayElement.appendChild(temperatureElement);

                    const windElement = document.createElement('h4');
                    windElement.textContent = `Wind: ${wind} m/s`;
                    todayElement.appendChild(windElement);

                    const humidityElement = document.createElement('h4');
                    humidityElement.textContent = `Humidity: ${humidity}%`;
                    todayElement.appendChild(humidityElement);

                    // Display the weather icon if available
                    if (data.list[0].weather && data.list[0].weather[0].icon) {
                        const weatherIcon = document.createElement('img');
                        weatherIcon.src = `https://openweathermap.org/img/wn/${data.list[0].weather[0].icon}.png`;
                        weatherIcon.alt = data.list[0].weather[0].description;

                        // Dynamically adjust the width of the weather icon based on screen size
                        const screenWidth = window.innerWidth;
                        let iconWidth;

                        if (screenWidth < 768) {
                            iconWidth = '50px'; // Set smaller width for small screens
                        } else {
                            iconWidth = '100px'; // Set larger width for larger screens
                        }

                        weatherIcon.style.width = iconWidth;
                        todayElement.appendChild(weatherIcon); // Append the weather icon to the today element
                    } else {
                        // If weather icon data is not available, clear the weather icon
                        const weatherIcon = document.createElement('img');
                        weatherIcon.style.display = 'none';
                        todayElement.appendChild(weatherIcon);
                    }
                } else {
                    console.error('Error fetching or processing forecast data.'); // Log an error if forecast data is not available
                }

                // Display the five-day forecast
                const fiveDayForecast = document.querySelector('#forecast');
                fiveDayForecast.innerHTML = ''; // Clear previous content from the five-day forecast container

                // Loop through the forecast data for the next five days
                for (let i = 0; i < Math.min(5, data.list.length); i++) {
                    const forecastData = data.list[i];

                    // Create elements to display forecast details
                    const card = document.createElement('div');
                    card.classList.add('col-md-2');

                    const cardBody = document.createElement('div');
                    cardBody.classList.add('card-body');

                    const dayTitle = document.createElement('h5');
                    dayTitle.classList.add('card-title');
                    const forecastDate = new Date();
                    forecastDate.setDate(currentDate.getDate() + i); // Increment date by day index
                    const formattedForecastDate = forecastDate.toLocaleDateString('en-GB');
                    dayTitle.textContent = formattedForecastDate;

                    const dateAboveIcon = document.createElement('p');
                    dateAboveIcon.textContent = formattedForecastDate;
                    cardBody.appendChild(dateAboveIcon);

                    const icon = document.createElement('img');
                    icon.src = `https://openweathermap.org/img/wn/${forecastData.weather[0].icon}.png`;
                    icon.alt = forecastData.weather[0].description;
                    icon.style.width = '50px'; // Set the width of the weather icon
                    cardBody.appendChild(icon);

                    // Display temperature, wind speed, and humidity for each forecast day
                    const temp = document.createElement('p');
                    temp.classList.add('card-text');
                    const temperatureCelsius = Math.round(forecastData.main.temp - 273.15); // Convert temperature to Celsius
                    temp.textContent = `Temp: ${temperatureCelsius} °C`;

                    const wind = document.createElement('p');
                    wind.classList.add('card-text');
                    wind.textContent = `Wind: ${forecastData.wind.speed} m/s`;

                    const humidity = document.createElement('p');
                    humidity.classList.add('card-text');
                    humidity.textContent = `Humidity: ${forecastData.main.humidity}%`;

                    cardBody.appendChild(temp);
                    cardBody.appendChild(wind);
                    cardBody.appendChild(humidity);

                    card.appendChild(cardBody);
                    fiveDayForecast.appendChild(card); // Append the card to the five-day forecast container
                }
            });
    });
});
