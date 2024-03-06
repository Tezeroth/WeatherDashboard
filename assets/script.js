document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');

    searchButton.addEventListener('click', function(event) {
        event.preventDefault();

        const city = searchInput.value;

        if (!city) {
            console.error('City is not defined or empty');
            return;
        }

        const apiKey = '46bf27ee4a6615f3d91fa9948c938df9';
        const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const todayElement = document.querySelector('#today');
                todayElement.innerHTML = '';

                const cityNameElement = document.createElement('h2');
                cityNameElement.textContent = city;
                todayElement.appendChild(cityNameElement);

                const currentDate = new Date();
                const dateElement = document.createElement('p');
                const formattedDate = currentDate.toLocaleDateString('en-GB');
                dateElement.textContent = `Date: ${formattedDate}`;
                todayElement.appendChild(dateElement);

                if (data && data.list) {
                    const temperature = Math.round(data.list[0].main.temp - 273.15); // Convert temperature to Celsius
                    const wind = data.list[0].wind.speed;
                    const humidity = data.list[0].main.humidity;

                    const temperatureElement = document.createElement('p');
                    temperatureElement.textContent = `Temperature: ${temperature} °C`;
                    todayElement.appendChild(temperatureElement);

                    const windElement = document.createElement('p');
                    windElement.textContent = `Wind: ${wind} m/s`;
                    todayElement.appendChild(windElement);

                    const humidityElement = document.createElement('p');
                    humidityElement.textContent = `Humidity: ${humidity}%`;
                    todayElement.appendChild(humidityElement);

                    const weatherIcon = document.createElement('img');
                    weatherIcon.src = `https://openweathermap.org/img/wn/${data.list[0].weather[0].icon}.png`;
                    weatherIcon.alt = data.list[0].weather[0].description;
                    todayElement.appendChild(weatherIcon);
                } else {
                    console.error('Error fetching or processing forecast data.');
                }

                const fiveDayForecast = document.querySelector('#forecast');
                fiveDayForecast.innerHTML = '';

                for (let i = 0; i < Math.min(5, data.list.length); i++) {
                    const forecastData = data.list[i];

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

                    const icon = document.createElement('img');
                    icon.src = `https://openweathermap.org/img/wn/${forecastData.weather[0].icon}.png`;
                    icon.alt = forecastData.weather[0].description;
                    cardBody.appendChild(icon);

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

                    cardBody.appendChild(dayTitle);
                    cardBody.appendChild(temp);
                    cardBody.appendChild(wind);
                    cardBody.appendChild(humidity);

                    card.appendChild(cardBody);
                    fiveDayForecast.appendChild(card);
                }
            });
    });
});