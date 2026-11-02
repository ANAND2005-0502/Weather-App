<div id="weatherIcon" class="weather-icon">🌤️</div>

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const weatherIcon = document.getElementById("weatherIcon");
const error = document.getElementById("error");

// Weather condition codes
function getWeather(code) {
    if (code === 0) return ["Clear Sky", "☀️"];
    if (code <= 3) return ["Partly Cloudy", "⛅"];
    if (code <= 48) return ["Foggy", "🌫️"];
    if (code <= 57) return ["Drizzle", "🌦️"];
    if (code <= 67) return ["Rainy", "🌧️"];
    if (code <= 77) return ["Snowy", "❄️"];
    if (code <= 82) return ["Rain Showers", "🌦️"];
    if (code <= 86) return ["Snow Showers", "🌨️"];
    if (code <= 99) return ["Thunderstorm", "⛈️"];

    return ["Unknown", "🌡️"];
}

// Fetch weather data
async function getWeatherData(city) {
    if (!city.trim()) {
        error.innerText = "Please enter a city name!";
        return;
    }

    try {
        error.innerText = "Loading weather...";

        // Find city coordinates
        const geoURL =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

        const geoResponse = await fetch(geoURL);
        if (!geoResponse.ok) throw new Error("Network error");

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("City not found!");
        }

        const place = geoData.results[0];

        // Get live weather
        const weatherURL =
            `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`;

        const weatherResponse = await fetch(weatherURL);
        if (!weatherResponse.ok) throw new Error("Weather unavailable");

        const weatherData = await weatherResponse.json();
        const current = weatherData.current;

        const [weatherText, icon] = getWeather(current.weather_code);

        // Display data
        cityName.innerText = place.name + ", " + place.country;
        temperature.innerText = Math.round(current.temperature_2m) + "°C";
        condition.innerText = weatherText;
        humidity.innerText = current.relative_humidity_2m + "%";
        wind.innerText = current.wind_speed_10m + " km/h";
        weatherIcon.innerText = icon;

        error.innerText = "";

    } catch (err) {
        error.innerText = err.message;
    }
}

// Search button
searchBtn.addEventListener("click", function() {
    getWeatherData(cityInput.value);
});

// Enter key
cityInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        getWeatherData(cityInput.value);
    }
});

// Default city
getWeatherData("Delhi");
