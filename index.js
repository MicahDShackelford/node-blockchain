import cluster from 'cluster'
import Blockchain from './src/Blockchain.js'

// Instantiate blockchain
let blockchain = new Blockchain

const numberSlaves = 4

if(cluster.isMaster) {
    console.log(`Master ${process.pid} is running`)

    setTimeout(() => {
        for(let i = 0; i < numberSlaves; i++) {
            cluster.fork()
        }
    }, 1000);

    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
    })
} else {
    console.log(`Worker ${process.pid} started`);
    for(let i = 0; i < 10; i++) {
        blockchain.addNewBlock()
    }
}