const Blockchain = require("../blockchain");

const blockchain = new Blockchain();

blockchain.addBlock({data:'intial'});
console.log('First Block', blockchain.chain[blochchain.chain.length-1]);
let prevTimeStamp, nextTimeStamp, nextBlock, timeDiff, average;

const times = [];

for(let i = 0; i < 10000; i++){
    prevTimeStamp = blockchain.chain[blockchain.chain.length-1].timestamp;
    blockchain.addBlock({data:`block ${i}`});
    nextBlock = blockchain.chain[blockchain.chain.length-1];
    nextTimeStamp = nextBlock.timestamp;
    timeDiff  = nextTimeStamp - prevTimeStamp;
    times.push(timeDiff);
    average = times.reduce((total, num) => (total+num))/times.length;
    console.log(`Time to mine block: ${timeDiff}ms. Difficulty: ${nextBlock.difficulty}. Average time: ${average}ms.`);
    
}