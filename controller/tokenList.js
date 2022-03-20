const Web3 = require("web3");
const config = require('../routes/config.json');
// var db = require('../db/db.js');
const mongoose = require('mongoose');
const { async } = require("crypto-random-string");


toChainId = {
    BSC : "97",
    ETH : "3",
}

tokenList = {
    ELONGOAT:
    {
        name: "ELONGOAT",
        symbol: "EGT",
        decimal: 9,
        tokenAddress: {
            BSC: "0x682D26987599E6e355CD930201E3bBbf65DBF650",
            ETH: "0x73298736b1c0cF1CFFf1B30016aA351A40E9CFB5"

        },
        tokenAbi: {
            BSC: require('./ABI/tokenAbi.json'),
            ETH: require('./ABI/tokenAbi.json')

        },
        bridgeAddress: {
            BSC: "0xd5e9107F9eF4285395404D535e5773E7136a82b4",
            ETH: "0xd430e189E3a5246927Ba786dF4e7E34f36f8BA70"
        },
        bridgeAbi: {
            BSC: require('./ABI/bridgeBSCAbi.json'),
            ETH: require('./ABI/bridgeEthAbi.json')

        },
    }
    

}



module.exports = {


    // fetchAbis: async (req, res) => {
    //     try {
    //         let tokenId = ''
    //         if (req.query.tokenId == null) {
    //             return res.send({ "status": "false", "message": "tokenId not found" })
    //         } else {
    //             tokenId = (req.query.tokenId);
    //         }
    //         if (tokenId > tokenList.length - 1)
    //             return res.send({ "status": "false", "message": "tokenId out of index" })

    //         res.send({
    //             "status": "true",
    //             "message": "Contract ABIs fetched",
    //             "details": tokenList[token]

    //             // "addresses": {
    //             //     contract_address_eth: catoshiFTMContractAddress,
    //             //     contract_abi_eth: catoshiFTMAbi,
    //             //     chain_id_eth: chainId,
    //             //     rpc_url_eth: connectionURLFTM,
    //             //     contract_address_bsc: catoshiBSCContractAddress,
    //             //     contract_abi_bsc: catoshiBSCAbi,
    //             //     chain_id_bsc: chainId1,
    //             //     rpc_url_bsc: connectionURLBSC,
    //             //     admin_address: adminAddresses
    //             // }
    //         })
    //     } catch (err) {
    //         console.log("error in fetching Contract ABIs !", err)
    //         res.send({ "status": "false", "error": err, "message": 'Error in fetching Contract ABIs !' })
    //     }
    // },

    tokenList: () => {
        return tokenList
    },

    toChainId: (network)=>{
        return toChainId[network]
    },

    tokenAddress: (token, network) => {
        token = tokenList[token]["tokenAddress"][network]
        console.log("**************************")
        console.log(token)
        return token
    },

    tokenSymbol: (token) => {
        symbol = tokenList[token]["symbol"]
        return symbol
    },

    bridgeDetails: (token, network) => {
        address = tokenList[token]["bridgeAddress"][network]
        console.log("**************************")
        console.log(address)
        abi = tokenList[token]["bridgeAbi"][network]
        decimal = tokenList[token]["decimal"]
        // console.log(abi)
        return [address, abi,decimal]
    },

    getTokenDetails: async (req, res) => {
        try {
            let network = '';
            let token = ''

            if (req.query.token == null) {
                return res.send({ "status": "false", "message": "token not found" })
            } else {
                token = (req.query.token);
            }
            if (req.query.network == null) {
                tokenAddress = tokenList[token]["tokenAddress"]
                bridgeAddress = tokenList[token]["bridgeAddress"]
                bridgeAbi = tokenList[token]["bridgeAbi"]
                tokenAbi = tokenList[token]["tokenAbi"]
            } else {
                network = (req.query.network);
                tokenAddress = tokenList[token]["tokenAddress"][network]
                bridgeAddress = tokenList[token]["bridgeAddress"][network]
                bridgeAbi = tokenList[token]["bridgeAbi"][network]
                tokenAbi = tokenList[token]["tokenAbi"][network]

            }

            decimal = tokenList[token]["decimal"]
            // bridgeDetails = token.bridgeDetails(tokenId, networkId);
            // bridgeAddress = bridgeDetails[0]
            // bridgeAbi = bridgeDetails[0]

            console.log("tokenAddress", tokenAddress)

            res.send({
                "status": "true", "messgae": "Token details recieved","decimal":decimal, "TokenAddress": tokenAddress,
                "bridgeAddress": bridgeAddress, "bridgeAbi": bridgeAbi, "tokenAbi": tokenAbi
            })

        } catch (err) {
            console.log("error in getting token details", err)
            res.send({ "status": "false", "error": err })
        }
    }

}
