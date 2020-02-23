let request;
let DB;
let gamelocationStore;
let playersStore;
const VERSION = 1;
const databaseName = "spyFallDB";

function addLocation() {
  // const value = {
  //   location: "Kansas",
  //   text:"My First object"
  // };
  // const value2 = {
  //   location: "Florida",
  //   text:"My SEcond object"
  // };
  var gamelocationstring = document.getElementById("location").value;
  var data = {
    location: gamelocationstring
  };
  // const tx = DB.transaction("spyFallDB","readwrite");
  gamelocationStore = DB.transaction("Locations", "readwrite").objectStore(
    "Locations"
  );

  gamelocationStore.add(data);
  location.reload();
}

function getPlayers() {
  removeRowsFromTable();
  playersStore = DB.transaction("Players", "readonly").objectStore("Players");
  const req = playersStore.openCursor();
  req.onsuccess = e => {
    const cursor = e.target.result;

    if (cursor) {
      console.log(
        `key: ${cursor.key} PlayerName:${cursor.value.playername} Player Email:${cursor.value.email}`
      );
      var data = {
          location:cursor.value.playername
      }
      insertRow(data);
      cursor.continue();
    }
  };
}

function searchLocations() {
  removeRowsFromTable();
  var foundCount = 0;
  gamelocationStore = DB.transaction("Locations", "readonly").objectStore(
    "Locations"
  );
  const req = gamelocationStore.openCursor();
  req.onsuccess = e => {
    var stringToSearch = document
      .getElementById("locationsearch")
      .value.toUpperCase();
    var stringToSearchArray = Array.from(stringToSearch);
    const cursor = e.target.result;

    if (cursor) {
      var sqlString = cursor.value.location;

      var arraystring = Array.from(sqlString.toUpperCase());

      // console.log("arraystaring:"+arraystring);
      for (var i = 0; i <= stringToSearchArray.length; i++) {
        if (stringToSearchArray[i] == arraystring[i]) {
          // console.log(`i is:${i}and the length is${stringToSearchArray.length} \nfound match with my: ${arraystring[i]} and your :${stringToSearchArray[i]}`);
          if (i >= stringToSearchArray.length - 1) {
            // console.log("we have reached the end of search ");
            foundCount++;
            console.log(
              `We found ${cursor.value.location} is close to what you want `
            );
            foundCount += 1;
            var data = {
              location: cursor.value.location
            };
            insertRow(data);
          }
        } else {
          // console.log(`${cursor.value.location} Wasnt a match I is:${i}`);
          break;
        }
      }
      cursor.continue();
      // console.log(`key: ${cursor.key} Location:${cursor.value.location} `);
    }
  };

  if (foundCount == 0) {
    var data = {
      location: "Sorry Search ended up with zero results..."
    };
    insertRow(data);
    console.log("Sorry Search ended up with zero results...");
  }
}

function getLocations() {
  removeRowsFromTable();
  gamelocationStore = DB.transaction("Locations", "readonly").objectStore(
    "Locations"
  );
  const req = gamelocationStore.openCursor();
  req.onsuccess = e => {
    const cursor = e.target.result;

    if (cursor) {
     // console.log(`key: ${cursor.key} Location:${cursor.value.location} `);
      var data={
        location:cursor.value.location
      }
      insertRow(data);
      cursor.continue();
    }
  };
}

function addPlayer() {
  var username = document.getElementById("username").value;
  var userEmail = document.getElementById("email").value;

  if (userEmail !== "" && username !== "") {
    const value = {
      playername: username,
      email: userEmail
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

function createDatabase() {
  request = indexedDB.open(databaseName, VERSION);

  request.onupgradeneeded = e => {
    DB = e.target.result;
    gamelocationStore = DB.createObjectStore("Locations", {
      keyPath: "location"
    });
    playersStore = DB.createObjectStore("Players", {
      keyPath: "playername",
      Email: "email"
    });
    //  alert(`on upgrade called Database: ${DB.name } Version : ${DB.version}` );
  };
  request.onsuccess = e => {
    DB = e.target.result;
    // addValueToData();

    // alert(`on success called Database: ${DB.name } Version : ${DB.version}`);
  };
  request.onerror = e => {
    // alert("on error called ");
  };
}
function removeRowsFromTable(){

  var tableHeaderRowCount = 1;
var table = document.getElementById('addLocationTable');
var rowCount = table.rows.length;
for (var i = tableHeaderRowCount; i < rowCount; i++) {
    table.deleteRow(tableHeaderRowCount);
}


}
function insertRow(data) {
  // Find a <table> element with id="myTable":
  console.log("from search " + data.location);

  if (data != null) {
    // gotta love redundancysssss

    var table = document.getElementById("addLocationTable");
    
    // Create an empty <tr> element and add it to the last position of the table:
    var row = table.insertRow(-1);

    // Add some text to the new cells:
    var x = document.getElementById("addLocationTable").rows.length;
    x = x - 1;
    row.insertCell(0).outerHTML = '<th scope="row">' + x + "</th>"; // rather than innerHTML
    row.insertCell(1).outerHTML =
      "<td class='d-flex justify-content-start'>" + data.location + "</td>";
  }
}

createDatabase();
