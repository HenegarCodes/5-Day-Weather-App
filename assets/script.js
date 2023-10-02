$(document).ready(function() {
function fetchCurrentWeather(city) {

//api key and url links 
    var apiKey = 'aecc33e1f3ac606321129d5660f649cb';
    var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

//fetch that will get thes repsonse form api and utlize it as json
    fetch(apiUrl) 
    .then((reponse) => Response.json())
    .then((data) =>{
        //this gets the current weather data we need
        var city = data.name
        var date = new Date(data.dt *1000).toLocaleDateString();
        var iconUrl = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
        var temperature = data.main.temp;
        var humidity = data.main.humidity;
        var windSpeed = data.wind.speed;

        document.getElementById('city').textContent = city;
        document.getElementById('date').textContent = date;
        document.getElementById('weather').src = iconUrl;
        document.getElementById('temperature').textContent = `${temperature}°C`;
        document.getElementById('humidity').textContent = `${humidity}%`;
        document.getElementById('wind-speed').textContent = `${windSpeed} m/s`;

    })

}

}














})aecc33e1f3ac606321129d5660f649cb
