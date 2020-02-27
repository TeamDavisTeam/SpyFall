let DB;
let locationStore;
let playersStore;
const VERSION = 2;
const databaseName = "spyFallDB";
const indexedDBIsOnline = !window.indexedDB ? "Dont Have" : "Have";
const localStorageIsOnline = typeof Storage !== "undefined" ? "Have" : "Dont Have";
let locationsInPlayCount,locationsTotalCount;
function createDatabase() {
    request = indexedDB.open(databaseName, VERSION);
  
    request.onupgradeneeded = e => {
      DB = e.target.result;
      locationStore = DB.createObjectStore("Locations", {
        keyPath: "location",
        usedCount: 0,
        inplay: "inplay"
      });
      playersStore = DB.createObjectStore("Players", {
        keyPath: "playername",
        Email: "email",
        playing: "playing"
      });
  
      //  alert(`on upgrade called Database: ${DB.name } Version : ${DB.version}` );
    };
    request.onsuccess = e => {
      DB = e.target.result;
      // addValueToData();
      
      populateLocationTableIndexDB();
      // alert(`on success called Database: ${DB.name } Version : ${DB.version}`);
    };
    request.onerror = e => {
      alert("on error called ");
      //console.log(`Error ${e.target.errorCode}`);
    };
  }

  function populateLocationTableIndexDB() {
    removeRowsFromLocationTable();
  

  console.log(` Database idb ${DB} Database: ${databaseName } Version : ${VERSION}`);
   locationStore = DB.transaction("Locations", "readonly").objectStore("Locations");
  const req = locationStore.openCursor();
  req.onsuccess = e => {
    const cursor = e.target.result;

    if (cursor) {
      // console.log(`key: ${cursor.key} Location:${cursor.value.location} `);
     var data={
         location:cursor.value.location,
         usedCount:cursor.value.usedCount,
         inplay:cursor.value.inplay
     }
     locationsTotalCount++;
     addLocationToTable(data);
      cursor.continue();
    }
  };
}
function removeRowsFromLocationTable() {
    try {
      var tableHeaderRowCount2 = 1;
      var table2 = document.getElementById("locationTable");
      var rowCount2 = table2.rows.length;
      console.log(`locations Row Count :${rowCount2}`);
      for (var i = tableHeaderRowCount2; i < rowCount2; i++) {
        table2.deleteRow(tableHeaderRowCount2);
      }
    } catch (error) {
      console.log(`error prob had nothing to delete ${error}`);
    }
  }
function addLocationToTable(data) {
    // Find a <table> element with id="myTable":
    console.log(`Inserting ${data.location} usedCount:${data.usedCount} inplay:${data.inplay}`);
  
    if (data != null) {
      // gotta love redundancysssss
  
      var table = document.getElementById("locationTable");
  
      // Create an empty <tr> element and add it to the last position of the table:
      var row = table.insertRow(-1);
  
      var buttonColor;
      var NotPlaying;
      if(data.inplay==="yes"){
            buttonColor= "btn btn-success"
            NotPlaying="<=Playing=>"
      }else{
          buttonColor="btn btn-danger"
          NotPlaying="Not Playing"
      }
      // Add some text to the new cells:
      var x = document.getElementById("locationTable").rows.length;
      x = x - 1;
      row.insertCell(0).outerHTML = '<th scope="row">' + x + "</th>"; // rather than innerHTML
    //   row.insertCell(1).outerHTML =
    //     "<td class='d-flex justify-content-start'>" + data.location + "<button value=\"Use\" class=\""+buttonColor+"\" onclick=\"useLocation("+data.location+")\" type=\"button\" ></button></td>";
    //     // row.insertCell(1).outerHTML =
        // "<td class='d-flex justify-content-start'> <button value=\"Use\" class=\""+buttonColor+"\" onclick=\"useLocation("+data.location+")\" type=\"button\" ></button></td>";
        // 
        row.insertCell(1).outerHTML =
        "<div class=\" d-flex justify-content-between bg-secondary mb-3\"><div class=\"p-2 \">" + data.location + "</div><div class=\"p-2 bg-warning\"><button value=\"Use\" class=\""+buttonColor+"\" onclick=\"useLocation('"+data.location+"')\" type=\"button\" >"+NotPlaying+"</button></div></div>";
       
    }
  }

  function useLocation(data){

    console.log(typeof(data));
    addLocationToGame(data);

  }

  function addLocationToGame(locationInfo) {
   
  
    var locationName = locationInfo;
  
    // Open up a transaction as usual
    var objectStore = DB.transaction(["Locations"], "readwrite").objectStore(
      "Locations"
    );
  
    // Get the to-do list object that has this title as it's title
    var objectStoreTitleRequest = objectStore.get(locationName);
  
    objectStoreTitleRequest.onsuccess = function() {
      // Grab the data object returned as the result
      var data = objectStoreTitleRequest.result;
        var option;
      if(data.inplay==="yes"){
        option = "no"
      }else{
         option="yes"
      }
      // Update the notified value in the object to "yes"
      data.inplay = option;
  
      // Create another request that inserts the item back into the database
      var updateTitleRequest = objectStore.put(data);
  
      // Log the transaction that originated this request
      console.log(
        "The transaction that originated this request is " +
          updateTitleRequest.transaction
      );
  
      // When this new request succeeds, run the displayData() function again to update the display
      updateTitleRequest.onsuccess = function() {
        console.log("Success update " + updateTitleRequest.readyState);
  
       removeRowsFromLocationTable();
       populateLocationTableIndexDB();
      };
    };
  
    
  }

  createDatabase();