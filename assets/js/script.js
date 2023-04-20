var searchCityBtn = document.querySelector('#searchCityBtn');
var searchCityInput = document.querySelector('#searchCity');
var previousCities = document.querySelector('#previousCities');
var cities = [];

retrieveCityList();

searchCityBtn.addEventListener('click', function (event) {
    event.preventDefault();
    var searchCity = searchCityInput.value.trim();
    if (searchCity != '') {
        addToPreviousCities(searchCity);
         // Add input value to array
        cities.push(searchCity);
        // Save array to localStorage
        localStorage.setItem("cities", JSON.stringify(cities));
        // Clear input field
        searchCityInput.value = '';
    }
});

function addToPreviousCities(city) {
    var cityButton = document.createElement("button");
    var cityText = document.createTextNode(city);
    cityButton.append(cityText);
    previousCities.append(cityButton);
};

function retrieveCityList() {
    var getCities = localStorage.getItem('cities');
    if (getCities) {
        cities = JSON.parse(getCities);
    };
    cities.forEach(i => {
        addToPreviousCities(i);
    });
};
