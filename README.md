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

* **Additionally created a working favicon icon for the app**

Want to give this app a try? Follow these steps to run the app:

**1.** Install Node.js if not on the PC.

- You can verify you have it with the node -v command in bash windows. This will show you the version # if installed.

- To Install Node.js: Go to the official Node.js website and download the latest LTS version for Window. Verify with node -v and npm -v that the install was successful.

**2.** Clone the app and download to your PC. You will need a github account and Git installed on your PC.

- To clone the app, open github.com and sign in. Go to https://github.com/itmighthavebeen/Munro-Express. Select the drop down arrow by the green Code button and copy the URL.
- Go to the desired download location on your PC. Highlight the location folder and select Open Git Bash Here. This will open a git terminal window.
- In the Terminal window, type git clone _the url copied from github_

**3.** Download (if needed) Visual Studio Code and open folder containing cloned app

**4.** Create the .env folder and edit to add your api key and a path to the DB. The api key is for https://api.openweathermap.org api. The DB info is on the project form. The variable name for the api key is API_KEY

**5.** Now that the app is downloaded on your PC and the env file is created, close VSC and open bash. Make sure you are in the project folder:

- pwd - will tell you the path you are currently
- cd to the desired folder containing that is the recently cloned project. It will be called Munro-Express

**6.** After verifying you are in the correct path _your path name here/Munro-Express_,

- type **npm install** to install the needed dependencies
- the bash window will show information such as how many packages are installed.

**7.** Type **npm start** to start the app

**8.** You can Ctrl+Click on type http://localhost:1776/ in a browser window to start the app. _Ctrl C_ will stop the process in bash. _Exit_ will exit bash.

**9.** If you get an error that a process is already running, use these commands to find the processes on port 1776 and to kill them:
*netstat -ano | findstr :1776
*taskkill /PID ##### /F _where ##### is the process id from the above command_

- **Additional Notes**
  The apps uses dependecies of axios, cherrio (used to get picture from a page-free/common/ethical), cors, dotenv, express, moment (used for time conversion), mongodb and serve-favicon.

The database can be erased (by going to the MongoDB web page) and will be loaded on first run of the app. It will only be read if data exists.

Enjoy the app, but keep in mind the Wikimedia API is making requests without an access token and is limited to 500 requests per hour per IP address.

With OpenWeatherMap's free plan, you can make 60 API calls per minute and 1,000 API calls per day, but you do need to register and get an API key (see info above about .env file)

What I would like to do to help the app: Add the other Munros. Add functionality such as seeing the location on a map, listening to the gaelic pronuciation, letting you enter your location in Scotland and telling you which Munros are closest.

Latha Math! (or Good Day!)
3-28-25
