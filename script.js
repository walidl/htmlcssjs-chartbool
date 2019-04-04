// fa un ciclo do while su tre tipi di format
// esce quando il format mi da mese diverso dalla stringa di errore "Invalid date"
function getMonth(date){

  var form = ["DD/MM/YYYY","MMMM","YYYY-MM-DD"];

  var j = 0 ;

  do{

      var mom = moment(date , form[j]);
      j++;

    } while ( mom.format("M") == "Invalid date" );

    console.log(date, " - ", mom.format("MMMM"));

  return mom.format("MMMM");
}

function drawMonthySales( etichette, valori){

  var ctx = document.getElementById('monthlySales').getContext('2d');
  var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        labels: etichette,
        datasets: [{
            label: 'Total Monthly Sales',
            backgroundColor: 'rgba(232, 242, 255,0.5)',
            borderColor: 'rgba(0, 0, 0,0.7)',
            data: valori,
            tension: 0.2,
        },
      ],
    },

    // Configuration options go here
    options: {}
  });
  
}

function monthlySales(inData){

  var monthsSales= {

    January: 0,
    February: 0,
    March: 0 ,
    April: 0,
    May: 0,
    June: 0,
    July: 0,
    August: 0,
    September: 0,
    October: 0,
    November: 0,
    December:0,
  }

  for (var i = 0; i < inData.length; i++) {

    var mese = getMonth(inData[i].date);

    monthsSales[mese] += Number(inData[i].amount);

  }
  var keys = Object.keys(monthsSales);
  var values = Object.values(monthsSales);

  // console.log(monthsSales);
  drawMonthySales(keys,values);

}

function drawSalesPie(etichette , valori){

  var ctx = document.getElementById('salesmanPie').getContext('2d');
  var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'pie',

    // The data for our dataset
    data: {
        labels: etichette,
        datasets: [{
            label: 'Total Monthly Sales',
            backgroundColor: ["#FFCD56", "#ff1e1e","#0F9D58","#5624c1" ],
            borderColor: 'rgba(255, 255, 255,0.5)',
            data: valori,
            tension: 0.2,
        },
      ],
    },

    // Configuration options go here
    options: {
      elements: {
        arc: {
            borderWidth: 0
        }
      }
    }
  });
  
}

function salesPersentage(dati){

  var totalRev = 0;

  var coppiaValori= {};

  for (var i = 0; i < dati.length; i++) {

    if(!(dati[i].salesman in coppiaValori)){

      coppiaValori[dati[i].salesman] = dati[i].amount;
    }
    else{

      coppiaValori[dati[i].salesman] += Number(dati[i].amount);
    }

    totalRev += Number(dati[i].amount);
  }


  console.log(coppiaValori);

  var keys = Object.keys(coppiaValori);
  var values = Object.values(coppiaValori);

  drawSalesPie(keys , values);
}

function manageData(info){

  monthlySales(info);
  salesPersentage(info);
}

function getData(){

  $.ajax({

    url: "http://157.230.17.132:4013/sales",
    method: "GET",
    success: function(inData,state){

      console.log(inData);
      manageData(inData);

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
