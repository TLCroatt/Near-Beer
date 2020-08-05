$("#search").on("click", function() {
    console.log("here")
    event.preventDefault();
    event.stopPropagation();
    let city = $("#city-input").val().trim();
    if (city != '') {
        // The following clears the error if something is typed in the search field that isn't accepted
        $("#city-input").html("")
        
        console.log(localStorage.getItem("city"));
        searchCity(city);
        brewery(city);
        addHistory(city);
        renderHistory();

        $.ajax({
            url: createBreweryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
        })
        
        //clear search results on new search
        //$("")
    }
    else {
        $("#city-input").html("Field cannot be empty");
    }
});
// Save the cities searched for
function addHistory(city){ 
    // Check for changes in the local item and log them
    cities.push(city);
    localStorage.setItem("cities", cities); 
};

// Render the history localstorage
function renderHistory(){
    $("#history").empty();
    for (i = 0; i < cities.length; i++) {
        //    
        $("#history").append($("<button class='btn btn-info d-flex flex-column'>").attr("cityName", cities[i]).text(cities[i]));
    }
    $("#history button").on("click",function(){
        event.preventDefault();
        let searchedCity = $(this).attr("cityName");
    });
};

//function to create url based on search type
function createBreweryURL(){
    var searchtype ="city"//$(#"dropdownId").value;  //needs to be changed to dropdown ID
    var city = "Denver"
    var url = "";
    numBrew = 5;
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


