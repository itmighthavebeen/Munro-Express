// munro-weather.js
"use strict";

// Parse the query string from the URL
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

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
  displayWeatherIcon(iconCode, weatherDesc);

  if (name && latitude && longitude) {
    // Display the mountain details on the page
    document.getElementById("munroName").textContent = ` ${name}`;
    document.getElementById(
      "coordinatesName"
    ).textContent = ` Latitude: ${latitude}, Longitude: ${longitude}`;
  }

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
