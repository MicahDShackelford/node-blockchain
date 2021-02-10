import Blockchain from './src/Blockchain.js'

// Instantiate blockchain
let blockchain = new Blockchain

// Create a 10 block blockchain
for(let i = 0; i < 10; i++) {
    blockchain.addNewBlock()
}

console.log(blockchain.blockchain)