const searchCityBtn = document.querySelector('#searchCityBtn');
const searchCityInput = document.querySelector('#searchCity');
const previousCities = document.querySelector('#previousCities');
const deleteHistoryBtn = document.querySelector('#deleteHistory');
// const iconurl = "http://openweathermap.org/img/w/" + iconcode + "@2x.png";
var cities = [];

// Load previous cities from local storage
loadCityList();

// Handle search button click
searchCityBtn.addEventListener('click', function (event) {
    event.preventDefault();
    var searchCity = searchCityInput.value.trim();
    if (searchCity) {
        addToCityList(searchCity);
        // Clear input field
        searchCityInput.value = '';
    }
});

// Add an event listener to the delete history button to call the clearCityList function
deleteHistoryBtn.addEventListener('click', event => {
    event.preventDefault();
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
    }
}

// Clear the list of previous cities
function clearCityList() {
    localStorage.removeItem('cities');
    cities.length = 0;
    previousCities.textContent = '';
    previousCities.style.display = 'none';
}

// Handle click events on the dynamically created city buttons
previousCities.addEventListener('click', event => {
    if (event.target.tagName === 'BUTTON') {
        var city = event.target.textContent;
        alert('Do something')
    }
});