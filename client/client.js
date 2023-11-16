const webSocket = require("ws");

//create a localhost client
const client = new webSocket("ws://localhost:8000");

//handling the event when connection to server is successfull
client.on("open", () => {
    console.log("Connected");

    let jsonString = '{"data":"dummy"}';

    //set timeout
    //sendig the message to the server
    setTimeout(() => {
        client.send(jsonString);
    }, 5000);

    //handling the event when the websocket connection is closed
    client.on("close", (code) => {
        console.log(`Connection close with code: ${code}`);
    });

    //disconnectiong the websocket connection in 10s
    setTimeout(() => {
        client.close();
    }, 10000);
});                                                                                                                          

//handling the event when handling the message from the server
client.on("message", (message) => {
    console.log(`Receved message: ${message}`);
});

//handling the event when the connection to the server is unsuccessful
client.on("error", (error) => {
    console.log(`Error: ${error}`);
})