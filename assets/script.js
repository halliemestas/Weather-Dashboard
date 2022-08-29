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

