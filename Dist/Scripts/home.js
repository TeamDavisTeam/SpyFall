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
      populatePlayingTableIndexDB();
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
     if(cursor.value.inplay==="yes"){
        locationsInPlayCount++;
        addLocationToTable(cursor.value);

     }
     locationsTotalCount++;
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
    console.log("inserting " + data.location + " to Locations table");
  
    if (data != null) {
      // gotta love redundancysssss
  
      var table = document.getElementById("locationTable");
  
      // Create an empty <tr> element and add it to the last position of the table:
      var row = table.insertRow(-1);
  
      // Add some text to the new cells:
      var x = document.getElementById("locationTable").rows.length;
      x = x - 1;
      row.insertCell(0).outerHTML = '<th scope="row">' + x + "</th>"; // rather than innerHTML
      row.insertCell(1).outerHTML =
        "<td class='d-flex justify-content-start'>" + data.location + "</td>";
        }
  }


  function populatePlayingTableIndexDB() {
    removeRowsFromPlayingTable();
    playersStore = DB.transaction("Players", "readonly").objectStore("Players");
    const req = playersStore.openCursor();
    req.onsuccess = e => {
      const cursor = e.target.result;
  
      if (cursor) {
        // console.log(`key: ${cursor.key} Location:${cursor.value.location} `);
        if (cursor.value.playing === "yes") {
          var data = {
            playername: cursor.value.playername,
            Email: cursor.value.email,
            playing: cursor.value.playing
          };
          insertPlayingRow(data);
        }
        cursor.continue();
      }
    };
  }
  function removeRowsFromPlayingTable() {
    var tableHeaderRowCount2 = 1;
    var table2 = document.getElementById("playingTable");
    var rowCount2 = table2.rows.length;
    console.log(`People playing table Row Count :${rowCount2}`);
    for (var i = tableHeaderRowCount2; i < rowCount2; i++) {
      table2.deleteRow(tableHeaderRowCount2);
    }
  }
  function insertPlayingRow(data) {
    // Find a <table> element with id="myTable":
    console.log("inserting " + data.playername + " to Playing table");
  
    if (data != null) {
      // gotta love redundancysssss
  
      var table = document.getElementById("playingTable");
  
      // Create an empty <tr> element and add it to the last position of the table:
      var row = table.insertRow(-1);
  
      // Add some text to the new cells:
      var x = document.getElementById("playingTable").rows.length;
      x = x - 1;
      row.insertCell(0).outerHTML = '<th scope="row">' + x + "</th>"; // rather than innerHTML
      row.insertCell(1).outerHTML =
        "<div class=\" d-flex justify-content-between bg-secondary mb-3\"><div class=\"p-2 \">" + data.playername + "</div><div class=\"p-2 bg-success\">Playing</div></div>";
       
    //   row.insertCell(2).outerHTML =
    //     "<td><button onclick='addPlayerToGame(\"" +
    //     data.playername +
    //     '","no")\' type="button" class="btn btn-primary">Remove</button></td>';
    }
  }




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

       