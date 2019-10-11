
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
    document.getElementById("rest_api").innerHTML =  '<br>'+' 価格:'+data.params.message[0].price + '<br>';
}
});
