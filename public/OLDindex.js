/*require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI, {
useNewUrlParser: true,
useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));*/
//
//
// Import required modules
/*require('dotenv').config();  // To load environment variables from .env
const { MongoClient } = require('mongodb');

// MongoDB connection URI from .env
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

// Define the database and collection
const databaseName = 'mountainDB';
const collectionName = 'mountains';

// Initial mountain data to insert
const mountainsData = [
  {
    name: "Ben Lomond",
    coordinates: {
      latitude: 56.229,
      longitude: -4.534
    }
  },
  {
    name: "Mount Everest",
    coordinates: {
      latitude: 27.9881,
      longitude: 86.9250
    }
  }
];

// Function to insert data only on initial run
async function insertInitialData() {
  try {
    const database = client.db(databaseName);
    const collection = database.collection(collectionName);

    // Check if there are already documents in the collection
    const existingData = await collection.find().toArray();
    if (existingData.length === 0) {
      // Insert the initial mountain data
      const result = await collection.insertMany(mountainsData);
      console.log(`Inserted ${result.insertedCount} mountain(s)`);
    } else {
      console.log("Data already exists, skipping insert.");
    }
  } catch (error) {
    console.error('Error inserting data:', error);
  }
}

// Function to fetch all mountains from the database
async function fetchMountains() {
  try {
    const database = client.db(databaseName);
    const collection = database.collection(collectionName);
    
    // Fetch all mountains data
    const mountains = await collection.find().toArray();
    console.log("Fetched mountains:", mountains);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Main function to run the app
async function main() {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Connected to MongoDB!");

    // Insert initial data if it's the first run
    await insertInitialData();

    // Fetch and display the mountain data
    await fetchMountains();
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  } finally {
    // Close the connection
    await client.close();
  }
}

// Run the main function
main();*/
//
//
//*****************************************************************************************************
//  */
// Import required modules
/*require('dotenv').config();  // Load environment variables from .env
const mongoose = require('mongoose');

// MongoDB URI from the .env file
const uri = process.env.MONGODB_URI;

// Connect to MongoDB using Mongoose
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// Define the Mountain Schema
const mountainSchema = new mongoose.Schema({
  name: String,
  coordinates: {
    latitude: Number,
    longitude: Number
  }
});

// Create a Mountain model based on the schema
const Mountain = mongoose.model('Mountain', mountainSchema);

// Initial mountain data to insert
const mountainsData = [
  {
    name: "Ben Lomond",
    coordinates: {
      latitude: 56.229,
      longitude: -4.534
    }
  },
  {
    name: "Mount Everest",
    coordinates: {
      latitude: 27.9881,
      longitude: 86.9250
    }
  }
];

// Function to insert data only on the initial run
async function insertInitialData() {
  try {
    // Check if there is any data in the collection
    const existingData = await Mountain.find();
    
    if (existingData.length === 0) {
      // Insert the initial mountain data if no data exists
      const result = await Mountain.insertMany(mountainsData);
      console.log(`Inserted ${result.length} mountain(s)`);
    } else {
      console.log("Data already exists, skipping insert.");
    }
  } catch (error) {
    console.error('Error inserting data:', error);
  }
}

// Function to fetch all mountains from the database
async function fetchMountains() {
  try {
    // Fetch all mountains data from the database
    const mountains = await Mountain.find();
    console.log("Fetched mountains:", mountains);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Main function to run the app
async function main() {
  // Insert initial data if it's the first run
  await insertInitialData();
  
  // Fetch and display the mountain data
  await fetchMountains();
}

// Run the main function
main();
*/
//////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
// index.js (This file is optional depending on the use case)
//JavaScript
"use strict";

/*const mongoose = require('mongoose');


require('dotenv').config();*/

// MongoDB connection URI from .env file
/*const uri = process.env.MONGODB_URI;

// Connect to MongoDB using Mongoose
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log("Error connecting to MongoDB:", error));

//const Mountain = require('./models/Munros');

// Initialize data insertion on first run
async function insertInitialData() {
  try {
    const existingData = await Mountain.find();
    if (existingData.length === 0) {
        console.log("inserting data");
      const result = await Mountain.insertMany([
        { name: "Ben Lomond", coordinates: { latitude: 56.229, longitude: -4.534 } },
        { name: "Mount Everest", coordinates: { latitude: 27.9881, longitude: 86.9250 } }
      ]);
      console.log(`${result.length} mountains inserted.`);
    } else {
      console.log('Data already exists.');
    }
  } catch (error) {
    console.error('Error inserting data:', error);
  }
}*/

//insertInitialData();

//
// declare global variable outside of function to get Munro mountain data 
//
const mountainArray = [];

  // Function to fetch and display mountain data
  async function fetchMountainData() {
    console.log("in mountain fetch");
    try {
        const response = await fetch('/api/mountains');
        const data = await response.json();
        mountainArray.push(...data);
        console.log("munro data =", mountainArray);
        console.log("munro name",mountainArray[0].name);

        const mountainDataContainer = document.getElementById('mountain-data');
        mountainDataContainer.innerHTML = ''; // Clear previous data

        function populateMountainDropdown() {
          // Get the dropdown element
          const dropdown = document.getElementById('mountain-dropdown');
      
          // Loop through the array and create an option for each mountain
          mountainArray.forEach(mountain => {

            console.log("in array",mountain.name);
              const option = document.createElement('option');
              option.value = mountain.name; // Set the value to the mountain name
              option.textContent = mountain.name; // Display the mountain name
              dropdown.appendChild(option); // Append the option to the dropdown
          });
      }
      
      // Ensure that the DOM is fully loaded before calling the function
      document.addEventListener('DOMContentLoaded', () => {
          populateMountainDropdown();
      });

     /*   if (data && data.length > 0) {
            // Display each mountain's name and coordinates for html ids
            data.forEach(mountain => {
                const mountainItem = document.createElement('div');
                mountainItem.classList.add('mountain-item');

                mountainItem.innerHTML = `
                    <h2>${mountain.name}</h2>
                    <p><strong>Coordinates:</strong> Latitude: ${mountain.coordinates.latitude}, Longitude: ${mountain.coordinates.longitude}</p>
                `;

                mountainDataContainer.appendChild(mountainItem);
            });
        } else {
            mountainDataContainer.innerHTML = '<p>No mountain data found.</p>';
        }*/
    } catch (error) {
        console.error('Error fetching mountain data:', error);
        document.getElementById('mountain-data').innerHTML = '<p>Failed to load mountain data. Please try again later.</p>';
    }
}
  

// Function to fetch the image of Ben Lomond from the backend
async function fetchImage() {
    try {
        const response = await fetch('/ben-lomond-image');
        const data = await response.json();

        if (data.imageUrl) {
            const img = document.createElement('img');
            img.src = data.imageUrl;
            img.alt = 'Ben Lomond Image';
            img.classList.add('ben-lomond-image');

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
}

// Load data when the page loads
window.onload = async () => {
  console.log("in windows load");
    await fetchMountainData(); // Load mountain data
    await fetchImage(); // Load Ben Lomond image
};

// Button listener for loading mountain data
document.getElementById('load-mountain-btn').addEventListener('click', fetchMountainData);

