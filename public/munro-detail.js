// munro-detail.js
"use strict";

// Parse the query string from the URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}
var fahrenheit = 0;
var celsius = 0;
var weatherDesc = " ";
var humidity = 0;
var visibility = 0;
var nearestTown = " ";
var sunrise,sunset = 0;


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
function unixTimeToDateTime(unixTimestamp) {
    const dateObj = new Date(unixTimestamp * 1000); // Convert to milliseconds
  
    const year = dateObj.getUTCFullYear();
    const month = dateObj.getUTCMonth() + 1; // Month is 0-indexed, so add 1
    const day = dateObj.getUTCDate();
    let hours = dateObj.getUTCHours();
    const minutes = dateObj.getUTCMinutes();
    const seconds = dateObj.getUTCSeconds();

    // Determine AM/PM
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12; // Convert 24-hour time to 12-hour format
    hours = hours ? hours : 12; // Handle case where 0 becomes 12 for midnight
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes; // Add leading zero for minutes if necessary
    const formattedSeconds = seconds < 10 ? '0' + seconds : seconds; // Add leading zero for seconds if necessary
  
    // Return formatted date and time in 12-hour format with AM/PM
    return `${month}/${day}/${year} ${hours}:${formattedMinutes}:${formattedSeconds} ${ampm} GMT`;
}

  
async function getWeatherData(latitude,longitude) {
    const url = `http://localhost:1776/api/getWeather?lat=${latitude}&lon=${longitude}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      console.log("in munro detail weather",data);
      if (data && data.weatherResponse) {
        
        const weather = data.weatherResponse.weather;
        const humidityData = data.weatherResponse.humidity;
        nearestTown = data.weatherResponse.name;
        visibility = data.weatherResponse.visibility;
        sunrise = data.weatherResponse.sunrise;
        sunset = data.weatherResponse.sunset;
        
        console.log("name and vis:", nearestTown, visibility,sunrise,sunset);
        //is it truthy?
        const iconCode = data.weatherResponse.iconCode;
console.log("icon",iconCode);
       // const iconCode = data.weatherResponse.weather.icon;
        const temperatureKelvin = data.weatherResponse.temperature;
       // const humidity = data.weatherResponse.humidity;
        ///////////////
          // Build the URL for the weather icon
          const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;
            
          // Display the icon in an <img> element
         // const weatherIcon = document.getElementById('weather-icon');
        //  weatherIcon.src = iconUrl;
        //  weatherIcon.alt = data.weatherResponse.weather;
        const kelvinTemp = temperatureKelvin; 
console.log(temperatureKelvin);

// Convert to Celsius and Fahrenheit
celsius = kelvinToCelsius(kelvinTemp);
fahrenheit = kelvinToFahrenheit(kelvinTemp);
weatherDesc = weather; 
humidity = humidityData;

const unixTimestamp_rise = sunrise; //UTC from openweather api
  const dateTimeStr_rise = unixTimeToDateTime(unixTimestamp_rise);
  let unixTimestamp_set = sunset; //UTC from openweather api
  const dateTimeStr_set = unixTimeToDateTime(unixTimestamp_set);
  console.log("this IS THE DATE TIME:", dateTimeStr_set); 

// Output the result
console.log(`Temperature in Celsius: ${celsius.toFixed(2)}°C`);
console.log(`Temperature in Fahrenheit: ${fahrenheit.toFixed(2)}°F`);
console.log("toen", nearestTown);

        // Display the town and sun data in the HTML
 
        document.getElementById('sunrise').textContent = `Sunrise: ${dateTimeStr_rise}`;
        document.getElementById('sunset').textContent = `Sunset: ${dateTimeStr_set}`;
        document.getElementById('nearestTown').textContent = `Nearest Town: ${nearestTown} Scotland`;
       
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
function goToWeatherPage() {
    const name = getQueryParam('name');
    const latitude = getQueryParam('latitude');
    const longitude = getQueryParam('longitude');
    console.log("values from detail before next page:", fahrenheit, weatherDesc, humidity);

    if (fahrenheit !== undefined && weatherDesc !== undefined && humidity !== undefined) {
    // Build the URL to pass the parameters to the weather page
    const url = `munro-weather.html?name=${encodeURIComponent(name)}&latitude=${encodeURIComponent(latitude)}&longitude=${encodeURIComponent(longitude)}&temperature_F=${encodeURIComponent(fahrenheit)}&weatherDesc=${encodeURIComponent(weatherDesc)}&humidity=${encodeURIComponent(humidity)}`;
    console.log ("in munro detail url for weather page", url);
    
    // Redirect to the weather page with the parameters
    window.location.href = url;
} else {
    console.error("Weather data is not available.");
}

}



  
 // getWeatherData(latitude, longitude);
  /////////////////////////////////////

window.onload = async () => {
    console.log("in window munro load");
    // Use the query parameters on munro-detail.html
    const name = getQueryParam('name');
    const latitude = getQueryParam('latitude');
    const longitude = getQueryParam('longitude');
    const gaelic = getQueryParam('gaelic');
    const translation = getQueryParam('translation');
    const comments = getQueryParam('comments');
    const height = getQueryParam('height');
    console.log("??what??", name, latitude);

    if (name && latitude && longitude) {
        // Display the mountain details on the page
        document.getElementById('mountain-name').textContent = `Mountain Name: ${name}`;
        document.getElementById('gaelic').textContent = `Gaelic Name: ${gaelic}`;
        document.getElementById('translation').textContent = `Gaelic Translation: ${translation}`;
        document.getElementById('comments').textContent = `Interesting Fact: ${comments}`;
        document.getElementById('coordinates').textContent = `Coordinates: Latitude: ${latitude}, Longitude: ${longitude}`;
        document.getElementById('height').textContent = `Height: ${height}`;
    
        console.log("data in detail=", latitude, longitude);
        await getWeatherData(latitude, longitude);
    } else {
        // If no data is found, show an error message
        document.getElementById('mountain-data').innerHTML = '<p>Error: Mountain data not found.</p>';
    }

   
  //  await fetchMountainData(); // Load mountain data
    await fetchImage(); // Load Munro image
};

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


