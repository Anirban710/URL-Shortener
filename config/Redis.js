// const redis = require("redis");

// const client = redis.createClient({
//     socket: {
//         host: "127.0.0.1",
//         port: 6380   // we are using port 6380
//     }
// });

// client.connect()
//     .then(() => console.log("Redis connected"))
//     .catch(err => console.error("Redis error", err));

// module.exports = client;

const redis = require("redis");

const client = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    tls: true
  },
  password: process.env.REDIS_PASSWORD
});

client.on("error", (err) => console.error("Redis Error", err));

(async () => {
  await client.connect();
  console.log("Redis connected");
})();

module.exports = client;

