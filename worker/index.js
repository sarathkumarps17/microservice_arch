const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});
const sub = redisClient.duplicate();

function fib(index) {
  if (index < 2) return 1;
  return fib(index - 1) + fib(index - 2);
}

sub.on('message', (channel, message) => {
  redisClient.hset('values', message, fib(parseInt(message)));
});
sub.subscribe('insert');

// const testWorker = async()=>{
//   const isConnected =  redisClient.connected
//   console.log({isConnected})
//   await redisClient.set('val2','5',redis.print)
//   await redisClient.set('val2','7',redis.print)
//   await redisClient.set('val1','12',redis.print)
//   setTimeout(()=>redisClient.hgetall("values", function (err, obj) {
//     console.dir(obj);
// }),3000)
// }

// testWorker()