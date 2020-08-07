//global variables
var city = "";
var cities = [];
var text = "";
var searchType = "";
var brewList = [];

const displayNum = 3;

// Save the cities searched for
function addHistory(city){ 
    // Check for changes in the local item and log them
    var storedCities = JSON.parse(localStorage.getItem("cities"));
    if(storedCities !== null){
        cities = storedCities;
    }

    city.toUpperCase();
console.log("city =" +city);
    var index = cities.indexOf(city);
console.log("index = " + index);
    if(index === -1){
        cities.push(city);
        localStorage.setItem("cities", JSON.stringify(cities));
    };
    renderHistory();

};

// Render the history localstorage
function renderHistory(){
    $("#history").empty();
    var storedCities = JSON.parse(localStorage.getItem("cities"));
    if(storedCities !== null){
        cities = storedCities;
    }

    for (i = 0; i < cities.length; i++) {
        //
        var listEl = $("<li>");  
        $(listEl).append($("<button class='btn btn-info d-flex flex-column'>").attr("cityName", cities[i]).text(cities[i]));
        $("#history").append(listEl);
    }
    
};

//function to create url based on search type
function createBreweryURL(){
    var searchtype ="city"//$(#"dropdownId").value;  //needs to be changed to dropdown ID
    var city = "Denver"
    var url = "";
    var numBrew = displayNum;
    switch(searchtype){
        case "city":
            url = "https://api.openbrewerydb.org/breweries?by_city=" + city +"&per_page="+ numBrew;  
            break;
        case "name":
            url = "https://api.openbrewerydb.org/breweries?by_name=" + city +"&per_page="+ numBrew;
            break;
        case "zipcode":
            url ="https://api.openbrewerydb.org/breweries?by_postal=" + city +"&per_page="+ numBrew;
            break;
        default:
            url ="https://api.openbrewerydb.org/breweries?by_name=" + city +"&per_page="+ numBrew;
            break;
    } 
    console.log(url);
    return url; 
}

function renderResults(response){

    console.log("whereisit" + response);
    for (i = 0; i < cities.length; i++) {
        //
        var outerDivEl = $("<div class= 'media-object stack-for-small'>");  
        var mediaEl = $("<div class= 'media-object-section'>");
        var thumbnailEl = $("<div class= 'thumbnail'>");
        var imageEl = $("<img src= 'https://via.placeholder.com/200'>");
        
        $(thumbnailEl).append(imageEl);
        $(mediaEl).append(thumbnailEl);
        $(outerDivEl).append(mediaEl);

        var media2El = $("<div class= 'media-object-section'>");
        var nameEl = $("<h4>").text(response[i].name);
        var addressEl = $("<p>").text(response[i].street);
        var phoneNumberEl = $("<p>").text(response[i].phone);
        var urlEl = $("<p>").text(response[i].website_url);

        $(nameEl).append(media2El);
        $(addressEl).append(media2El);
        $(phoneNumberEl).append(media2El);
        $(urlEl).append(media2El);

        $(outerDivEl).append(media2El);
        $("#search-results").append(outerDivEl);
    }
    
}

function callBrewAPI(){
    //let city ="Denver" //$("#city-input").val().trim();
    if (city !== "") {
        // The following clears the error if something is typed in the search field that isn't accepted
       $("#city-input").html("")
        
        // console.log(localStorage.getItem("city"));
        // searchCity(city);
        // brewery(city);
        

        $.ajax({
            url: createBreweryURL(),
            method: "GET"
        }).then(function (response) {
            console.log(response);

        })
    
    }

    ////////////////////////////////////This is not working
    else {
        $("#city-input").html("Field cannot be empty");
    }
}

$("#history").on("click",function(){
    event.preventDefault();
    city = event.target.innerText;
    console.log("clicked city= "+city);
    //render search results
    
});

$("#search").on("click", function() {
    console.log("here")
    event.preventDefault();
    event.stopPropagation();

    searchType = $("#select").val();
    city = $("#findtext").val().trim();
   
    addHistory(city);
    callBrewAPI();    
});

renderHistory();


