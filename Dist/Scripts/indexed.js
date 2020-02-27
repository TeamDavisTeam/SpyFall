let request;
let DB;
let gamelocationStore;
let playerStore ;
let gamePlayerStore; 
let locationStore;

const VERSION = 1;
const databaseName = "spyFallDB";
const indexedDBIsOnline = !window.indexedDB ? "Dont Have" : "Have";
const localStorageIsOnline = typeof Storage !== "undefined" ? "Have" : "Dont Have";

// this will set some variables just in case we need local storage
let arrayOfLocations = []; // these are the total list or "ARRAY " of locations the script could chose from
let arrayOfPlayers = []; // array of all players
let arrayOfGamePlayers = []; // array of Players Playing the game
let arrayOfGameLocations = []; // array of locations currently in the game

// end of variables for local storage

// // In the following line, you should include the prefixes of implementations you want to test.
// window.indexedDB =
//   window.indexedDB ||
//   window.mozIndexedDB ||
//   window.webkitIndexedDB ||
//   window.msIndexedDB;
// // DON'T use "var indexedDB = ..." if you're not in a function.
// // Moreover, you may need references to some window.IDB* objects:
// window.IDBTransaction = window.IDBTransaction ||
//   window.webkitIDBTransaction ||
//   window.msIDBTransaction || { READ_WRITE: "readwrite" }; // This line should only be needed if it is needed to support the object's constants for older browsers
// window.IDBKeyRange =
//   window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
// // (Mozilla has never prefixed these objects, so we don't need window.mozIDB*)

function createDatabase() {
  request = indexedDB.open(databaseName, VERSION);

  request.onupgradeneeded = e => {
    DB = e.target.result;
    locationStore = DB.createObjectStore("Locations", {
      keyPath: "location",
      usedCount:0,
      inplay:"inplay"
    });
    playersStore = DB.createObjectStore("Players", {
      keyPath: "playername",
      Email: "email",
      playing:"playing"
    });
   
    
    //  alert(`on upgrade called Database: ${DB.name } Version : ${DB.version}` );
  };
  request.onsuccess = e => {
    DB = e.target.result;
    // addValueToData();
    populateTables();
    // alert(`on success called Database: ${DB.name } Version : ${DB.version}`);
  };
  request.onerror = e => {
     alert("on error called ");
    //console.log(`Error ${e.target.errorCode}`);
  };
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Dom Functions
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function populatePlayingTableIndexDB() {
    removeRowsFromPlayingTable();
   playersStore = DB.transaction("Players", "readonly").objectStore(
    "Players"
  );
  const req = playersStore.openCursor();
 req.onsuccess = e => {
   const cursor = e.target.result;

   if (cursor) {
    // console.log(`key: ${cursor.key} Location:${cursor.value.location} `);
    if(cursor.value.playing ==="yes"){
        var data={
            playername:cursor.value.playername,
             Email:cursor.value.email,
             playing:cursor.value.playing
         }
         insertPlayingRow(data);
    }
     cursor.continue();
   }
 };
  }

 




//   function insertRow(data) {
//     // Find a <table> element with id="myTable":
//     console.log("from search " + data.location);
  
//     if (data != null) {
//       // gotta love redundancysssss
  
//       var table = document.getElementById("addLocationTable");
      
//       // Create an empty <tr> element and add it to the last position of the table:
//       var row = table.insertRow(-1);
  
//       // Add some text to the new cells:
//       var x = document.getElementById("addLocationTable").rows.length;
//       x = x - 1;
//       row.insertCell(0).outerHTML = '<th scope="row">' + x + "</th>"; // rather than innerHTML
//       row.insertCell(1).outerHTML =
//         "<td class='d-flex justify-content-start'>" + data.location + "</td>";
//     }
//   }
  
  function insertPlayingRow(data){
 // Find a <table> element with id="myTable":
 console.log("inserting " + data.playername+" to Playing table");
  
 if (data != null) {
   // gotta love redundancysssss

   var table = document.getElementById("peopleplayingtable");
   
   // Create an empty <tr> element and add it to the last position of the table:
   var row = table.insertRow(-1);

   // Add some text to the new cells:
   var x = document.getElementById("peopleplayingtable").rows.length;
   x = x - 1;
   row.insertCell(0).outerHTML = '<th scope="row">' + x + "</th>"; // rather than innerHTML
   row.insertCell(1).outerHTML =
     "<td class='d-flex justify-content-start'>" + data.playername + "</td>";
     row.insertCell(2).outerHTML = '<td><button onclick=\'addPlayerToGame("'+data.playername+'","no")\' type="button" class="btn btn-primary">Remove</button></td>';
 
    }


  }
  function insertNotPlayingRow(data){
    // Find a <table> element with id="myTable":
    console.log("inserting " + data.playername+" to Not Playing table");
     
    if (data != null) {
      // gotta love redundancysssss
   
      var table = document.getElementById("peoplenotplayingtable");
      
      // Create an empty <tr> element and add it to the last position of the table:
      var row = table.insertRow(-1);
   
      // Add some text to the new cells:
      var x = document.getElementById("peoplenotplayingtable").rows.length;
      x = x - 1;
      row.insertCell(0).outerHTML = '<th scope="row">' + x + "</th>"; // rather than innerHTML
      row.insertCell(1).outerHTML =
        "<td class='d-flex justify-content-start'>" + data.playername + "</td>";
        row.insertCell(2).outerHTML = '<td><button onclick=\'addPlayerToGame("'+data.playername+'","yes")\' type="button" class="btn btn-primary">Join</button></td>';
    }
   
   
     }
   


  function populateNotPlayingTableIndexDB() {
     removeRowsFromNotPlayingTable();
    playersStore = DB.transaction("Players", "readonly").objectStore(
        "Players"
      );
      const req = playersStore.openCursor();
     req.onsuccess = e => {
       const cursor = e.target.result;
   
       if (cursor) {
        // console.log(`key: ${cursor.key} Location:${cursor.value.location} `);
        if(cursor.value.playing ==="no"){
            var data={
                playername:cursor.value.playername,
                 Email:cursor.value.email,
                 playing:cursor.value.playing
             }
             insertNotPlayingRow(data);
        }
         cursor.continue();
       }
     };
   }

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function addPlayerToIndexed() {
  var username = document.getElementById("username").value;
  var userEmail = document.getElementById("email").value;

  if (userEmail !== "" && username !== "") {
    const value = {
        playername: username,
      email: userEmail,
      playing:"no"
    };
    // const value2 = {
    //   location: "Florida",
    //   text:"My SEcond object"
    // };

    // const tx = DB.transaction("spyFallDB","readwrite");
    playersStore = DB.transaction("Players", "readwrite").objectStore(
      "Players"
    );

    playersStore.add(value);
  } else {
    console.log(
      "setup An alert of somekind for input of player names and email add page"
    );
  }
  location.reload();
}
// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//------------------------------------------------------------------------------------------------------------------//
  // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//------------------------------------------------------------------------------------------------------------------//
//   This Will Start the Local Storage Functions
 // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
 //------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------//
  // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//------------------------------------------------------------------------------------------------------------------//
  // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Dom Manipulation Functions
 // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
// this will be when the user presses the join button 


// this will be when the user presses the Remove button 





function insertPlayerRows() {
    retrieveLocalStorage();
    
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
  function insertLocationRows() {
    retrieveLocalStorage();
    
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
 
 
  // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Delete Functions 
  // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
  function deleteLocation(id) {
    
    for( var i = 0; i < arrayOfLocations.length; i++){ 
      if ( arrayOfLocations[i].id === id) {
          results = arrayOfLocations[i];
          
        arrayOfLocations.splice(i, 1); 
      }
      
   }
   for( var i = 0; i < arrayOfLocations.length; i++){ 
     arrayOfLocations[i].id = i;
      
   }
   saveData();
   
  }
  // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ADD Functions 
// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
function addPlayerToLocalStorage() {
  var username = document.getElementById("username").value;
  var userEmail = document.getElementById("email").value;

  if (userEmail !== "" && username !== "") {
    const value = {
      playername: username,
      email: userEmail
    };
     
  
    if (arrayOfPlayers != 0 && arrayOfPlayers != null) {
        length = arrayOfPlayers.length;
        
        
        length = arrayOfPlayers.length;
        data = {
            id: length,
            playername: username,
            email:userEmail
          };
          arrayOfPlayers.push(data);
          
    
      } else {
       
        
        arrayOfPlayers =[];
        length = 0;
        data = {
            id: length,
            playername: username,
            email:userEmail
          };
          arrayOfPlayers.push(data);
          
      }
     
      savePlayersArray();
  } else {
    console.log(
      "setup An alert of somekind for input of player names and email add page"
    );
  }
  location.reload();
}



// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//           SAVING---- Updating ARRAYS  FUNCTIONS 
// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
function resetArrayIDs(arrayt){
    for( var i = 0; i < arrayt.length; i++){ 
        arrayt[i].id = i;
         
      }
      
}
function savePlayersArray() {
    var results = JSON.stringify(arrayOfPlayers);
  
    localStorage.setItem("Players", results);
    
    location.reload();
  }
  function saveGamePlayersArray() {
    var results = JSON.stringify(arrayOfGamePlayers);
  
    localStorage.setItem("GamePlayers", results);
    
    location.reload();
  }
  function saveLocationsArray() {
    var results = JSON.stringify(arrayOfLocations);
  
    localStorage.setItem("Locations", results);
    
    location.reload();
  }
  function saveGameLocationsArray() {
    var results = JSON.stringify(arrayOfGameLocations);
  
    localStorage.setItem("GameLocations", results);
    
    location.reload();
  }
// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//           Retreiving ARRAYS  FUNCTIONS 
// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

  function retrieveLocalStorage() {
  // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // get the String stored in local storage 
    locationResults = localStorage.getItem("Locations");
    playersResults = localStorage.getItem("Players");
    gameLocationsResults = localStorage.getItem("GameLocations");
    gamePlayersResults = localStorage.getItem("GamePlayers");
// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // parse the json string 
    var parsedlocationResults = JSON.parse(locationResults);
    var parsedplayersResults = JSON.parse(playersResults);
    var parsedgameLocationsResults = JSON.parse(gameLocationsResults);
    var parsedgamePlayersResults = JSON.parse(gamePlayersResults);
    // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // update the arrays 
    arrayOfLocations = parsedlocationResults;
    arrayOfPlayers = parsedplayersResults;
    arrayOfGameLocations=parsedgameLocationsResults;
    arrayOfGamePlayers = parsedgamePlayersResults;
  }


  
function addPlayer() {
    if(indexedDBIsOnline=="Have"){
        addPlayerToIndexed();
    }else if(localStorageIsOnline=="Have"){
        addPlayerToLocalStorage();
    }
}

function populateTables() {
    
populatePlaying();
populateNotPlaying();


}

function populateNotPlaying() {

if(indexedDBIsOnline=="Have"){
    populateNotPlayingTableIndexDB();
}else if(localStorageIsOnline=="Have"){
   
}

}
function populatePlaying() {

if(indexedDBIsOnline=="Have"){
    populatePlayingTableIndexDB();
}else if(localStorageIsOnline=="Have"){
   
}

}
//option yes or no
function addPlayerToGame(data,option){
//    createDatabase();
  
//     console.log(`called add Player to game  ${data} and ${option}`);
//     playersStore = DB.transaction("Players", "readwrite").objectStore(
//         "Players"
//       );
//       var objectStoreplayernameRequest = playersStore.get(data);

//       objectStoreplayernameRequest.onsuccess = function() {
//         // Grab the data object returned as the result
//         var data = objectStoreplayernameRequest.result;
      
//         // Update the notified value in the object to "yes"
//         data.playing = option;
      
//         // Create another request that inserts the item back into the database
//         var updateTitleRequest = playersStore.put(data);
      
//         // Log the transaction that originated this request
//         //console.log("The transaction that originated this request is " + updateTitleRequest.transaction);
      
//         // When this new request succeeds, run the displayData() function again to update the display
//         // When this new request succeeds, run the displayData() function again to update the display
//         playersStore.onsuccess = function() {
//             location.reload();
//   };
        
        
//       };
     ////////////////////////////////////////////////////////////////////////////////////////////////////////

     var title = data;

// Open up a transaction as usual
var objectStore = DB.transaction(['Players'], "readwrite").objectStore('Players');

// Get the to-do list object that has this title as it's title
var objectStoreTitleRequest = objectStore.get(title);

objectStoreTitleRequest.onsuccess = function() {
  // Grab the data object returned as the result
  var data = objectStoreTitleRequest.result;

  // Update the notified value in the object to "yes"
  data.playing = option;

  // Create another request that inserts the item back into the database
  var updateTitleRequest = objectStore.put(data);

  // Log the transaction that originated this request
  console.log("The transaction that originated this request is " + updateTitleRequest.transaction);

  // When this new request succeeds, run the displayData() function again to update the display
  updateTitleRequest.onsuccess = function() {
  console.log("Success update "+updateTitleRequest.readyState);

    location.reload();
  };
  
};

     ////////////////////////////////////////////////////////////////////////////////////////////////////////
}

function removeRowsFromNotPlayingTable(){

    var tableHeaderRowCount1 = 1;
  var table1 = document.getElementById('peoplenotplayingtable');
  var rowCount1 = table1.rows.length;
  console.log(`People Not playing table Row Count :${rowCount1}`);
  for (var i = tableHeaderRowCount1; i < rowCount1; i++) {
      table1.deleteRow(tableHeaderRowCount1);
  }
 
  
  }

  function removeRowsFromPlayingTable(){

    var tableHeaderRowCount2 = 1;
    var table2 = document.getElementById('peopleplayingtable');
    var rowCount2 = table2.rows.length;
    console.log(`People playing table Row Count :${rowCount2}`);
    for (var i = tableHeaderRowCount2; i < rowCount2; i++) {
        table2.deleteRow(tableHeaderRowCount2);
    }

  }

// var title = "Walk dog";

// // Open up a transaction as usual
// var objectStore = db.transaction(['toDoList'], "readwrite").objectStore('toDoList');

// // Get the to-do list object that has this title as it's title
// var objectStoreTitleRequest = objectStore.get(title);

// objectStoreTitleRequest.onsuccess = function() {
//   // Grab the data object returned as the result
//   var data = objectStoreTitleRequest.result;

//   // Update the notified value in the object to "yes"
//   data.notified = "yes";

//   // Create another request that inserts the item back into the database
//   var updateTitleRequest = objectStore.put(data);

//   // Log the transaction that originated this request
//   console.log("The transaction that originated this request is " + updateTitleRequest.transaction);

//   // When this new request succeeds, run the displayData() function again to update the display
//   updateTitleRequest.onsuccess = function() {
//     displayData();
//   };
// };







if (indexedDBIsOnline == "Have") {
console.log("We have Indexed DB ");
createDatabase();


} else if (indexedDBIsOnline == "Dont Have") {
  if(localStorageIsOnline=="Have"){
      // we have local storage
      console.log("We have Local Storage");
      retrieveLocalStorage();
      
  }else{
      // we dont have any storage options 
      alert(`Sorry IndexedDB and Local Storage is Offline There arent any options for Storage`);
      document.getElementById("addPlayerButton").disabled = true;
  }
    }



