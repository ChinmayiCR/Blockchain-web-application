const PubNub = require('pubnub');
// const { parse } = require('uuid');
const credentials = {
    publishKey: 'pub-c-510de2d7-f95b-4c86-b011-20e2a27bfd70',
    subscribeKey: 'sub-c-0ccbd390-bc5b-11eb-8f6a-ae5fdf7280c3',
    secretKey: 'sec-c-YmI4YWMwNzEtZjlmZS00MmE1LWJlYjUtODQ3ODkxYjQzYmU0'
}

const CHANNELS = {
    TEST : 'TEST',
    BLOCKCHAIN: 'BLOCKCHAIN',
    TRANSACTION: 'TRANSACTION'
};

class PubSub {
    constructor({blockchain, transactionPool, wallet}){
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;
        this.pubnub = new PubNub(credentials);

        this.pubnub.subscribe({ channels: Object.values(CHANNELS) });

        this.pubnub.addListener(this.listener());
    }

    broadcastChain(){
        this.publish({
            channel: CHANNELS.BLOCKCHAIN,
            message: JSON.stringify(this.blockchain.chain)
        });
    }

    broadcastTransaction(transaction) {
        this.publish({
            channel: CHANNELS.TRANSACTION,
            message: JSON.stringify(transaction)
        });
    }

    subscribeToChannels(){
        this.pubnub.subscribe({
            channels: [Object.values(CHANNELS)]
        });
    }
    listener(){
        return {
            message: messageObject => {
                const {channel, message} = messageObject;

                console.log(`Message received. Channel: ${channel}. Message: ${message}.`);
                const parsedMessage = JSON.parse(message);

                switch(channel){
                    case CHANNELS.BLOCKCHAIN: 
                        this.blockchain.replaceChain(parsedMessage, true, () => {
                            this.transactionPool.clearBlockchainTransactions({
                                chain: parsedMessage.chain
                            });
                        });
                        break;
                    case CHANNELS.TRANSACTION:
                        if (!this.transactionPool.existingTransaction({
                                inputAddress: this.wallet.publicKey
                            })) {
                            this.transactionPool.setTransaction(parsedMessage);
                        }
                        break;
                    default: 
                        return;
                }
            }
        }    
    }
    publish({channel, message}){

        this.pubnub.publish({message, channel});
    }
    broadcastChain() {
        this.publish({
            channel: CHANNELS.BLOCKCHAIN,
            message: JSON.stringify(this.blockchain.chain)
        });
    }

    broadcastTransaction(transaction) {
        this.publish({
            channel: CHANNELS.TRANSACTION,
            message: JSON.stringify(transaction)
        });
    }
}

module.exports = PubSub;