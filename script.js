function isNum(val) {
	val = parseInt(val);
 	if( isNaN(val) ) {
		return false
 	} else {
		return true;
	}
}

// fa un ciclo do while su tre tipi di format
// esce quando il format mi da mese diverso dalla stringa di errore "Invalid date"
function getMonth(date, formato){

  var form = ["DD/MM/YYYY","MMMM","YYYY-MM-DD"];

  var j = 0 ;

  do{

      var mom = moment(date , form[j]);
      j++;

    } while ( mom.format("M") == "Invalid date" );

    // console.log(date, " - ", mom.format(formato));

  return mom.format(formato);
}

function drawMonthySales( etichette, valori){

  var elem = $("<canvas id='monthlySales'> </canvas>");
  $(".first .grafico").empty().append(elem);

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

    var mese = getMonth(inData[i].date,"MMMM");

    monthsSales[mese] += Number(inData[i].amount);

  }
  var keys = Object.keys(monthsSales);
  var values = Object.values(monthsSales);
  // console.log(monthsSales);
  drawMonthySales(keys,values);

  return keys;
}

function drawSalesPie(etichette , valori){

  var elem = $("<canvas id='salesmanPie'> </canvas>")
  $(".second .grafico").empty().append(elem);

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

	for (var i = 0; i < values.length; i++) {
		
		values[i] *= (100/totalRev);
		values[i] = values[i].toFixed(2)
	}

  drawSalesPie(keys , values);

  return keys;
}

function setupOptions(months ,salesman){

  var names = $("#salesmanList")
  var mesi = $("#MonthsList");
  names.empty();
  mesi.empty();

  var temp = $("#option-template").html();
  var comp = Handlebars.compile(temp);

  for (var i = 0; i < salesman.length; i++) {

    var data = { val: salesman[i] };
    var opt = comp(data);
    names.append(opt);
  }

  for (var i = 0; i < months.length; i++) {

    var data = { val: months[i] };
    var opt = comp(data);
    mesi.append(opt);
  }

}

function postNewData(dati){

  $.ajax({

    url: "http://157.230.17.132:4013/sales",
    method: "POST",
    data: dati,
    success: function(inData,state){

      getData();
    },
    error: function(){

      console.log("errore!")
    }
  })
}

function insertNewSale(months ,salesman){

  setupOptions(months ,salesman);

  var btn = $("#submitButton");
  var name = $("#salesmanList")
  var mese = $("#MonthsList");
  var inp = $("#inputSale");

  btn.click(function(){


    if(isNum(inp.val())){

      postNewData({

        salesman: name.val(),
        amount: inp.val(),
        date: mese.val(),
      })

    }
    else{

      inp.val("");
      alert("inserisci valore numerico")
    }
  })
}

function drawQuarterNumbs(etichette , valori){

  var elem = $("<canvas id='quarterSales'> </canvas>")
  $(".third .grafico").empty().append(elem);

  var ctx = document.getElementById('quarterSales').getContext('2d');

  var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'bar',

    // The data for our dataset
    data: {
        labels: etichette,
        datasets: [{
            backgroundColor: ["#FFCD56", "#ff1e1e","#0F9D58","#5624c1" ],
            borderColor: 'rgba(255, 255, 255,0.5)',
            data: valori,
            tension: 0.2,
        },
      ],
    },

    // Configuration options go here
    options: { scales: {
      yAxes: [{
        display: true,
        ticks: {

          beginAtZero: true   // minimum value will be 0.
        }
      }]
      }
    }

  });
}

function quarterTrend(dati){

  var quarterCount = {

    "First quarter": 0,
    "Second quarter": 0,
    "Third quarter": 0,
    "Fourth quarter": 0,
  }

  for (var i = 0; i < dati.length; i++) {

    var mese = getMonth(dati[i].date,"M");

    if(mese >= 1 && mese <= 3) { quarterCount["First quarter"] += 1; }
    else if (mese >= 4 && mese <= 6) { quarterCount["Second quarter"] += 1; }
    else if (mese >= 7 && mese <= 9) { quarterCount["Third quarter"] += 1; }
    else if (mese >= 10 && mese <= 12) { quarterCount["Fourth quarter"] += 1; }

  }

  var keys = Object.keys(quarterCount);
  var values = Object.values(quarterCount);

  console.log(quarterCount);
  drawQuarterNumbs(keys, values);
}

function manageData(info){

  var mesi = monthlySales(info);
  var venditori = salesPersentage(info);
  quarterTrend(info);
  console.log(mesi);
  console.log(venditori);

  insertNewSale(mesi , venditori);

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

  var zoom = $("section .fas");

  zoom.click(function(){

    $(".wrapper").toggle();
    $(this).parent("section").toggleClass("zoom")
    $(this).toggleClass("fa-search-plus").toggleClass("fa-search-minus")
    })

}

$(document).ready(init);
