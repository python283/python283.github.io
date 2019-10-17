
const channelName = "lightning_executions_FX_BTC_JPY";

// note: reconnection handling needed.
const ws = new WebSocket("wss://ws.lightstream.bitflyer.com/json-rpc");

ws.addEventListener("open", () => {
ws.send(JSON.stringify({
    method: "subscribe",
    params: {
    channel: channelName
    },
    id: 123
}));
});

ws.addEventListener("message", msgEvent => {
const data = JSON.parse(msgEvent.data);

if (data.id === 123) {
    console.log("subscribed!");
}
if (data.params && data.params.channel && data.params.message) {
    console.log(data.params.message[0].price);
    //document.getElementById("rest_api").innerHTML =  '<br>'+' 価格:'+data.params.message[0].price + '<br>'+data.params.message[0].exec_date ;
    
    if (buf['price'].length >1000){
        buf['price'] = buf['price'].slice(data.params.message.length,1000);
    };

    for (  var i = 0;  i < data.params.message.length;  i++  ) {
        buf['price'].push({
            id: data.params.message[i].id,
            p: data.params.message[i].price,
            d: data.params.message[i].exec_date
        });
    };
    
    onReceive(buf)
    
    //console.log(buf['price'].length);

    



}
});




var config = {
	type: 'candlestick',
	data: {
		datasets: [{
			data: [],
			fractionalDigitsCount: 2
		}]
	},
	options: {
        maintainAspectRatio: false,
		title: {
			display: true,
            text: 'BTC/JPY 5s ',
            fontSize:20
		},
		legend: {
			display: false,
		},
		scales: {
        
			xAxes: [{
                stacked: true,
				type: 'realtime',
				realtime: {
					duration: 300000,
					refresh: 5000,
					delay: 0,
                    //onRefresh:onRefresh,
                    onReceive:onReceive
                    
                },
                ticks:{
                    fontSize:12
                }
            }],
            
            yAxes:[{
                ticks:{
                    fontSize:12
                }

            }]
        },
        layout: {
            padding: {
                left: 0,
                right: 30,
                top: 10,
                bottom: 10,
            }
        },
		tooltips: {
			position: 'nearest',
			intersect: false
		},
		animation: {
			duration: 0
		}
	}
};

window.onload = function() {
	var ctx = document.getElementById('myChart').getContext('2d');
	window.myChart = new Chart(ctx, config);
};

//データ到着後更新
//var myChart = new Chart(ctx, config);これいらない
function onReceive(buf) {
    var t = Date.now();
	var data = myChart.data.datasets[0].data;
	var last;
    
	t -= t % 5000;
	if (data.length === 0) {
		data.push({ t: t - 5000, o: buf['price'][0].p-1, h: buf['price'][0].p+1, l: buf['price'][0].p-2, c: buf['price'][0].p });
	}
	last = data[data.length - 1];
	if (t != last.t) {
		var c = last.c;
		last = { t: t, o: c, h: c, l: c, c: c };
		data.push(last);
    }
	last.c = buf['price'][buf['price'].length-1].p;
	last.h = Math.max(last.h, last.c);
	last.l = Math.min(last.l, last.c);
    // append the new data to the existing chart data


    // update chart datasets keeping the current animation
    myChart.update({
        preservation: true
    });
}

//時間とともに更新
function onRefresh(chart) {
	var t = Date.now();
	var data = chart.data.datasets[0].data;
	var last;
    
	t -= t % 5000;
	if (data.length === 0) {
		data.push({ t: t - 5000, o: buf['price'][0].p-1, h: buf['price'][0].p+1, l: buf['price'][0].p-2, c: buf['price'][0].p });
	}
	last = data[data.length - 1];
	if (t != last.t) {
		var c = last.c;
		last = { t: t, o: c, h: c, l: c, c: c };
		data.push(last);
    }
	last.c = buf['price'][buf['price'].length-1].p;
	last.h = Math.max(last.h, last.c);
	last.l = Math.min(last.l, last.c);
}
