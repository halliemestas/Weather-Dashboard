//locatlStorage functions first
function saveSearch(cityName)
{
    console.log(cityName);
    var cityStorage = localStorage.getItem("cityStorage");
    if (cityStorage === null) cityStorage = [];
    else {
    cityStorage = JSON.parse(cityStorage);
    }
    cityStorage.unshift(cityName);
    var newCityAdded = JSON.stringify(cityStorage);
    localStorage.setItem("cityStorage", newCityAdded);
}

function displayPreviousSearches() {
    var cityStorage = localStorage.getItem("cityStorage");
    cityStorage = JSON.parse(cityStorage);
  
    ul.empty();
  
    if (cityStorage != null) {
      for (var i = 0; i < cityStorage.length; i++) {
        if(cityStorage[i] != null )
        {
          var createLi = document.createElement("li");
          createLi.textContent = cityStorage[i];
          ul.append(createLi);
        }
      }
    }
  }

//event listener to clear storage 
clear.on("click", localStorage.clear());

//global variables
var apiKey = "5b2d2eb99bb618ebba868aac9689df5c"
var city = "Denver"
var currentConditions = "https://api.openweathermap.org/data/2.5/weather?appid="
var fiveDay ="https://api.openweathermap.org/data/2.5/forecast?appid="
var uvIndex =
  "https://api.openweathermap.org/data/2.5/uvi?appid={appid}&lat={lat}&lon={lon}"
var searchedArr = JSON.parse(localStorage.getItem("searchedItems")) || [];
var currentWeatherDiv = $("#current-weather")
var fiveDayDiv = $("#five-day");
var ul = $("#searches");
var search = $("#search-input");
var clear = $("#clearbtn");
var values = 0;


//taking in user input, and passing the value into a variable
$(document).ready(function() 
{
    search.on("click", function(event) 
    {
    var userInput = $("#city-search").val();

    //remove previous information
    currentWeatherDiv.empty();
    fiveDayDiv.empty();

    //run functions
    getWeather(userInput);
    saveSearch(userInput);
    displayFiveDayForecast(userInput);
    displayPreviousSearches();
    })
})

//get current weather
async function getWeather(cityName) 
{
    var apiCall = ""

    if (cityName !== "") 
    {
        apiCall = currentConditions + apiKey + "&q=" + cityName;
    } 
    else //run default for Atlanta
    {
        apiCall = currentConditions + apiKey + "&q=" + city;
    }

    var response = await $.ajax({
        url: apiCall,
        method: "GET"
    })

    var getCurrentCity = response.name;
    var date = new Date();
    var val=(date.getMonth()+1)+"/"+date.getDate()+"/"+date.getFullYear();
    var getCurrentWeatherIcon = response.weather[0].icon;
    var displayCurrentWeatherIcon = $("<img src = http://openweathermap.org/img/wn/" + getCurrentWeatherIcon + "@2x.png />");
    var currentCityEl = $("<h3 class = 'card-body'>").text(getCurrentCity+" ("+val+")");
    currentCityEl.append(displayCurrentWeatherIcon);
    currentWeatherDiv.append(currentCityEl);
    var getTemp = response.main.temp;
    getTemp = ((getTemp-273.15)*1.8)+32;
    getTemp = getTemp.toFixed(1);
    var tempEl = $("<p class='card-text'>").text("Temperature: "+getTemp+"° F");
    currentWeatherDiv.append(tempEl);
    var getHumidity = response.main.humidity;
    var humidityEl = $("<p class='card-text'>").text("Humidity: "+getHumidity+"%");
    currentWeatherDiv.append(humidityEl);
    var getWindSpeed = response.wind.speed.toFixed(1);
    var windSpeedEl = $("<p class='card-text'>").text("Wind Speed: "+getWindSpeed+" mph");
    currentWeatherDiv.append(windSpeedEl);
    var getLong = response.coord.lon;
    var getLat = response.coord.lat;
        
    var uvURL = "https://api.openweathermap.org/data/2.5/uvi?appid=d3b85d453bf90d469c82e650a0a3da26&lat="+getLat+"&lon="+getLong;
    var uvResponse = await $.ajax({
            url: uvURL,
            method: "GET"
    })

    // getting UV Index info and setting color class according to value
    var getUVIndex = uvResponse.value;
    var uvNumber = $("<span>");
    if (getUVIndex > 0 && getUVIndex <= 2.99)
        uvNumber.addClass("low");
    else if(getUVIndex >= 3 && getUVIndex <= 5.99)
        uvNumber.addClass("moderate");
    else if(getUVIndex >= 6 && getUVIndex <= 7.99)
        uvNumber.addClass("high");
    else if(getUVIndex >= 8 && getUVIndex <= 10.99)
        uvNumber.addClass("vhigh");
    else
            uvNumber.addClass("extreme");
    uvNumber.text(getUVIndex);
    var uvIndexEl = $("<p class='card-text'>").text("UV Index: ");
        uvNumber.appendTo(uvIndexEl);
        currentWeatherDiv.append(uvIndexEl);
        $("#weatherContainer").html(currentWeatherDiv);

}

getWeather(city);

async function displayFiveDayForecast(cityName) {
    var apiCall = ""

    if (cityName !== "") 
    {
        apiCall = fiveDay + apiKey + "&q=" + cityName;
    } 
    else //run default for Atlanta
    {
        apiCall = fiveDay + apiKey + "&q=" + city;
    }

    var response = await $.ajax({
        url: apiCall,
        method: "GET"
    })

    var cardDeck = $("<div  class='card-deck'>");
    
  
    for (i=0; i<5;i++)
    {
      var forecastCard = $("<div class='card mb-3 mt-3'>");
      var cardBody = $("<div class='card-body'>");
      var date = new Date();
      date.setDate(date.getDate() + i);
      var all = (date.getMonth()+1)+"/"+date.getDate()+"/"+date.getFullYear();
      var forecastDate = $("<h5 class='card-title'>").text(all);
      
        cardBody.append(forecastDate);
        var getCurrentWeatherIcon = response.list[i].weather[0].icon;
        var displayWeatherIcon = $("<img src = http://openweathermap.org/img/wn/" + getCurrentWeatherIcon + ".png />");
        cardBody.append(displayWeatherIcon);
        var getTemp = response.list[i].main.temp;
        getTemp = ((getTemp-273.15)*1.8)+32;
        getTemp = getTemp.toFixed(1);
        var tempEl = $("<p class='card-text'>").text("Temp: "+getTemp+"° F");
        cardBody.append(tempEl);
        var getHumidity = response.list[i].main.humidity;
        var humidityEl = $("<p class='card-text'>").text("Humidity: "+getHumidity+"%");
        cardBody.append(humidityEl);
        var getWindSpeed = response.list[i].wind.speed.toFixed(1);
        var windSpeedEl = $("<p class='card-text'>").text("Wind Speed: "+getWindSpeed+" mph");
        cardBody.append(windSpeedEl);
        forecastCard.append(cardBody);
        cardDeck.append(forecastCard);
    }
    fiveDayDiv.append(cardDeck);
}

displayFiveDayForecast(city);