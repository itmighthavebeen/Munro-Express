"use strict";
require("dotenv").config(); // Load environment variables from .env
const express = require("express");
const axios = require("axios");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const favicon = require("serve-favicon"); //trying to bring in my own icon and it worked!
const Mountain = require("./public/Munros"); // Import Mountain model from Munros.js where it is defined for Mongo DB
const cheerio = require("cheerio"); // Cheerio to scrape image URLs from the page
const app = express();
const port = 1776;

// Enable CORS for cross-origin requests and favicon for icon hopefully
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));
app.use(cors());

// Serve static files (HTML, CSS, JS, etc.) from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// MongoDB connection URI from .env file
const uri = process.env.MONGODB_URI;

// Connect to MongoDB using Mongoose
mongoose
  .connect(uri)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log("Error connecting to MongoDB:", error));

// Initialize data insertion on first run
async function insertInitialData() {
  try {
    const existingData = await Mountain.find();
    if (existingData.length === 0) {
      console.log("inserting data");
      const result = await Mountain.insertMany([
        {
          name: "Ben Lomond",
          gaelic: "Beinn Laomainn",
          translation: "Beacon Mountain",
          coordinates: { latitude: 56.1881, longitude: -4.6262 },
          height: 3196,
          comments:
            "The most southerly Munro. It is one of the most popular hill-walks in Scotland.",
        },

        {
          name: "Ben Macdui",
          gaelic: "Beinn MacDuibh",
          translation: "MacDuff's Mountain",
          coordinates: { latitude: 57.0704, longitude: -3.6691 },
          height: 4295,
          comments:
            "The second highest mountain in Scotland and in all of the UK.",
        },

        {
          name: "Ben Nevis",
          gaelic: "Beinn Nibheis",
          translation: "Venomous Mountain",
          coordinates: { latitude: 56.7969, longitude: -5.0036 },
          height: 4411,
          comments: "The highest mountain in Scotland and all of the UK.",
        },

        {
          name: "Braeriach",
          gaelic: "Am Braigh Riabhach",
          translation: "The Brindled Upland",
          coordinates: { latitude: 57.058378, longitude: -3.72578 },
          height: 4252,
          comments: "The third highest mountain in Scotland and all of the UK.",
        },

        {
          name: "A' Mhaighdean",
          gaelic: "A'Mhaighdean",
          translation: "The Maiden",
          coordinates: { latitude: 57.7197, longitude: -5.3468 },
          height: 3173,
          comments: "One of the least accessible in northern Scotland.",
        },

        {
          name: "Ben Lawers",
          gaelic: "Beinn Labhair",
          translation: "Mountain of the Loud Stream",
          coordinates: { latitude: 56.449, longitude: -4.2209 },
          height: 3983,
          comments:
            "Water from Ben Lawers is used to generate hydro-electric power.",
        },

        {
          name: "Aonach Beag",
          gaelic: "Aonach Beag",
          translation: "Small Ridge",
          coordinates: { latitude: 56.80003, longitude: -4.953 },
          height: 4049,
          comments:
            "The highest point in the UK made of non-igneous rock, composed mainly of the metamorphic rock schist.",
        },

        {
          name: "Cairn Toul",
          gaelic: "Carn an t-Sabhail",
          translation: "Hill of the Barn",
          coordinates: { latitude: 57.0544, longitude: -3.7107 },
          height: 4236,
          comments:
            "Located in the Cairngorms National Park, the slopes have uncommon artic plants.",
        },

        {
          name: "Beinn Bhrotain",
          gaelic: "Beinn Bhrotain",
          translation: "Hill of the Mastiff",
          coordinates: { latitude: 57.0098, longitude: -3.7238 },
          height: 3796,
          comments:
            "At the edge of Glen Dee, it is named after Brodan, the legandary black hound of the Fingalian Tribe.",
        },

        {
          name: "Cairn Gorm",
          gaelic: "An Carn Gorm",
          translation: "The Blue Cairn",
          coordinates: { latitude: 57.1167, longitude: -3.6433 },
          height: 4085,
          comments:
            "Experienced the highest recorded wind gusts in the UK at 173 mph, making it one of the windest places in the UK.",
        },
      ]);
      console.log(`${result.length} mountains inserted.`);
    } else {
      console.log("Data already exists.");
    }
  } catch (error) {
    console.error("Error inserting data:", error);
  }
}

insertInitialData();

//
//Function to get the FILE part of a page URL
//
function extractFileName(url) {
  // Decode the URL and extract the file name
  const decodedUrl = decodeURIComponent(url);
  const fileName = decodedUrl.split("/").pop().split(":").pop();

  return fileName.toLowerCase(); // Make comparison case-insensitive
}

function normalizeFileName(fileName) {
  // Remove any numeric prefix followed by 'px' (e.g., '500px-', '200px-', etc.)
  fileName = fileName.replace(/^\d+px-/, ""); // Remove numeric prefix like '500px-'

  // Replace spaces, underscores, and hyphens with a common character (e.g., remove them)
  fileName = fileName.replace(/[\s_-]/g, ""); // Remove spaces, underscores, and hyphens

  return fileName; // Return the normalized file name
}
//
//Function to see if 2 images are the same - would prefer different images if available
//
function compareUrlsUsingIncludes(url1, url2) {
  // Extract and normalize the file names from both URLs
  let fileName1 = extractFileName(url1);
  let fileName2 = extractFileName(url2);

  // Normalize file names by removing unwanted numeric prefixes (e.g., '500px-', '200px-')
  fileName1 = normalizeFileName(fileName1);
  fileName2 = normalizeFileName(fileName2);

  console.log("Normalized 1 and 2", fileName1, fileName2);

  return fileName1 === fileName2;
}

//
//Function to get the image from a creative commons page that is brought back from api call
//

async function getImageFromPage(url) {
  try {
    // Fetch the Wikipedia page content
    const pageResponse = await axios.get(url);
    const $ = cheerio.load(pageResponse.data);

    // Find the image URL (in this case, look for 'infobox' images or any other appropriate image)
    const imageUrl = $("#mw-content-text img").first().attr("src");

    if (imageUrl) {
      return `https:${imageUrl}`; // Return the full image URL
    } else {
      throw new Error("Image not found on the page");
    }
  } catch (error) {
    console.error("Error scraping the page for the image:", error);
    return null;
  }
}
//
//get the munro image(s) up to 20 from wikimedia api on a single call to save calls
//I could have called the API twice to get 2 different types of images, but thought this was more efficient as long as it is ethical
//wanted to get a few so I  could look through them and use 2 different images
//
app.get("/munro-image", async (req, res) => {
  try {
    const { name } = req.query;
    console.log("Mountain name for query:", name);

    if (!name) {
      return res.status(400).json({ message: "Mountain name is required" });
    }

    // Request the Wikimedia API to get image data
    const response = await axios.get("https://en.wikipedia.org/w/api.php", {
      params: {
        action: "query",
        titles: name,
        prop: "pageimages|images", //get pageimage and all images
        imlimit: "20", // Limit to 20 images
        pithumbsize: 500, // Size
        format: "json",
      },
    });

    // console.log("API Response (Images and Thumbnail):", response.data); used for debugging

    const pages = response.data.query.pages;
    const pageId = Object.keys(pages)[0];

    // Get the thumbnail URL
    const thumbnailUrl = pages[pageId].thumbnail
      ? pages[pageId].thumbnail.source
      : null;

    // Get the image filenames (other images)
    const images = pages[pageId].images || [];

    //  In testing noticed you sometimes get Common-logo image - not wanted for our app so filter out
    // We need to go through each image URL and find the first one that does not contain 'commons-logo'
    let validImageUrl = null;

    // Loop through images and check the URLs
    for (const image of images) {
      const imagePageUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(
        image.title
      )}`;
      //
      //check for valid extensions that work for our page
      //
      const validImageExtensions = [".jpg", ".jpeg", ".gif"];

      const imageExtension = image.title.slice(-4).toLowerCase(); // Get last 4 chars (e.g., '.jpg', '.gif')

      let different_Images = false;
      // Check if the file names are the same
      if (compareUrlsUsingIncludes(imagePageUrl, thumbnailUrl)) {
        console.log("The URLs have the same file name:", imagePageUrl);
      } else {
        different_Images = true;
        console.log("The URLs do not have the same file name.");
      }

      // Check if the image URL contains 'commons-logo' or map
      if (
        !imagePageUrl.includes("Commons-logo") &&
        !imagePageUrl.includes("map") &&
        validImageExtensions.includes(imageExtension) &&
        different_Images
      ) {
        console.log("this is a valid url", imagePageUrl);
        validImageUrl = imagePageUrl;
        break; // Exit the loop once we find the first valid image URL
      }
    }

    // We will need to get the image URL from one of the image pages
    let scrapedImageUrl = null;

    // Get the URL of the first image page (to scrape from)
    if (images.length > 0) {
      scrapedImageUrl = await getImageFromPage(validImageUrl);
    }

    // Prepare the response with the two URLs
    const imageUrls = [];

    if (scrapedImageUrl) {
      imageUrls.push({ type: "scraped", url: scrapedImageUrl });
    }

    if (thumbnailUrl) {
      imageUrls.push({ type: "thumbnail", url: thumbnailUrl });
    }

    console.log("Image URLs with desc:", imageUrls);

    // Send the image URLs (Thumbnail + Scraped Image)
    res.json({ imageUrls });
  } catch (error) {
    console.error("Error fetching images:", error);
    res
      .status(500)
      .json({ message: "Error fetching images from Wikimedia API" });
  }
});

// Route to fetch all munro data and store in an array for dropdown population and use later
app.get("/api/mountains", async (req, res) => {
  try {
    const mountains = await Mountain.find(); // Fetch all mountains from the database
    res.status(200).json(mountains); // Return all mountain data as JSON
  } catch (error) {
    console.error("Error fetching mountains:", error);
    res.status(500).json({ message: "Error fetching mountains" });
  }
});
//
////////////WEATHER DATA call to Openweather API ///////////////////////////////////
//
console.log("api key", process.env.API_KEY);
async function getWeatherData(latitude, longitude) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&unit=metrics&appid=${process.env.API_KEY}`;

  try {
    const response = await fetch(url);
    const rawBody = await response.text(); // Raw response body as text
    // console.log("Response Status:", response.status); used for testing
    // console.log("Response Body:", rawBody); // Log the raw body

    // Now parse the body as JSON
    const weatherResponse = JSON.parse(rawBody);

    // console.log("Fetched data:", weatherResponse); used for testing

    if (weatherResponse.cod === 200) {
      return {
        // If the request is successful, display the weather data

        weather: weatherResponse.weather[0].description,
        iconCode: weatherResponse.weather[0].icon,
        temperature: weatherResponse.main.temp,
        humidity: weatherResponse.main.humidity,
        visibility: weatherResponse.visibility, //meters
        name: weatherResponse.name,
        sunrise: weatherResponse.sys.sunrise, //unix UTC time stamps
        sunset: weatherResponse.sys.sunset, //unix UTC time stamps
        timezone: weatherResponse.timezone,
      };
    } else {
      console.error("Failed to fetch weather data:", weatherResponse.message);
      return { error: weatherResponse.message };
    }
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return { error: error.message };
  }
}

// Express route to handle the API request
app.get("/api/getWeather", async (req, res) => {
  const { lat, lon } = req.query; // Get lat and lon from the query parameters

  if (!lat || !lon) {
    return res
      .status(400)
      .json({ error: "Latitude and longitude are required" });
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
      error: "Error fetching weather data",
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log("Press Ctrl+C to end this process.");
});
