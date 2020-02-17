

let items

if (localStorage.getItem('locations')) {
  items = JSON.parse(localStorage.getItem('locations'))
} else {
  items = []
}

localStorage.setItem('locations', JSON.stringify(itemsArray))
const data = JSON.parse(localStorage.getItem('items'))







function insertRows(name){
// Find a <table> element with id="myTable":
var table = document.getElementById("addLocationTable");



    // Create an empty <tr> element and add it to the last position of the table:
var row = table.insertRow(-1);



// Add some text to the new cells:
var x = document.getElementById("addLocationTable").rows.length;
x = x-1;
row.insertCell(0).outerHTML = "<th scope=\"row\">"+x+"</th>";  // rather than innerHTML
row.insertCell(1).outerHTML = "<td>"+name+"</td>";  // rather than innerHTML   <th scope="row">1</th>   <td>New Jersey</td>

}


function addLocation(){

console.log("Hello from javascript!!!!");
loc = document.getElementById("locationName").value;
console.log(loc);

insertRows(loc);

}
