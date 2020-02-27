let DB;
let locationStore;
let playersStore;
const VERSION = 2;
const databaseName = "spyFallDB";

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





function removeRowsFromLocationTable(){

    var tableHeaderRowCount2 = 1;
    var table2 = document.getElementById('gameviewlocationstable');
    var rowCount2 = table2.rows.length;
   // console.log(`locations Row Count :${rowCount2}`);
    for (var i = tableHeaderRowCount2; i < rowCount2; i++) {
        table2.deleteRow(tableHeaderRowCount2);
    }
        console.log(`Deleted ${rowCount2} of ${rowCount2} Rows `);
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
        if(cursor.value.inplay==="yes"){
          addLocationToTable(cursor.value);
        }
        
        cursor.continue();
      }
    };
  }


  function addLocationToTable(data) {
    // Find a <table> element with id="myTable":
    console.log("inserting " + data.location + " to Locations table");
  
    if (data != null) {
      // gotta love redundancysssss
  
      var table = document.getElementById("gameviewlocationstable");
  
      // Create an empty <tr> element and add it to the last position of the table:
      var row = table.insertRow(-1);
  
      // Add some text to the new cells:
      var x = document.getElementById("gameviewlocationstable").rows.length;
      x = x - 1;
      row.insertCell(0).outerHTML = '<th scope="row">' + x + "</th>"; // rather than innerHTML
      row.insertCell(1).outerHTML =
        "<td class='d-flex justify-content-start'>" + data.location + "</td>";
    }
  }



  createDatabase();
  