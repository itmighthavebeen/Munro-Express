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
const cheerio = require('cheerio'); // Cheerio to scrape image URLs from the page
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
        comments: "The second highest mountain in Scotland and in all of the UK."},

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
        comments: "The highest point in the UK made of non-igneous rock, composed mainly of the metamorphic rock schist."},

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



/*app.get('/munro-image', async (req, res) => {
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
          console.log("what is the imageUrl", imageUrl);
      } else {
          res.status(404).json({ message: 'No images found for the Munro' });
      }
  } catch (error) {
      console.error('Error fetching image:', error);
      res.status(500).json({ message: 'Error fetching image' });
  }
});*/
/////////////////////////////////////////////////////////////

// Scrape image from a Wikipedia page (you already have this function)
async function getImageFromPage(url) {
  try {
    // Fetch the Wikipedia page content
    const pageResponse = await axios.get(url);
    const $ = cheerio.load(pageResponse.data);

    // Find the image URL (in this case, look for 'infobox' images or any other appropriate image)
    const imageUrl = $('#mw-content-text img').first().attr('src');
    console.log("inside getimage from page", imageUrl);
    if (imageUrl) {
      return `https:${imageUrl}`; // Return the full image URL
    } else {
      throw new Error('Image not found on the page');
    }
  } catch (error) {
    console.error('Error scraping the page for the image:', error);
    return null;
  }
}

app.get('/munro-image', async (req, res) => {
  try {
    const { name } = req.query;
    console.log("Mountain name for query:", name);

    if (!name) {
      return res.status(400).json({ message: 'Mountain name is required' });
    }

    // Request the Wikimedia API to get image data
    const response = await axios.get('https://en.wikipedia.org/w/api.php', {
      params: {
        action: 'query',
        titles: name,
        prop: 'pageimages|images',
        imlimit: '20',  // Limit to 5 images
        pithumbsize: 500,  // Size for thumbnail
        format: 'json'
      }
    });

    console.log('API Response (Images and Thumbnail):', response.data);

    const pages = response.data.query.pages;
    const pageId = Object.keys(pages)[0];

   // const images = pages[pageId].images || [];

 //   const imageDetailsResponse = await axios.get('https://en.wikipedia.org/w/api.php', {
   //   params: {
   //     action: 'query',
   //     titles: images.map(image => image.title).join('|'),  // Pass the list of image titles
   //     prop: 'imageinfo',  // Get image information (description and URL)
   //     iiprop: 'desc|url',  // Fetch description and URL
   //     format: 'json'
   //   }
   // });
//console.log('imageDetailsResponse.data', imageDetailsResponse.data);

    // Get the thumbnail URL
    const thumbnailUrl = pages[pageId].thumbnail ? pages[pageId].thumbnail.source : null;

    // Get the image filenames (other images)
    const images = pages[pageId].images || [];

    ////////////////////////////
     // We need to go through each image URL and find the first one that does not contain 'commons-logo'
     let validImageUrl = null;

     // Loop through images and check the URLs
     for (const image of images) {
       const imagePageUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(image.title)}`;
 
       // Check if the image URL contains 'commons-logo'
       if (!imagePageUrl.includes('commons-logo')) {
         validImageUrl = imagePageUrl;
         break; // Exit the loop once we find the first valid image URL
       }
     }

    //////////////////////////////
    
    // We will need to get the image URL from one of the image pages
    let scrapedImageUrl = null;

    // Get the URL of the first image page (to scrape from)
   if (images.length > 0) {
    //  const imagePageUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(images[2].title)}`;
   //   Scrape the image from this page
      scrapedImageUrl = await getImageFromPage(validImageUrl);
    }

    // Prepare the response with the two URLs
    const imageUrls = [];

    if (validImageUrl) {
      imageUrls.push({ type: 'scraped', url: validImageUrl });
    }
// Iterate over images and collect their URL and description
//images.forEach(image => {
//  const imageInfo = imageDetailsResponse.data.query.pages[image.pageId]?.imageinfo[0] || {};//

 // const imageUrl = imageInfo.url || 'No URL available';
 // const imageDescription = imageInfo.description || 'No description available';

//  imageUrls.push({
 //   type: 'scraped',  // Image type (you can customize this)
 //   url: imageUrl,    // Image URL
   
 // });
//});


    // Add the thumbnail URL
    if (thumbnailUrl) {
  imageUrls.push({ type: 'thumbnail', url: thumbnailUrl });
   }

    // Add the scraped image URL (only if found)
 //   if (scrapedImageUrl) {
 //    const imageDescription = images.length > 0 ? images[2].description : "No description available";  // Fallback if no description exists
 //    imageUrls.push({ type: 'scraped', url: scrapedImageUrl
 //     });
 //   }

    console.log("Image URLs with desc:", imageUrls);

    // Send the image URLs (Thumbnail + Scraped Image)
    res.json({ imageUrls });

  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ message: 'Error fetching images from Wikimedia API' });
  }
});


/////////////////////////////////////////////////////////////////

app.get('/munro-image-oncemore', async (req, res) => {
  try {
    const { name } = req.query;
    console.log("Mountain name for query:", name);

    if (!name) {
      return res.status(400).json({ message: 'Mountain name is required' });
    }

    // Request the Wikimedia API to get image data
    const response = await axios.get('https://en.wikipedia.org/w/api.php', {
      params: {
        action: 'query',
        titles: name,
        prop: 'pageimages|images',
        imlimit: '4',  // Limit to 4 images
        pithumbsize: 500,  // Size for thumbnail
        format: 'json'
      }
    });

    console.log('API Response (Images and Thumbnail):', response.data);

    const pages = response.data.query.pages;
    const pageId = Object.keys(pages)[0];

    // Get the thumbnail URL
    const thumbnailUrl = pages[pageId].thumbnail ? pages[pageId].thumbnail.source : null;

    // Get the image filenames (other images)
    const images = pages[pageId].images || [];
    const imageUrls = [];

    // Add the thumbnail as the first image
    if (thumbnailUrl) {
      imageUrls.push({ type: 'thumbnail', url: thumbnailUrl });
    }

    // Now we get URLs for the pages of the other images (second, third, and fourth images)
    const imagePageUrls = [];
    for (let i = 0; i < images.length && imagePageUrls.length < 3; i++) {
      const image = images[i];
      const imagePageUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(image.title)}`;
      imagePageUrls.push(imagePageUrl);
    }

    // Add the URLs of the pages to the imageUrls
    for (const pageUrl of imagePageUrls) {
      imageUrls.push({ type: 'page', url: pageUrl });
    }

    console.log("Image URLs:", imageUrls);

    // Send the image URLs (Thumbnail + URLs for pages to scrape)
    res.json({ imageUrls });

  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ message: 'Error fetching images from Wikimedia API' });
  }
});




///////////////////////////////////////////////////////////
app.get('/munro-imageagain', async (req, res) => {
  try {
    const { name } = req.query;
    console.log("Mountain name for query:", name);
    
    if (!name) {
      return res.status(400).json({ message: 'Mountain name is required' });
    }

    // Step 1: Get images (including thumbnail) and image info using one query
    const response = await axios.get('https://en.wikipedia.org/w/api.php', {
      params: {
        action: 'query',
        titles: name,
        prop: 'pageimages|images|imageinfo', // Fetch images and their URLs
        iiprop: 'url', // Retrieve URLs for images
        pithumbsize: 500, // Set size of the thumbnail (500px)
        format: 'json'
      }
    });

    console.log('API Response (Images and Image URLs):', response.data);

    const pages = response.data.query.pages;
    const pageId = Object.keys(pages)[0];
    const images = pages[pageId].images || []; // List of images
    const thumbnailUrl = pages[pageId].thumbnail ? pages[pageId].thumbnail.source : null; // Get the thumbnail URL

    // Prepare the response with image URLs
    let imageUrls = [];

    // Add the thumbnail image as the first URL
    if (thumbnailUrl) {
      imageUrls.push(thumbnailUrl);
    } else {
      imageUrls.push("https://path/to/default/image.jpg"); // Fallback if no thumbnail is available
    }

    // Loop through the images to get their URLs
    if (images.length > 0) {
      images.forEach((image) => {
        const imageTitle = image.title.replace('File:', ''); // Remove the 'File:' prefix
        const imageUrl = `https://upload.wikimedia.org/wikipedia/commons/${imageTitle}`;
        imageUrls.push(imageUrl); // Add the image URL to the array
      });
    }

    if (imageUrls.length === 0) {
      imageUrls.push("https://path/to/default/image.jpg"); // Fallback if no images are found
    }

    console.log("Image URLs:", imageUrls);

    // Send the image URLs back to the frontend
    res.json({ imageUrls });

  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ message: 'Error fetching images from Wikimedia API' });
  }
});


/////////////////////////////////////////////////////////////////
app.get('/munro-image_what', async (req, res) => {
  try {
    const { name } = req.query;
    console.log("Mountain name for query:", name);
    
    if (!name) {
      return res.status(400).json({ message: 'Mountain name is required' });
    }

    // Request to the Wikimedia API
    const response = await axios.get('https://en.wikipedia.org/w/api.php', {
      params: {
        action: 'query',
        titles: name,
        prop: 'pageimages|images', // Add `images` to fetch more images beyond the thumbnail
        pithumbsize: 500,
        format: 'json'
      }
    });

    console.log('API Response:', response.data);

    const pages = response.data.query.pages;
    const pageId = Object.keys(pages)[0];
    const images = pages[pageId].images || []; // List of image objects
    const thumbnailUrl = pages[pageId].thumbnail ? pages[pageId].thumbnail.source : null;

    console.log("images", images);

    // Prepare response with the main image (thumbnail) and all images found
    let imageUrls = [];

    // If there's a thumbnail image
    if (thumbnailUrl) {
      imageUrls.push(thumbnailUrl);
    }

    // Loop through all images in the images array
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      console.log("Processing image:", image.title);

      // Remove the 'File:' prefix from the title to get the correct image filename
      const imageFileName = image.title.replace('File:', '');

      // URL-encode the filename to ensure proper formatting
      const encodedFileName = encodeURIComponent(imageFileName);

      // Build the full image URL
      const imageUrl = `https://upload.wikimedia.org/wikipedia/commons/${encodedFileName}`;

      console.log("Image URL:", imageUrl);

      // Add the image URL to the response
      imageUrls.push(imageUrl);
    }

    // If no images were found, add a fallback image URL
    if (imageUrls.length === 0) {
      imageUrls.push("https://path/to/default/image.jpg");
    }

    console.log("All Image URLs:", imageUrls);

    // Send the image URLs back to the frontend
    res.json({ imageUrls });

  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ message: 'Error fetching images from Wikimedia API' });
  }
});

////////////////////////////////////////////
async function getImageFromPageWHAT(url) {
  try {
    // Fetch the Wikipedia page content
    const pageResponse = await axios.get(url);
    const $ = cheerio.load(pageResponse.data);

    // Find the image URL (in this case, look for 'infobox' images)
    const imageUrl = $('#mw-content-text img').first().attr('src');
    console.log("inside getimage from page",imageUrl);
    if (imageUrl) {
      return `https:${imageUrl}`;
    } else {
      throw new Error('Image not found on the page');
    }
  } catch (error) {
    console.error('Error scraping the page for the image:', error);
    return null;
  }
}


////////////////////////////////////////////////////
// Example API endpoint to use the scraping function
app.get('/scrape-image', async (req, res) => {
  const { pageUrl } = req.query; // Accept the page URL as a query parameter

  if (!pageUrl) {
    return res.status(400).json({ message: 'Page URL is required' });
  }

  // Call the scraping function
  const imageUrl = await getImageFromPage(pageUrl);

  // If an image is found, return the image URL
  if (imageUrl) {
    return res.json({ imageUrl });
  } else {
    // If no image is found, send an error response
    return res.status(404).json({ message: 'No image found on the page' });
  }
});

//////////////////////////////////////////////////////
app.get('/munro-image_2', async (req, res) => {
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
////////////////////////////////////////////////////////////////////////

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

