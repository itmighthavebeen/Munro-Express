"use strict";
const mountainArray = []; // global definition of array

document.addEventListener("keydown", function (e) {
  const image = document.getElementById("zoom-image");
  let scale = 1; // Default scale

  // If 'Ctrl' key is pressed along with '+' or '-', want to be able to zoom mountain picture
  if (e.ctrlKey) {
    if (e.key === "+") {
      scale += 0.1; // Increase zoom
    } else if (e.key === "-") {
      scale -= 0.1; // Decrease zoom
    }

    // Ensure scale stays within reasonable limits (e.g., between 0.5x and 3x)
    if (scale < 0.5) scale = 0.5;
    if (scale > 3) scale = 3;

    // Apply zoom to the image by changing its transform scale
    image.style.transform = `scale(${scale})`;
  }
});

////////////////////////////////

// Function to fetch and display mountain data
async function fetchMountainData() {
  try {
    const response = await fetch("/api/mountains");
    const data = await response.json();

    // Add the fetched data to the existing array without reassigning it
    mountainArray.push(...data); // Use push() directly on the array

    // Access the name of the first mountain correctly
    if (mountainArray.length > 0) {
      console.log("munro name", mountainArray[0].name);
    } else {
      console.log("No mountains in the array.");
    }

    const mountainDataContainer = document.getElementById("mountain-data");
    mountainDataContainer.innerHTML = ""; // Clear previous data

    // Function to populate dropdown with mountain names
    function populateMountainDropdown() {
      // Get the dropdown element
      const dropdown = document.getElementById("mountain-dropdown");

      // Loop through the array and create an option for each mountain
      mountainArray.forEach((mountain) => {
        const option = document.createElement("option");
        option.value = mountain.name; // Set the value to the mountain name
        option.textContent = mountain.name; // Display the mountain name
        dropdown.appendChild(option); // Append the option to the dropdown
      });
    }

    // Call the function to populate the dropdown
    populateMountainDropdown();
  } catch (error) {
    console.error("Error fetching mountain data:", error);
    document.getElementById("mountain-data").innerHTML =
      "<p>Failed to load mountain data. Please try again later.</p>";
  }
}

// Modify the click handler of 'load-mountain-btn' to navigate to the new page
document.getElementById("load-mountain-btn").addEventListener("click", () => {
  // Get the selected mountain's name
  const selectedMountainName =
    document.getElementById("mountain-dropdown").value;

  // If a mountain is selected, find its data and navigate to the new screen
  const selectedMountain = mountainArray.find(
    (mountain) => mountain.name === selectedMountainName
  );
  if (selectedMountain) {
    // Construct URL with the mountain name and coordinates as query parameters
    const { name, coordinates, gaelic, translation, height, comments } =
      selectedMountain;
    const imageUrl = selectedMountain.imageUrl;
    const url = `munro-detail.html?name=${encodeURIComponent(
      name
    )}&latitude=${encodeURIComponent(
      coordinates.latitude
    )}&longitude=${encodeURIComponent(
      coordinates.longitude
    )}&gaelic=${encodeURIComponent(gaelic)}&translation=${encodeURIComponent(
      translation
    )}&height=${encodeURIComponent(height)}&comments=${encodeURIComponent(
      comments
    )}`;
    window.location.href = url; // Redirect to the munro-detail page
  } else {
    alert("Please select a mountain first.");
  }
});

// Load data when the page loads
window.onload = async () => {
  await fetchMountainData();
};
