let arrayOfLocations = [];

function retrieveLocationData() {
  
  
  results = localStorage.getItem("Locations");
  var parsedResults = JSON.parse(results);
  arrayOfLocations = parsedResults;
}

// must be the total array before saving here
function saveData() {
  var results = JSON.stringify(arrayOfLocations);

  localStorage.setItem("Locations", results);
  
  location.reload();
}

function insertRows() {
  retrieveLocationData();
  
  // Find a <table> element with id="myTable":

  var data = arrayOfLocations;

  if (data != null && data.length >= 0) {
    // gotta love redundancysssss

    for (var i = 0; i < data.length; i++) {
      var table = document.getElementById("addLocationTable");

      // Create an empty <tr> element and add it to the last position of the table:
      var row = table.insertRow(-1);

      // Add some text to the new cells:
      var x = document.getElementById("addLocationTable").rows.length;
      x = x - 1;
      row.insertCell(0).outerHTML = '<th scope="row">' + x + "</th>"; // rather than innerHTML
      row.insertCell(1).outerHTML = "<td class='d-flex justify-content-start'>"+data[i].location + "</td><td><button onclick=deleteLocation("+data[i].id+") class= 'btn btn-danger  bd-highlight' type= button >Delete</button></td>";
    }
  }
}
// this is called from the html page button click
function addLocation() {
  

  if (arrayOfLocations != 0 && arrayOfLocations != null) {
    length = arrayOfLocations.length;
    
    loc = document.getElementById("locationName").value;
    length = arrayOfLocations.length;
    data = {
        id: length,
        location: loc
      };
      arrayOfLocations.push(data);
      

  } else {
   
    loc = document.getElementById("locationName").value;
    arrayOfLocations =[];
    length = 0;
    data = {
        id: length,
        location: loc
      };
      arrayOfLocations.push(data);
      
  }
 
  saveData();
  
}

function addToFileAndRefresh(value) {
  var stringValueOfArray = JSON.stringify(value);
  saveData(stringValueOfArray);
}

function deleteLocation(id) {
  
  for( var i = 0; i < arrayOfLocations.length; i++){ 
    if ( arrayOfLocations[i].id === id) {
        results = arrayOfLocations[i];
        
      arrayOfLocations.splice(i, 1); 
    }
    
 }
 saveData();
 
}



///////   now load the data








if (typeof Storage !== "undefined") {
  // Code for localStorage/sessionStorage.
  console.log("Local Storage is Online ...");
  retrieveLocationData();
  
  insertRows();
  
} else {
  // Sorry! No Web Storage support..
  console.log("Sorry! No Web Storage support..");
}
