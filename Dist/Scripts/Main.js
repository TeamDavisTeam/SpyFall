let request;
let DB;
let gamelocationStore;
let playerStore ;
let gamePlayerStore; 
let locationStore;

const VERSION = 2;
const databaseName = "spyFallDB";
const indexedDBIsOnline = !window.indexedDB ? "Dont Have" : "Have";
const localStorageIsOnline = typeof Storage !== "undefined" ? "Have" : "Dont Have";

// this will set some variables just in case we need local storage
let arrayOfLocations = []; // these are the total list or "ARRAY " of locations the script could chose from
let arrayOfPlayers = []; // array of all players
let arrayOfGamePlayers = []; // array of Players Playing the game
let arrayOfGameLocations = []; // array of locations currently in the game

// end of variables for local storage

// In the following line, you should include the prefixes of implementations you want to test.
window.indexedDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB;
// DON'T use "var indexedDB = ..." if you're not in a function.
// Moreover, you may need references to some window.IDB* objects:
window.IDBTransaction = window.IDBTransaction ||
  window.webkitIDBTransaction ||
  window.msIDBTransaction || { READ_WRITE: "readwrite" }; // This line should only be needed if it is needed to support the object's constants for older browsers
window.IDBKeyRange =
  window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
// (Mozilla has never prefixed these objects, so we don't need window.mozIDB*)

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
   // populateTables();
    // alert(`on success called Database: ${DB.name } Version : ${DB.version}`);
    console.log(`on success called Database: ${DB.name } Version : ${DB.version}`);
  };
  request.onerror = e => {
     alert("on error called ");
    //console.log(`Error ${e.target.errorCode}`);
  };
}
createDatabase();