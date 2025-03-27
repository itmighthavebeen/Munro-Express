// munro-detail.js
"use strict";

// Parse the query string from the URL
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}
var fahrenheit = 0.0;
var celsius = 0.0;
var weatherDesc = " ";
var humidity = 0;
var visibility = 0;
var nearestTown = " ";
var sunrise,
  sunset = 0;
var scrapedImage = " ";
var iconCode = " ",
  iconUrl = " ";

// Function to fetch the image of the Munro from the backend i.e. server.js
// To get different pictures, get the thumbnail and the next valid pages picure using Cheerio
// These are creative commons images

async function fetchImage() {
  try {
    const nameOfMunro = getQueryParam("name");

    console.log("name of munro", nameOfMunro);

    const response = await fetch(`/munro-image?name=${nameOfMunro}`);
    const data = await response.json();
    const thumbnail = data.imageUrls.find(
      (img) => img.type === "thumbnail"
    ).url;
    scrapedImage = data.imageUrls.find((img) => img.type === "scraped").url;

    if (thumbnail) {
      const img = document.createElement("img");

      img.src = thumbnail;
      let imageDescription = "Image of the Munro" + nameOfMunro;
      img.alt = imageDescription;
      img.classList.add("munro-image");

      const imageContainer = document.getElementById("image-container");
      imageContainer.innerHTML = ""; // Clear any existing content
      imageContainer.appendChild(img);
    } else {
      console.log("No image found");
    }
  } catch (error) {
    console.error("Error fetching image:", error);
    document.getElementById("image-container").innerHTML =
      "<p>Error fetching image.</p>";
  }
}
//
//Function to convert the Sunrise and Sunset times
//
function unixTimeToDateTime(unixTimestamp) {
  const dateObj = new Date(unixTimestamp * 1000); // Convert to milliseconds

  const year = dateObj.getUTCFullYear();
  const month = dateObj.getUTCMonth() + 1; // Month is 0-indexed, so add 1
  const day = dateObj.getUTCDate();
  let hours = dateObj.getUTCHours();
  const minutes = dateObj.getUTCMinutes();
  const seconds = dateObj.getUTCSeconds();

  // Determine AM/PM
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12; // Convert 24-hour time to 12-hour format
  hours = hours ? hours : 12; // Handle case where 0 becomes 12 for midnight
  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes; // Add leading zero for minutes if necessary
  const formattedSeconds = seconds < 10 ? "0" + seconds : seconds; // Add leading zero for seconds if necessary

  // Return formatted date and time in 12-hour format with AM/PM
  return `${month}/${day}/${year} ${hours}:${formattedMinutes}:${formattedSeconds} ${ampm} GMT`;
}

//
// API call to weather api for info given latitude and longitude from store MongoDB
//
async function getWeatherData(latitude, longitude) {
  const url = `http://localhost:1776/api/getWeather?lat=${latitude}&lon=${longitude}`;
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data && data.weatherResponse) {
      const weather = data.weatherResponse.weather;
      const humidityData = data.weatherResponse.humidity;
      nearestTown = data.weatherResponse.name;
      visibility = data.weatherResponse.visibility;
      sunrise = data.weatherResponse.sunrise;
      sunset = data.weatherResponse.sunset;

      //is it truthy?
      iconCode = data.weatherResponse.iconCode;
      console.log("icon code", iconCode);
      console.log("type of ", typeof iconCode);

      const temperatureKelvin = data.weatherResponse.temperature;

      // Build the URL for the weather icon
      iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

      const kelvinTemp = temperatureKelvin;

      // Convert to Celsius and Fahrenheit
      celsius = kelvinToCelsius(kelvinTemp);
      fahrenheit = kelvinToFahrenheit(kelvinTemp);

      weatherDesc = weather;
      humidity = humidityData;

      const unixTimestamp_rise = sunrise; //UTC from openweather api so need to convert
      const dateTimeStr_rise = unixTimeToDateTime(unixTimestamp_rise);

      let unixTimestamp_set = sunset; //UTC from openweather api so need to convert
      const dateTimeStr_set = unixTimeToDateTime(unixTimestamp_set);

      //Set HTML values and dynamically add data

      document.getElementById("sunsetName").textContent = ` ${dateTimeStr_set}`;
      const sunrisElement = document.getElementById("sunrise");
      const sunriseDataElement = document.createElement("span");
      sunriseDataElement.textContent = ` ${dateTimeStr_rise}`;
      sunrisElement.appendChild(sunriseDataElement);

      document.getElementById(
        "townName"
      ).textContent = `${nearestTown}, Scotland`;
    } else {
      document.getElementById("errorMessage").textContent =
        "Error: Could not fetch weather data.";
    }
  } catch (error) {
    console.log(error);
  }
}
//
// Function to convert Kelvin to Celsius
//
function kelvinToCelsius(kelvin) {
  return kelvin - 273.15;
}
//
// Function to convert Kelvin to Fahrenheit
//
function kelvinToFahrenheit(kelvin) {
  return ((kelvin - 273.15) * 9) / 5 + 32;
}
//
//set url for passing paramemters
//
function goToWeatherPage() {
  const name = getQueryParam("name");
  const latitude = getQueryParam("latitude");
  const longitude = getQueryParam("longitude");

  if (
    fahrenheit !== undefined &&
    weatherDesc !== undefined &&
    humidity !== undefined &&
    scrapedImage !== undefined &&
    iconCode !== undefined
  ) {
    // Build the URL to pass the parameters to the weather page
    const url = `munro-weather.html?name=${encodeURIComponent(
      name
    )}&latitude=${encodeURIComponent(latitude)}&longitude=${encodeURIComponent(
      longitude
    )}&temperature_F=${encodeURIComponent(
      fahrenheit
    )}&temperature_C=${encodeURIComponent(
      celsius
    )}&weatherDesc=${encodeURIComponent(
      weatherDesc
    )}&humidity=${encodeURIComponent(
      humidity
    )}&scrapedImage=${encodeURIComponent(
      scrapedImage
    )}&iconUrl=${encodeURIComponent(iconUrl)}&iconCode=${encodeURIComponent(
      iconCode
    )}`;

    // Redirect to the weather page with the parameters
    window.location.href = url;
  } else {
    console.error("Weather data is not available.");
  }
}

window.onload = async () => {
  // Use the query parameters to get passed info
  const name = getQueryParam("name");
  const latitude = getQueryParam("latitude");
  const longitude = getQueryParam("longitude");
  const gaelic = getQueryParam("gaelic");
  const translation = getQueryParam("translation");
  const comments = getQueryParam("comments");
  const height = getQueryParam("height");

  if (name && latitude && longitude) {
    // Display the mountain details on the page
    document.getElementById("munroName").textContent = `${name}`;
    document.getElementById("gaelicName").textContent = ` ${gaelic}`;
    document.getElementById("translationName").textContent = ` ${translation}`;
    document.getElementById("factName").textContent = ` ${comments}`;
    document.getElementById(
      "coordinatesName"
    ).textContent = ` Latitude: ${latitude}, Longitude: ${longitude}`;
    document.getElementById("heightName").textContent = ` ${height} feet`;

    await getWeatherData(latitude, longitude);
  } else {
    // If no data is found, show an error message
    document.getElementById("mountain-data").innerHTML =
      "<p>Error: Mountain data not found.</p>";
  }

  await fetchImage(); // Load Munro image
};
