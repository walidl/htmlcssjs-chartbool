
function getMonth(date){

  var form = ["DD/MM/YYYY","MMMM","YYYY-MM-DD"];

  var j = 0 ;
  do {
      var mom = moment(date , form[j]);
      j++;

    } while (mom.format("M") == "Invalid date");

  return mom.format("M");
}

function drawMonthySales(values){

  var ctx = document.getElementById('monthlySales').getContext('2d');
  var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July',"August", "September","October","November","December"],
        datasets: [{
            label: 'Total Monthly Sales',
            backgroundColor: 'rgba(232, 242, 255,0.5)',
            borderColor: 'rgba(0, 0, 0,0.7)',
            data: values,
            tension: 0.2,
        },
      ],
    },

    // Configuration options go here
    options: {}
  });
  chart.canvas.parentNode.style.height = '800px';
  chart.canvas.parentNode.style.width = '800px';
}

function monthlySales(inData){

  var form = ["DD/MM/YYYY","MMMM","YYYY-MM-DD"]
  var yearSales =[0,0,0,0,0,0,0,0,0,0,0,0];

  for (var i = 0; i < inData.length; i++) {

    var mese = getMonth(inData[i].date);

    yearSales[mese-1] += Number(inData[i].amount);
  }

  console.log(yearSales);
  drawMonthySales(yearSales);
}

function isPresent(item,array){

  for (var i = 0; i < array.length; i++) {

    if(array[i][0] == item) return i;
  }
  return -1;
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
  chart.canvas.parentNode.style.height = '800px';
  chart.canvas.parentNode.style.width = '800px';
}

function salesPersentage(dati){

  var totalRev = 0;
  var coppiaValori= [];

  for (var i = 0; i < dati.length; i++) {

    var index = isPresent(dati[i].salesman, coppiaValori);

    if(index == -1){

      coppiaValori.push([dati[i].salesman , dati[i].amount]);
    }
    else{

      coppiaValori[index][1] += Number(dati[i].amount);
    }

    totalRev += Number(dati[i].amount);

  }

  console.log(coppiaValori);
  console.log(totalRev);
  var venditori = [];
  var vendite = [];
  for (var i = 0; i < coppiaValori.length; i++) {

    venditori.push(coppiaValori[i][0]);
    vendite.push(coppiaValori[i][1])
  }
  drawSalesPie(venditori , vendite)

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
