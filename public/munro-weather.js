// munro-weather.js
"use strict";

// Parse the query string from the URL
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

/*async function getWeatherData(latitude, longitude) {
  const url = `http://localhost:1776/api/getWeather?lat=${latitude}&lon=${longitude}`;
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data && data.weatherResponse) {
      const weather = data.weatherResponse.weather;
      //is it truthy?
      const iconCode = data.weatherResponse.iconCode;

      const temperatureKelvin = data.weatherResponse.temperature;
      const humidity = data.weatherResponse.humidity;
      const kelvinTemp = temperatureKelvin;

      // Function to fetch and display the weather icon
      function displayWeatherIcon(iconCode, weatherDescription) {
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        const weatherIcon = document.getElementById("weather-icon");

        // Check if the element exists before updating
        if (weatherIcon) {
          weatherIcon.src = iconUrl; // Set the src to display the icon
          weatherIcon.alt = `${weatherDescription} icon`; // Provide more context for the alt text
        } else {
          console.error("Weather icon element not found.");
        }
      }

      // Convert to Celsius and Fahrenheit
      // const celsius = kelvinToCelsius(kelvinTemp);
      // const fahrenheit = kelvinToFahrenheit(kelvinTemp);

      // Display the weather data in the HTML
      document.getElementById("weatherName").textContent = ` ${weather}`;
      document.getElementById("celsiusName").textContent = ` ${celsius.toFixed(
        2
      )}°C`;
      document.getElementById(
        "fahrenheitName"
      ).textContent = ` ${fahrenheit.toFixed(2)}°F`;
      document.getElementById("humidityName").textContent = ` ${humidity}%`;
      displayWeatherIcon(iconCode, data.weatherResponse.weather);
    } else {
      document.getElementById("errorMessage").textContent =
        "Error: Could not fetch weather data.";
    }
  } catch (error) {
    console.log(error);
  }
} */

// Function to convert Kelvin to Celsius
//function kelvinToCelsius(kelvin) {
//  return kelvin - 273.15;
//}

// Function to convert Kelvin to Fahrenheit
//function kelvinToFahrenheit(kelvin) {
//////  return ((kelvin - 273.15) * 9) / 5 + 32;
//}

window.onload = async () => {
  // Use the query parameters on munro-detail.html
  const name = getQueryParam("name");
  const latitude = getQueryParam("latitude");
  const longitude = getQueryParam("longitude");
  const fahrenheit = getQueryParam("temperature_F");
  const celsius = getQueryParam("temperature_C");
  const weatherDesc = getQueryParam("weatherDesc");
  const humidity = getQueryParam("humidity");
  const scrapedImage = getQueryParam("scrapedImage");
  const iconUrl = getQueryParam("iconUrl");
  const iconCode = getQueryParam("iconCode");

  let numberValueF = parseFloat(fahrenheit);
  let numberValueC = parseFloat(celsius);
  console.log("iconCode=", iconCode, typeof iconCode);
  displayWeatherIcon(iconCode, weatherDesc);

  if (name && latitude && longitude) {
    // Display the mountain details on the page
    document.getElementById("munroName").textContent = ` ${name}`;
    document.getElementById(
      "coordinatesName"
    ).textContent = ` Latitude: ${latitude}, Longitude: ${longitude}`;
  }
  //   await getWeatherData(latitude, longitude);
  // } else {
  // If no data is found, show an error message
  //   document.getElementById("mountain-data").innerHTML =
  //    "<p>Error: Mountain data not found.</p>";
  //  }
  // Convert to Celsius and Fahrenheit
  //const temperatureKelvin = temperature;
  //const humidity = humidity;
  // const kelvinTemp = temperatureKelvin;
  // const celsius = kelvinToCelsius(kelvinTemp);
  // const fahrenheit = kelvinToFahrenheit(kelvinTemp);

  // Display the weather data in the HTML
  document.getElementById("weatherName").textContent = ` ${weatherDesc}`;
  document.getElementById("celsiusName").textContent = ` ${numberValueC.toFixed(
    2
  )}°C`;
  document.getElementById(
    "fahrenheitName"
  ).textContent = ` ${numberValueF.toFixed(2)}°F`;
  document.getElementById("humidityName").textContent = ` ${humidity}%`;

  if (scrapedImage) {
    const img = document.createElement("img");
    let imageDescription = "Image of Munro" + name;
    img.src = scrapedImage;
    img.alt = imageDescription;
    img.classList.add("munro-image");

    const imageContainer = document.getElementById(
      "image-container-on-weather"
    );
    imageContainer.innerHTML = "";
    imageContainer.appendChild(img);
  } else {
    console.log("No image found");
  }

  function displayWeatherIcon(iconCode, weatherDescription) {
    console.log("icon code before load", iconCode);
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;
    console.log("weather icon", iconUrl);

    const weatherIcon = document.getElementById("weather-icon");

    // Check if the element exists before updating
    if (weatherIcon) {
      weatherIcon.src = iconUrl; // Set the src to display the icon
      weatherIcon.alt = `${weatherDescription} icon`; // Provide more context for the alt text
    } else {
      console.error("Weather icon element not found.");
    }
  }

  function goToWeatherPage() {
    const name = getQueryParam("name");
    const latitude = getQueryParam("latitude");
    const longitude = getQueryParam("longitude");

    // Build the URL to pass the parameters to the weather page
    const url = `munro-weather.html?name=${encodeURIComponent(
      name
    )}&latitude=${encodeURIComponent(latitude)}&longitude=${encodeURIComponent(
      longitude
    )}&temperature=${encodeURIComponent(
      temperature
    )}&weatherDesc=${encodeURIComponent(
      weatherDesc
    )}&humidity=${encodeURIComponent(humidity)}`;

    // Redirect to the weather page with the parameters
    window.location.href = url;
  }
};
