/*const express = require('express');
const axios = require('axios');
const path = require('path');
const cors = require('cors');
const app = express();
const port = 1776;

// Enable CORS for cross-origin requests
app.use(cors());

// Serve static files (HTML, CSS, JS, etc.) from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to fetch the image of Ben Lomond from Wikimedia API
app.get('/ben-lomond-image', async (req, res) => {
    try {
        // Request to the Wikimedia API
        const response = await axios.get('https://en.wikipedia.org/w/api.php', {
            params: {
                action: 'query',
                titles: 'Ben_Lomond',
                prop: 'images',
                format: 'json'
            }
        });

        console.log('API Response:', response.data);


        // Extract image data
      

        const pages = response.data.query.pages;
        const pageId = Object.keys(pages)[0];
        const images = pages[pageId].images;

        if (images && images.length > 0) {
            // Get the first image from the list
        //    const imageName = images[0].title;
        const continueData = response.data.continue;  // Contains the image name in "imcontinue"
        const imageName = continueData.imcontinue;
        const imageParts = imageName.split('|');
        imageJpg = imageParts[1];

        console.log ("imagedata", imageJpg);
        //    const imageUrl = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(imageJpg)}`;
        const imageUrl = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(imageJpg)}`;

            // Send the image URL back to the frontend
            res.json({ imageUrl });
            console.log("what is the imageUrl",imageUrl);
        } else {
            res.status(404).json({ message: 'No images found for Ben Lomond' });
        }
    } catch (error) {
        console.error('Error fetching image:', error);
        res.status(500).json({ message: 'Error fetching image' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});*/

/////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
// server.js
"use strict";
require('dotenv').config();  // Load environment variables from .env
const express = require('express');
const axios = require('axios');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const favicon = require('serve-favicon');  //trying to bring in my own icon
const Mountain = require('./public/Munros');  // Import Mountain model

const app = express();
const port = 1776;

// Enable CORS for cross-origin requests and favicon for icon hopefully
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico'))); 
app.use(cors());

// Serve static files (HTML, CSS, JS, etc.) from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection URI from .env file
const uri = process.env.MONGODB_URI;

// Connect to MongoDB using Mongoose
mongoose.connect(uri)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log("Error connecting to MongoDB:", error));

  ///////
  /*const mongoose = require('mongoose');


require('dotenv').config();

// MongoDB connection URI from .env file
const uri = process.env.MONGODB_URI;

// Connect to MongoDB using Mongoose
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log("Error connecting to MongoDB:", error));

//const Mountain = require('./models/Munros');*/

// Initialize data insertion on first run
async function insertInitialData() {
  try {
    const existingData = await Mountain.find();
    if (existingData.length === 0) {
        console.log("inserting data");
      const result = await Mountain.insertMany([
        { name: "Ben Lomond", 
          gaelic: "Beinn Laomainn", 
          translation: "Beacon Mountain", 
          coordinates: { latitude: 56.1881, longitude: -4.6262 }, 
          height: 3196, 
          comments: "The most southerly Munro. It is one of the most popular hill-walks in Scotland."},

        { name: "Ben Macdui", 
          gaelic: "Beinn MacDuibh",
          translation: "MacDuff's Mountain",
          coordinates: { latitude: 57.0704, longitude: -3.6691 },
          height: 4295,
        comments: "The second highest mountain in Scotland and all of the UK."},

        {name: "Ben Nevis",
          gaelic: "Beinn Nibheis",
          translation: "Venomous Mountain",
          coordinates: { latitude: 56.7969, longitude: -5.0036 },
          height: 4411,
        comments: "The highest mountain in Scotland and all of the UK."},

        {name: "Braeriach", 
          gaelic: "Am Braigh Riabhach",
          translation: "The Brindled Upland",
          coordinates: { latitude: 57.058378, longitude: -3.72578 },
          height: 4252,
        comments: "The third highest mountain in Scotland and all of the UK."},

        {name: "A' Mhaighdean", 
          gaelic: "A'Mhaighdean",
          translation: "The Maiden",
          coordinates: { latitude: 57.7197, longitude: -5.3468 },
          height: 3173,
        comments: "One of the least accessible in northern Scotland."},

        {name: "Ben Lawers", 
          gaelic: "Beinn Labhair",
          translation: "Mountain of the Loud Stream",
          coordinates: { latitude: 56.449, longitude: -4.2209 },
          height: 3983,
        comments: "Water from Ben Lawers is used to generate hydro-electric power."},

        {name: "Aonach Beag", 
          gaelic: "Aonach Beag",
          translation: "Small Ridge",
          coordinates: { latitude: 56.80003, longitude: -4.953 },
          height: 4049,
        comments: "The highest point in the UK made of non-igneous rock, composec mainly of the metamorphic rock schist."},

        {name: "Cairn Toul", 
          gaelic: "Carn an t-Sabhail",
          translation: "Hill of the Barn",
          coordinates: { latitude: 57.0544, longitude: -3.7107 },
          height: 4236,
        comments: "Located in the Cairngorms National Park, the slopes have uncommon artic plants."},

        {name: "Beinn Bhrotain", 
          gaelic: "Beinn Bhrotain",
          translation: "Hill of the Mastiff",
          coordinates: { latitude: 57.0098, longitude: -3.7238 },
          height: 3796,
        comments: "At the edge of Glen Dee, it is named after Brodan, the legandary black hound of the Fingalian Tribe."},

        {name: "Cairn Gorm", 
          gaelic: "An Carn Gorm",
          translation: "The Blue Cairn",
          coordinates: { latitude: 57.1167, longitude: -3.6433 },
          height: 4085,
        comments: "Experienced the highest recorded wind gusts in the UK at 173 mph, making it one of the windest places in the UK."},
       

      ]);
      console.log(`${result.length} mountains inserted.`);
    } else {
      console.log('Data already exists.');
    }
  } catch (error) {
    console.error('Error inserting data:', error);
  }
}

insertInitialData();
/////////

// Route to fetch the image of Ben Lomond from Wikimedia API


// Route to insert data only on the first run
/*console.log("before intial insert");
app.get('/api/insert-initial-data', async (req, res) => {
  try {
    const existingData = await Mountain.find();

    console.log("existing data:", existingData);

    if (existingData.length === 0) {
      // Insert initial mountain data if no data exists
      const result = await Mountain.insertMany([
         { name: "Ben Lomond", 
          gaelic: "Beinn Laomainn", 
          translation: "Beacon Mountain", 
          coordinates: { latitude: 56.1881, longitude: -4.6262 }, 
          height: 3196, 
          comments: "The most southerly Munro. It is one of the most popular hill-walks in Scotland."},

        { name: "Ben Macdui", 
          gaelic: "Beinn MacDuibh",
          translation: "MacDuff's Mountain",
          coordinates: { latitude: 57.0704, longitude: -3.6691 },
          height: 4295,
        comments: "The second highest mountain in Scotland and all of the UK."},

        {name: "Ben Nevis",
          gaelic: "Beinn Nibheis",
          translation: "Venomous Mountain",
          coordinates: { latitude: 56.7969, longitude: -5.0036 },
          height: 4411,
        comments: "The highest mountain in Scotland and all of the UK."},

        {name: "Braeriach", 
          gaelic: "Am Braigh Riabhach",
          translation: "The Brindled Upland",
          coordinates: { latitude: 57.058378, longitude: -3.72578 },
          height: 4252,
        comments: "The third highest mountain in Scotland and all of the UK."},

        {name: "A'Mhaighdean", 
          gaelic: "A'Mhaighdean",
          translation: "The Maiden",
          coordinates: { latitude: 57.7197, longitude: -5.3468 },
          height: 3173,
        comments: "One of the least accessible in northern Scotland."},

        {name: "Ben Lawers", 
          gaelic: "Beinn Labhair",
          translation: "Mountain of the Loud Stream",
          coordinates: { latitude: 56.449, longitude: -4.2209 },
          height: 3983,
        comments: "Water from Ben Lawers is used to generate hydro-electric power."},

        {name: "Aonach Beag", 
          gaelic: "Aonach Beag",
          translation: "Small Ridge",
          coordinates: { latitude: 56.80003, longitude: -4.953 },
          height: 4049,
        comments: "The highest point in the UK made of non-igneous rock, composec mainly of the metamorphic rock schist."},

        {name: "Cairn Toul", 
          gaelic: "Carn an t-Sabhail",
          translation: "Hill of the Barn",
          coordinates: { latitude: 57.0544, longitude: -3.7107 },
          height: 4236,
        comments: "Located in the Cairngorms National Park, the slopes have uncommon artic plants."},

        {name: "Beinn Bhrotain", 
          gaelic: "Beinn Bhrotain",
          translation: "Hill of the Mastiff",
          coordinates: { latitude: 57.0098, longitude: -3.7238 },
          height: 3796,
        comments: "At the edge of Glen Dee, it is named after Brodan, the legandary black hound of the Fingalian Tribe."},

        {name: "Cairn Gorm", 
          gaelic: "An Carn Gorm",
          translation: "The Blue Cairn",
          coordinates: { latitude: 57.1167, longitude: -3.6433 },
          height: 4085,
        comments: "Experienced the highest recorded wind gusts in the UK at 173 mph, making it one of the windest places in the UK."},
       

      ]);
      res.status(200).json({ message: `${result.length} mountains inserted.` });
    } else {
      res.status(200).json({ message: 'Data already exists.' });
    }
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ message: 'Error inserting data' });
  }
});*/



app.get('/munro-image', async (req, res) => {
  try {

    const { name } = req.query;
    console.log("name of moutain for query:",name);
    console.log(typeof name);
    if (!name) {
      return res.status(400).json({ message: 'Mountain name is required' });
    }
      // Request to the Wikimedia API
      const response = await axios.get('https://en.wikipedia.org/w/api.php', {
          params: {
              action: 'query',
              titles: name,
              prop: 'pageimages',
              pithumbsize: 500,
              format: 'json'
          }
      });

      console.log('API Response:', response.data);

      // Extract image data
      const pages = response.data.query.pages;
      const pageId = Object.keys(pages)[0];
      const images = pages[pageId].images;

      if (pages[pageId] && pages[pageId].thumbnail) {
        const thumbnailUrl = pages[pageId].thumbnail.source; // The URL for the thumbnail image
        console.log("Main Thumbnail Image URL:", thumbnailUrl);
        let imageUrl = thumbnailUrl;
        // Send the image URL back to the frontend
        res.json({ imageUrl });
        console.log("what is the imageUrl", imageUrl);
       // return imageUrl;

    //  if (images && images.length > 0) {

            // Check if we have any images
  /*  if (images && images.length > 0) {
      let imageName = null;
      let validImages = [];*/

      // Loop through all images and pick the most likely main image (you can adjust the logic here)
    /*  for (let i = 0; i < images.length; i++) {
        const image = images[i];
        const validImageExtensions = ['.jpg', '.jpeg', '.png', '.gif', ];

        const imageExtension = image.title.slice(-4).toLowerCase(); // Get last 4 chars (e.g., '.jpg', '.png')
        console.log("extension is",imageExtension,image.title);


        //get only picture images
        if (validImageExtensions.includes(imageExtension)) {
           imageName = image.title;

           //get a better image if it is main or thumbnail or icon and leave loop

         // if (image.title.includes("main") || image.title.includes("thumbnail") || image.title.includes("icon")){
         //     imageName = image.title;
          break; 
        }
      }
        // If no preferred image found, use the first image
        if (!imageName) {
          imageName = image.title;
        }
      
    

      if (imageName) {
        console.log("Chosen Image:", imageName);
      }
    
        /*  const continueData = response.data.continue;  // Contains the image name in "imcontinue"
          const imageName = continueData.imcontinue;
          const imageParts = imageName.split('|');
          const imageJpg = imageParts[1];

          console.log ("imagedata", imageJpg);*/
         /* const imageUrl = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(imageName)}`;
          console.log("what is wrong with my url?",imageUrl);

          // Send the image URL back to the frontend
          res.json({ imageUrl });
          console.log("what is the imageUrl", imageUrl);*/
      } else {
          res.status(404).json({ message: 'No images found for the Munro' });
      }
  } catch (error) {
      console.error('Error fetching image:', error);
      res.status(500).json({ message: 'Error fetching image' });
  }
});

// Route to fetch all munro data and store in an array for dropdown population and use later
app.get('/api/mountains', async (req, res) => {
try {
  const mountains = await Mountain.find();  // Fetch all mountains from the database
  res.status(200).json(mountains);  // Return all mountain data as JSON
} catch (error) {
  console.error('Error fetching mountains:', error);
  res.status(500).json({ message: 'Error fetching mountains' });
}
});

console.log ("api key", process.env.API_KEY);
////////////WEATHER DATA ////////////////////////////////////
/*async function getWeatherData(latitude, longitude) {
 
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.API_KEY}
`;
console.log ("url-",url);
  try {
    const response = await fetch(url);
    const data = await response.json();
console.log ("after fetch", data.cod);
    if (data.cod === 200) {
      // If the request is successful, display the weather data
      const weather = data.weather[0].description;
      const temperature = data.main.temp;
      const humidity = data.main.humidity;

      console.log(`Weather: ${weather}`);
      console.log(`Temperature: ${temperature}°C`);
      console.log(`Humidity: ${humidity}%`);
  } else {
      console.error('Failed to fetch weather data:', data.message);
  }
} catch (error) {
  console.error('Error fetching weather data:', error);
}
}

app.get("/api/getWeather", (request, response) => {
  getWeatherData(latitude,longitude).then((weather) => {
    response.status(200).json({
      status: 200,
      data: weather,
    });
  });
});

////////////////////////////////////////////////////////*/

/////////////////////////////////////////////////////
console.log ("api key", process.env.API_KEY);
async function getWeatherData(latitude, longitude) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&unit=metrics&appid=${process.env.API_KEY}`;
  console.log("URL:", url);

  try {
    const response = await fetch(url);
    const rawBody = await response.text(); // Raw response body as text
    console.log("Response Status:", response.status);
    console.log("Response Body:", rawBody); // Log the raw body
    
    
    // Now parse the body as JSON
    const weatherResponse = JSON.parse(rawBody);
   
    console.log("Fetched data:", weatherResponse);
    console.log("vis and name",weatherResponse.visibility,weatherResponse.name);
    ///////////////////////////
   // const weatherResponse = await response.json();
  //  console.log("Response Status:", response.status);
//console.log("Response Body:", await response.text()); // Raw response

  //  console.log("Fetched data:", weatherResponse);
    
    if (weatherResponse.cod === 200) {
     
      return {
         // If the request is successful, display the weather data
    
        weather: weatherResponse.weather[0].description,
        iconCode: weatherResponse.weather[0].icon,
        temperature: weatherResponse.main.temp,
        humidity: weatherResponse.main.humidity,
        visibility: weatherResponse.visibility,    //meters
        name: weatherResponse.name,
        sunrise: weatherResponse.sys.sunrise,     //unix UTC time stamps
        sunset: weatherResponse.sys.sunset,       //unix UTC time stamps
        timezone: weatherResponse.timezone

    
      };
    } else {
      console.error('Failed to fetch weather data:', weatherResponse.message);
      return { error: weatherResponse.message };
    }
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return { error: error.message };
  }
  
}

// Express route to handle the API request
app.get("/api/getWeather", async (req, res) => {
  const { lat, lon } = req.query; // Get lat and lon from the query parameters
  
  if (!lat || !lon) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }

  try {
    const weatherData = await getWeatherData(lat, lon);
    res.status(200).json({
      status: 200,
   //   data: weatherData,
   weatherResponse: weatherData,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      error: 'Error fetching weather data',
    });
  }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    console.log("Press Ctrl+C to end this process.");
});

