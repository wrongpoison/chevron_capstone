downtime_url='https://drive.google.com/file/d/18p4P4-ob1X7DSonIp6Hpy426zOAuBJsm/view?usp=sharing'
alarm_url='https://docs.google.com/spreadsheets/d/1efXgXid3tvyGs8S4OhkJAvKbNoHTsvJmVun9riH2X1A/edit?usp=sharing'
pizza_test_url='https://docs.google.com/spreadsheets/d/1eemi9_R7QEZp1SyOGUWvJ5XysUbKYlASQL9_PmcS_Po/edit#gid=0'


// Load Charts and the corechart package.
google.charts.load('current', {'packages':['corechart']});
console.log('charts loaded');

function initialize() {
  var opts = {sendMethod: 'auto'};
  // Replace the data source URL on next line with your data source URL.
  //var downtime_query = new google.visualization.Query(downtime_url, opts);
  var test_query = new google.visualization.Query(pizza_test_url, opts);
  console.log(test_query);

  // Optional request to return only column C and the sum of column B, grouped by C members.
  // downtime_query.setQuery('select C, sum(B) group by C');

  // Send the query with a callback function.
  //downtime_query.send(handleQueryResponse);
  test_query.send(handleQueryResponse);
}

function handleQueryResponse(response) {
  // Called when the query response is returned.
  if (response.isError()){
      alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
      return;
  }
  var data = response.getDataTable();
  console.log(data);
  var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
  chart.draw(data, {width: 400, height:300, is3D: true});
  chart.draw(data, null);
}

google.setOnLoadCallback(initialize);


// // Draw the pie chart for Sarah's pizza when Charts is loaded.
// google.charts.setOnLoadCallback(drawSarahChart);

// // Draw the pie chart for the Anthony's pizza when Charts is loaded.
// google.charts.setOnLoadCallback(drawAnthonyChart);

// // Callback that draws the pie chart for Sarah's pizza.
// function drawSarahChart() {

//   // Create the data table for Sarah's pizza.
//   var data = new google.visualization.DataTable();
//   data.addColumn('string', 'Topping');
//   data.addColumn('number', 'Slices');
//   data.addRows([
//     ['Mushrooms', 1],
//     ['Onions', 1],
//     ['Olives', 2],
//     ['Zucchini', 2],
//     ['Pepperoni', 1]
//   ]);

//   // Set options for Sarah's pie chart.
//   var options = {title:'How Much Pizza Sarah Ate Last Night',
//                  width:500,
//                  height:300};

//   // Instantiate and draw the chart for Sarah's pizza.
//   var chart = new google.visualization.PieChart(document.getElementById('Sarah_chart_div'));
//   chart.draw(data, options);
// }

// // Callback that draws the pie chart for Anthony's pizza.
// function drawAnthonyChart() {

//   // Create the data table for first chart
//   var data = new google.visualization.DataTable();
//   data.addColumn('string', 'Topping');
//   data.addColumn('number', 'Slices');
//   data.addRows([
//     ['Mushrooms', 2],
//     ['Onions', 2],
//     ['Olives', 2],
//     ['Zucchini', 0],
//     ['Pepperoni', 3]
//   ]);

//   // Set options for Anthony's pie chart.
//   var options = {title:'How Much Pizza Anthony Ate Last Night',
//                  width:500,
//                  height:300};

//   // Instantiate and draw the chart for Anthony's pizza.
//   var chart = new google.visualization.PieChart(document.getElementById('Anthony_chart_div'));
//   chart.draw(data, options);
// }