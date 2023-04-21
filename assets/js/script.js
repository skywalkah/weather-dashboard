const searchCityBtn = document.querySelector('#searchCityBtn');
const searchCityInput = document.querySelector('#searchCity');
const previousCities = document.querySelector('#previousCitiesBtns');
const deleteHistoryBtn = document.querySelector('#deleteHistory');
const articleWrapper = document.querySelector('.article-wrapper');
const currentWeather = document.querySelector('#currentWeather');
const apiKey = '5b2d6050c7c3a26b74faa7aa5cbc4c3c';
const cities = [];

// Load previous cities from local storage
loadCityList();

// Handle search button click
searchCityBtn.addEventListener('click', function (event) {
    event.preventDefault();
    const searchCity = searchCityInput.value.trim();
    if (searchCity) {
        addToCityList(searchCity);
        getWeatherAPI(searchCity);
        // Clear input field
        searchCityInput.value = '';
    }
});

// Lets fetch weather data from openweathermap.org
var getWeatherAPI = function (city) {
    const forecastApiUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=' + apiKey + '&units=imperial';
    const currentApiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + apiKey + '&units=imperial';

    var fetchCall = function (x, y) {
        fetch(x)
            .then(function (response) {
                if (response.ok) {
                    response.json().then(function (data) {
                        y(data, city);
                    });
                } else {
                    currentWeather.innerHTML = '<h3>Error: ' + response.statusText + '</h3>';
                    articleWrapper.innerHTML = '';
                }
            })
            .catch(function (error) {
                currentWeather.innerHTML = '<h3>Sorry, we are unable to connect to OpenWeather at this time.<br />Please try again later.</h3>';
            });
    }

    // Fetch call for the 5 day forecast
    fetchCall(forecastApiUrl, showForecastWeather);

    // Fetch call for the current weather
    fetchCall(currentApiUrl, showCurrentWeather);

};

var showCurrentWeather = function (data, city) {
    let currentWeatherHtml = '';
    const date = dayjs().format('MM/DD/YYYY');
    const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    const description = data.weather[0].description;
    const temp = Math.round(data.main.temp);
    const windSpeed = data.wind.speed;
    const humidity = data.main.humidity;
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
    currentWeather.innerHTML = currentWeatherHtml;
}

var showForecastWeather = function (data, city) {
    // console.log(data, city);
    let fiveDayHtml = '';
    for (let i = 0; i < data.list.length; i += 8) {
        const date = new Date(data.list[i].dt_txt);
        const iconUrl = `https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png`;
        const description = data.list[i].weather[0].description;
        const temp = Math.round(data.list[i].main.temp);
        const windSpeed = data.list[i].wind.speed;
        const humidity = data.list[i].main.humidity;
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

        articleWrapper.innerHTML = fiveDayHtml;
    }
};

// Add an event listener to the delete history button to call the clearCityList function
deleteHistoryBtn.addEventListener('click', function(event) {
    event.preventDefault();
    this.style.display = 'none';
    clearCityList();
});

// Lets store the city inside an array in local storage
function addToCityList(city) {
    cities.push(city);
    localStorage.setItem('cities', JSON.stringify(cities));
    const cityButton = document.createElement('button');
    cityButton.textContent = city;
    previousCities.prepend(cityButton);
    previousCities.style.display = 'block';
    deleteHistoryBtn.style.display = 'block';
}

// Load the list of previous cities from local storage
function loadCityList() {
    var storedCities = localStorage.getItem('cities');
    if (storedCities) {
        var parsedCities = JSON.parse(storedCities);
        cities.push(...parsedCities);
        parsedCities.forEach(city => {
            cityButton = document.createElement('button');
            cityButton.textContent = city;
            previousCities.prepend(cityButton);
        });
        previousCities.style.display = 'block';
        deleteHistoryBtn.style.display = 'block';
    }
}

// Clear the list of previous cities
function clearCityList() {
    localStorage.clear();
    previousCities.textContent = '';
    previousCities.style.display = 'none';
}

// Add an event listener to each dynamically created city button to call getWeatherAPI function
previousCities.addEventListener('click', function (event) {
    const cityButton = event.target.closest('button');
    if (cityButton) {
        const searchCity = cityButton.textContent;
        getWeatherAPI(searchCity);
    }
});