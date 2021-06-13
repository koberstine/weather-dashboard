// runs the 2 fetches for the city name

function searchForCity () {
    if ($("#city").val() != ""){
        fetch("http://api.openweathermap.org/data/2.5/weather?q=" + $("#city").val() + "&units=imperial&appid=f19d4e1c772c15cfa5a0df0f4a51a3f8")
        .then (function (firstResponse) {
            return firstResponse.json()
        })
        .then (function (weather) {
            fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + weather.coord.lat + "&lon=" + weather.coord.lon + "&exclude=minutely,hourly,alerts&units=imperial&appid=f19d4e1c772c15cfa5a0df0f4a51a3f8")
            .then (function (secondResponse) {
                return secondResponse.json()
            })
            .then (function (oneCall) {
                displayWeather(weather, oneCall);
            })
        })
    }
    $("#city").val("");
}

function displayWeather(weather, oneCall) {

    // each element of current weather

    var displayHere = $("#current-weather");
    displayHere.html("");
    var actualCityName = weather.name;
    var currentWeatherHeader = $("<h1/>");
    var todaysDate = new Date(weather.dt*1000);
    var parcedDate = (todaysDate.getMonth()+1) + "/" + todaysDate.getDate() + "/" + todaysDate.getFullYear();
    currentWeatherHeader.text(actualCityName + " " + parcedDate);
    displayHere.append(currentWeatherHeader);

    var currentWeatherIcon = $("<img/>");
    var weatherIconLocation = "http://openweathermap.org/img/wn/" + weather.weather[0].icon + "@2x.png";
    currentWeatherIcon.attr("src", weatherIconLocation); 
    displayHere.append(currentWeatherIcon);

    var temperature = $("<p/>")
    temperature.text("Temp: " + weather.main.temp + "\xB0F");
    displayHere.append(temperature);

    var wind = $("<p/>")
    wind.text("Wind: " + weather.wind.speed + " MPH");
    displayHere.append(wind);

    var humidity = $("<p/>")
    humidity.text("Humidity: " + weather.main.humidity + "%");
    displayHere.append(humidity);

    var uvIndex = $("<p/>");
    uvIndex.text("UV Index: ")
    displayHere.append(uvIndex)
    var uvIndexSpan = $("<span/>");
    uvIndexSpan.text(oneCall.current.uvi)
    displayHere.append(uvIndexSpan)

    // array for 5 day forecast

    var displayFiveDay = $("#5-day-forcast");
    displayFiveDay.html("");
    displayFiveDay.append("<h2>5-Day Forecast</h2>")
    for (i=1;i<6;i++){
        var singleDay = $("<div/>");
        var thisDay = "day" + i;
        singleDay.attr("id", thisDay)
        displayFiveDay.append(singleDay)
        var displayOneDay = $(singleDay)

        var fiveDayDate = $("<p/>");
        var singleDayDate = new Date(oneCall.daily[i].dt*1000);
        var parcedSingleDate = (singleDayDate.getMonth()+1) + "/" + singleDayDate.getDate() + "/" + singleDayDate.getFullYear();
        fiveDayDate.text(parcedSingleDate);
        displayOneDay.append(fiveDayDate);
        
        var fiveDayWeatherIcon = $("<img/>");
        var fiveDayIconLocation = "http://openweathermap.org/img/wn/" + oneCall.daily[i].weather[0].icon + "@2x.png";
        fiveDayWeatherIcon.attr("src", fiveDayIconLocation); 
        displayOneDay.append(fiveDayWeatherIcon);

        var fiveDayTemperature = $("<p/>");
        fiveDayTemperature.text("Temp: " + oneCall.daily[i].temp.day + "\xB0F");
        displayOneDay.append(fiveDayTemperature);

        var fiveDayWind = $("<p/>");
        fiveDayWind.text("Wind: " + oneCall.daily[i].wind_speed + " MPH");
        displayOneDay.append(fiveDayWind);

        var fiveDayHumidity = $("<p/>");
        fiveDayHumidity.text("Humidity: " + oneCall.daily[i].humidity + "%");
        displayOneDay.append(fiveDayHumidity);

    }
    createNewList (weather.name);
}

// make a new array of city names for localStorage

function createNewList (cityName) {
    var newList = [cityName];
    if (localStorage.getItem('cityList') !== null) {
        var oldList =  JSON.parse(localStorage.getItem('cityList'));
        for (i=0;i<oldList.length;i++) {
            if (oldList[i] != cityName && newList.length < 10) {
                newList.push(oldList[i]);
            }
        }
    }
    localStorage.setItem('cityList', JSON.stringify(newList));
    console.log(newList)
    createButtons(newList);
}

// create clickable buttons for cities in localStorage

function createButtons (cityList) {
    var buttonLocation = $("#search-history");
    buttonLocation.html("");
    for (i=0;i<cityList.length;i++) {
        var button = $("<button/>");
        var buttonLabel = cityList[i];
        button.text(buttonLabel);

        button.click(function () {
            $("#city").val(buttonLabel);
            searchForCity ();
        })

        buttonLocation.append(button)      
    }
}

// pre-load cities if store in local storage
$("#city").val("");
if (localStorage.getItem('cityList') !== null) {
    var list =  JSON.parse(localStorage.getItem('cityList'));
    createButtons (list);
}

//wait for the search button to be clicked

$("#search-form").submit(function( event ) {
    searchForCity();
    event.preventDefault();
    });

