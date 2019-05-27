$(document).ready(function(){
    // Load Charts and the corechart package.
google.charts.load('current', {'packages':['corechart']});
console.log('charts loaded');
});

function initialize() {
  var opts = {sendMethod: 'auto'};
  // Replace the data source URL on next line with your data source URL.
  //var downtime_query = new google.visualization.Query(downtime_url, opts);
  //var test_query = new google.visualization.Query(pizza_test_url, opts);
  //console.log(test_query);

  // Optional request to return only column C and the sum of column B, grouped by C members.
  // downtime_query.setQuery('select C, sum(B) group by C');

  // Send the query with a callback function.
  //downtime_query.send(handleQueryResponse);
  //test_query.send(handleQueryResponse);
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
  







function query_google_sheets(season, field, alarm){
    sheet_name = "https://docs.google.com/spreadsheets/d/18FBlbVwB_dDpCnvruQ2WjHOtgzxufBYTsn3IMTEPLmg/edit#gid=1361174674";
    sheet_gid = "1361174674"
    key="18FBlbVwB_dDpCnvruQ2WjHOtgzxufBYTsn3IMTEPLmg"
    //query="https://spreadsheets.google.com/tq?tqx=out:html&tq=SELECT%20K%20WHERE%20E%20CONTAINS%20%27" + alarm + "%27%20AND%20I%20CONTAINS%20%27" + season + "%27%20AND%20J%20CONTAINS%20%27" + field + "%27";
    var query = new google.visualization.Query(sheet_name);
    query.setQuery('select K, WHERE E contains ' + alarm + ' limit 1');
    console.log(query);
    query.send(handleQueryResponse);
    //gviz/tq?tq=query

    console.log(query);
    console.log("https://spreadsheets.google.com/tq?tqx=out:html&tq=SELECT%20K%20WHERE%20E%20CONTAINS%20%27bms_status%27")

}

function submit_form(){
    season = ($('#season').val());
    field=($('#field').val());
    alarm=($('#alarm').val());
    console.log("season: " + season);
    console.log("field: " + field);
    console.log("alarm: " + alarm);
    query_google_sheets(season, field, alarm);

    $('#output').html("test val");
};

function reset_form(){
    season = ($('#season').val(" "));
    field=($('#field').val(" "));
    alarm=($('#alarm').val(" "));
    $('#output').html(" ");
};