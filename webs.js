
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
    console.log(data.params.channel, data.params.message);
    document.getElementById("rest_api").innerHTML =  '<br>'+' 価格:'+data.params.message[0].price + '<br>'+data.params.message[0].exec_date ;
    
    
    buf['price'].push({
        id: data.params.message[0].id,
        p: data.params.message[0].price
    });
 


   




}
});



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

var config = {
	type: 'candlestick',
	data: {
		datasets: [{
			data: [],
			fractionalDigitsCount: 2
		}]
	},
	options: {
		title: {
			display: true,
			text: 'Financial chart sample'
		},
		legend: {
			display: false,
		},
		scales: {
			xAxes: [{
				type: 'realtime',
				realtime: {
					duration: 120000,
					refresh: 500,
					delay: 0,
					onRefresh: onRefresh
				}
			}]
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