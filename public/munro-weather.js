// munro-weather.js
"use strict";

// Parse the query string from the URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}


// Function to fetch the image of the Munro from the backend i.e. server.js
async function fetchImage() {
    try {
       //
       //  const response = await fetch('/munro-image'); // Ensure this URL is correct and the endpoint is available
       const nameOfMunro = getQueryParam('name');
       console.log("name of munro",nameOfMunro);
       const response = await fetch(`/munro-image?name=${nameOfMunro}`);
        const data = await response.json();
console.log("in munro detail",data.imageUrl);
        if (data.imageUrl) {
            const img = document.createElement('img');
            img.src = data.imageUrl;
            img.alt = 'Munro Image';
            img.classList.add('munro-image');

            const imageContainer = document.getElementById('image-container');
            imageContainer.innerHTML = ''; // Clear any existing content
            imageContainer.appendChild(img);
        } else {
            console.log('No image found');
        }
    } catch (error) {
        console.error('Error fetching image:', error);
        document.getElementById('image-container').innerHTML = '<p>Error fetching image.</p>';
    }
};

let latitude = 56.1881;
let longitude = -4.6262;
/////////////////////////
async function getWeatherData(latitude,longitude) {
    const url = `http://localhost:1776/api/getWeather?lat=${latitude}&lon=${longitude}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      console.log("in munro detail weather",data);
      if (data && data.weatherResponse) {
        
        const weather = data.weatherResponse.weather;
        //is it truthy?
        const iconCode = data.weatherResponse.iconCode;
console.log("icon",iconCode);
       // const iconCode = data.weatherResponse.weather.icon;
        const temperatureKelvin = data.weatherResponse.temperature;
        const humidity = data.weatherResponse.humidity;
        ///////////////
          // Build the URL for the weather icon
      //    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;
            
          // Display the icon in an <img> element
      //   const weatherIcon = document.getElementById('weather-icon');
      //    weatherIcon.src = iconUrl;
      //    weatherIcon.alt = data.weatherResponse.weather;
        const kelvinTemp = temperatureKelvin; 
console.log(temperatureKelvin);
// Function to fetch and display the weather icon
function displayWeatherIcon(iconCode, weatherDescription) {
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

    const weatherIcon = document.getElementById('weather-icon');
    
    // Check if the element exists before updating
    if (weatherIcon) {
        weatherIcon.src = iconUrl; // Set the src to display the icon
        weatherIcon.alt = `${weatherDescription} icon`; // Provide more context for the alt text
    } else {
        console.error('Weather icon element not found.');
    }
}




        

// Convert to Celsius and Fahrenheit
const celsius = kelvinToCelsius(kelvinTemp);
const fahrenheit = kelvinToFahrenheit(kelvinTemp);

// Output the result
console.log(`Temperature in Celsius: ${celsius.toFixed(2)}°C`);
console.log(`Temperature in Fahrenheit: ${fahrenheit.toFixed(2)}°F`);

        // Display the weather data in the HTML
        document.getElementById('weatherDesc').textContent = `Weather: ${weather}`;
        document.getElementById('temperatureCelsius').textContent = `Temperature: ${celsius.toFixed(2)}°C`;
        document.getElementById('temperatureFahrenheit').textContent = `Temperature: ${fahrenheit.toFixed(2)}°F`;
        document.getElementById('humidity').textContent = `Humidity: ${humidity}%`;
        displayWeatherIcon(iconCode, data.weatherResponse.weather);
    } else {
        document.getElementById('errorMessage').textContent = "Error: Could not fetch weather data.";
    }
    } catch (error) {
      console.log(error);
    }
  }
  // Function to convert Kelvin to Celsius
function kelvinToCelsius(kelvin) {
    return kelvin - 273.15;
}

// Function to convert Kelvin to Fahrenheit
function kelvinToFahrenheit(kelvin) {
    return (kelvin - 273.15) * 9/5 + 32;
}



  
 // getWeatherData(latitude, longitude);
  /////////////////////////////////////

window.onload = async () => {
    console.log("in window munro load");
    // Use the query parameters on munro-detail.html
    const name = getQueryParam('name');
    const latitude = getQueryParam('latitude');
    const longitude = getQueryParam('longitude');
    const temperature = getQueryParam('temperature');
    const weatherDesc = getQueryParam('weatherDesc');
    const humidity = getQueryParam('humidity');
    console.log("??what, in weather page??", name, latitude);

    if (name && latitude && longitude) {
        // Display the mountain details on the page
        document.getElementById('mountain-name').textContent = `Mountain Name: ${name}`;
        document.getElementById('coordinates').textContent = `Coordinates: Latitude: ${latitude}, Longitude: ${longitude}`;
    
        console.log("data in detail=", latitude, longitude);
        await getWeatherData(latitude, longitude);
    } else {
        // If no data is found, show an error message
        document.getElementById('mountain-data').innerHTML = '<p>Error: Mountain data not found.</p>';
    }

    //document.getElementById('weather-data').textContent= `weather ${weather}`;

  //  await fetchMountainData(); // Load mountain data
    await fetchImage(); // Load Munro image

    function goToWeatherPage() {
        const name = getQueryParam('name');
        const latitude = getQueryParam('latitude');
        const longitude = getQueryParam('longitude');
    
        // Build the URL to pass the parameters to the weather page
        const url = `munro-weather.html?name=${encodeURIComponent(name)}&latitude=${encodeURIComponent(latitude)}&longitude=${encodeURIComponent(longitude)}&temperature=${encodeURIComponent(weatherData.temperature)}&weatherDesc=${encodeURIComponent(weatherData.weatherDesc)}&humidity=${encodeURIComponent(weatherData.humidity)}`;
        
        // Redirect to the weather page with the parameters
        window.location.href = url;
    }
    
};
console.log("in munro weather");
/*window.onload = function() {
    // Get the query parameter from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const mountainName = urlParams.get('name');

    if (mountainName) {
        // Display the mountain name
        document.getElementById('mountain-name').textContent = `Mountain: ${mountainName}`;
    } else {
        document.getElementById('mountain-name').textContent = "Mountain not found.";
    }
};*/


