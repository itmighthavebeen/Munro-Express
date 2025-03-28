# Munro-Express

Fàilte!
This is an Express app that displays Munro information, across 3 dynamically loaded web pages.
In Scotland, A Munro is a mountain that is over 3,000 feet (914.4 meters) in height, named after Sir Hugh Munro who surveyed and cataloged them in 1891. They are beautiful and plentiful with 282 Munros across Scotland. Scotland is a Right To Roam country, granting everyone the right to access land and inland water for recreational purposes, provided they behave responsibly and follow the Scottish Outdoor Access Code. So pick a Munro and get out there! To make it easier to research the Munro, a mongo DB of the top 10 Munros was loaded to provide data for the detail on the pages. Two APIs where called to get weather information and images of the mountains.

Let's take a look at the details of the app:

**Feature List**

- **Use arrays, objects, sets or maps to store and retrieve information that is displayed in your app.**
- **Analyze data that is stored in arrays, objects, sets or maps and display information about it in your app.**

  - Arrays used to store data such as a set of images retrieved from the wikimedia API into an imagesUrl array

- **Analyze data that is stored in arrays, objects, sets or maps and display information about it in your app.**

  - The array of images is analyzed to pick out the images that have the file type of ".jpg", ".jpeg", ".gif" and that are a different image than the one that is the tumbnail image of the Munro page. The API is asked to bring back 20 images to look through so the app can display 2 different images of the Munro.

- **Create a function that accepts two or more input parameters and returns a value that is calculated or determined by the inputs. Basic math functions don’t count (e.g. addition, etc).**

  - The function getWeatherData(latitude, longitude) takes input of latitude and longitude and uses this data when calling the API Openweather. Data returned and manipulated include temperature, humidity, nearest town, sunrise and sunset (times that needed to be converted form UTC time).

- **Retrieve data from a third-party API and use it to display something within your app.**

  - Two APIs were called, wikimedia and openweather. These were called to get images and weather data. The information is displayed on a detail and weather page. The API is called on one page and the data is passed between the pages as Params.

- **Create a node.js web server using a modern framework such as Express.js or Fastify. Serve at least one route that your app uses (must serve more than just the index.html file).**
  \*This app is a node.js using Express.

- **Interact with a database to store and retrieve information (e.g. MySQL, MongoDB, etc).**
  \*Created a Mountain database (defined in Munros.js) in mongo. Store the information on the first run of the app, and then retrieves the information from then on.

Want to give this app a try. Follow these steps to run the app:

"author": "",
"license": "ISC",
"dependencies" : {
"axios": "^1.8.1",
"cheerio": "^1.0.0",
"cors": "^2.8.5",
"dotenv": "^16.4.7",
"express": "^4.21.2",
"moment": "^2.30.1",
"moment-timezone": "^0.5.47",
"mongodb": "^6.14.0",
"mongoose": "^8.11.0",
"serve-favicon": "^2.5.0"
},
"devDependencies": {
"nodemon": "^3.1.9"
