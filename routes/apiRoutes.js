const express= require('express');
const router = express.Router();
const catoshiBSC = require('../controller/catoshiBSC');
const catoshiETH = require('../controller/catoshiETH');
const tokenList = require('../controller/tokenList');




router.get('/balanceOf_BSC', catoshiBSC.getbalance);                                   
router.get('/balanceOf_ETH', catoshiETH.getbalance); 


router.get('/getETHAmountAfterFee', catoshiETH.getAmountAfterFee);            
router.get('/getBSCAmountAfterFee', catoshiBSC.getAmountAfterFee);             


router.get('/getBSCTransactionResponse',catoshiBSC.getTransactionResponse);
router.get('/getETHTransactionResponse',catoshiETH.getTransactionResponse);


router.get('/getBSCBridgeFees', catoshiBSC.bridgeFees );                                
router.get('/getETHBridgeFees', catoshiETH.bridgeFees );                                


router.get('/checkBSCAllowance',catoshiBSC.checkAllowance)
router.get('/checkETHAllowance',catoshiETH.checkAllowance)


router.get('/BSCVaultBalance', catoshiBSC.vaultBalance);                                
router.get('/ETHVaultBalance', catoshiETH.vaultBalance);                                

router.get('/getContractAddress', tokenList.getTokenDetails);                              
router.get('/getTrxDetails', catoshiBSC.getTrxDetails);


module.exports= router