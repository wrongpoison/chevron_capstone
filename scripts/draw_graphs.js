function initialize() {
  var opts = {sendMethod: 'auto'};
  // Replace the data source URL on next line with your data source URL.
  var query = new google.visualization.Query('http://spreadsheets.google.com?key=123AB&...', opts);

  // Optional request to return only column C and the sum of column B, grouped by C members.
  query.setQuery('select C, sum(B) group by C');

  // Send the query with a callback function.
  query.send(handleQueryResponse);
}

function handleQueryResponse(response) {
  // Called when the query response is returned.
}

// Load Charts and the corechart package.
google.charts.load('current', {'packages':['corechart']});

// Draw the pie chart for Sarah's pizza when Charts is loaded.
google.charts.setOnLoadCallback(drawSarahChart);

// Draw the pie chart for the Anthony's pizza when Charts is loaded.
google.charts.setOnLoadCallback(drawAnthonyChart);

// Callback that draws the pie chart for Sarah's pizza.
function drawSarahChart() {

  // Create the data table for Sarah's pizza.
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Topping');
  data.addColumn('number', 'Slices');
  data.addRows([
    ['Mushrooms', 1],
    ['Onions', 1],
    ['Olives', 2],
    ['Zucchini', 2],
    ['Pepperoni', 1]
  ]);

  // Set options for Sarah's pie chart.
  var options = {title:'How Much Pizza Sarah Ate Last Night',
                 width:500,
                 height:300};

  // Instantiate and draw the chart for Sarah's pizza.
  var chart = new google.visualization.PieChart(document.getElementById('Sarah_chart_div'));
  chart.draw(data, options);
}

// Callback that draws the pie chart for Anthony's pizza.
function drawAnthonyChart() {

  // Create the data table for first chart
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Topping');
  data.addColumn('number', 'Slices');
  data.addRows([
    ['Mushrooms', 2],
    ['Onions', 2],
    ['Olives', 2],
    ['Zucchini', 0],
    ['Pepperoni', 3]
  ]);

  // Set options for Anthony's pie chart.
  var options = {title:'How Much Pizza Anthony Ate Last Night',
                 width:500,
                 height:300};

  // Instantiate and draw the chart for Anthony's pizza.
  var chart = new google.visualization.PieChart(document.getElementById('Anthony_chart_div'));
  chart.draw(data, options);
}