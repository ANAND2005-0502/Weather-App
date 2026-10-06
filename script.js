async function getWeather() {

    const city = document.getElementById("cityInput").value.trim();
    const result = document.getElementById("weatherResult");

    if (city === "") {
        result.innerHTML = `
            <p class="error">Please enter a city name.</p>
        `;
        return;
    }

    try {

        result.innerHTML = `<p>Loading...</p>`;

        // Find city coordinates
        const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            result.innerHTML = `
                <p class="error">City not found!</p>
            `;
            return;
        }

        const location = geoData.results[0];

        const latitude = location.latitude;
        const longitude = location.longitude;

        // Get weather
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`
        );

        const weatherData = await weatherResponse.json();

        const current = weatherData.current;

        result.innerHTML = `
            <h2>${location.name}, ${location.country}</h2>

            <div class="temperature">
                ${current.temperature_2m}°C
            </div>

            <p>💧 Humidity: ${current.relative_humidity_2m}%</p>

            <p>💨 Wind Speed: ${current.wind_speed_10m} km/h</p>

            <p>🌤️ Weather: ${getWeatherDescription(current.weather_code)}</p>
        `;

    } catch (error) {

        result.innerHTML = `
            <p class="error">
                Something went wrong. Please try again.
            </p>
        `;

        console.error(error);
    }
}


function getWeatherDescription(code) {

    if (code === 0) {
        return "Clear Sky ☀️";
    }

    if (code >= 1 && code <= 3) {
        return "Partly Cloudy 🌤️";
    }

    if (code >= 45 && code <= 48) {
        return "Fog 🌫️";
    }

    if (code >= 51 && code <= 67) {
        return "Rain 🌧️";
    }

    if (code >= 71 && code <= 77) {
        return "Snow ❄️";
    }

    if (code >= 80 && code <= 82) {
        return "Rain Showers 🌦️";
    }

    if (code >= 95 && code <= 99) {
        return "Thunderstorm ⛈️";
    }

    return "Unknown Weather";
}