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
    populateTables();
    // alert(`on success called Database: ${DB.name } Version : ${DB.version}`);
  };
  request.onerror = e => {
    alert("on error called ");
    //console.log(`Error ${e.target.errorCode}`);
  };
}

function populateTables() {
  populatePlaying();
  populateNotPlaying();
}

function populateNotPlaying() {
//   if (indexedDBIsOnline == "Have") {
    populateNotPlayingTableIndexDB();
//   } else if (localStorageIsOnline == "Have") {
//   }
}
function populatePlaying() {
//   if (indexedDBIsOnline == "Have") {
    populatePlayingTableIndexDB();
//   } else if (localStorageIsOnline == "Have") {
//   }
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
//option yes or no
function addPlayerToGame(data, option) {
  ////////////////////////////////////////////////////////////////////////////////////////////////////////

  var title = data;

  // Open up a transaction as usual
  var objectStore = DB.transaction(["Players"], "readwrite").objectStore(
    "Players"
  );

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
    console.log(
      "The transaction that originated this request is " +
        updateTitleRequest.transaction
    );

    // When this new request succeeds, run the displayData() function again to update the display
    updateTitleRequest.onsuccess = function() {
      console.log("Success update " + updateTitleRequest.readyState);

      location.reload();
    };
  };

  ////////////////////////////////////////////////////////////////////////////////////////////////////////
}

function addPlayer() {
  var userName = document.getElementById("username").value;
  var useremail = document.getElementById("email").value;
  locationStore = DB.transaction("Players", "readwrite").objectStore("Players");
  value = {
    playername: userName,
    email:useremail,
    playing:"no"
  };

  locationStore.add(value);
  document.getElementById("username").value = "";
  document.getElementById("email").value = "";

  populateTables();
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

function removeRowsFromNotPlayingTable() {
  var tableHeaderRowCount1 = 1;
  var table1 = document.getElementById("peoplenotplayingtable");
  var rowCount1 = table1.rows.length;
  console.log(`People Not playing table Row Count :${rowCount1}`);
  for (var i = tableHeaderRowCount1; i < rowCount1; i++) {
    table1.deleteRow(tableHeaderRowCount1);
  }
}

function removeRowsFromPlayingTable() {
  var tableHeaderRowCount2 = 1;
  var table2 = document.getElementById("peopleplayingtable");
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

    var table = document.getElementById("peopleplayingtable");

    // Create an empty <tr> element and add it to the last position of the table:
    var row = table.insertRow(-1);

    // Add some text to the new cells:
    var x = document.getElementById("peopleplayingtable").rows.length;
    x = x - 1;
    row.insertCell(0).outerHTML = '<th scope="row">' + x + "</th>"; // rather than innerHTML
    row.insertCell(1).outerHTML =
      "<td class='d-flex justify-content-start'>" + data.playername + "</td>";
    row.insertCell(2).outerHTML =
      "<td><button onclick='addPlayerToGame(\"" +
      data.playername +
      '","no")\' type="button" class="btn btn-primary">Remove</button></td>';
  }
}
function insertNotPlayingRow(data) {
  // Find a <table> element with id="myTable":
  console.log("inserting " + data.playername + " to Not Playing table");

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
    row.insertCell(2).outerHTML =
      "<td><button onclick='addPlayerToGame(\"" +
      data.playername +
      '","yes")\' type="button" class="btn btn-primary">Join</button></td>';
  }
}
//  alert(`on upgrade called Database: ${DB.name } Version : ${DB.version}` );

createDatabase();
