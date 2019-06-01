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
      console.log('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
      return;
  }
  var data = response.getDataTable();
  console.log("Data: " + data);
  //var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
  //chart.draw(data, {width: 400, height:300, is3D: true});
  //chart.draw(data, null);
  return data;
}

google.setOnLoadCallback(initialize);
  







function query_google_sheets(season, field, alarm){
    
    sheet_name = "https://spreadsheets.google.com/tq?&tq=&key=1u4gPK5jV2ZJ2_qft2uc_DlKvr8zNgaKt5QD2efcKtko";
    //sheet_gid = "294463958";
    //key="1u4gPK5jV2ZJ2_qft2uc_DlKvr8zNgaKt5QD2efcKtko";

    var query = new google.visualization.Query(sheet_name);
    query.setQuery("select J limit 1");
    console.log(query);
    response = query.send(handleQueryResponse);
    console.log(response);
    return response;
    // //gviz/tq?tq=query

    //query = "https://spreadsheets.google.com/tq?tqx=out:html&tq=select%20J%20where%20I%20contains%20%22Shamrock%22%20AND%20H%20contains%20%224%22%20limit%201&key=1u4gPK5jV2ZJ2_qft2uc_DlKvr8zNgaKt5QD2efcKtko";
    //console.log(query);
}

function submit_form(){
    season = ($('#season').val());
    field=($('#field').val());
    alarm=($('#alarm').val());
    console.log("season: " + season);
    console.log("field: " + field);
    console.log("alarm: " + alarm);
    prediction = query_google_sheets(season, field, alarm);
    console.log(prediction);

    //Case statements for web app
    var output_codes = ["Misc - Other", "Industrial Action", "Repair/Failure", "Weather/Seas"];
    prediction = output_codes[Math.floor(Math.random()*output_codes.length)];
    $('#output').html(prediction);
};

function reset_form(){
    season = ($('#season').val(" "));
    field=($('#field').val(" "));
    alarm=($('#alarm').val(" "));
    $('#output').html(" ");
};