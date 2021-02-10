import sha256 from 'crypto-js/sha256.js'

/**
 * Class representing a block that makes up the blockchain
 */
export default class Block {
    constructor(index, timestamp, data, precedingHash) {
        this.index = index
        this.timestamp = timestamp
        this.data = {
            sender: null,
            recipient: null, 
            quantity: null,
            ...data
        }
        this.precedingHash = precedingHash
        
        this.nonce = 0
        this.possibleCoinSizes = [500,1000,5000,10000,100000]

        this.hash = this.getHash()
    }

    // Get the sha256 hash for this block
    getHash() {
        return sha256(
            this.index +
            this.precedingHash +
            this.timestamp +
            JSON.stringify(this.data) +
            this.nonce
        ).toString()
    }

    // Mine the block
    mineBlock(difficulty) {
        const adjustedDifficulty = Math.floor(difficulty / 100)

        while (this.hash.substring(0, adjustedDifficulty) !== Array(adjustedDifficulty + 1).join("0")) {
            this.nonce++
            this.hash = this.getHash()
        }

        this.data.quantity = this.possibleCoinSizes[Math.floor(Math.random() * this.possibleCoinSizes.length - 1)]
        this.hash = this.getHash()
    }
    
    getBlock() {
        return {
            timestamp: this.timestamp,
            data: this.data,
            precedingHash: this.precedingHash,
            hash: this.hash
        }
    }
}