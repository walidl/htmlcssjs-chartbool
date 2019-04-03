function manageData(info){

  monthlySales(info)
}

function getMonth(){

  var form = ["DD/MM/YYYY","MMMM","YYYY-MM-DD"];

  var j = 0 ;
  do {
      var date = moment(inData[i].date,form[j]);
      j++;

    } while (date.format("M") == "Invalid date");

  return date.format("M");
}


function monthlySales(inData){

  var form = ["DD/MM/YYYY","MMMM","YYYY-MM-DD"]
  var monthlySales =[0,0,0,0,0,0,0,0,0,0,0,0,];

  for (var i = 0; i < inData.length; i++) {

    // var j = 0;
    // do {
    //   var date = moment(inData[i].date,form[j]);
    //   j++;
    //
    // } while (date.format("M") == "Invalid date");

    var mese = getMonth();

    monthlySales[mese-1] += Number(inData[i].amount);
  }

  console.log(monthlySales);
}


function getData(){

  $.ajax({

  url: "http://157.230.17.132:4013/sales",
  method: "GET",
  success: function(inData,state){

    console.log(inData);
    manageData(inData);

    var form = ["DD/MM/YYYY","MMMM","YYYY-MM-DD"]
    var monthlySales =[0,0,0,0,0,0,0,0,0,0,0,0,];

    for (var i = 0; i < inData.length; i++) {

      var j = 0;
      do {
        var date = moment(inData[i].date,form[j]);
        j++;

      } while (date.format("M") == "Invalid date");

      var mese = date.format("M")

      monthlySales[mese-1] += Number(inData[i].amount);
    }

    console.log(monthlySales);



  },
  error: function(){

    console.log("errore!")
  }
  })
}

function init(){

  getData();

}

$(document).ready(init);
