$(document).ready(function() {
    var apiKey = 'aecc33e1f3ac606321129d5660f649cb'; 
    var searchForm = $('#searchForm');
    var searchInput = $('#searchInput');
    var searchHistory = $('#search-history');
    var currentWeather = $('#currentWeather');
    var forecastWeather = $('#forecastWeather');

    // Function to fetch weather data from OpenWeatherMap API
    function fetchWeatherData(cityName, callback) {
        var weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;
        $.getJSON(weatherUrl, callback);
    }

    // fetch 5-day forecast data from OpenWeatherMap API
    function fetchForecastData(cityName, callback) {
        var forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`;
        $.getJSON(forecastUrl, callback);
    }

    // Function to display current weather data
    function displayCurrentWeather(data) {
        var cityName = data.name;
        var date = dayjs.unix(data.dt).format('MMMM D, YYYY');
        var iconCode = data.weather[0].icon;
        var temperature = (data.main.temp - 273.15).toFixed(2); // Kelvin to Celsius
        var humidity = data.main.humidity;
        var windSpeed = data.wind.speed;

        // Create and update HTML elements to display current weather
        var currentWeatherHtml = `
            <h2>${cityName}</h2>
            <p>Date: ${date}</p>
            <p>Temperature: ${temperature} °C</p>
            <p>Humidity: ${humidity}%</p>
            <p>Wind Speed: ${windSpeed} m/s</p>
            <img src="https://openweathermap.org/img/w/${iconCode}.png" alt="Weather Icon">
        `;

        // update weather 
        currentWeather.html(currentWeatherHtml);
    }

    function displayForecast(data) {
        forecastWeather.empty();
    
        // store forecasts by date
        var dailyForecasts = {};
    
        // Loop through the forecast data
        for (let i = 0; i < data.list.length; i++) {
            var forecast = data.list[i];
            var date = dayjs.unix(forecast.dt).format('YYYY-MM-DD');
    
            // Check if a forecast for this date already exists if it doesn't then add it
            if (!dailyForecasts[date]) {
                dailyForecasts[date] = forecast;
            }
        }
    
        // Loop through the daily forecasts and create HTML for each
        for (var date in dailyForecasts) {
            var forecast = dailyForecasts[date];
            var formattedDate = dayjs(forecast.dt_txt).format('MMMM D, YYYY');
            var iconCode = forecast.weather[0].icon;
            var temperature = (forecast.main.temp - 273.15).toFixed(2); // Convert from Kelvin to farenheit
            var humidity = forecast.main.humidity;
            var windSpeed = forecast.wind.speed;
    
            // Create HTML for each daily 
            var forecastHtml = `
                <div class="forecast-item">
                    <p>Date: ${formattedDate}</p>
                    <p>Temperature: ${temperature} °C</p>
                    <p>Humidity: ${humidity}%</p>
                    <p>Wind Speed: ${windSpeed} m/s</p>
                    <img src="https://openweathermap.org/img/w/${iconCode}.png" alt="Weather Icon">
                </div>
            `;
    
            forecastWeather.append(forecastHtml);
        }
    }

    // Function to handle form submission
    searchForm.on('submit', function(event) {
        event.preventDefault();
        var cityName = searchInput.val().trim();

        if (!cityName) {
            return;
        }

        //  display current weather
        fetchWeatherData(cityName, function(currentWeatherData) {
            displayCurrentWeather(currentWeatherData);
        });

        // display 5-day forecast
        fetchForecastData(cityName, function(forecastData) {
            displayForecast(forecastData);
        });

        // searched city is saved to local storage and parsed
        var searchHistoryList = JSON.parse(localStorage.getItem('searchHistory')) || [];
        searchHistoryList.push(cityName);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistoryList));

        updateSearchHistory();
    });

    // update search history
    function updateSearchHistory() {
        var searchHistoryList = JSON.parse(localStorage.getItem('searchHistory')) || [];
        searchHistory.empty();

        for (var cityName of searchHistoryList) {
            var listItem = $('<li>').text(cityName);
            listItem.on('click', function() {
                handleHistoryItemClick(cityName);
            });
            searchHistory.append(listItem);
        }
    }

    // click previously searched city
    function handleHistoryItemClick(cityName) {
        // Fcurrent weather for city clicked
        fetchWeatherData(cityName, function(currentWeatherData) {
            displayCurrentWeather(currentWeatherData);
        });

        // display 5-day forecast
        fetchForecastData(cityName, function(forecastData) {
            displayForecast(forecastData);
        });
    }
    updateSearchHistory();
});
