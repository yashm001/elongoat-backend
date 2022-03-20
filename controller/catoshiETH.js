const Web3 = require("web3");
const config = require('../routes/config.json');
var db = require('../db/db.js');
const mongoose = require('mongoose');
const tokenList = require('./tokenList')
const tokenAbi = require('./ABI/tokenAbi.json');
const chainId = config.chainIdFTM;
const chainId1 = config.chainIdBSC;
const connectionURLFTM = config.connectionURLFTM;
const connectionURLBSC = config.connectionURLBSC;



var web3 = new Web3(new Web3.providers.HttpProvider(config.connectionURLETH));
var web3BSC = new Web3(new Web3.providers.HttpProvider(connectionURLBSC));

const { async } = require('crypto-random-string');

const transactionDetails = mongoose.model('transactionDetails');

var adminAddresses = config.adminAddresses;


module.exports = {

    // balanceOf: async (req, res) => {
    //     try {
    //         let userAddress = '';
           
    //         if (req.query.userAddress == null) {
    //             return res.send({ "status": "false", "message": "address not found" })
    //         } else {
    //             userAddress = (req.query.userAddress);
    //         }
           
    //         var catoshiFTMContract = await new web3.eth.Contract(catoshiFTMAbi, catoshiFTMContractAddress)
    //         let output = await catoshiFTMContract.methods.balanceOf(userAddress).call()
    //         res.send({ "status": "true", "messgae": "Token details recieved", "Tokens": output })

    //     } catch (err) {
    //         console.log("error in getting user balance", err)
    //         res.send({ "status": "false", "error": err })
    //     }
    // },


    vaultBalance: async (req, res) => {
        try {
            let token = ''
            
            if (req.query.token == null) {
                return res.send({ "status": "false", "message": "token not found" })
            } else {
                token = (req.query.token);
            }
            console.log("token",token)
            tokenAddress = tokenList.tokenAddress(token,"ETH");
            bridgeDetail = tokenList.bridgeDetails(token,"ETH");
            bridgeAddress = bridgeDetail[0]

            var tokenContract = await new web3.eth.Contract(tokenAbi, tokenAddress)
            let output = await tokenContract.methods.balanceOf(bridgeAddress).call()
            let decimal = await tokenContract.methods.decimals().call()
            output = output/(10**decimal)
            res.send({
                "status": "true",
                "messgae": "Vault Balance recieved",
                "vault_balance": output
            })

        } catch (err) {
            console.log("error in getting vault balance", err)
            res.send({ "status": "false", "error": err })
        }
    },

    getbalance: async (req, res) => {
        try {
            let userAddress = '';
            let token = ''
            if (req.query.userAddress == null) {
                return res.send({ "status": "false", "message": "address not found" })
            } else {
                userAddress = (req.query.userAddress);
            }
            if (req.query.token == null) {
                return res.send({ "status": "false", "message": "token not found" })
            } else {
                token = (req.query.token);
            }
            console.log("token",token)
            tokenAddress = tokenList.tokenAddress(token,"ETH");
            // console.log("tokenDetails*****************",tokenDetails)
            // tokenAddress = tokenDetails[tokenId]

            console.log("tokenAddress", tokenAddress)
            var tokenContract = await new web3.eth.Contract(tokenAbi, tokenAddress)
            let output = await tokenContract.methods.balanceOf(userAddress).call()
            let decimal = await tokenContract.methods.decimals().call()
            output = output/(10**decimal)
            console.log("output",output)
           

            res.send({ "status": "true", "messgae": "user balance recieved", "Tokens": output })

        } catch (err) {
            console.log("error in getting user balance", err)
            res.send({ "status": "false", "error": err })
        }
    },

    getAmountAfterFee: async (req, res) => {
        try {
            let amount = '';
            let token = ''
            if (req.query.amount == null) {
                return res.send({ "status": "false", "message": "amount not found" })
            } else {
                amount = (req.query.amount);
            }
            if (req.query.token == null) {
                return res.send({ "status": "false", "message": "token not found" })
            } else {
                token = (req.query.token);
            }
            bridgeDetail = tokenList.bridgeDetails(token,"ETH");
            bridgeAddress = bridgeDetail[0]
            bridgeAbi = bridgeDetail[1]
            decimal = bridgeDetail[2]

            amount = BigInt(amount * (10**decimal))
            console.log("amount",amount)

            var bridgeContract = await new web3.eth.Contract(bridgeAbi, bridgeAddress)
            var output = await bridgeContract.methods.feeCalculation(amount).call()
            output = output/(10**decimal)
            res.send({"status": "true", "output" : output})

        } catch (err) {
            console.log("error in getting amount details", err)
            res.send({ "status": "false", "error": err })
        }
    },

    getTransactionResponse: async (req, res) => {
        try {
            let txHash = '';
                if (req.query.txHash == null) {
                    return res.send({ "status": "false", "message": "hash not found" })
                } else {
                    txHash = (req.query.txHash);
                }
            let token = '';
                if(req.query.token==null){
                    return res.send({"status": "false", "message": "token not found"})
                } else {
                    token = (req.query.token);
                } 

            let swapAmount = '';
                if (req.query.swapAmount == null) {
                    return res.send({ "status": "false", "message": "swapAmount not found" })
                } else {
                    swapAmount = (req.query.swapAmount);
                }
        

            let fromTimestamp = '';
                if (req.query.fromTimestamp == null) {
                    return res.send({ "status": "false", "message": "fromTimestamp not found" })
                } else {
                    fromTimestamp = (req.query.fromTimestamp);
                }

            let toChain = '';
                if(req.query.toChain==null){
                    return res.send({"status": "false", "message": "toChain not found"})
                } else {
                    toChain = (req.query.toChain);
                } 

            var receipt = await web3.eth.getTransactionReceipt(txHash)
            // console.log(receipt)
            while(receipt == null) {
                receipt = await web3.eth.getTransactionReceipt(txHash)
            }
            const status = receipt['status']
            tokenSymbol = tokenList.tokenSymbol(token);


            const obj = {
                fromChain: 'ETH',
                fromTransactionHash: txHash,
                fromTransactionStatus: status,
                fromBlockNumber: receipt['blockNumber'],
                walletAddress: receipt['from'],
                token: tokenSymbol,
                swapAmount: swapAmount,
                fromTimestamp: fromTimestamp,
                swapId: null,
                toChain: toChain,
                toTransactionHash: '',
                toTransactionStatus: false,
                toTimestamp: '',
                nonce: null,
                rawData: null
            }

            
            const data = new transactionDetails(obj);
            try {
                await data.save();
                let response = {
                    status: status,
                    message: `transaction ${status ? 'confirmed' : 'failed'}`,
                    data: 'Transaction Saved in db Successfully'
                };
                res.send(response);
                console.log("Transaction details Saved in db Successfully")
            }
            catch (err) {
                let response = {
                    status: status,
                    message: `transaction ${status ? 'confirmed' : 'failed'}`,
                    data: 'Error in saving Transaction details in DB'
                };
                res.send(response);
                console.log("Error in saving Transaction details in DB, ", err)
            };
        }
        catch (err) {
            console.log("###################################################")
            console.log("###################################################")
            console.log("###################################################")
            console.log("error in getting transaction details", err)
            res.send({ "status": "false", "error": err, "message": 'Error in getting Transaction Details...' })
        }
    },

    checkAllowance : async(req,res) => {
        try {
            let token = ''
            let userAddress =''
            let amount = ''
            if (req.query.userAddress == null) {
                return res.send({ "status": "false", "message": "userAddress not found" })
            } else {
                userAddress = (req.query.userAddress);
            }
            if (req.query.token == null) {
                return res.send({ "status": "false", "message": "token not found" })
            } else {
                token = (req.query.token);
            }
            if (req.query.amount == null) {
                return res.send({ "status": "false", "message": "amount not found" })
            } else {
                amount = (req.query.amount);
            }

            tokenAddress = tokenList.tokenAddress(token,"ETH");
            bridgeDetail = tokenList.bridgeDetails(token,"ETH");
            bridgeAddress = bridgeDetail[0]
            decimal = bridgeDetail[2]

            var tokenContract = await new web3.eth.Contract(tokenAbi, tokenAddress)
            let output = await tokenContract.methods.allowance(userAddress,bridgeAddress).call()
            amount = amount * (10**decimal)
            let response = false;
            if(amount<=output)
                response = true;
           
            res.send({"status": "true", "response" : response})

        } catch (err) {
            console.log("error in getting allowance details", err)
            res.send({ "status": "false", "error": err })
        }
    },
    bridgeFees: async (req, res) => {
        try {
            let token = '';
                if (req.query.token == null) {
                    return res.send({ "status": "false", "message": "token not found" })
                } else {
                    token = (req.query.token);
                }

            let toChain = '';
                if (req.query.toChain == null) {
                    return res.send({ "status": "false", "message": "toChain not found" })
                } else {
                    toChain = (req.query.toChain);
                }
    
            let toChainId = tokenList.toChainId(toChain)
            console.log("toChainId",toChainId)
            bridgeDetail = tokenList.bridgeDetails(token,"ETH");
            bridgeAddress = bridgeDetail[0]
            bridgeAbi = bridgeDetail[1]
            decimal = bridgeDetail[2]

            var bridgeContract = await new web3.eth.Contract(bridgeAbi, bridgeAddress)
            var gasUsed = await bridgeContract.methods.getProcessedFees(toChainId).call();
            // var gasUsed = await bridgeContract.methods._processedFees().call();

            res.send({ "status": "true", "bridgeFees": gasUsed ,"decimal" :decimal  })
        } catch (err) {
            console.log("error in getting fees details", err)
            res.send({ "status": "false", "error": err })
        }
    },

    // triggerEvents: async (req, res) => {
    //     try {
    //         let blockNumber = '';
    //         if (!!req.query.blockNumber) {
    //             if (req.query.blockNumber === null || blockNumber < 0) {
    //                 return res.send({ "status": "false", "message": "Invalid Block Number!!" })
    //             } else {
    //                 blockNumber = (req.query.blockNumber);
    //             }
    //         } else {
    //             return res.send({ "status": "false", "message": "Block Number not found" })
    //         }
    //         const web3Ftm = new Web3(new Web3.providers.HttpProvider(connectionURLFTM));
    //         var latestBlock = await web3Ftm.eth.getBlockNumber();
    //         if (latestBlock <= parseInt(blockNumber)) {
    //             return res.send({
    //                 "status": "false",
    //                 "message": "Provided block number is not yet mined!!"
    //             })
    //         }
    //         catoshiETHEventCall(blockNumber);
    //         res.send({
    //             "status": 'true',
    //             "message": "API to call events has been trigerred",
    //             "blockNumber": blockNumber
    //         })
    //     } catch (err) {
    //         console.log("error in fetching FTM Events", err)
    //         res.send({ "status": "false", "error": err })
    //     }
    // },

    // getTrxDetails: async (req, res) => {
    //     try {
    //         let params = {};
    //         if (!!req.query.walletAddress) {
    //             params.walletAddress = req.query.walletAddress;
    //         }
    //         // const transactionDetailsData = await transactionDetails.find(params).sort({'_id':-1}).limit(20)
    //         const transactionDetailsData = await transactionDetails.find(params).sort({ '_id': -1 })
    //         let response = {
    //             status: true,
    //             data: transactionDetailsData.map(data => ({
    //                 amount: data.swapAmount / Math.pow(10, 18), ...data._doc
    //             }))
    //         };
    //         res.send(response);
    //     }
    //     catch (err) {
    //         console.log(err)
    //     }
    // },

    // speedUpTrx: async (req, res) => {
    //     try {
    //         let objectID = '';
    //         if (!!req.query.objectID) {
    //             if (req.query.objectID === null) {
    //                 return res.send({ "status": "false", "message": "Invalid Primary key!!" })
    //             } else {
    //                 objectID = (req.query.objectID);
    //             }
    //         } else {
    //             return res.send({ "status": "false", "message": "Object ID not found" })
    //         }
    //         let mongoData = await transactionDetails.find({ _id: objectID })
    //         if (mongoData.length <= 0) {
    //             res.send({ "status": 'false', "message": "No Data found with this key..." })
    //         }
    //         // console.log('DB Data', mongoData, mongoData.length)
    //         if (!mongoData[0].toTransactionHash) {
    //             res.send({ "status": 'false', "message": "Transaction Hash not found..." })
    //         }
    //         if (!mongoData[0].swapId) {
    //             res.send({ "status": 'false', "message": "Record does not contain swap ID..." })
    //         }
    //         if (!mongoData[0].nonce) {
    //             res.send({ "status": 'false', "message": "Nonce not found for this trx..." })
    //         }
    //         if (!mongoData[0].rawData) {
    //             res.send({ "status": 'false', "message": "raw Data not found for this trx..." })
    //         }
    //         let web3Instance = web3;
    //         if (mongoData[0].toChain === 'BSC') {
    //             web3Instance = web3BSC;
    //             console.log('switched to BSC web3')
    //         }
    //         // console.log('web3', web3);
    //         var receipt = await web3Instance.eth.getTransactionReceipt(mongoData[0].toTransactionHash)
    //         if (receipt === null) {
    //             catoshiSpeedUpTrx(mongoData[0]);
    //             res.send({
    //                 "status": 'true',
    //                 "message": "Speeding up this transaction",
    //                 "transaction_id": mongoData[0].toTransactionHash,
    //                 "chain": mongoData[0].toChain
    //             })
    //         }
    //         else {
    //             res.send({
    //                 "status": 'false',
    //                 "message": "Transaction is not pending and has already either succeeded or failed !",
    //                 "transaction_id": mongoData[0].toTransactionHash,
    //                 "chain": mongoData[0].toChain
    //             })
    //         }
    //     } catch (err) {
    //         console.log("error in fetching details from DB", err)
    //         res.send({ "status": "false", "error": err })
    //     }
    // },

}