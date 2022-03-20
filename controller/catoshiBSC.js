const Web3 = require("web3");
const config = require('../routes/config.json');
var db = require('../db/db.js');
const mongoose = require('mongoose');
const tokenAbi = require('./ABI/tokenAbi.json')
const tokenList = require('./tokenList')

const httpEndPointInfura = config.connectionURLBSC;
// const chainId1 = config.chainId1;
var web3 = new Web3(new Web3.providers.HttpProvider(httpEndPointInfura));

const transactionDetails = mongoose.model('transactionDetails');

const { bridgeDetails } = require("./tokenList");


module.exports = {

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
            tokenAddress = tokenList.tokenAddress(token,"BSC");
            // console.log("tokenDetails*****************",tokenDetails)
            // tokenAddress = tokenDetails[tokenId]

            console.log("tokenAddress", tokenAddress)
            var tokenContract = await new web3.eth.Contract(tokenAbi, tokenAddress)
            let output = await tokenContract.methods.balanceOf(userAddress).call()
            let decimal = await tokenContract.methods.decimals().call()
            output = output/(10**decimal)
            res.send({ "status": "true", "messgae": "user balance recieved", "Tokens": output })

        } catch (err) {
            console.log("error in getting user balance", err)
            res.send({ "status": "false", "error": err })
        }
    },

    vaultBalance: async(req, res) => {
        try{
            let token = ''
            if (req.query.token == null) {
                return res.send({ "status": "false", "message": "token not found" })
            } else {
                token = (req.query.token);
            }
            tokenAddress = tokenList.tokenAddress(token,"BSC");
            bridgeDetail = tokenList.bridgeDetails(token,"BSC");
            bridgeAddress = bridgeDetail[0]

            var tokenContract = await new web3.eth.Contract(tokenAbi, tokenAddress)
            let output = await tokenContract.methods.balanceOf(bridgeAddress).call()
            let decimal = await tokenContract.methods.decimals().call()
            output = output/(10**decimal)
            res.send({
                "status":"true",
                "messgae":"Vault Balance recieved", 
                "vault_balance": output
            })
                            
        }catch(err){
            console.log("error in getting vault balance",err)
            res.send({"status":"false", "error": err})
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
            bridgeDetail = tokenList.bridgeDetails(token,"BSC");
            bridgeAddress = bridgeDetail[0]
            bridgeAbi = bridgeDetail[1]
            decimal = bridgeDetail[2]

            amount = BigInt(amount * (10**decimal))
            console.log("amount",amount)
            // console.log("**********************")
            // console.log(bridgeAddress)
            // console.log("**********************")
            // console.log(bridgeDetail)
            var bridgeContract = await new web3.eth.Contract(bridgeAbi, bridgeAddress)
            var output = await bridgeContract.methods.feeCalculation(amount).call()
            output = output/(10**decimal)
            res.send({"status": "true", "output" : output})

        } catch (err) {
            console.log("error in getting amount details", err)
            res.send({ "status": "false", "error": err })
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

            tokenAddress = tokenList.tokenAddress(token,"BSC");
            bridgeDetail = tokenList.bridgeDetails(token,"BSC");
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
    
    getTransactionResponse: async (req,res) =>{
        try{
            let txHash = '';
                if(req.query.txHash==null){
                    return res.send({"status": "false", "message": "hash not found"})
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
                if(req.query.swapAmount==null){
                    return res.send({"status": "false", "message": "swapAmount not found"})
                } else {
                    swapAmount = (req.query.swapAmount);
                }    
            

            let fromTimestamp = '';
                if(req.query.fromTimestamp==null){
                    return res.send({"status": "false", "message": "fromTimestamp not found"})
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
            while(receipt == null) {
                console.log("re",receipt)
                receipt = await web3.eth.getTransactionReceipt(txHash)
            }
            // console.log(receipt)
            const status = receipt['status']
            tokenSymbol = tokenList.tokenSymbol(token);
            console.log("888888888888888888")


            const obj = {
                fromChain: 'BSC',
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
                    message: `transaction ${ status ? 'confirmed' : 'failed' }`, 
                    data: 'Transaction Saved in db Successfully'
                };
                res.send(response);
                console.log("Transaction details Saved in db Successfully")
            }
            catch (err) {
                let response = { 
                    status: status, 
                    message: `transaction ${ status ? 'confirmed' : 'failed' }`, 
                    data: 'Error in saving Transaction details in DB'
                };
                res.send(response);
                console.log("Error in saving Transaction details in DB, ", err)
            }; 
        }
        catch(err){
            console.log("error in getting transaction details", err)
            res.send({"status":"false", "error": err, "message": 'Error in getting Transaction Details...'})
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

            bridgeDetail = tokenList.bridgeDetails(token,"BSC");
            bridgeAddress = bridgeDetail[0]
            bridgeAbi = bridgeDetail[1]
            decimal = bridgeDetail[2]


            var bridgeContract = await new web3.eth.Contract(bridgeAbi, bridgeAddress)
            var gasUsed = await bridgeContract.methods.getProcessedFees(toChainId).call();

            res.send({ "status": "true", "bridgeFees": gasUsed , "decimal" : decimal})
        } catch (err) {
            console.log("error in getting fees details", err)
            res.send({ "status": "false", "error": err })
        }
    },

    triggerEvents: async (req, res) => {
        try{
            let blockNumber = '';
                if(req.query.blockNumber === null || blockNumber < 0){
                    return res.send({"status": "false", "message": "Invalid Block Number!!"})
                } else {
                    blockNumber = (req.query.blockNumber);
                }    
            ``
            const web3Bsc = new Web3(new Web3.providers.HttpProvider(httpEndPointInfura));
            var latestBlock = await web3Bsc.eth.getBlockNumber();
            if(latestBlock <= parseInt(blockNumber)) {
                return res.send({
                    "status": "false", 
                    "message": "Provided block number is not yet mined!!"
                })
            }
            catoshiBSCEventCall(blockNumber);
            res.send({ 
                "status": 'true', 
                "message": "API to call events has been trigerred",
                "blockNumber": blockNumber    
            })                 
        }catch(err){
            console.log("error in fetching BSC Events",err)
            res.send({"status":"false", "error": err})
        }
    },

    getTrxDetails: async (req, res) => {
        try {
            let params = {}
            let token = '';
                if (req.query.token == null) {
                    return res.send({ "status": "false", "message": "token not found" })
                } else {
                    token = (req.query.token);
                    if(token != "None"){
                        params.token = token;
                    }
                }

            let toChain = '';
                if (req.query.toChain == null) {
                    return res.send({ "status": "false", "message": "toChain not found" })
                } else {
                    toChain = (req.query.toChain);
                    if(toChain != "None"){
                        params.toChain = toChain;
                    }
                }
                let fromChain = '';
                if (req.query.fromChain == null) {
                    return res.send({ "status": "false", "message": "fromChain not found" })
                } else {
                    fromChain = (req.query.fromChain);
                    if(fromChain != "None"){
                        params.fromChain = fromChain;
                    }
                }
            // let params = req.query;
            // console.log(params)
            // if (!!req.query.walletAddress) {
            //     params.walletAddress = req.query.walletAddress;
            // }
            // const transactionDetailsData = await transactionDetails.find(params).sort({'_id':-1}).limit(20)
            const transactionDetailsData = await transactionDetails.find(params).sort({ '_id': -1 })
            let response = {
                status: true,
                data: transactionDetailsData.map(data => ({
                    amount: data.swapAmount, ...data._doc
                }))
            };
            res.send(response);
        }
        catch (err) {
            console.log(err)
        }
    }
}