//global variables
var searches = [];
var brewList = [];
var searchTerm = {text: "",
                searchType: ""};

//constants
const displayNum = 5;  // number of breweries displayed
const numBrew = 5;     // number of breweries limited in response 
const mapApiKey ="lXw9IgIAR4y4IkigocbWh3gsNoX7Be92";  //API key for mapquest

//hide display box before search
//$("#search-results").hide();

// Save the cities searched for
function addHistory(searchTerm){ 
    // Check for changes in the local item and log them
    var index = -1
    var storedSearches = JSON.parse(localStorage.getItem("searches"));
    if(storedSearches !== null){
        searches = storedSearches;
        searchTerm.text.toUpperCase();

        //find if search tearm is already stored
        for (let i = 0; i < searches.length; i++) {
            if(searches[i].text === searchTerm.text){
                index = i;
            }
        }
    }

    //push SearchTerm into searches if it is not there
    if(index === -1){
        if(searchTerm.text !== "" && searchTerm.text !== null){
            searches.push(searchTerm);
            localStorage.setItem("searches", JSON.stringify(searches));
        }
    };
    renderHistory();
};

// Render the history localstorage
function renderHistory(){
    $("#history").empty();
    var storedSearches = JSON.parse(localStorage.getItem("searches"));
    if(storedSearches !== null){
        searches = storedSearches;
    } 

    //add all searches to history
    for (i = 0; i < searches.length; i++) {
        var listEl = $("<li>");  
        $(listEl).append($("<button class='btn btn-info d-flex flex-column'>").attr("data-searchType", searches[i].searchType).text(searches[i].text));
        $("#history").append(listEl);
    }
    
};

//function to create url based on search type
function createBreweryURL(){
    var url = "";
    switch(searchTerm.searchType){
        case "City":
            url = "https://api.openbrewerydb.org/breweries?by_city=" + searchTerm.text +"&per_page="+ numBrew;  
            break;
        case "Brewery-Name":
            url = "https://api.openbrewerydb.org/breweries?by_name=" + searchTerm.text +"&per_page="+ numBrew;
            break;
        case "Zip-Code":
            url ="https://api.openbrewerydb.org/breweries?by_postal=" + searchTerm.text +"&per_page="+ numBrew;
            break;
        default:
            url ="https://api.openbrewerydb.org/breweries?by_city=" + searchTerm.text +"&per_page="+ numBrew;
            break;
    } 
    return url; 
}

function renderResults(response){
    //clear container
    $("#search-results").empty();
    // for each brewery in response
    for (i = 0; i < response.length; i++) {
 
        var outerDivEl = $("<div class= 'media-object stack-for-small'>");  
        var mediaEl = $("<div class= 'media-object-section'>");
        var thumbnailEl = $("<div class= 'thumbnail'>");
        var imageEl = $("<img>");
        imageEl.attr("src","https://www.mapquestapi.com/staticmap/v5/map?key="+mapApiKey+"&locations="+response[i].street+","+
            response[i].city+","+response[i].state+"&size=300,250" )
        
        $(thumbnailEl).append(imageEl);
        $(mediaEl).append(thumbnailEl);
        $(outerDivEl).append(mediaEl);

        var media2El = $("<div class= 'media-object-section'>");
        var nameEl = $("<h4>").text(response[i].name);
        var addressEl = $("<p>").text(response[i].street);
        var phoneNumberEl = $("<p>").text(response[i].phone);
        var urlEl = $("<p>").text(response[i].website_url);

        $(media2El).append(nameEl);
        $(media2El).append(addressEl);
        $(media2El).append(phoneNumberEl);
        $(urlEl).append(media2El);

        $(outerDivEl).append(media2El);
        $("#search-results").append(outerDivEl);
    }
    
}

function renderNotFound(){
    $("#search-results").empty();
    $("#search-results").append($("<h3>").text("No Results Found"));
}

function callBrewAPI(){
    //if search term is not empty
    if (searchTerm.text !== "") {
        // The following clears the error if something is typed in the search field that isn't accepted
       
        
        $.ajax({
            url: createBreweryURL(),
            method: "GET"
        }).then(function(response){
            if(response.length > 0){
                renderResults(response);
            }else{
                renderNotFound();
            }
        });
    }

    
}

$(document).keypress(function(event) {
    console.log("here")
    if (event.keyCode === 13) {
      event.preventDefault();
      $("#search").click();
    
    }
  });

$("#history").on("click",function(){
    event.preventDefault();
    searchTerm.text = event.target.innerText;
    searchTerm.searchType = $(event.target).attr("data-searchType");
    callBrewAPI()
    
});

$("#search").on("click", function() {
console.log("here")
    event.preventDefault();
    event.stopPropagation();

    searchTerm.searchType = $("#select").val();
    searchTerm.text = $("#findtext").val().trim();

    $("#findtext").val("");
   
    addHistory(searchTerm);
    callBrewAPI();    
});

$("#clear").on("click", function() {
    searches = [];
    localStorage.removeItem("searches");
    renderHistory();
})

$("#search-results").empty();
renderHistory();


