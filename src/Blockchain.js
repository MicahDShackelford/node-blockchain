import Block from "./Block.js"

import moment from 'moment'

/**
 * Class represents the master blockchain
 */
export default class Blockchain {
    constructor() {
        this.blockchain = []
        this.difficulty = 3
        this.totalChainQuantity = 0
        this.initiateGenesisBlock()
    }

    // Adds the genesis block to the blockchain
    initiateGenesisBlock() {
        this.addNewBlock({
            index: 0,
            timestamp: moment.now().toString(),
            data: {
                sender: null,
                recipient: null,
                quantity: 1000
            },
        }, true)
    }

    checkChainValidity() {
        // Check hash validity
        for(let i = 0; i < this.blockchain.length; i++) {
            const currentBlock = this.blockchain[i]
            const precedingBlock = i ? this.blockchain[i-1] : null

            // If a block is modified the hash will change and thus invalidate the whole blockchain
            // We exclude the genesis block - it will never have a preceding hash
            if(i && precedingBlock.hash !== currentBlock.precedingHash) return false

            // Check the hash VS the computed hash - ensure its integrity is intact
            if(currentBlock.hash !== currentBlock.getHash()) return false   
        }

        // Ensure total quantity is valid
        return this.blockchain.reduce((acc, itr) => acc + itr.data.quantity) === this.totalChainQuantity
    }

    // Retrieves the latest block in the blockchain
    retrieveLatestBlock() {
        return this.blockchain[this.blockchain.length-1] ?? null
    }

    // Add a new block to the blockchain
    addNewBlock({
        index = this.blockchain.length,
        timestamp = moment.now().toString(),
        data = {sender: null, recipient: null, quantity: 0},
    } = {}, isGenesis = false) {
        // Get the latest block so we can determine the preceding hash
        const latestBlock = this.retrieveLatestBlock()
        // Get the hash property or null (should only be null for genesis block)
        const precedingHash = latestBlock ? latestBlock.hash : null
        // Create a new block that will be pushed to the blockchain
        const newBlock = new Block(index, timestamp, data, precedingHash)

        // Mine this block if its not the genesis block
        if(!isGenesis) {
            newBlock.mineBlock(this.difficulty)
            // console.log(newBlock)
        }  

        console.log(newBlock)
        this.totalChainQuantity += newBlock.data.quantity
        // Push the new block
        this.blockchain.push(newBlock)

        this.recalculateChainDifficulty()
    }

    recalculateChainDifficulty() {
        this.difficulty += this.totalChainQuantity / 500
    }
}