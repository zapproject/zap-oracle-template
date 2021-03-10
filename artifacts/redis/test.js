
// docker run -d --name some-redis -p 6380:6379 redis
// node artifacts/redis/test.js


const redis = require("redis");
const client = redis.createClient({
    port:6380,
    host:"127.0.0.1"
});
 

client.on("connect", () =>{
    console.log("Client connected to redis....")
});


client.on("ready", () =>{
    console.log("Client is connected and ready to be used....")
});


client.on("error", (err) =>{
    console.log(err.message)
});
 
client.on("end", () =>{
    console.log("Client disconnected from redis....")
});

client.set("key", "value");
client.get("key", (err, value) => {
    if(err) console.log(err.message);
    console.log(value);
});


module.exports = client