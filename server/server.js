const webSocket = require("ws");
const redis = require("redis");

let redisClient;
// let url = "redis://35.188.168.176:6379";

(async () => {
    redisClient = redis.createClient({
        rootNodes: [
            {
                url: 'http://35.188.39.234:6379/'
            }
        ]
    });
    redisClient.on('error', (error) => console.log(`Redis error: ${error}`));
    await redisClient.connect();
})();

const server = new webSocket.Server({port: 9944});

server.on("connection", (ws) => {
    console.log('New client connected !');

    //send welcome message to the client
    ws.send("Hello this is welcome from SERVER");

    try {
        //reply
        ws.on("message", async (message) => {

            let data = JSON.parse(message);
            // let user_id = data.user_acc_id;

            let metaData = [
                {user_acc_id: data.user_acc_id},
                {pub_address: data.pub_address},
                {cid: data.cid},
                {d_url: data.d_url},
                {gcs_url: data.gcs_url},
                {bucket_name: data.bucket_name},
                {file_name: data.file_name},
            ];
        
            const response = { metaData };
            await redisClient.set('metadata', JSON.stringify(response));

            const chashedData = await redisClient.get('metadata');

            if(chashedData) {

                ws.send(`Cached data: ${chashedData}`);
                console.log(`Cached data: ${chashedData}`);
                return;

            } else {
                ws.send(`No metadata found`);
                console.log(`No metadata found`);
            }

            // Accessing user_acc_id from metaData
            // const userAccId = metaData.find(item => 'user_acc_id' in item).user_acc_id;

            // ws.send(`User ID: ${userAccId}`);
            // console.log(`User Id: ${userAccId}`);
        
        });
    } catch (error) {
        console.log(`Error getting metadata: ${error}`);
        return res.status(500).json({message: error});
    }

});
