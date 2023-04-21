const searchCityBtn = document.querySelector('#searchCityBtn');
const searchCityInput = document.querySelector('#searchCity');
const previousCities = document.querySelector('#previousCitiesBtns');
const deleteHistoryBtn = document.querySelector('#deleteHistory');
const articleWrapper = document.querySelector('.article-wrapper');
const currentWeather = document.querySelector('#currentWeather');
const apiKey = '5b2d6050c7c3a26b74faa7aa5cbc4c3c';
const cities = [];
let cityButton;

// Lets declare a function to create buttons
var makeButton = function(btnTxt) {
    // Lets create a button 
    var cityButton = document.createElement('button');
    // Lets add the button text to the button
    cityButton.textContent = btnTxt;
    // Add all the buttons to their DOM container previousCitiesBtns
    previousCities.prepend(cityButton);
}

// Function to make the buttons visible in the DOM
var showButtons = function() {
    // Lets make the buttons containers previousCitiesBtns visible
    previousCities.style.display = 'block';
    // Lets make the delete button visible
    deleteHistoryBtn.style.display = 'block';
}

// Load previous cities from local storage
loadCityList();

// Handle search button click
searchCityBtn.addEventListener('click', function (event) {
    event.preventDefault();
    // Lets store the value of the search field
    const searchCity = searchCityInput.value.trim();
    // If we do have a value
    if (searchCity) {
        // Then lets add it to the list of cities
        addToCityList(searchCity);
        // Then lets get the weather for this city
        getWeather(searchCity);
        // Clear input field
        searchCityInput.value = '';
    }
});

// Lets fetch weather data from openweathermap.org
var getWeather = function (city) {

    // Lets store the API url path to get us the Latitude and Longitude of the city
    const getLatLonAPI = 'https://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=1&appid=' + apiKey;

    // Lets declare empty variables 
    let lat, lon;
    let forecastApiUrl, currentApiUrl;

    //  We create an asynchronous fetch call to get the Latitude and Longitude
    async function fetchLatLon() {
        try {
            const response = await fetch(getLatLonAPI);
            const data = await response.json();
            // Once we received them, we store then in the variables we declared outside this call
            lat = data[0].lat;
            lon = data[0].lon;
            // Now they are stored, we can call the next fetch call to get the cities data
            nowFetchCities();
        } catch (error) {
            // If we have an error here, it most likely means the city was not found
            console.log(error);
            currentWeather.innerHTML = "<h3>Sorry, we couldn't find the city.<h3>";
            // Lets clear the 5 day forecast section
            articleWrapper.innerHTML = '';
        }
    }

    // We call the function to get the Latitude and Longitude
    fetchLatLon();

    // After we got lat and lon on the previous function, now we can get the cities weather data
    function nowFetchCities() {
        // This is the API url path for the 5 day forecast
        forecastApiUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey + '&units=imperial';
        // This is the API url path for the current weather conditions
        currentApiUrl = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey + '&units=imperial';

        // We create the function that will take 2 parameters with a fetch call inside it
        var fetchCall = function (x, y) {
            // The fetch call takes one of the parameters which will be the API url path
            fetch(x)
                .then(function (response) {
                    if (response.ok) {
                        response.json()
                            .then(function (data) {
                                // The y is the second parameter and we will pass the showCurrentWeather function that will take the data and the name of the current city
                                y(data, city);
                            });
                        } else {
                            // If the call failed, we will inform the user of the error
                            currentWeather.innerHTML = '<h3>Error: ' + response.statusText + '</h3>';
                            // Lets clear the 5 day forecast section
                            articleWrapper.innerHTML = '';
                        }
                    })
                    .catch(function (error) {
                        // Lets print out the error for debugging purposes
                        console.log(error);
                        // We did not find the city so let's inform the user we couldn't find that city
                        currentWeather.innerHTML = '<h3>Sorry, we are unable to connect to OpenWeather at this time.<br />Please try again later.</h3>';
                    });
        }

        // Fetch call for the 5 day forecast
        fetchCall(forecastApiUrl, showForecastWeather);

        // Fetch call for the current weather
        fetchCall(currentApiUrl, showCurrentWeather);
    }
};

// The current weather function will take 1 parameter, the data array with all the weather data
var showCurrentWeather = function (data, city) {
    // Lets declare an empty variable which will hold our html
    let currentWeatherHtml = '';
    // We are setting and formatting the current date with DayJS 
    const date = dayjs().format('MM/DD/YYYY');
    const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
    const description = data.weather[0].description;
    // We are rounding the temperature to the nearest integer and saving it to "temp"
    const temp = Math.round(data.main.temp);
    const windSpeed = data.wind.speed;
    const humidity = data.main.humidity;
    // Lets store our html in a variable
    currentWeatherHtml += `
        <h2>${city}<br /><small>${date}</small></h2>
        <img
            src="${iconUrl}"
            alt="${description}"
        />
        <p><span>${temp}&deg;</span>F</p>
        <p>Wind: ${windSpeed} MPH</p>
        <p>Humidity: ${humidity}%</p>
    `;
    // We now append our html for the current weather data to its DOM wrapper
    currentWeather.innerHTML = currentWeatherHtml;
}

// Lets declare the function that will show the 5 day forecast weather
var showForecastWeather = function (data) {
    // Lets declare an empty variable which will hold our html
    let fiveDayHtml = '';
    // Lets create a for loop that will iterate through the data array and get the 5 days
    for (let i = 0; i < data.list.length; i += 8) {
        const date = new Date(data.list[i].dt_txt);
        const iconUrl = `https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png`;
        const description = data.list[i].weather[0].description;
        const temp = Math.round(data.list[i].main.temp);
        const windSpeed = data.list[i].wind.speed;
        const humidity = data.list[i].main.humidity;
        // Lets store our html in a variable
        fiveDayHtml += `
            <article>
                <h3>${dayjs(date.toDateString()).format('dddd')}<br /><small>${dayjs(date.toDateString()).format('MM/DD/YYYY')}</small></h3>
                <img
                    src="${iconUrl}"
                    alt="${description}"
                />
                <p><span>${temp}&deg;</span>F</p>
                <p>Wind: ${windSpeed} MPH</p>
                <p>Humidity: ${humidity}%</p>
            </article>
        `;
        // We now append our html for the current weather data to its DOM wrapper
        articleWrapper.innerHTML = fiveDayHtml;
    }
};

// Add an event listener to the delete history button to call the clearCityList function
deleteHistoryBtn.addEventListener('click', function (event) {
    event.preventDefault();
    // Hide this button when we click it
    this.style.display = 'none';
    // Call the function that will clear local storage
    clearCityList();
});

// Lets store the city inside an array in local storage, it will take 1 parameter, the city name
function addToCityList(city) {
    // Lets add the city to the city list array
    cities.push(city);
    // We convert the array to a string and save it in local storage
    localStorage.setItem('cities', JSON.stringify(cities));
    // Lets create a button for this city
    makeButton(city);
    // Lets make the buttons visible in the DOM
    showButtons();
}

// Load the list of previously saved cities from local storage function
function loadCityList() {
    // Lets store the cities from local storage into a variable
    var storedCities = localStorage.getItem('cities');
    // If we have cities stored
    if (storedCities) {
        // Then lets parse it into a iterable array
        var parsedCities = JSON.parse(storedCities);
        // Lets add the stored cities to our cities array
        cities.push(...parsedCities);
        // Lets create a button for each city
        parsedCities.forEach(city => {
            // Create the button
            makeButton(city);
        });
        // Lets make the buttons visible in the DOM
        showButtons();
    }
}

// Clear the list of previous cities
function clearCityList() {
    localStorage.clear();
    previousCities.textContent = '';
    previousCities.style.display = 'none';
}

// Add an event listener to each dynamically created city button to call getWeather function
previousCities.addEventListener('click', function (event) {
    const cityButton = event.target.closest('button');
    if (cityButton) {
        const searchCity = cityButton.textContent;
        getWeather(searchCity);
    }
});