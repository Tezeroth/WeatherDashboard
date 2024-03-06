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
        savedCities.push(city);
        saveToLocalStorage();
    };

    // Function to create a search button for a city and add it to the history container
    const createSearchButton = (city) => {
        const button = document.createElement('button');
        button.classList.add('list-group-item', 'list-group-item-action');
        button.textContent = city;

        // Event listener to handle click on the search button
        button.addEventListener('click', function() {
            searchInput.value = city;
            searchButton.dispatchEvent(new Event('click'));
        });

        historyContainer.appendChild(button); // Append the button to the history container
    };

    // Load saved search history buttons
    savedCities.forEach(city => {
        createSearchButton(city);
    });

    // Event listener to handle click on the search button
    searchButton.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent the default form submission behavior

        const city = searchInput.value.trim(); // Get the city name from the search input field

        if (!city) {
            console.error('City is not defined or empty'); // Log an error if the city name is empty
            return;
        }

        // Add the city to the search history
        addToHistory(city);

        // Create and append a search button for the city to the history container
        createSearchButton(city);

        const apiKey = '46bf27ee4a6615f3d91fa9948c938df9';
        const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

        // Fetch weather forecast data from the OpenWeatherMap API
        fetch(apiUrl)
            .then(response => response.json())
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
                fiveDayForecast.innerHTML = '';

                for (let i = 0; i < Math.min(5, data.list.length); i++) {
                    const forecastData = data.list[i];

                    const card = document.createElement('div');
                    card.classList.add('col-md-2');

                    const cardBody = document.createElement('div');
                    cardBody.classList.add('card-body');

                    // Display the date for each forecast day
                    const dayTitle = document.createElement('h5');
                    dayTitle.classList.add('card-title');
                    const forecastDate = new Date();
                    forecastDate.setDate(currentDate.getDate() + i); // Increment date by day index
                    const formattedForecastDate = forecastDate.toLocaleDateString('en-GB');
                    dayTitle.textContent = formattedForecastDate;

                    const dateAboveIcon = document.createElement('p');
                    dateAboveIcon.textContent = formattedForecastDate;
                    cardBody.appendChild(dateAboveIcon);

                    // Display the weather icon for each forecast day
                    const icon = document.createElement('img');
                    icon.src = `https://openweathermap.org/img/wn/${forecastData.weather[0].icon}.png`;
                    icon.alt = forecastData.weather[0].description;
                    icon.style.width = '50px'; // Set the width of the icon
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
